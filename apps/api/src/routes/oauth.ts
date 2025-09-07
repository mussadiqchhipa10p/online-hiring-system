import { Router } from 'express';
import passport from '../config/passport';
import { generateTokens } from '../utils/jwt';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: OAuth
 *   description: OAuth authentication endpoints for third-party login
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     description: Redirect user to Google OAuth consent screen
 *     tags: [OAuth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 *       400:
 *         description: OAuth configuration error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handle Google OAuth callback and generate JWT tokens
 *     tags: [OAuth]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *         description: Error parameter if OAuth failed
 *     responses:
 *       302:
 *         description: Redirect to frontend with authentication tokens or error
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               description: |
 *                 Redirect URL format:
 *                 - Success: `${WEB_URL}/auth/callback?accessToken={token}&refreshToken={token}`
 *                 - Error: `${WEB_URL}/login?error=oauth_failed`
 *       400:
 *         description: OAuth authentication failed
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Redirect to frontend login page with error
 */
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user as any;
      const tokens = generateTokens(user);

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.WEB_URL || 'http://localhost:3000'}/auth/callback?` + 
        `accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.WEB_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
  }
);

/**
 * @swagger
 * /api/auth/linkedin:
 *   get:
 *     summary: Initiate LinkedIn OAuth
 *     description: Redirect user to LinkedIn OAuth consent screen
 *     tags: [OAuth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to LinkedIn OAuth consent screen
 *       400:
 *         description: OAuth configuration error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/linkedin', passport.authenticate('linkedin'));

/**
 * @swagger
 * /api/auth/linkedin/callback:
 *   get:
 *     summary: LinkedIn OAuth callback
 *     description: Handle LinkedIn OAuth callback and generate JWT tokens
 *     tags: [OAuth]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from LinkedIn
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *         description: Error parameter if OAuth failed
 *     responses:
 *       302:
 *         description: Redirect to frontend with authentication tokens or error
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               description: |
 *                 Redirect URL format:
 *                 - Success: `${WEB_URL}/auth/callback?accessToken={token}&refreshToken={token}`
 *                 - Error: `${WEB_URL}/login?error=oauth_failed`
 *       400:
 *         description: OAuth authentication failed
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Redirect to frontend login page with error
 */
router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false }),
  (req, res) => {
    try {
      const user = req.user as any;
      const tokens = generateTokens(user);

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.WEB_URL || 'http://localhost:3000'}/auth/callback?` + 
        `accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.WEB_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
  }
);

export default router;
