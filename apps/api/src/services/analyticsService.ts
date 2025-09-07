import { PrismaClient } from '@prisma/client';
import { redisService } from './redisService';

const prisma = new PrismaClient();

export interface AnalyticsOverview {
  totalJobs: number;
  totalApplications: number;
  totalRatings: number;
  totalHires: number;
  averageRating: number;
  applicationsPerJob: number;
  hireRate: number;
  topSkills: Array<{ skill: string; count: number }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

export interface JobAnalytics {
  totalViews: number;
  totalApplications: number;
  averageRating: number;
  statusDistribution: Array<{ status: string; count: number }>;
  applicationsOverTime: Array<{ date: string; count: number }>;
  topCandidates: Array<{
    candidateId: string;
    candidateName: string;
    rating: number;
    applicationDate: Date;
  }>;
}

export interface EmployerAnalytics {
  totalJobs: number;
  totalApplications: number;
  totalHires: number;
  averageRating: number;
  applicationsPerJob: number;
  hireRate: number;
  jobsOverTime: Array<{ date: string; count: number }>;
  applicationsOverTime: Array<{ date: string; count: number }>;
  topPerformingJobs: Array<{
    jobId: string;
    title: string;
    applications: number;
    views: number;
    hireRate: number;
  }>;
}

export class AnalyticsService {
  // Cache TTL in seconds (5 minutes)
  private readonly CACHE_TTL = 300;

  async getOverview(fromDate?: Date, toDate?: Date): Promise<AnalyticsOverview> {
    const cacheKey = `overview:${fromDate?.toISOString() || 'all'}:${toDate?.toISOString() || 'all'}`;
    
    // Try to get from cache first
    const cached = await redisService.getCachedAnalytics<AnalyticsOverview>('overview', { fromDate, toDate });
    if (cached) {
      return cached;
    }

    // Build date filter
    const dateFilter = this.buildDateFilter(fromDate, toDate);

    // Get basic counts
    const [
      totalJobs,
      totalApplications,
      totalRatings,
      totalHires,
      averageRatingResult,
      skillsData,
      recentActivity
    ] = await Promise.all([
      prisma.job.count({ where: dateFilter.job }),
      prisma.application.count({ where: dateFilter.application }),
      prisma.rating.count({ where: dateFilter.rating }),
      prisma.application.count({ where: { ...dateFilter.application, status: 'HIRED' } }),
      prisma.rating.aggregate({ where: dateFilter.rating, _avg: { score: true } }),
      this.getTopSkills(fromDate, toDate),
      this.getRecentActivity(fromDate, toDate)
    ]);

    const averageRating = averageRatingResult._avg.score || 0;
    const applicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
    const hireRate = totalApplications > 0 ? (totalHires / totalApplications) * 100 : 0;

    const overview: AnalyticsOverview = {
      totalJobs,
      totalApplications,
      totalRatings,
      totalHires,
      averageRating: Math.round(averageRating * 100) / 100,
      applicationsPerJob: Math.round(applicationsPerJob * 100) / 100,
      hireRate: Math.round(hireRate * 100) / 100,
      topSkills: skillsData,
      recentActivity
    };

    // Cache the result
    await redisService.setCachedAnalytics('overview', overview, this.CACHE_TTL, { fromDate, toDate });

    return overview;
  }

  async getJobAnalytics(jobId: string, fromDate?: Date, toDate?: Date): Promise<JobAnalytics> {
    const cacheKey = `job:${jobId}:${fromDate?.toISOString() || 'all'}:${toDate?.toISOString() || 'all'}`;
    
    // Try to get from cache first
    const cached = await redisService.getCachedAnalytics<JobAnalytics>('job', { jobId, fromDate, toDate });
    if (cached) {
      return cached;
    }

    const dateFilter = this.buildDateFilter(fromDate, toDate);

    // Get job data
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          where: dateFilter.application,
          include: {
            candidate: {
              include: {
                user: { select: { name: true } }
              }
            },
            rating: true
          }
        }
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const totalViews = job.views;
    const totalApplications = job.applications.length;
    const averageRating = job.applications
      .filter(app => app.rating)
      .reduce((sum, app) => sum + (app.rating?.score || 0), 0) / 
      (job.applications.filter(app => app.rating).length || 1);

    // Status distribution
    const statusDistribution = job.applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Applications over time
    const applicationsOverTime = await this.getApplicationsOverTime(jobId, fromDate, toDate);

    // Top candidates
    const topCandidates = job.applications
      .filter(app => app.rating)
      .sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0))
      .slice(0, 5)
      .map(app => ({
        candidateId: app.candidateId,
        candidateName: app.candidate.user.name || 'Unknown',
        rating: app.rating?.score || 0,
        applicationDate: app.createdAt
      }));

    const analytics: JobAnalytics = {
      totalViews,
      totalApplications,
      averageRating: Math.round(averageRating * 100) / 100,
      statusDistribution: Object.entries(statusDistribution).map(([status, count]) => ({ status, count })),
      applicationsOverTime,
      topCandidates
    };

    // Cache the result
    await redisService.setCachedAnalytics('job', analytics, this.CACHE_TTL, { jobId, fromDate, toDate });

    return analytics;
  }

  async getEmployerAnalytics(employerId: string, fromDate?: Date, toDate?: Date): Promise<EmployerAnalytics> {
    const cacheKey = `employer:${employerId}:${fromDate?.toISOString() || 'all'}:${toDate?.toISOString() || 'all'}`;
    
    // Try to get from cache first
    const cached = await redisService.getCachedAnalytics<EmployerAnalytics>('employer', { employerId, fromDate, toDate });
    if (cached) {
      return cached;
    }

    const dateFilter = this.buildDateFilter(fromDate, toDate);

    // Get employer's jobs
    const jobs = await prisma.job.findMany({
      where: { 
        employerId,
        ...dateFilter.job
      },
      include: {
        applications: {
          where: dateFilter.application,
          include: { rating: true }
        }
      }
    });

    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0);
    const totalHires = jobs.reduce((sum, job) => 
      sum + job.applications.filter(app => app.status === 'HIRED').length, 0
    );

    // Calculate average rating
    const allRatings = jobs.flatMap(job => 
      job.applications.filter(app => app.rating).map(app => app.rating!.score)
    );
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, score) => sum + score, 0) / allRatings.length 
      : 0;

    const applicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
    const hireRate = totalApplications > 0 ? (totalHires / totalApplications) * 100 : 0;

    // Jobs over time
    const jobsOverTime = await this.getJobsOverTime(employerId, fromDate, toDate);

    // Applications over time
    const applicationsOverTime = await this.getApplicationsOverTimeForEmployer(employerId, fromDate, toDate);

    // Top performing jobs
    const topPerformingJobs = jobs
      .map(job => ({
        jobId: job.id,
        title: job.title,
        applications: job.applications.length,
        views: job.views,
        hireRate: job.applications.length > 0 
          ? (job.applications.filter(app => app.status === 'HIRED').length / job.applications.length) * 100 
          : 0
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 10);

    const analytics: EmployerAnalytics = {
      totalJobs,
      totalApplications,
      totalHires,
      averageRating: Math.round(averageRating * 100) / 100,
      applicationsPerJob: Math.round(applicationsPerJob * 100) / 100,
      hireRate: Math.round(hireRate * 100) / 100,
      jobsOverTime,
      applicationsOverTime,
      topPerformingJobs
    };

    // Cache the result
    await redisService.setCachedAnalytics('employer', analytics, this.CACHE_TTL, { employerId, fromDate, toDate });

    return analytics;
  }

  // Helper methods
  private buildDateFilter(fromDate?: Date, toDate?: Date) {
    const baseFilter = {};
    
    if (fromDate || toDate) {
      const dateFilter: any = {};
      if (fromDate) dateFilter.gte = fromDate;
      if (toDate) dateFilter.lte = toDate;
      return {
        job: { createdAt: dateFilter },
        application: { createdAt: dateFilter },
        rating: { createdAt: dateFilter }
      };
    }

    return {
      job: baseFilter,
      application: baseFilter,
      rating: baseFilter
    };
  }

  private async getTopSkills(fromDate?: Date, toDate?: Date, limit: number = 10) {
    const jobs = await prisma.job.findMany({
      where: fromDate || toDate ? {
        createdAt: {
          ...(fromDate && { gte: fromDate }),
          ...(toDate && { lte: toDate })
        }
      } : {},
      select: { skills: true }
    });

    const skillCounts: Record<string, number> = {};
    jobs.forEach(job => {
      job.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));
  }

  private async getRecentActivity(fromDate?: Date, toDate?: Date, limit: number = 10) {
    const [recentJobs, recentApplications, recentRatings] = await Promise.all([
      prisma.job.findMany({
        where: fromDate || toDate ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate })
          }
        } : {},
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { employer: { include: { user: { select: { name: true } } } } }
      }),
      prisma.application.findMany({
        where: fromDate || toDate ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate })
          }
        } : {},
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { 
          job: { select: { title: true } },
          candidate: { include: { user: { select: { name: true } } } }
        }
      }),
      prisma.rating.findMany({
        where: fromDate || toDate ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate })
          }
        } : {},
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { 
          application: { 
            include: { 
              job: { select: { title: true } },
              candidate: { include: { user: { select: { name: true } } } }
            }
          }
        }
      })
    ]);

    const activities = [
      ...recentJobs.map(job => ({
        type: 'job_created',
        description: `New job "${job.title}" created by ${job.employer.user.name}`,
        timestamp: job.createdAt
      })),
      ...recentApplications.map(app => ({
        type: 'application_submitted',
        description: `${app.candidate.user.name} applied for "${app.job.title}"`,
        timestamp: app.createdAt
      })),
      ...recentRatings.map(rating => ({
        type: 'rating_given',
        description: `Rating ${rating.score}/5 given to ${rating.application.candidate.user.name} for "${rating.application.job.title}"`,
        timestamp: rating.createdAt
      }))
    ];

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private async getApplicationsOverTime(jobId: string, fromDate?: Date, toDate?: Date) {
    const applications = await prisma.application.findMany({
      where: {
        jobId,
        ...(fromDate || toDate ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate })
          }
        } : {})
      },
      select: { createdAt: true }
    });

    // Group by date
    const grouped = applications.reduce((acc, app) => {
      const date = app.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }

  private async getJobsOverTime(employerId: string, fromDate?: Date, toDate?: Date) {
    const jobs = await prisma.job.findMany({
      where: {
        employerId,
        ...(fromDate || toDate ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate })
          }
        } : {})
      },
      select: { createdAt: true }
    });

    const grouped = jobs.reduce((acc, job) => {
      const date = job.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }

  private async getApplicationsOverTimeForEmployer(employerId: string, fromDate?: Date, toDate?: Date) {
    const applications = await prisma.application.findMany({
      where: {
        job: { employerId },
        ...(fromDate || toDate ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate })
          }
        } : {})
      },
      select: { createdAt: true }
    });

    const grouped = applications.reduce((acc, app) => {
      const date = app.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }

  // Cache invalidation methods
  async invalidateJobAnalytics(jobId: string): Promise<void> {
    await redisService.invalidatePattern(`analytics:job:${jobId}*`);
    await redisService.invalidatePattern('analytics:overview*');
  }

  async invalidateEmployerAnalytics(employerId: string): Promise<void> {
    await redisService.invalidatePattern(`analytics:employer:${employerId}*`);
    await redisService.invalidatePattern('analytics:overview*');
  }

  async invalidateAllAnalytics(): Promise<void> {
    await redisService.invalidatePattern('analytics:*');
  }
}

export const analyticsService = new AnalyticsService();
