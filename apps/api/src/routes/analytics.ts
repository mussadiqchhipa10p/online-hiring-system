import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/auth';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting endpoints
 */

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     description: Get general analytics overview for the authenticated user
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalJobs:
 *                           type: number
 *                           description: Total number of jobs in the system
 *                           example: 150
 *                         totalApplications:
 *                           type: number
 *                           description: Total number of applications
 *                           example: 1250
 *                         totalUsers:
 *                           type: number
 *                           description: Total number of users
 *                           example: 500
 *                         recentActivity:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 description: Activity type
 *                                 example: "job_created"
 *                               timestamp:
 *                                 type: string
 *                                 format: date-time
 *                               data:
 *                                 type: object
 *                                 description: Activity-specific data
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/overview', authenticate, analyticsController.getOverview.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/employer:
 *   get:
 *     summary: Get employer analytics
 *     description: Get detailed analytics for the authenticated employer
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employer analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         jobsPosted:
 *                           type: number
 *                           description: Total jobs posted by employer
 *                           example: 25
 *                         totalApplications:
 *                           type: number
 *                           description: Total applications received
 *                           example: 350
 *                         averageApplicationsPerJob:
 *                           type: number
 *                           format: float
 *                           description: Average applications per job
 *                           example: 14.0
 *                         applicationStatusBreakdown:
 *                           type: object
 *                           properties:
 *                             PENDING:
 *                               type: number
 *                             REVIEW:
 *                               type: number
 *                             INTERVIEW_SCHEDULED:
 *                               type: number
 *                             REJECTED:
 *                               type: number
 *                             HIRED:
 *                               type: number
 *                         topPerformingJobs:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               jobId:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               applications:
 *                                 type: number
 *                               views:
 *                                 type: number
 *                         monthlyTrends:
 *                           type: object
 *                           properties:
 *                             applications:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   month:
 *                                     type: string
 *                                   count:
 *                                     type: number
 *                             jobs:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   month:
 *                                     type: string
 *                                   count:
 *                                     type: number
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not an employer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/employer', authenticate, requireRole(['EMPLOYER']), analyticsController.getEmployerAnalytics.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/admin:
 *   get:
 *     summary: Get admin analytics
 *     description: Get comprehensive system analytics (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         systemStats:
 *                           type: object
 *                           properties:
 *                             totalUsers:
 *                               type: number
 *                             totalEmployers:
 *                               type: number
 *                             totalCandidates:
 *                               type: number
 *                             totalJobs:
 *                               type: number
 *                             totalApplications:
 *                               type: number
 *                             totalRatings:
 *                               type: number
 *                         userGrowth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: string
 *                               newUsers:
 *                                 type: number
 *                               totalUsers:
 *                                 type: number
 *                         platformActivity:
 *                           type: object
 *                           properties:
 *                             jobsCreatedLastMonth:
 *                               type: number
 *                             applicationsLastMonth:
 *                               type: number
 *                             averageApplicationsPerJob:
 *                               type: number
 *                               format: float
 *                             mostPopularSkills:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   skill:
 *                                     type: string
 *                                   count:
 *                                     type: number
 *                         performanceMetrics:
 *                           type: object
 *                           properties:
 *                             averageHireTime:
 *                               type: number
 *                               description: Average time to hire in days
 *                             hireRate:
 *                               type: number
 *                               format: float
 *                               description: Percentage of applications that result in hire
 *                             topEmployers:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   employerId:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   jobsPosted:
 *                                     type: number
 *                                   totalApplications:
 *                                     type: number
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/admin', authenticate, requireRole(['ADMIN']), analyticsController.getAdminAnalytics.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/cache/invalidate:
 *   post:
 *     summary: Invalidate analytics cache
 *     description: Clear cached analytics data to force refresh (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cache invalidated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Analytics cache invalidated successfully"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/cache/invalidate', authenticate, requireRole(['ADMIN']), analyticsController.invalidateCache.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/job/{id}:
 *   get:
 *     summary: Get job analytics
 *     description: Get detailed analytics for a specific job (Job owner or Admin only)
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         job:
 *                           $ref: '#/components/schemas/Job'
 *                         totalViews:
 *                           type: number
 *                           description: Total job views
 *                           example: 245
 *                         totalApplications:
 *                           type: number
 *                           description: Total applications received
 *                           example: 32
 *                         applicationStatusBreakdown:
 *                           type: object
 *                           properties:
 *                             PENDING:
 *                               type: number
 *                             REVIEW:
 *                               type: number
 *                             INTERVIEW_SCHEDULED:
 *                               type: number
 *                             REJECTED:
 *                               type: number
 *                             HIRED:
 *                               type: number
 *                         viewsOverTime:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               date:
 *                                 type: string
 *                                 format: date
 *                               views:
 *                                 type: number
 *                         applicationsOverTime:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               date:
 *                                 type: string
 *                                 format: date
 *                               applications:
 *                                 type: number
 *                         averageRating:
 *                           type: number
 *                           format: float
 *                           description: Average rating of applications for this job
 *                           example: 3.8
 *                         candidateSkillsBreakdown:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               skill:
 *                                 type: string
 *                               candidateCount:
 *                                 type: number
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not the job owner or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/job/:id', authenticate, analyticsController.getJobAnalytics.bind(analyticsController));

export default router;
