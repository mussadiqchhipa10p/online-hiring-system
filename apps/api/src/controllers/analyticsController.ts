import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { z } from 'zod';

const dateRangeSchema = z.object({
  from: z.string().optional().transform(val => val ? new Date(val) : undefined),
  to: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

export class AnalyticsController {
  async getOverview(req: Request, res: Response) {
    try {
      const { from, to } = dateRangeSchema.parse(req.query);

      const overview = await analyticsService.getOverview(from, to);

      res.json({
        success: true,
        data: overview,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch analytics overview',
      });
    }
  }

  async getJobAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { from, to } = dateRangeSchema.parse(req.query);

      const analytics = await analyticsService.getJobAnalytics(id, from, to);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Job analytics not found',
      });
    }
  }

  async getEmployerAnalytics(req: Request, res: Response) {
    try {
      const employerId = req.user?.employerId;
      const { from, to } = dateRangeSchema.parse(req.query);

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can view their analytics',
        });
      }

      const analytics = await analyticsService.getEmployerAnalytics(employerId, from, to);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch employer analytics',
      });
    }
  }

  async getAdminAnalytics(req: Request, res: Response) {
    try {
      const { from, to } = dateRangeSchema.parse(req.query);

      // Admin can view overall analytics
      const overview = await analyticsService.getOverview(from, to);

      res.json({
        success: true,
        data: overview,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch admin analytics',
      });
    }
  }

  async invalidateCache(req: Request, res: Response) {
    try {
      const { type, id } = req.body;

      if (type === 'job' && id) {
        await analyticsService.invalidateJobAnalytics(id);
      } else if (type === 'employer' && id) {
        await analyticsService.invalidateEmployerAnalytics(id);
      } else if (type === 'all') {
        await analyticsService.invalidateAllAnalytics();
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid cache invalidation parameters',
        });
      }

      res.json({
        success: true,
        message: 'Cache invalidated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to invalidate cache',
      });
    }
  }
}

export const analyticsController = new AnalyticsController();
