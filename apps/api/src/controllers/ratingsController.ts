import { Request, Response } from 'express';
import { ratingsService } from '../services/ratingsService';
import { createRatingSchema, updateRatingSchema } from '../utils/validation';
import { socketService } from '../index';

export class RatingsController {
  async createRating(req: Request, res: Response) {
    try {
      const validatedData = createRatingSchema.parse(req.body);
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can create ratings',
        });
      }

      const rating = await ratingsService.createRating(validatedData, employerId);

      // Emit Socket.IO event for new rating
      socketService.emitRatingCreated(rating);

      res.status(201).json({
        success: true,
        data: rating,
        message: 'Rating created successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create rating',
      });
    }
  }

  async updateRating(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateRatingSchema.parse(req.body);
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can update ratings',
        });
      }

      const rating = await ratingsService.updateRating(id, validatedData, employerId);

      // Emit Socket.IO event for rating update
      socketService.emitRatingUpdated(rating);

      res.json({
        success: true,
        data: rating,
        message: 'Rating updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update rating',
      });
    }
  }

  async getRatingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rating = await ratingsService.getRatingById(id);

      res.json({
        success: true,
        data: rating,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Rating not found',
      });
    }
  }

  async deleteRating(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can delete ratings',
        });
      }

      await ratingsService.deleteRating(id, employerId);

      res.json({
        success: true,
        message: 'Rating deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete rating',
      });
    }
  }

  async getCandidateRatings(req: Request, res: Response) {
    try {
      const candidateId = req.user?.candidateId;
      const { page = 1, pageSize = 10 } = req.query;

      if (!candidateId) {
        return res.status(403).json({
          success: false,
          error: 'Only candidates can view their ratings',
        });
      }

      const result = await ratingsService.getCandidateRatings(
        candidateId,
        Number(page),
        Number(pageSize)
      );

      res.json({
        success: true,
        data: result.ratings,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch candidate ratings',
      });
    }
  }

  async getEmployerRatings(req: Request, res: Response) {
    try {
      const employerId = req.user?.employerId;
      const { page = 1, pageSize = 10 } = req.query;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can view their ratings',
        });
      }

      const result = await ratingsService.getEmployerRatings(
        employerId,
        Number(page),
        Number(pageSize)
      );

      res.json({
        success: true,
        data: result.ratings,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch employer ratings',
      });
    }
  }

  async getCandidateAverageRating(req: Request, res: Response) {
    try {
      const candidateId = req.user?.candidateId;

      if (!candidateId) {
        return res.status(403).json({
          success: false,
          error: 'Only candidates can view their average rating',
        });
      }

      const result = await ratingsService.getCandidateAverageRating(candidateId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch candidate average rating',
      });
    }
  }

  async getEmployerRatingStats(req: Request, res: Response) {
    try {
      const employerId = req.user?.employerId;

      if (!employerId) {
        return res.status(403).json({
          success: false,
          error: 'Only employers can view their rating stats',
        });
      }

      const result = await ratingsService.getEmployerRatingStats(employerId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch employer rating stats',
      });
    }
  }
}

export const ratingsController = new RatingsController();
