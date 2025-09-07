import { Router } from 'express';
import passport from '../config/passport';
import { generateTokens } from '../utils/jwt';

const router: Router = Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

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

// LinkedIn OAuth routes
router.get('/linkedin', passport.authenticate('linkedin'));

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
