import { PrismaClient, Application, AppStatus, Prisma } from '@prisma/client';
import { CreateApplicationInput, UpdateApplicationInput, ApplicationFilters } from '../utils/validation';
import { analyticsService } from './analyticsService';

const prisma = new PrismaClient();

export class ApplicationsService {
  async createApplication(data: CreateApplicationInput, candidateId: string) {
    // Check if job exists and is published
    const job = await prisma.job.findFirst({
      where: { 
        id: data.jobId,
        status: 'PUBLISHED'
      },
    });

    if (!job) {
      throw new Error('Job not found or not published');
    }

    // Check if candidate already applied to this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: data.jobId,
        candidateId,
      },
    });

    if (existingApplication) {
      throw new Error('You have already applied to this job');
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        ...data,
        candidateId,
      },
      include: {
        job: {
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
          },
        },
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
    });

    // Invalidate analytics cache
    await analyticsService.invalidateJobAnalytics(data.jobId);
    await analyticsService.invalidateAllAnalytics();

    // Emit Socket.IO event for new application
    // Note: Socket events will be emitted from controllers to avoid circular imports

    return application;
  }

  async getApplications(filters: Partial<ApplicationFilters> = {}) {
    const {
      jobId,
      candidateId,
      status,
      page = 1,
      pageSize = 10,
    } = filters;

    const where: Prisma.ApplicationWhereInput = {};

    if (jobId) {
      where.jobId = jobId;
    }

    if (candidateId) {
      where.candidateId = candidateId;
    }

    if (status) {
      where.status = status as AppStatus;
    }

    const skip = (page - 1) * pageSize;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
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
            },
          },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getApplicationById(id: string) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
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
          },
        },
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
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  async updateApplicationStatus(id: string, status: AppStatus, employerId: string) {
    // Check if application exists and belongs to employer's job
    const application = await prisma.application.findFirst({
      where: { 
        id,
        job: {
          employerId,
        },
      },
      include: {
        job: true,
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
      },
    });

    if (!application) {
      throw new Error('Application not found or access denied');
    }

    const oldStatus = application.status;

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: {
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
          },
        },
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
    });

    // Invalidate analytics cache
    await analyticsService.invalidateJobAnalytics(updatedApplication.jobId);
    await analyticsService.invalidateAllAnalytics();

    // Return both updated application and old status for Socket.IO events
    return { application: updatedApplication, oldStatus };
  }

  async updateApplication(id: string, data: UpdateApplicationInput, candidateId: string) {
    // Check if application exists and belongs to candidate
    const existingApplication = await prisma.application.findFirst({
      where: { 
        id,
        candidateId,
      },
    });

    if (!existingApplication) {
      throw new Error('Application not found or access denied');
    }

    // Only allow updates to notes for candidates
    const updateData: Partial<UpdateApplicationInput> = {};
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        job: {
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
          },
        },
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
    });

    return application;
  }

  async deleteApplication(id: string, candidateId: string) {
    // Check if application exists and belongs to candidate
    const existingApplication = await prisma.application.findFirst({
      where: { 
        id,
        candidateId,
      },
    });

    if (!existingApplication) {
      throw new Error('Application not found or access denied');
    }

    await prisma.application.delete({
      where: { id },
    });

    return { success: true };
  }

  async getCandidateApplications(candidateId: string, filters: Partial<Omit<ApplicationFilters, 'candidateId'>> = {}) {
    return this.getApplications({ ...filters, candidateId });
  }

  async getEmployerApplications(employerId: string, filters: Partial<Omit<ApplicationFilters, 'jobId'>> = {}) {
    // Get all jobs for this employer
    const jobs = await prisma.job.findMany({
      where: { employerId },
      select: { id: true },
    });

    const jobIds = jobs.map(job => job.id);

    const where: Prisma.ApplicationWhereInput = {
      jobId: { in: jobIds },
    };

    if (filters.status) {
      where.status = filters.status as AppStatus;
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
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
            },
          },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

export const applicationsService = new ApplicationsService();
