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
      role: 'admin',
      status: 'active',
    },
  });

  const volunteerUser = await prisma.user.upsert({
    where: { email: 'volunteer@test.com' },
    update: {},
    create: {
      full_name: 'Test Volunteer',
      email: 'volunteer@test.com',
      password_hash: password,
      role: 'volunteer',
      status: 'active',
    },
  });

  await prisma.volunteerProfile.upsert({
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
      role: 'organization',
      status: 'active',
    },
  });

  const org = await prisma.organization.upsert({
    where: { owner_id: orgUser.user_id },
    update: {},
    create: {
      owner_id: orgUser.user_id,
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
      role: 'organization',
      status: 'active',
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { owner_id: org2User.user_id },
    update: {},
    create: {
      owner_id: org2User.user_id,
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
      role: 'organization',
      status: 'active',
    },
  });

  const org3 = await prisma.organization.upsert({
    where: { owner_id: org3User.user_id },
    update: {},
    create: {
      owner_id: org3User.user_id,
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
      role: 'organization',
      status: 'active',
    },
  });

  const org4 = await prisma.organization.upsert({
    where: { owner_id: org4User.user_id },
    update: {},
    create: {
      owner_id: org4User.user_id,
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
      role: 'organization',
      status: 'active',
    },
  });

  const org5 = await prisma.organization.upsert({
    where: { owner_id: org5User.user_id },
    update: {},
    create: {
      owner_id: org5User.user_id,
      name: 'Paws & Claws Rescue',
      contact_email: 'paws@test.com',
      contact_phone: '555-456-7890',
      location: '567 Animal Ln, Petville',
      description: 'Rescuing and rehabilitating animals in need.',
      website: 'https://pawsandclaws.example.com',
      status: 'approved',
    },
  });

  await prisma.opportunitySkill.deleteMany();
  await prisma.opportunity.deleteMany();

  const skillsData = [
    'Gardening', 'Environment', 'Teamwork', 'Teaching', 'Mathematics',
    'Communication', 'Healthcare', 'First Aid', 'Animal Care', 'Patience',
    'Programming', 'JavaScript', 'Python', 'Leadership', 'Organization',
    'Empathy', 'Coaching', 'Sports', 'Logistics', 'Technology',
    'Attention to Detail', 'Photography', 'Design', 'Writing', 'Research',
    'Cooking', 'Driving', 'Counseling', 'Translation', 'Event Planning',
    'Public Speaking', 'Social Media', 'Data Entry',
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

  const categoryNames = ['Environment', 'Education', 'Healthcare', 'Technology', 'Community & Welfare'];
  const categories = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { category_name: name },
      update: {},
      create: { category_name: name, description: `${name} volunteering opportunities` },
    });
    categories[name] = cat;
  }

  const opportunities = [
    {
      title: 'Community Garden Volunteer',
      category: 'Environment',
      description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks.',
      location: 'Downtown Community Garden',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80',
      skills: ['Gardening', 'Environment', 'Teamwork'],
    },
    {
      title: 'Math Tutor for Teens',
      category: 'Education',
      description: 'Provide one-on-one math tutoring to high school students. Subjects include algebra, geometry, and calculus. Sessions are held online.',
      location: 'Online',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      skills: ['Teaching', 'Mathematics', 'Communication'],
    },
    {
      title: 'Health Screening Assistant',
      category: 'Healthcare',
      description: 'Assist with community health screening events. Take vitals, register patients, and provide health education materials.',
      location: 'Community Health Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      skills: ['Healthcare', 'First Aid', 'Communication'],
    },
    {
      title: 'Animal Shelter Caretaker',
      category: 'Community & Welfare',
      description: 'Care for rescued animals. Duties include feeding, cleaning enclosures, walking dogs, and socializing with cats.',
      location: 'North Side Animal Shelter',
      org_id: org5.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      skills: ['Animal Care', 'Patience', 'Teamwork'],
    },
    {
      title: 'Coding Workshop Mentor',
      category: 'Technology',
      description: 'Mentor beginners through introductory coding workshops in Python and web development.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      skills: ['Programming', 'Teaching', 'JavaScript', 'Python'],
    },
    {
      title: 'Community Clean-Up Lead',
      category: 'Environment',
      description: 'Lead community clean-up events across various parks. Coordinate volunteers, distribute supplies, and ensure proper waste sorting.',
      location: 'Various City Parks',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
      skills: ['Leadership', 'Environment', 'Organization'],
    },
    {
      title: 'Senior Companion Program',
      category: 'Healthcare',
      description: 'Visit and engage with seniors at the community senior center. Play games, read books, or simply have meaningful conversations.',
      location: 'Golden Years Senior Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80',
      skills: ['Patience', 'Communication', 'Empathy'],
    },
    {
      title: 'Youth Soccer Coach',
      category: 'Education',
      description: 'Coach youth soccer for ages 8-12. Teach fundamentals, sportsmanship, and teamwork.',
      location: 'City Park Soccer Field',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
      skills: ['Coaching', 'Sports', 'Teamwork', 'First Aid'],
    },
    {
      title: 'Food Bank Sorters',
      category: 'Environment',
      description: 'Sort, organize, and pack donated food items for distribution to families in need.',
      location: 'Community Food Bank Warehouse',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
      skills: ['Organization', 'Teamwork', 'Logistics'],
    },
    {
      title: 'App Testing Volunteer',
      category: 'Technology',
      description: 'Test new accessibility apps and provide feedback to developers. Help make technology more inclusive.',
      location: 'Downtown Tech Hub',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
      skills: ['Technology', 'Attention to Detail', 'Communication'],
    },
    {
      title: 'Tree Planting Day',
      category: 'Environment',
      description: 'Join our tree planting initiative across the city. Help restore green spaces and combat urban heat Islands.',
      location: 'Riverside Park',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      skills: ['Gardening', 'Environment', 'Teamwork', 'Leadership'],
    },
    {
      title: 'Online English Tutor',
      category: 'Education',
      description: 'Teach English conversational skills to underprivileged students via video calls. Curriculum and materials provided.',
      location: 'Online',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
      skills: ['Teaching', 'Communication', 'Patience'],
    },
    {
      title: 'Blood Donation Drive Coordinator',
      category: 'Healthcare',
      description: 'Help organize and manage community blood donation events. Register donors, manage schedules, and ensure smooth operations.',
      location: 'City Convention Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80',
      skills: ['Healthcare', 'Organization', 'Communication', 'Event Planning'],
    },
    {
      title: 'Pet Adoption Event Helper',
      category: 'Community & Welfare',
      description: 'Assist at weekend pet adoption events. Help match families with rescue animals and provide care information.',
      location: 'Petville Community Center',
      org_id: org5.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
      skills: ['Animal Care', 'Communication', 'Event Planning'],
    },
    {
      title: 'Website Redesign Volunteer',
      category: 'Technology',
      description: 'Help redesign our organization website using modern UI/UX principles. Work with our design team on layout and accessibility.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
      skills: ['Technology', 'Design', 'Programming', 'Communication'],
    },
    {
      title: 'Beach Clean-Up Drive',
      category: 'Environment',
      description: 'Participate in monthly beach clean-up drives. Collect waste, sort recyclables, and document marine debris data.',
      location: 'Sunset Beach',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
      skills: ['Environment', 'Teamwork', 'Organization', 'Data Entry'],
    },
    {
      title: 'Science Fair Judge',
      category: 'Education',
      description: 'Judge middle school science fair projects. Evaluate presentations and provide constructive feedback to young scientists.',
      location: 'Schooltown Convention Hall',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80',
      skills: ['Teaching', 'Research', 'Communication', 'Public Speaking'],
    },
    {
      title: 'Mental Health Hotline Supporter',
      category: 'Healthcare',
      description: 'Provide compassionate listening and resource information to callers on our mental health support hotline. Training provided.',
      location: 'Online',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
      skills: ['Counseling', 'Empathy', 'Communication', 'Patience'],
    },
    {
      title: 'Dog Walking Volunteer',
      category: 'Community & Welfare',
      description: 'Walk and exercise shelter dogs to keep them healthy and socialized. Flexible morning or evening shifts available.',
      location: 'North Side Animal Shelter',
      org_id: org5.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
      skills: ['Animal Care', 'Patience', 'Teamwork'],
    },
    {
      title: 'Social Media Content Creator',
      category: 'Technology',
      description: 'Create engaging social media content to promote our tech-for-good initiatives. Design graphics, write captions, and analyze engagement.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      skills: ['Social Media', 'Design', 'Writing', 'Photography'],
    },
    {
      title: 'Community Kitchen Assistant',
      category: 'Community & Welfare',
      description: 'Help prepare and serve meals at our community kitchen. Assist with food prep, serving, and clean-up for those in need.',
      location: 'Downtown Community Kitchen',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80',
      skills: ['Cooking', 'Teamwork', 'Organization', 'Logistics'],
    },
    {
      title: 'After-School Homework Helper',
      category: 'Education',
      description: 'Assist elementary students with homework in reading, writing, and math. Help build confidence and academic skills.',
      location: 'Schooltown Library',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      skills: ['Teaching', 'Patience', 'Communication', 'Mathematics'],
    },
    {
      title: 'Vaccination Clinic Support',
      category: 'Healthcare',
      description: 'Support community vaccination clinics with patient registration, queue management, and post-vaccination observation.',
      location: 'Caretown Medical Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80',
      skills: ['Healthcare', 'Organization', 'Communication', 'Data Entry'],
    },
    {
      title: 'Foster Cat Socializer',
      category: 'Community & Welfare',
      description: 'Socialize rescued cats in our foster program. Help them become comfortable around people for better adoption chances.',
      location: 'Petville Foster Center',
      org_id: org5.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80',
      skills: ['Animal Care', 'Patience', 'Empathy'],
    },
    {
      title: 'Translation Services Volunteer',
      category: 'Technology',
      description: 'Translate documents and website content from English to Khmer. Help make our resources accessible to local communities.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      skills: ['Translation', 'Writing', 'Communication', 'Attention to Detail'],
    },
    {
      title: 'Recycling Education Ambassador',
      category: 'Environment',
      description: 'Educate communities about proper recycling practices. Host workshops at schools and distribute educational materials.',
      location: 'Various Schools',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
      skills: ['Teaching', 'Environment', 'Public Speaking', 'Communication'],
    },
    {
      title: 'Career Counseling Volunteer',
      category: 'Education',
      description: 'Provide career guidance and resume review sessions to high school students preparing for college and employment.',
      location: 'Schooltown Career Center',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      skills: ['Counseling', 'Teaching', 'Communication', 'Leadership'],
    },
    {
      title: 'First Aid Training Assistant',
      category: 'Healthcare',
      description: 'Assist instructors during community first aid and CPR training sessions. Help with demonstrations and participant practice.',
      location: 'Community Health Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
      skills: ['First Aid', 'Healthcare', 'Teaching', 'Communication'],
    },
    {
      title: 'Mobile App Developer Volunteer',
      category: 'Technology',
      description: 'Help build a mobile app for tracking volunteer hours and impact. Work with our tech team using React Native.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      skills: ['Programming', 'JavaScript', 'Technology', 'Teamwork'],
    },
    {
      title: 'Wildlife Habitat Restoration',
      category: 'Environment',
      description: 'Restore natural habitats in protected areas. Remove invasive species, plant native vegetation, and monitor wildlife activity.',
      location: 'Green Valley Reserve',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      skills: ['Environment', 'Gardening', 'Teamwork', 'Research'],
    },
    {
      title: 'Tech Workshop for Seniors',
      category: 'Technology',
      description: 'Teach basic computer and smartphone skills to senior citizens. Help them stay connected with family and access online services.',
      location: 'Golden Years Senior Center',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
      skills: ['Technology', 'Teaching', 'Patience', 'Communication'],
    },
    {
      title: 'Community First Aid Workshop',
      category: 'Healthcare',
      description: 'Lead basic first aid workshops for community members. Teach wound care, CPR basics, and emergency response.',
      location: 'Community Health Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
      skills: ['First Aid', 'Healthcare', 'Teaching', 'Communication'],
    },
    {
      title: 'Animal Grooming Volunteer',
      category: 'Community & Welfare',
      description: 'Help groom and bathe shelter animals to keep them healthy and adoption-ready. No prior experience needed, training provided.',
      location: 'Petville Foster Center',
      org_id: org5.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80',
      skills: ['Animal Care', 'Patience', 'Attention to Detail'],
    },
    {
      title: 'Youth Basketball Coach',
      category: 'Education',
      description: 'Coach basketball for youth ages 10-14. Teach fundamentals, teamwork, and sportsmanship in a fun environment.',
      location: 'City Park Basketball Court',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
      skills: ['Coaching', 'Sports', 'Teamwork', 'Teaching'],
    },
    {
      title: 'Soup Kitchen Cook',
      category: 'Environment',
      description: 'Prepare and serve nutritious meals at our soup kitchen. Help with menu planning, cooking, and serving to those experiencing food insecurity.',
      location: 'Downtown Community Kitchen',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
      skills: ['Cooking', 'Organization', 'Teamwork', 'Logistics'],
    },
    {
      title: 'Crisis Helpline Counselor',
      category: 'Healthcare',
      description: 'Provide immediate support to individuals in crisis through our 24/7 helpline. Comprehensive training and supervision provided.',
      location: 'Online',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
      skills: ['Counseling', 'Empathy', 'Communication', 'Patience'],
    },
    {
      title: 'Mobile Clinic Tech Support',
      category: 'Technology',
      description: 'Set up and maintain technology equipment on mobile health clinics. Ensure tablets, network, and telemedicine tools work smoothly.',
      location: 'Various Locations',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      skills: ['Technology', 'Healthcare', 'Programming', 'Logistics'],
    },
    {
      title: 'Bake Sale Organizer',
      category: 'Technology',
      description: 'Organize weekend bake sales to raise funds for animal rescue operations. Coordinate baking, pricing, and sales.',
      location: 'Petville Town Square',
      org_id: org5.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
      skills: ['Cooking', 'Event Planning', 'Organization', 'Teamwork'],
    },
    {
      title: 'Tutoring for New Immigrants',
      category: 'Education',
      description: 'Help new immigrants learn English and navigate local services. Provide one-on-one language practice and community orientation.',
      location: 'Schooltown Library',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      skills: ['Teaching', 'Translation', 'Communication', 'Empathy'],
    },
    {
      title: 'Disaster Relief Volunteer',
      category: 'Environment',
      description: 'Train and prepare for emergency disaster response. Assist with evacuation shelters, supply distribution, and community coordination.',
      location: 'City Emergency Center',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
      skills: ['First Aid', 'Logistics', 'Teamwork', 'Communication'],
    },
    {
      title: 'Accessibility Tester',
      category: 'Technology',
      description: 'Test websites and apps for accessibility compliance. Help identify barriers for users with disabilities and suggest improvements.',
      location: 'Online',
      org_id: org4.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
      skills: ['Technology', 'Attention to Detail', 'Programming', 'Communication'],
    },
    {
      title: 'Meal Prep for Homeless Shelters',
      category: 'Environment',
      description: 'Help prepare and package nutritious meals for distribution to homeless shelters across the city.',
      location: 'Community Food Bank Kitchen',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80',
      skills: ['Cooking', 'Organization', 'Logistics'],
    },
    {
      title: 'Food Truck Fundraiser Cook',
      category: 'Education',
      description: 'Run a charity food truck at local events. Cook and sell meals with all proceeds going to youth programs.',
      location: 'Various Event Locations',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
      skills: ['Cooking', 'Event Planning', 'Teamwork', 'Communication'],
    },
    {
      title: 'Grief Support Group Facilitator',
      category: 'Healthcare',
      description: 'Facilitate weekly grief support groups for adults who have lost loved ones. Provide a safe space for healing and connection.',
      location: 'Community Wellness Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
      skills: ['Counseling', 'Empathy', 'Communication', 'Patience'],
    },
    {
      title: 'Youth Mentoring & Counseling',
      category: 'Education',
      description: 'Provide one-on-one mentoring and counseling for at-risk youth. Build trusting relationships and guide positive development.',
      location: 'Schooltown High School',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80',
      skills: ['Counseling', 'Teaching', 'Empathy', 'Communication'],
    },
    {
      title: 'Senior Yoga & Fitness Coach',
      category: 'Healthcare',
      description: 'Lead gentle yoga and fitness classes for senior citizens. Help improve mobility, balance, and overall wellness.',
      location: 'Golden Years Senior Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      skills: ['Coaching', 'Sports', 'Healthcare', 'Communication'],
    },
    {
      title: 'Community Cricket Coach',
      category: 'Education',
      description: 'Coach cricket for youth and young adults in the community. Organize practice sessions and friendly matches.',
      location: 'City Cricket Ground',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80',
      skills: ['Coaching', 'Sports', 'Teamwork', 'Teaching'],
    },
    {
      title: 'Nutrition Workshop Leader',
      category: 'Healthcare',
      description: 'Lead interactive nutrition and healthy cooking workshops for low-income families. Teach budget-friendly meal planning.',
      location: 'Community Health Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
      skills: ['Cooking', 'Healthcare', 'Teaching', 'Communication'],
    },
    {
      title: 'Special Olympics Volunteer Coach',
      category: 'Education',
      description: 'Support athletes with intellectual disabilities in track, soccer, and swimming events. Help with training, encouragement, and event coordination.',
      location: 'City Sports Complex',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',
      skills: ['Coaching', 'Sports', 'Patience', 'Teamwork'],
    },
    {
      title: 'Elderly Home Visiting Volunteer',
      category: 'Community & Welfare',
      description: 'Visit elderly residents at nursing homes, provide companionship, help with letters, and engage in recreational activities.',
      location: 'Golden Years Senior Center',
      org_id: org3.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80',
      skills: ['Communication', 'Patience', 'Empathy'],
    },
    {
      title: 'Homeless Shelter Night Support',
      category: 'Community & Welfare',
      description: 'Provide evening support at homeless shelters. Help with intake, serve meals, and ensure a safe and welcoming environment.',
      location: 'City Shelter',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
      skills: ['Organization', 'Teamwork', 'Communication', 'Empathy'],
    },
    {
      title: 'Youth Recreation Center Assistant',
      category: 'Community & Welfare',
      description: 'Help supervise and organize activities at a youth recreation center. Assist with sports, arts, and homework support.',
      location: 'Schooltown Recreation Center',
      org_id: org2.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
      skills: ['Teaching', 'Teamwork', 'Sports', 'Communication'],
    },
    {
      title: 'Community Food Distribution Driver',
      category: 'Community & Welfare',
      description: 'Deliver food packages to homebound seniors and families in need. Must have a valid drivers license and reliable vehicle.',
      location: 'Downtown Distribution Center',
      org_id: org.org_id,
      status: 'open',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
      skills: ['Driving', 'Organization', 'Logistics', 'Communication'],
    },
  ];

  const orgs = await prisma.organization.findMany({ select: { org_id: true, owner_id: true } });
  const orgOwnerMap = {};
  for (const o of orgs) orgOwnerMap[o.org_id] = o.owner_id;

  await Promise.all(opportunities.map((opp) => {
    const { skills, category, ...oppData } = opp;
    return prisma.opportunity.create({
      data: {
        ...oppData,
        requirement: oppData.requirement || 'No specific requirements',
        format: oppData.format || 'onsite',
        work_time: oppData.work_time || 'Flexible',
        start_date: oppData.start_date || new Date(),
        end_date: oppData.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        posted_by: orgOwnerMap[oppData.org_id],
        category_id: categories[category].category_id,
        skills: {
          create: skills.map((name) => ({
            skill: { connect: { skill_name: name } },
          })),
        },
      },
    });
  }));

  console.log('Seed data inserted successfully');
  console.log(`  - ${opportunities.length} opportunities created (${categoryNames.length} categories)`);
  console.log('  - 5 organizations created');
  console.log('  - 3 users created (volunteer@test.com / org@test.com / admin@smakjit.com, password: password123)');
  console.log(`  - ${skillsData.length} skills available`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
