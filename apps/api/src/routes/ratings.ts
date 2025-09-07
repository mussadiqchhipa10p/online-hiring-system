import { Router } from 'express';
import { ratingsController } from '../controllers/ratingsController';
import { authenticate, requireRole } from '../middleware/auth';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Candidate rating and evaluation endpoints
 */

/**
 * @swagger
 * /api/ratings/{id}:
 *   get:
 *     summary: Get rating by ID
 *     description: Retrieve detailed information about a specific rating
 *     tags: [Ratings]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Rating'
 *       404:
 *         description: Rating not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ratingsController.getRatingById.bind(ratingsController));

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Create a new rating
 *     description: Create a rating for a candidate's application (Employer only)
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRatingRequest'
 *     responses:
 *       201:
 *         description: Rating created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Bad request - invalid input or duplicate rating
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not an employer or not authorized for this application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, requireRole(['EMPLOYER']), ratingsController.createRating.bind(ratingsController));

/**
 * @swagger
 * /api/ratings/{id}:
 *   patch:
 *     summary: Update a rating
 *     description: Update an existing rating (Employer only - rating owner)
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating score (1-5)
 *                 example: 4
 *               feedback:
 *                 type: string
 *                 description: Detailed feedback
 *               interviewer:
 *                 type: string
 *                 description: Name of the interviewer
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not the rating owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Rating not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', authenticate, requireRole(['EMPLOYER']), ratingsController.updateRating.bind(ratingsController));

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating
 *     description: Delete an existing rating (Employer only - rating owner)
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Rating deleted successfully"
 *       400:
 *         description: Bad request - unable to delete rating
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not the rating owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Rating not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate, requireRole(['EMPLOYER']), ratingsController.deleteRating.bind(ratingsController));

/**
 * @swagger
 * /api/ratings/employer/my-ratings:
 *   get:
 *     summary: Get employer's ratings
 *     description: Retrieve all ratings created by the authenticated employer
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: applicationId
 *         schema:
 *           type: string
 *         description: Filter ratings by application ID
 *       - in: query
 *         name: score
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter ratings by score
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Employer ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Rating'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
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
router.get('/employer/my-ratings', authenticate, requireRole(['EMPLOYER']), ratingsController.getEmployerRatings.bind(ratingsController));

/**
 * @swagger
 * /api/ratings/employer/stats:
 *   get:
 *     summary: Get employer rating statistics
 *     description: Retrieve rating statistics and insights for the authenticated employer
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employer rating statistics retrieved successfully
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
 *                         totalRatings:
 *                           type: number
 *                           description: Total number of ratings given
 *                           example: 45
 *                         averageScore:
 *                           type: number
 *                           format: float
 *                           description: Average rating score given
 *                           example: 3.8
 *                         scoreDistribution:
 *                           type: object
 *                           properties:
 *                             "1":
 *                               type: number
 *                               description: Number of 1-star ratings
 *                             "2":
 *                               type: number
 *                               description: Number of 2-star ratings
 *                             "3":
 *                               type: number
 *                               description: Number of 3-star ratings
 *                             "4":
 *                               type: number
 *                               description: Number of 4-star ratings
 *                             "5":
 *                               type: number
 *                               description: Number of 5-star ratings
 *                         recentRatings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Rating'
 *                           description: Most recent ratings (last 5)
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
router.get('/employer/stats', authenticate, requireRole(['EMPLOYER']), ratingsController.getEmployerRatingStats.bind(ratingsController));

/**
 * @swagger
 * /api/ratings/candidate/my-ratings:
 *   get:
 *     summary: Get candidate's ratings
 *     description: Retrieve all ratings received by the authenticated candidate
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: applicationId
 *         schema:
 *           type: string
 *         description: Filter ratings by application ID
 *       - in: query
 *         name: score
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter ratings by score
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Candidate ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Rating'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not a candidate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/candidate/my-ratings', authenticate, requireRole(['CANDIDATE']), ratingsController.getCandidateRatings.bind(ratingsController));

/**
 * @swagger
 * /api/ratings/candidate/average:
 *   get:
 *     summary: Get candidate's average rating
 *     description: Retrieve the average rating score for the authenticated candidate
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate average rating retrieved successfully
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
 *                         averageRating:
 *                           type: number
 *                           format: float
 *                           description: Average rating score
 *                           example: 4.2
 *                         totalRatings:
 *                           type: number
 *                           description: Total number of ratings received
 *                           example: 12
 *                         ratingBreakdown:
 *                           type: object
 *                           properties:
 *                             "1":
 *                               type: number
 *                               description: Number of 1-star ratings
 *                             "2":
 *                               type: number
 *                               description: Number of 2-star ratings
 *                             "3":
 *                               type: number
 *                               description: Number of 3-star ratings
 *                             "4":
 *                               type: number
 *                               description: Number of 4-star ratings
 *                             "5":
 *                               type: number
 *                               description: Number of 5-star ratings
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not a candidate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No ratings found for candidate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/candidate/average', authenticate, requireRole(['CANDIDATE']), ratingsController.getCandidateAverageRating.bind(ratingsController));

export default router;
