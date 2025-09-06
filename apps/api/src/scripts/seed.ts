import { PrismaClient, Role, JobStatus, AppStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  // Create employer user
  const employerPassword = await bcrypt.hash('employer123', 10);
  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@example.com' },
    update: {},
    create: {
      email: 'employer@example.com',
      password: employerPassword,
      name: 'John Employer',
      role: Role.EMPLOYER,
    },
  });

  const employer = await prisma.employer.upsert({
    where: { userId: employerUser.id },
    update: {},
    create: {
      userId: employerUser.id,
      companyName: 'Tech Corp Inc.',
    },
  });

  // Create candidate user
  const candidatePassword = await bcrypt.hash('candidate123', 10);
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@example.com' },
    update: {},
    create: {
      email: 'candidate@example.com',
      password: candidatePassword,
      name: 'Jane Candidate',
      role: Role.CANDIDATE,
    },
  });

  const candidate = await prisma.candidate.upsert({
    where: { userId: candidateUser.id },
    update: {},
    create: {
      userId: candidateUser.id,
    },
  });

  // Create sample jobs
  const job1 = await prisma.job.upsert({
    where: { id: 'job-1' },
    update: {},
    create: {
      id: 'job-1',
      employerId: employer.id,
      title: 'Senior Full Stack Developer',
      description: 'We are looking for a senior full stack developer with experience in React, Node.js, and PostgreSQL.',
      location: 'San Francisco, CA',
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
      status: JobStatus.PUBLISHED,
      views: 150,
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: 'job-2' },
    update: {},
    create: {
      id: 'job-2',
      employerId: employer.id,
      title: 'Frontend Developer',
      description: 'Join our frontend team to build amazing user experiences with React and modern web technologies.',
      location: 'Remote',
      skills: ['React', 'TypeScript', 'CSS', 'Jest', 'Webpack'],
      status: JobStatus.PUBLISHED,
      views: 89,
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 'job-3' },
    update: {},
    create: {
      id: 'job-3',
      employerId: employer.id,
      title: 'Backend Developer',
      description: 'Looking for a backend developer to work on our API and database systems.',
      location: 'New York, NY',
      skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      status: JobStatus.DRAFT,
      views: 0,
    },
  });

  // Create sample application
  const application = await prisma.application.upsert({
    where: { id: 'app-1' },
    update: {},
    create: {
      id: 'app-1',
      jobId: job1.id,
      candidateId: candidate.id,
      status: AppStatus.PENDING,
      notes: 'I am very interested in this position and have relevant experience.',
    },
  });

  // Create sample resume
  await prisma.resume.upsert({
    where: { id: 'resume-1' },
    update: {},
    create: {
      id: 'resume-1',
      candidateId: candidate.id,
      url: 'https://example.com/resume.pdf',
      parsedJson: {
        name: 'Jane Candidate',
        email: 'candidate@example.com',
        experience: [
          {
            company: 'Previous Company',
            position: 'Frontend Developer',
            duration: '2 years'
          }
        ],
        skills: ['React', 'TypeScript', 'Node.js']
      },
    },
  });

  // Create sample rating
  await prisma.rating.upsert({
    where: { id: 'rating-1' },
    update: {},
    create: {
      id: 'rating-1',
      applicationId: application.id,
      score: 4,
      feedback: 'Great technical skills and communication. Would recommend for the next round.',
      interviewer: 'John Employer',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin: admin@example.com / admin123');
  console.log('📧 Employer: employer@example.com / employer123');
  console.log('📧 Candidate: candidate@example.com / candidate123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
