import { apiClient } from './api';
import { Job, JobSearchParams, PaginatedResponse } from '@online-hiring-system/types';

export const jobsService = {
  async getJobs(params: JobSearchParams): Promise<PaginatedResponse<Job>> {
    const response = await apiClient.getPaginated<Job>('/jobs', params);
    return response;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    return response.data!;
  },

  async createJob(jobData: any): Promise<Job> {
    const response = await apiClient.post<Job>('/jobs', jobData);
    return response.data!;
  },

  async updateJob(id: string, jobData: any): Promise<Job> {
    const response = await apiClient.put<Job>(`/jobs/${id}`, jobData);
    return response.data!;
  },

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },
};
