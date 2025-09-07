import { PrismaClient, Rating, Prisma } from '@prisma/client';
import { CreateRatingInput, UpdateRatingInput } from '../utils/validation';
import { analyticsService } from './analyticsService';

const prisma = new PrismaClient();

export class RatingsService {
  async createRating(data: CreateRatingInput, employerId: string) {
    // Check if application exists and belongs to employer's job
    const application = await prisma.application.findFirst({
      where: { 
        id: data.applicationId,
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

    // Check if rating already exists for this application
    const existingRating = await prisma.rating.findUnique({
      where: { applicationId: data.applicationId },
    });

    if (existingRating) {
      throw new Error('Rating already exists for this application');
    }

    // Create rating
    const rating = await prisma.rating.create({
      data,
      include: {
        application: {
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
          },
        },
      },
    });

    // Invalidate analytics cache
    await analyticsService.invalidateAllAnalytics();

    // Emit Socket.IO event for new rating
    // Note: Socket events will be emitted from controllers to avoid circular imports

    return rating;
  }

  async updateRating(id: string, data: UpdateRatingInput, employerId: string) {
    // Check if rating exists and belongs to employer's job
    const existingRating = await prisma.rating.findFirst({
      where: { 
        id,
        application: {
          job: {
            employerId,
          },
        },
      },
    });

    if (!existingRating) {
      throw new Error('Rating not found or access denied');
    }

    // Update rating
    const rating = await prisma.rating.update({
      where: { id },
      data,
      include: {
        application: {
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
          },
        },
      },
    });

    // Invalidate analytics cache
    await analyticsService.invalidateAllAnalytics();

    // Emit Socket.IO event for rating update
    // Note: Socket events will be emitted from controllers to avoid circular imports

    return rating;
  }

  async getRatingById(id: string) {
    const rating = await prisma.rating.findUnique({
      where: { id },
      include: {
        application: {
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
          },
        },
      },
    });

    if (!rating) {
      throw new Error('Rating not found');
    }

    return rating;
  }

  async deleteRating(id: string, employerId: string) {
    // Check if rating exists and belongs to employer's job
    const existingRating = await prisma.rating.findFirst({
      where: { 
        id,
        application: {
          job: {
            employerId,
          },
        },
      },
    });

    if (!existingRating) {
      throw new Error('Rating not found or access denied');
    }

    await prisma.rating.delete({
      where: { id },
    });

    return { success: true };
  }

  async getCandidateRatings(candidateId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: {
          application: {
            candidateId,
          },
        },
        include: {
          application: {
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.rating.count({
        where: {
          application: {
            candidateId,
          },
        },
      }),
    ]);

    return {
      ratings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getEmployerRatings(employerId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: {
          application: {
            job: {
              employerId,
            },
          },
        },
        include: {
          application: {
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.rating.count({
        where: {
          application: {
            job: {
              employerId,
            },
          },
        },
      }),
    ]);

    return {
      ratings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getCandidateAverageRating(candidateId: string) {
    const result = await prisma.rating.aggregate({
      where: {
        application: {
          candidateId,
        },
      },
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
    });

    return {
      averageRating: result._avg.score || 0,
      totalRatings: result._count.score,
    };
  }

  async getEmployerRatingStats(employerId: string) {
    const result = await prisma.rating.aggregate({
      where: {
        application: {
          job: {
            employerId,
          },
        },
      },
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
    });

    return {
      averageRating: result._avg.score || 0,
      totalRatings: result._count.score,
    };
  }
}

export const ratingsService = new RatingsService();
