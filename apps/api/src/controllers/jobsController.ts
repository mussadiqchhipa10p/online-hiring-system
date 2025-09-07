import { Request, Response } from 'express';
import { jobsService } from '../services/jobsService';
import { createJobSchema, updateJobSchema, jobFiltersSchema } from '../utils/validation';
import { JobStatus } from '@prisma/client';

export class JobsController {
  async createJob(req: Request, res: Response) {
    try {
      const validatedData = createJobSchema.parse(req.body);
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can create jobs',
        });
      }

      const job = await jobsService.createJob(validatedData, employerId);

      res.status(201).json({
        success: true,
        data: job,
        message: 'Job created successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create job',
      });
    }
  }

  async getJobs(req: Request, res: Response) {
    try {
      const filters = jobFiltersSchema.parse(req.query);
      const result = await jobsService.getJobs(filters);

      res.json({
        success: true,
        data: result.jobs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch jobs',
      });
    }
  }

  async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await jobsService.getJobById(id);

      res.json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Job not found',
      });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateJobSchema.parse(req.body);
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can update jobs',
        });
      }

      const job = await jobsService.updateJob(id, validatedData, employerId);

      res.json({
        success: true,
        data: job,
        message: 'Job updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update job',
      });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can delete jobs',
        });
      }

      await jobsService.deleteJob(id, employerId);

      res.json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete job',
      });
    }
  }

  async updateJobStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can update job status',
        });
      }

      if (!Object.values(JobStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid job status',
        });
      }

      const job = await jobsService.updateJobStatus(id, status, employerId);

      res.json({
        success: true,
        data: job,
        message: 'Job status updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update job status',
      });
    }
  }

  async getEmployerJobs(req: Request, res: Response) {
    try {
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can view their jobs',
        });
      }

      const filters = jobFiltersSchema.parse(req.query);
      const result = await jobsService.getEmployerJobs(employerId, filters);

      res.json({
        success: true,
        data: result.jobs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch employer jobs',
      });
    }
  }
}

export const jobsController = new JobsController();
