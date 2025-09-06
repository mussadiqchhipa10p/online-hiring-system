import { apiClient } from './api';
import { Application, CreateApplicationRequest, ApplicationFilterParams, PaginatedResponse } from '@online-hiring-system/types';

export const applicationsService = {
  async getApplications(params: ApplicationFilterParams): Promise<PaginatedResponse<Application>> {
    const response = await apiClient.getPaginated<Application>('/applications', params);
    return response;
  },

  async getApplicationById(id: string): Promise<Application> {
    const response = await apiClient.get<Application>(`/applications/${id}`);
    return response.data!;
  },

  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    const response = await apiClient.post<Application>('/applications', applicationData);
    return response.data!;
  },

  async updateApplication(id: string, applicationData: any): Promise<Application> {
    const response = await apiClient.put<Application>(`/applications/${id}`, applicationData);
    return response.data!;
  },

  async deleteApplication(id: string): Promise<void> {
    await apiClient.delete(`/applications/${id}`);
  },
};
