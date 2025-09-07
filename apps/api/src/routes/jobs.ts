import { Router } from 'express';
import { jobsController } from '../controllers/jobsController';
import { authenticate, requireRole } from '../middleware/auth';

const router: Router = Router();

// Public routes
router.get('/', jobsController.getJobs.bind(jobsController));
router.get('/:id', jobsController.getJobById.bind(jobsController));

// Protected routes - Employer only
router.post('/', authenticate, requireRole(['EMPLOYER']), jobsController.createJob.bind(jobsController));
router.patch('/:id', authenticate, requireRole(['EMPLOYER']), jobsController.updateJob.bind(jobsController));
router.delete('/:id', authenticate, requireRole(['EMPLOYER']), jobsController.deleteJob.bind(jobsController));
router.patch('/:id/status', authenticate, requireRole(['EMPLOYER']), jobsController.updateJobStatus.bind(jobsController));
router.get('/employer/my-jobs', authenticate, requireRole(['EMPLOYER']), jobsController.getEmployerJobs.bind(jobsController));

export default router;
