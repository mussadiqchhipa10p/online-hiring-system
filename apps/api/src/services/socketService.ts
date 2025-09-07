import { Server as SocketIOServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  employerId?: string;
  candidateId?: string;
}

export class SocketService {
  private io: SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware for Socket.IO
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        // Verify JWT token (reuse existing JWT verification logic)
        const { verifyAccessToken } = await import('../utils/jwt');
        const payload = verifyAccessToken(token);

        if (payload.type !== 'access') {
          return next(new Error('Authentication error: Invalid token type'));
        }

        // Get user details with role-specific IDs
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { 
            id: true, 
            email: true, 
            role: true,
            employer: { select: { id: true } },
            candidate: { select: { id: true } }
          },
        });

        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user.id;
        socket.userRole = user.role;
        socket.employerId = user.employer?.id;
        socket.candidateId = user.candidate?.id;

        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.userId} (${socket.userRole})`);

      // Join role-specific rooms
      if (socket.userRole === 'EMPLOYER' && socket.employerId) {
        socket.join(`employer:${socket.employerId}`);
      } else if (socket.userRole === 'CANDIDATE' && socket.candidateId) {
        socket.join(`candidate:${socket.candidateId}`);
      } else if (socket.userRole === 'ADMIN') {
        socket.join('admin');
      }

      // Join user-specific room
      socket.join(`user:${socket.userId}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
      });

      // Handle custom events
      socket.on('join:job', (jobId: string) => {
        socket.join(`job:${jobId}`);
      });

      socket.on('leave:job', (jobId: string) => {
        socket.leave(`job:${jobId}`);
      });
    });
  }

  // Application Events
  public emitApplicationCreated(application: any) {
    const { jobId, candidateId } = application;
    
    // Notify employer about new application
    this.io.to(`job:${jobId}`).emit('application:created', {
      type: 'application:created',
      data: application,
      timestamp: new Date().toISOString(),
    });

    // Notify candidate about successful application
    this.io.to(`candidate:${candidateId}`).emit('application:submitted', {
      type: 'application:submitted',
      data: application,
      timestamp: new Date().toISOString(),
    });
  }

  public emitApplicationStatusChanged(application: any, oldStatus: string) {
    const { jobId, candidateId, status } = application;
    
    // Notify candidate about status change
    this.io.to(`candidate:${candidateId}`).emit('application:statusChanged', {
      type: 'application:statusChanged',
      data: {
        application,
        oldStatus,
        newStatus: status,
      },
      timestamp: new Date().toISOString(),
    });

    // Notify employer about status update
    this.io.to(`job:${jobId}`).emit('application:statusUpdated', {
      type: 'application:statusUpdated',
      data: {
        application,
        oldStatus,
        newStatus: status,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Rating Events
  public emitRatingCreated(rating: any) {
    const { application } = rating;
    const { candidateId } = application;
    
    // Notify candidate about new rating
    this.io.to(`candidate:${candidateId}`).emit('rating:created', {
      type: 'rating:created',
      data: rating,
      timestamp: new Date().toISOString(),
    });
  }

  public emitRatingUpdated(rating: any) {
    const { application } = rating;
    const { candidateId } = application;
    
    // Notify candidate about rating update
    this.io.to(`candidate:${candidateId}`).emit('rating:updated', {
      type: 'rating:updated',
      data: rating,
      timestamp: new Date().toISOString(),
    });
  }

  // Job Events
  public emitJobPublished(job: any) {
    // Notify all candidates about new job
    this.io.to('candidate:*').emit('job:published', {
      type: 'job:published',
      data: job,
      timestamp: new Date().toISOString(),
    });
  }

  public emitJobStatusChanged(job: any, oldStatus: string) {
    const { employerId, status } = job;
    
    // Notify employer about job status change
    this.io.to(`employer:${employerId}`).emit('job:statusChanged', {
      type: 'job:statusChanged',
      data: {
        job,
        oldStatus,
        newStatus: status,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // General notification method
  public emitNotification(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', {
      type: 'notification',
      data: notification,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast to all users (admin only)
  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, {
      type: event,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.io.engine.clientsCount;
  }

  // Get connected users by role
  public async getConnectedUsersByRole(): Promise<{ [role: string]: number }> {
    const sockets = await this.io.fetchSockets();
    const roleCounts: { [role: string]: number } = {};

    sockets.forEach((socket) => {
      const authSocket = socket as any;
      const role = authSocket.userRole || 'unknown';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    return roleCounts;
  }
}

// Import Socket type
import { Socket } from 'socket.io';
