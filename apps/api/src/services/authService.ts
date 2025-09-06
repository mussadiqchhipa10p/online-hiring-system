import { PrismaClient, User, Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, generateAccessToken } from '../utils/jwt';
import { LoginInput, RegisterInput, RefreshTokenInput } from '../utils/validation';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: RegisterInput) {
    const { email, password, name, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Create role-specific records
    if (role === Role.EMPLOYER) {
      await prisma.employer.create({
        data: {
          userId: user.id,
          companyName: `${name}'s Company`, // Default company name
        },
      });
    } else if (role === Role.CANDIDATE) {
      await prisma.candidate.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    };
  }

  async refreshToken(data: RefreshTokenInput) {
    const { refreshToken } = data;

    try {
      const payload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const accessToken = generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async logout(userId: string) {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    return { message: 'Logged out successfully' };
  }
}

export const authService = new AuthService();
