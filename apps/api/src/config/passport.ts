import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { PrismaClient, Role } from '@prisma/client';
import { generateTokens } from '../utils/jwt';

const prisma = new PrismaClient();

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    },
    async (payload, done) => {
      try {
        if (payload.type !== 'access') {
          return done(null, false);
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, name } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          return done(null, user);
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name: name?.givenName && name?.familyName 
              ? `${name.givenName} ${name.familyName}` 
              : name?.displayName || 'Google User',
            role: Role.CANDIDATE, // Default role for OAuth users
            password: null, // OAuth users don't have passwords
          },
        });

        // Create candidate record
        await prisma.candidate.create({
          data: {
            userId: user.id,
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// LinkedIn OAuth Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      callbackURL: '/api/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, name } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in LinkedIn profile'), null);
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          return done(null, user);
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name: name?.givenName && name?.familyName 
              ? `${name.givenName} ${name.familyName}` 
              : name?.displayName || 'LinkedIn User',
            role: Role.CANDIDATE, // Default role for OAuth users
            password: null, // OAuth users don't have passwords
          },
        });

        // Create candidate record
        await prisma.candidate.create({
          data: {
            userId: user.id,
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
