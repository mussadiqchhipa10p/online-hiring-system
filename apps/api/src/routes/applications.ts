import { Router } from 'express';
import { applicationsController } from '../controllers/applicationsController';
import { authenticate, requireRole } from '../middleware/auth';

const router: Router = Router();

// Public routes
router.get('/', applicationsController.getApplications.bind(applicationsController));
router.get('/:id', applicationsController.getApplicationById.bind(applicationsController));

// Protected routes - Candidate only
router.post('/', authenticate, requireRole(['CANDIDATE']), applicationsController.createApplication.bind(applicationsController));
router.patch('/:id', authenticate, requireRole(['CANDIDATE']), applicationsController.updateApplication.bind(applicationsController));
router.delete('/:id', authenticate, requireRole(['CANDIDATE']), applicationsController.deleteApplication.bind(applicationsController));
router.get('/candidate/my-applications', authenticate, requireRole(['CANDIDATE']), applicationsController.getCandidateApplications.bind(applicationsController));

// Protected routes - Employer only
router.patch('/:id/status', authenticate, requireRole(['EMPLOYER']), applicationsController.updateApplicationStatus.bind(applicationsController));
router.get('/employer/my-applications', authenticate, requireRole(['EMPLOYER']), applicationsController.getEmployerApplications.bind(applicationsController));

export default router;
