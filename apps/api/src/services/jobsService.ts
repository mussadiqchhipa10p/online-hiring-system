import { PrismaClient, Job, JobStatus, Prisma } from '@prisma/client';
import { CreateJobInput, UpdateJobInput, JobFilters } from '../utils/validation';

const prisma = new PrismaClient();

export class JobsService {
  async createJob(data: CreateJobInput, employerId: string) {
    const job = await prisma.job.create({
      data: {
        ...data,
        employerId,
      },
      include: {
        employer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return job;
  }

  async getJobs(filters: Partial<JobFilters> = {}) {
    const {
      q,
      skills,
      location,
      status,
      employerId,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      pageSize = 10,
    } = filters;

    const where: Prisma.JobWhereInput = {};

    // Search by title or description
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filter by skills
    if (skills && skills.length > 0) {
      where.skills = {
        hasSome: skills,
      };
    }

    // Filter by location
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Filter by status
    if (status) {
      where.status = status as JobStatus;
    }

    // Filter by employer
    if (employerId) {
      where.employerId = employerId;
    }

    const skip = (page - 1) * pageSize;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          employer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          applications: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take: pageSize,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getJobById(id: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        applications: {
          include: {
            candidate: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            rating: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Increment view count
    await prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return job;
  }

  async updateJob(id: string, data: UpdateJobInput, employerId: string) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findFirst({
      where: { id, employerId },
    });

    if (!existingJob) {
      throw new Error('Job not found or access denied');
    }

    const job = await prisma.job.update({
      where: { id },
      data,
      include: {
        employer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return job;
  }

  async deleteJob(id: string, employerId: string) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findFirst({
      where: { id, employerId },
    });

    if (!existingJob) {
      throw new Error('Job not found or access denied');
    }

    await prisma.job.delete({
      where: { id },
    });

    return { success: true };
  }

  async updateJobStatus(id: string, status: JobStatus, employerId: string) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findFirst({
      where: { id, employerId },
    });

    if (!existingJob) {
      throw new Error('Job not found or access denied');
    }

    const oldStatus = existingJob.status;

    const job = await prisma.job.update({
      where: { id },
      data: { status },
      include: {
        employer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Return both updated job and old status for Socket.IO events
    return { job, oldStatus };
  }

  async getEmployerJobs(employerId: string, filters: Partial<Omit<JobFilters, 'employerId'>> = {}) {
    return this.getJobs({ ...filters, employerId });
  }
}

export const jobsService = new JobsService();
