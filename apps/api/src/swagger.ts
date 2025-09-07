import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Hiring System API',
      version: '1.0.0',
      description: 'A comprehensive API for an online hiring and recruitment system',
      contact: {
        name: 'API Support',
        email: 'support@hiringSystem.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.hiringsystem.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        // Response wrapper
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
            },
            data: {
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['CANDIDATE', 'EMPLOYER', 'ADMIN'],
              description: 'User role in the system',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User registration timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        // Auth schemas
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'password123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              description: 'User full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'password123',
            },
            role: {
              type: 'string',
              enum: ['CANDIDATE', 'EMPLOYER', 'ADMIN'],
              description: 'User role in the system',
              example: 'CANDIDATE',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'JWT access token',
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                },
              },
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              description: 'Refresh token to generate new access token',
            },
          },
        },
        // Job schemas
        Job: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique job identifier',
            },
            title: {
              type: 'string',
              description: 'Job title',
              example: 'Senior Software Engineer',
            },
            description: {
              type: 'string',
              description: 'Detailed job description',
              example: 'We are looking for a senior software engineer...',
            },
            location: {
              type: 'string',
              description: 'Job location',
              example: 'San Francisco, CA',
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Required skills for the job',
              example: ['JavaScript', 'React', 'Node.js'],
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
              description: 'Job status',
              example: 'PUBLISHED',
            },
            employerId: {
              type: 'string',
              description: 'ID of the employer who posted the job',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Job creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateJobRequest: {
          type: 'object',
          required: ['title', 'description', 'location', 'skills'],
          properties: {
            title: {
              type: 'string',
              description: 'Job title',
              example: 'Senior Software Engineer',
            },
            description: {
              type: 'string',
              minLength: 10,
              description: 'Detailed job description (minimum 10 characters)',
              example: 'We are looking for a senior software engineer with expertise in modern web technologies...',
            },
            location: {
              type: 'string',
              description: 'Job location',
              example: 'San Francisco, CA',
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 1,
              description: 'Required skills for the job (at least one required)',
              example: ['JavaScript', 'React', 'Node.js'],
            },
          },
        },
        UpdateJobRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Job title',
            },
            description: {
              type: 'string',
              minLength: 10,
              description: 'Detailed job description',
            },
            location: {
              type: 'string',
              description: 'Job location',
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Required skills for the job',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
              description: 'Job status',
            },
          },
        },
        JobsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Job',
              },
            },
            pagination: {
              $ref: '#/components/schemas/Pagination',
            },
          },
        },
        // Application schemas
        Application: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique application identifier',
            },
            jobId: {
              type: 'string',
              description: 'ID of the job being applied to',
            },
            candidateId: {
              type: 'string',
              description: 'ID of the candidate applying',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'REVIEW', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED'],
              description: 'Application status',
              example: 'PENDING',
            },
            notes: {
              type: 'string',
              description: 'Additional notes from candidate',
            },
            resumeUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to candidate resume',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application submission timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateApplicationRequest: {
          type: 'object',
          required: ['jobId', 'resumeUrl'],
          properties: {
            jobId: {
              type: 'string',
              description: 'ID of the job being applied to',
            },
            notes: {
              type: 'string',
              description: 'Additional notes from candidate',
            },
            resumeUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to candidate resume',
              example: 'https://example.com/resume.pdf',
            },
          },
        },
        UpdateApplicationRequest: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['PENDING', 'REVIEW', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED'],
              description: 'Application status',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
            },
          },
        },
        // Rating schemas
        Rating: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique rating identifier',
            },
            applicationId: {
              type: 'string',
              description: 'ID of the application being rated',
            },
            score: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Rating score (1-5)',
              example: 4,
            },
            feedback: {
              type: 'string',
              description: 'Detailed feedback',
            },
            interviewer: {
              type: 'string',
              description: 'Name of the interviewer',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Rating creation timestamp',
            },
          },
        },
        CreateRatingRequest: {
          type: 'object',
          required: ['applicationId', 'score'],
          properties: {
            applicationId: {
              type: 'string',
              description: 'ID of the application being rated',
            },
            score: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Rating score (1-5)',
              example: 4,
            },
            feedback: {
              type: 'string',
              description: 'Detailed feedback',
            },
            interviewer: {
              type: 'string',
              description: 'Name of the interviewer',
            },
          },
        },
        // Utility schemas
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Current page number',
            },
            pageSize: {
              type: 'number',
              description: 'Number of items per page',
            },
            total: {
              type: 'number',
              description: 'Total number of items',
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
