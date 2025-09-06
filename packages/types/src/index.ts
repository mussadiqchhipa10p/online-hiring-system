// User and Auth Types
export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
}

// Employer Types
export interface Employer {
  id: string;
  userId: string;
  user: User;
  companyName: string;
  jobs: Job[];
}

// Candidate Types
export interface Candidate {
  id: string;
  userId: string;
  user: User;
  resumes: Resume[];
  applications: Application[];
  ratings: Rating[];
}

// Job Types
export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED'
}

export interface Job {
  id: string;
  employerId: string;
  employer: Employer;
  title: string;
  description: string;
  location: string;
  skills: string[];
  status: JobStatus;
  views: number;
  applications: Application[];
  createdAt: Date;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  skills: string[];
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: JobStatus;
}

// Application Types
export enum AppStatus {
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED'
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  candidateId: string;
  candidate: Candidate;
  status: AppStatus;
  notes?: string;
  rating?: Rating;
  createdAt: Date;
}

export interface CreateApplicationRequest {
  jobId: string;
  notes?: string;
  resumeUrl: string;
}

export interface UpdateApplicationRequest {
  status?: AppStatus;
  notes?: string;
}

// Rating Types
export interface Rating {
  id: string;
  applicationId: string;
  application: Application;
  score: number;
  feedback?: string;
  interviewer?: string;
  createdAt: Date;
}

export interface CreateRatingRequest {
  applicationId: string;
  score: number;
  feedback?: string;
  interviewer?: string;
}

// Resume Types
export interface Resume {
  id: string;
  candidateId: string;
  candidate: Candidate;
  url: string;
  parsedJson?: any;
}

// Analytics Types
export interface JobAnalytics {
  jobId: string;
  title: string;
  views: number;
  applicationsCount: number;
  averageRating: number;
  status: JobStatus;
}

export interface EmployerAnalytics {
  employerId: string;
  companyName: string;
  totalJobs: number;
  totalApplications: number;
  averageRating: number;
  hiredCount: number;
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalEmployers: number;
  totalCandidates: number;
  totalJobs: number;
  totalApplications: number;
  jobsByStatus: Record<JobStatus, number>;
  applicationsByStatus: Record<AppStatus, number>;
  averageRating: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Socket.IO Event Types
export interface SocketEvents {
  'application:created': (application: Application) => void;
  'application:statusChanged': (application: Application) => void;
  'rating:created': (rating: Rating) => void;
  'job:published': (job: Job) => void;
}

// Search and Filter Types
export interface JobSearchParams {
  query?: string;
  location?: string;
  skills?: string[];
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export interface ApplicationFilterParams {
  jobId?: string;
  candidateId?: string;
  status?: AppStatus;
  page?: number;
  limit?: number;
}
