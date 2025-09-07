import { z } from 'zod';
import { Role } from '@prisma/client';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Job validation schemas
export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

export const updateJobSchema = createJobSchema.partial().extend({
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
});

// Application validation schemas
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  notes: z.string().optional(),
  resumeUrl: z.string().url('Invalid resume URL'),
});

export const updateApplicationSchema = z.object({
  status: z.enum(['PENDING', 'REVIEW', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED']).optional(),
  notes: z.string().optional(),
});

// Rating validation schemas
export const createRatingSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  score: z.number().min(1).max(5, 'Score must be between 1 and 5'),
  feedback: z.string().optional(),
  interviewer: z.string().optional(),
});

export const updateRatingSchema = z.object({
  score: z.number().min(1).max(5, 'Score must be between 1 and 5').optional(),
  feedback: z.string().optional(),
  interviewer: z.string().optional(),
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const jobFiltersSchema = z.object({
  q: z.string().optional(),
  skills: z.string().transform((val) => val ? val.split(',').map(s => s.trim()) : undefined).optional(),
  location: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
  employerId: z.string().optional(),
  sort: z.enum(['createdAt', 'title', 'views']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  skills: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
  ...paginationSchema.shape,
});

export const applicationFilterSchema = z.object({
  jobId: z.string().optional(),
  candidateId: z.string().optional(),
  status: z.enum(['PENDING', 'REVIEW', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED']).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>;
export type JobFilters = z.infer<typeof jobFiltersSchema>;
export type JobSearchInput = z.infer<typeof jobSearchSchema>;
export type ApplicationFilters = z.infer<typeof applicationFilterSchema>;
export type ApplicationFilterInput = z.infer<typeof applicationFilterSchema>;
