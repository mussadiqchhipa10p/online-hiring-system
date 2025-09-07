import { Request, Response } from 'express';
import { applicationsService } from '../services/applicationsService';
import { createApplicationSchema, updateApplicationSchema, applicationFilterSchema } from '../utils/validation';
import { AppStatus } from '@prisma/client';
import { socketService } from '../index';

export class ApplicationsController {
  async createApplication(req: Request, res: Response) {
    try {
      const validatedData = createApplicationSchema.parse(req.body);
      const candidateId = req.user?.candidateId;

      if (!candidateId) {
        return res.status(403).json({
          success: false,
          error: 'Only candidates can apply for jobs',
        });
      }

      const application = await applicationsService.createApplication(validatedData, candidateId);

      // Emit Socket.IO event for new application
      socketService.emitApplicationCreated(application);

      res.status(201).json({
        success: true,
        data: application,
        message: 'Application submitted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit application',
      });
    }
  }

  async getApplications(req: Request, res: Response) {
    try {
      const filters = applicationFilterSchema.parse(req.query);
      const result = await applicationsService.getApplications(filters);

      res.json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch applications',
      });
    }
  }

  async getApplicationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const application = await applicationsService.getApplicationById(id);

      res.json({
        success: true,
        data: application,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Application not found',
      });
    }
  }

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can update application status',
        });
      }

      if (!Object.values(AppStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid application status',
        });
      }

      const result = await applicationsService.updateApplicationStatus(id, status, employerId);

      // Emit Socket.IO event for status change
      socketService.emitApplicationStatusChanged(result.application, result.oldStatus);

      res.json({
        success: true,
        data: result.application,
        message: 'Application status updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update application status',
      });
    }
  }

  async updateApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateApplicationSchema.parse(req.body);
      const candidateId = req.user?.candidateId;

      if (!candidateId) {
        return res.status(403).json({
          success: false,
          error: 'Only candidates can update their applications',
        });
      }

      const application = await applicationsService.updateApplication(id, validatedData, candidateId);

      res.json({
        success: true,
        data: application,
        message: 'Application updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update application',
      });
    }
  }

  async deleteApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const candidateId = req.user?.candidateId;

      if (!candidateId) {
        return res.status(403).json({
          success: false,
          error: 'Only candidates can delete their applications',
        });
      }

      await applicationsService.deleteApplication(id, candidateId);

      res.json({
        success: true,
        message: 'Application deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete application',
      });
    }
  }

  async getCandidateApplications(req: Request, res: Response) {
    try {
      const candidateId = req.user?.candidateId;

      if (!candidateId) {
        return res.status(403).json({
          success: false,
          error: 'Only candidates can view their applications',
        });
      }

      const filters = applicationFilterSchema.parse(req.query);
      const result = await applicationsService.getCandidateApplications(candidateId, filters);

      res.json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch candidate applications',
      });
    }
  }

  async getEmployerApplications(req: Request, res: Response) {
    try {
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can view applications for their jobs',
        });
      }

      const filters = applicationFilterSchema.parse(req.query);
      const result = await applicationsService.getEmployerApplications(employerId, filters);

      res.json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch employer applications',
      });
    }
  }
}

export const applicationsController = new ApplicationsController();
