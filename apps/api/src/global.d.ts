import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        employerId?: string;
        candidateId?: string;
      };
    }
  }
}

export {};
