require('dotenv').config();
const prisma = require('../src/lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smakjit.com' },
    update: {},
    create: {
      full_name: 'Admin SmakJit',
      email: 'admin@smakjit.com',
      password_hash: password,
      user_type: 'admin',
      status: 'active',
    },
  });

  await prisma.admin.upsert({
    where: { user_id: adminUser.user_id },
    update: {},
    create: {
      user_id: adminUser.user_id,
      name: 'Admin SmakJit',
      email: 'admin@smakjit.com',
    },
  });

  const volunteerUser = await prisma.user.upsert({
    where: { email: 'volunteer@test.com' },
    update: {},
    create: {
      full_name: 'Test Volunteer',
      email: 'volunteer@test.com',
      password_hash: password,
      user_type: 'volunteer',
      status: 'active',
    },
  });

  await prisma.volunteer.upsert({
    where: { user_id: volunteerUser.user_id },
    update: {},
    create: {
      user_id: volunteerUser.user_id,
      phone_num: '123-456-7890',
      location: 'Phnom Penh',
      bio: 'Passionate volunteer looking to make a difference.',
    },
  });

  const orgUser = await prisma.user.upsert({
    where: { email: 'org@test.com' },
    update: {},
    create: {
      full_name: 'Green Earth Initiative',
      email: 'org@test.com',
      password_hash: password,
      user_type: 'organization',
      status: 'active',
    },
  });

  const org = await prisma.organization.upsert({
    where: { user_id: orgUser.user_id },
    update: {},
    create: {
      user_id: orgUser.user_id,
      name: 'Green Earth Initiative',
      contact_email: 'org@test.com',
      contact_phone: '123-456-7890',
      location: '123 Green St, Cityville',
      description: 'We are dedicated to environmental conservation and community green projects.',
      website: 'https://greenearth.example.com',
      status: 'approved',
    },
  });

  const org2User = await prisma.user.upsert({
    where: { email: 'teach@test.com' },
    update: {},
    create: {
      full_name: 'Teach For Tomorrow',
      email: 'teach@test.com',
      password_hash: password,
      user_type: 'organization',
      status: 'active',
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { user_id: org2User.user_id },
    update: {},
    create: {
      user_id: org2User.user_id,
      name: 'Teach For Tomorrow',
      contact_email: 'teach@test.com',
      contact_phone: '098-765-4321',
      location: '456 Education Ave, Schooltown',
      description: 'Empowering students through quality education and mentorship programs.',
      website: 'https://teachfortomorrow.example.com',
      status: 'approved',
    },
  });

  const org3User = await prisma.user.upsert({
    where: { email: 'healthbridge@test.com' },
    update: {},
    create: {
      full_name: 'HealthBridge',
      email: 'healthbridge@test.com',
      password_hash: password,
      user_type: 'organization',
      status: 'active',
    },
  });

  const org3 = await prisma.organization.upsert({
    where: { user_id: org3User.user_id },
    update: {},
    create: {
      user_id: org3User.user_id,
      name: 'HealthBridge',
      contact_email: 'healthbridge@test.com',
      contact_phone: '555-123-4567',
      location: '789 Medical Blvd, Caretown',
      description: 'Providing accessible healthcare services to underserved communities.',
      website: 'https://healthbridge.example.com',
      status: 'approved',
    },
  });

  const org4User = await prisma.user.upsert({
    where: { email: 'techforgood@test.com' },
    update: {},
    create: {
      full_name: 'Tech for Good',
      email: 'techforgood@test.com',
      password_hash: password,
      user_type: 'organization',
      status: 'active',
    },
  });

  const org4 = await prisma.organization.upsert({
    where: { user_id: org4User.user_id },
    update: {},
    create: {
      user_id: org4User.user_id,
      name: 'Tech for Good',
      contact_email: 'techforgood@test.com',
      contact_phone: '555-987-6543',
      location: '321 Innovation Dr, Startupville',
      description: 'Leveraging technology to solve social challenges.',
      website: 'https://techforgood.example.com',
      status: 'approved',
    },
  });

  const org5User = await prisma.user.upsert({
    where: { email: 'paws@test.com' },
    update: {},
    create: {
      full_name: 'Paws & Claws Rescue',
      email: 'paws@test.com',
      password_hash: password,
      user_type: 'organization',
      status: 'active',
    },
  });

  const org5 = await prisma.organization.upsert({
    where: { user_id: org5User.user_id },
    update: {},
    create: {
      user_id: org5User.user_id,
      name: 'Paws & Claws Rescue',
      contact_email: 'paws@test.com',
      contact_phone: '555-456-7890',
      location: '567 Animal Ln, Petville',
      description: 'Rescuing and rehabilitating animals in need.',
      website: 'https://pawsandclaws.example.com',
      status: 'approved',
    },
  });

  const skillsData = [
    'Gardening', 'Environment', 'Teamwork', 'Teaching', 'Mathematics',
    'Communication', 'Healthcare', 'First Aid', 'Animal Care', 'Patience',
    'Programming', 'JavaScript', 'Python', 'Leadership', 'Organization',
    'Empathy', 'Coaching', 'Sports', 'Logistics', 'Technology',
    'Attention to Detail', 'Photography',
  ];

  const skillRecords = {};
  for (const name of skillsData) {
    const skill = await prisma.skill.upsert({
      where: { skill_name: name },
      update: {},
      create: { skill_name: name },
    });
    skillRecords[name] = skill;
  }

  const opportunities = [
    {
      title: 'Community Garden Volunteer',
      description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks.',
      location: 'Downtown Community Garden',
      org_id: org.org_id,
      status: 'open',
      skills: ['Gardening', 'Environment', 'Teamwork'],
    },
    {
      title: 'Math Tutor for Teens',
      description: 'Provide one-on-one math tutoring to high school students. Subjects include algebra, geometry, and calculus. Sessions are held online.',
      location: 'Online',
      org_id: org2.org_id,
      status: 'open',
      skills: ['Teaching', 'Mathematics', 'Communication'],
    },
    {
      title: 'Health Screening Assistant',
      description: 'Assist with community health screening events. Take vitals, register patients, and provide health education materials.',
      location: 'Community Health Center',
      org_id: org3.org_id,
      status: 'open',
      skills: ['Healthcare', 'First Aid', 'Communication'],
    },
    {
      title: 'Animal Shelter Caretaker',
      description: 'Care for rescued animals. Duties include feeding, cleaning enclosures, walking dogs, and socializing with cats.',
      location: 'North Side Animal Shelter',
      org_id: org5.org_id,
      status: 'open',
      skills: ['Animal Care', 'Patience', 'Teamwork'],
    },
    {
      title: 'Coding Workshop Mentor',
      description: 'Mentor beginners through introductory coding workshops in Python and web development.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      skills: ['Programming', 'Teaching', 'JavaScript', 'Python'],
    },
    {
      title: 'Community Clean-Up Lead',
      description: 'Lead community clean-up events across various parks. Coordinate volunteers, distribute supplies, and ensure proper waste sorting.',
      location: 'Various City Parks',
      org_id: org.org_id,
      status: 'open',
      skills: ['Leadership', 'Environment', 'Organization'],
    },
    {
      title: 'Senior Companion Program',
      description: 'Visit and engage with seniors at the community senior center. Play games, read books, or simply have meaningful conversations.',
      location: 'Golden Years Senior Center',
      org_id: org3.org_id,
      status: 'open',
      skills: ['Patience', 'Communication', 'Empathy'],
    },
    {
      title: 'Youth Soccer Coach',
      description: 'Coach youth soccer for ages 8-12. Teach fundamentals, sportsmanship, and teamwork.',
      location: 'City Park Soccer Field',
      org_id: org2.org_id,
      status: 'open',
      skills: ['Coaching', 'Sports', 'Teamwork', 'First Aid'],
    },
    {
      title: 'Food Bank Sorters',
      description: 'Sort, organize, and pack donated food items for distribution to families in need.',
      location: 'Community Food Bank Warehouse',
      org_id: org.org_id,
      status: 'open',
      skills: ['Organization', 'Teamwork', 'Logistics'],
    },
    {
      title: 'App Testing Volunteer',
      description: 'Test new accessibility apps and provide feedback to developers. Help make technology more inclusive.',
      location: 'Downtown Tech Hub',
      org_id: org4.org_id,
      status: 'open',
      skills: ['Technology', 'Attention to Detail', 'Communication'],
    },
  ];

  for (const opp of opportunities) {
    const { skills, ...oppData } = opp;
    await prisma.opportunity.create({
      data: {
        ...oppData,
        opportunity_skills: {
          create: skills.map((name) => ({
            skill: { connect: { skill_name: name } },
          })),
        },
      },
    });
  }

  console.log('Seed data inserted successfully');
  console.log(`  - ${opportunities.length} opportunities created`);
  console.log('  - 5 organizations created');
  console.log('  - 3 users created (volunteer@test.com / org@test.com / admin@smakjit.com, password: password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
