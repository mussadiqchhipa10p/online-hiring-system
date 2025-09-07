import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/auth';

const router: Router = Router();

// Public routes (with authentication)
router.get('/overview', authenticate, analyticsController.getOverview.bind(analyticsController));

// Protected routes - Employer only
router.get('/employer', authenticate, requireRole(['EMPLOYER']), analyticsController.getEmployerAnalytics.bind(analyticsController));

// Protected routes - Admin only
router.get('/admin', authenticate, requireRole(['ADMIN']), analyticsController.getAdminAnalytics.bind(analyticsController));
router.post('/cache/invalidate', authenticate, requireRole(['ADMIN']), analyticsController.invalidateCache.bind(analyticsController));

// Protected routes - Job analytics (accessible by job owner or admin)
router.get('/job/:id', authenticate, analyticsController.getJobAnalytics.bind(analyticsController));

export default router;
