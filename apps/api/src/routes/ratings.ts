import { Router } from 'express';
import { ratingsController } from '../controllers/ratingsController';
import { authenticate, requireRole } from '../middleware/auth';

const router: Router = Router();

// Public routes
router.get('/:id', ratingsController.getRatingById.bind(ratingsController));

// Protected routes - Employer only
router.post('/', authenticate, requireRole(['EMPLOYER']), ratingsController.createRating.bind(ratingsController));
router.patch('/:id', authenticate, requireRole(['EMPLOYER']), ratingsController.updateRating.bind(ratingsController));
router.delete('/:id', authenticate, requireRole(['EMPLOYER']), ratingsController.deleteRating.bind(ratingsController));
router.get('/employer/my-ratings', authenticate, requireRole(['EMPLOYER']), ratingsController.getEmployerRatings.bind(ratingsController));
router.get('/employer/stats', authenticate, requireRole(['EMPLOYER']), ratingsController.getEmployerRatingStats.bind(ratingsController));

// Protected routes - Candidate only
router.get('/candidate/my-ratings', authenticate, requireRole(['CANDIDATE']), ratingsController.getCandidateRatings.bind(ratingsController));
router.get('/candidate/average', authenticate, requireRole(['CANDIDATE']), ratingsController.getCandidateAverageRating.bind(ratingsController));

export default router;
