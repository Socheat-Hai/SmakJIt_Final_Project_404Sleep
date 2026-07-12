'use strict';

/*
 * ─── Demo Data Seeder ─────────────────────────────────────────────
 * Generates a reproducible set of demo records for all tables.
 *
 * All user accounts share the same password:
 *   Password123
 *
 * ID ranges (deterministic ── never use Math.random):
 *   Users:          1-33   (1-3 admin, 4-13 org_owner, 14-33 volunteer)
 *   Organizations:  1-10
 *   Categories:     1-5
 *   Skills:         1-10
 *   VolunteerProfiles: 1-20  (maps to user_id 14-33)
 *   Opportunities:  1-50
 *   Applications:   1-60
 *   SavedOpportunities: 1-30
 *
 * After bulk-inserts, every affected auto-increment sequence is
 * advanced past the highest explicit ID.
 */

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// -------------------------------------------------------------------
// Configurable constants  (tweak here to scale, then verify with
//   `node scripts/verify-seeder.js`)
// -------------------------------------------------------------------

const ADMIN_COUNT = 3;
const ORG_OWNER_COUNT = 10;
const VOLUNTEER_COUNT = 20;

const DEMO_PASSWORD = 'Password123';
const PASSWORD_HASH = bcrypt.hashSync(DEMO_PASSWORD, 10);

const CATEGORY_NAMES = [
  'Education',
  'Healthcare',
  'Environment',
  'Community Development',
  'Arts & Culture',
];

const SKILL_NAMES = [
  'Teaching',
  'Nursing',
  'Gardening',
  'Carpentry',
  'Cooking',
  'Driving',
  'Photography',
  'IT Support',
  'Event Planning',
  'Fundraising',
  'Technology',
];

const ORG_NAMES = [
  'EduCare Foundation',
  'HealthFirst Initiative',
  'Green Earth Collective',
  'Urban Development Corp',
  'Artisan Creative Hub',
  'Bright Future Academy',
  'Community Care Network',
  'Digital Literacy Project',
  'Sustainable Living Center',
  'Cultural Heritage Trust',
];

const LOCATIONS = [
  'Phnom Penh', 'Phnom Penh', 'Phnom Penh', 'Phnom Penh', 'Phnom Penh',
  'Phnom Penh', 'Phnom Penh', 'Phnom Penh', 'Phnom Penh', 'Phnom Penh',
];

const GENDERS = ['Male', 'Female'];

const OPPORTUNITY_IMAGES = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
  'https://images.unsplash.com/photo-1593113598332-cd59a93f6a1e?w=800&q=80',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
  'https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?w=800&q=80',
];

const OPPORTUNITY_TITLES_BY_CATEGORY = {
  Education: [
    'Math Tutor Needed',
    'Literacy Program Volunteer',
    'STEM Workshop Facilitator',
    'After-School Mentor',
    'Scholarship Committee Member',
    'Online Course Moderator',
    'Library Reading Partner',
    'ESL Conversation Partner',
    'Coding Bootcamp Coach',
    'Educational Content Creator',
  ],
  Healthcare: [
    'Hospital Greeter',
    'Health Fair Coordinator',
    'Mental Health Support',
    'Wellness Workshop Leader',
    'Blood Drive Organizer',
    'Senior Care Companion',
    'Nutrition Class Assistant',
    'Vaccination Campaign Helper',
    'Community Clinic Volunteer',
    'First Aid Instructor',
  ],
  Environment: [
    'Tree Planting Coordinator',
    'Beach Cleanup Leader',
    'Community Garden Assistant',
    'Recycling Program Manager',
    'Wildlife Conservation Aide',
    'Climate Awareness Educator',
    'Trail Maintenance Volunteer',
    'Urban Beekeeping Helper',
    'Water Quality Tester',
    'Sustainable Transport Advocate',
  ],
  'Community Development': [
    'Food Bank Distributor',
    'Youth Center Mentor',
    'Affordable Housing Advocate',
    'Neighborhood Watch Organizer',
    'Disaster Relief Volunteer',
    'Community Kitchen Chef',
    'Legal Aid Clinic Assistant',
    'Job Skills Trainer',
    'Public Art Project Coordinator',
    'Senior Outreach Worker',
  ],
  'Arts & Culture': [
    'Museum Docent',
    'Music Festival Volunteer',
    'Public Mural Painter',
    'Theatre Backstage Hand',
    'Dance Workshop Assistant',
    'Gallery Exhibition Guide',
    'Cultural Festival Planner',
    'Film Screening Coordinator',
    'Craft Workshop Instructor',
    'Storytelling Event Organizer',
  ],
};

const APPLICATION_STATUSES = ['pending', 'accepted', 'rejected'];
const ORG_STATUSES = ['approved', 'pending'];

const OPPORTUNITIES_PER_CATEGORY = 10;
const SKILLS_PER_OPP_RANGE = [2, 3];
const APPLICATION_COUNT = 60;
const SAVED_COUNT = 30;

// -------------------------------------------------------------------
// Derived ID ranges
// -------------------------------------------------------------------

const ADMIN_IDS = Array.from({ length: ADMIN_COUNT }, (_, i) => i + 1);
const ORG_OWNER_IDS = Array.from(
  { length: ORG_OWNER_COUNT },
  (_, i) => ADMIN_COUNT + i + 1,
);
const VOLUNTEER_IDS = Array.from(
  { length: VOLUNTEER_COUNT },
  (_, i) => ADMIN_COUNT + ORG_OWNER_COUNT + i + 1,
);
const USER_IDS = [...ADMIN_IDS, ...ORG_OWNER_IDS, ...VOLUNTEER_IDS];

const ORG_IDS = Array.from({ length: ORG_OWNER_COUNT }, (_, i) => i + 1);
const CATEGORY_IDS = Array.from(
  { length: CATEGORY_NAMES.length },
  (_, i) => i + 1,
);
const SKILL_IDS = Array.from(
  { length: SKILL_NAMES.length },
  (_, i) => i + 1,
);
const OPPORTUNITY_IDS = Array.from(
  { length: CATEGORY_NAMES.length * OPPORTUNITIES_PER_CATEGORY },
  (_, i) => i + 1,
);
const VOLUNTEER_PROFILE_IDS = Array.from(
  { length: VOLUNTEER_COUNT },
  (_, i) => i + 1,
);

// -------------------------------------------------------------------
// Build rows  (pure loops, no randomness)
// -------------------------------------------------------------------

function buildUsers() {
  const rows = [];

  for (let i = 0; i < ADMIN_COUNT; i++) {
    rows.push({
      user_id: ADMIN_IDS[i],
      full_name: `Admin ${['One', 'Two', 'Three'][i]}`,
      email: `admin_${['one', 'two', 'three'][i]}@example.com`,
      password_hash: PASSWORD_HASH,
      role: 'admin',
      status: 'active',
      created_at: new Date('2025-01-01'),
      updated_at: new Date('2025-01-01'),
    });
  }

  for (let i = 0; i < ORG_OWNER_COUNT; i++) {
    rows.push({
      user_id: ORG_OWNER_IDS[i],
      full_name: `Owner ${['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][i]}`,
      email: `owner_${i + 1}@example.com`,
      password_hash: PASSWORD_HASH,
      role: 'organization',
      status: 'active',
      created_at: new Date('2025-01-15'),
      updated_at: new Date('2025-01-15'),
    });
  }

  for (let i = 0; i < VOLUNTEER_COUNT; i++) {
    const num = i + 1;
    rows.push({
      user_id: VOLUNTEER_IDS[i],
      full_name: `Volunteer ${['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'][i]}`,
      email: `volunteer_${num}@example.com`,
      password_hash: PASSWORD_HASH,
      role: 'volunteer',
      status: 'active',
      created_at: new Date('2025-02-01'),
      updated_at: new Date('2025-02-01'),
    });
  }

  return rows;
}

function buildOrganizations() {
  const rows = [];

  for (let i = 0; i < ORG_OWNER_COUNT; i++) {
    const orgId = ORG_IDS[i];
    const status = i < 5 ? 'approved' : 'pending';

    rows.push({
      org_id: orgId,
      owner_id: ORG_OWNER_IDS[i],
      name: ORG_NAMES[i],
      contact_email: `contact${i + 1}@${ORG_NAMES[i].toLowerCase().replace(/\s+/g, '')}.org`,
      contact_phone: `+855-${String(1000000000 + i).slice(0, 9)}`,
      location: LOCATIONS[i % LOCATIONS.length],
      description: `${ORG_NAMES[i]} is a community-driven organization focused on making a positive impact.`,
      website: `https://${ORG_NAMES[i].toLowerCase().replace(/\s+/g, '')}.org`,
      logo: null,
      status,
      reviewed_by: status === 'approved' ? ADMIN_IDS[i % ADMIN_COUNT] : null,
      reviewed_at: status === 'approved' ? new Date('2025-02-15') : null,
      created_at: new Date('2025-01-20'),
      updated_at: new Date('2025-01-20'),
    });
  }

  return rows;
}

function buildCategories() {
  return CATEGORY_NAMES.map((name, i) => ({
    category_id: CATEGORY_IDS[i],
    category_name: name,
  }));
}

function buildSkills() {
  return SKILL_NAMES.map((name, i) => ({
    skill_id: SKILL_IDS[i],
    skill_name: name,
  }));
}

function buildVolunteerProfiles() {
  const rows = [];
  const bios = [
    'Passionate about community service and making a difference.',
    'Experienced volunteer looking for meaningful opportunities.',
    'Retired professional eager to give back to the community.',
    'College student seeking hands-on experience.',
    'Healthcare worker volunteering in free time.',
    'Teacher passionate about education equality.',
    'Environmental activist dedicated to sustainability.',
    'Tech professional mentoring youth in STEM.',
    'Artist using creativity for social impact.',
    'Stay-at-home parent with flexible availability.',
    'Recent graduate building professional experience.',
    'Career changer exploring non-profit sector.',
    'Community leader with strong organizational skills.',
    'Fitness enthusiast promoting healthy lifestyles.',
    'Former military seeking new ways to serve.',
    'Small business owner supporting local initiatives.',
    'Musician volunteering in arts education.',
    'Engineer applying technical skills for good.',
    'Writer passionate about storytelling for change.',
    'Multilingual volunteer bridging cultural gaps.',
  ];

  for (let i = 0; i < VOLUNTEER_COUNT; i++) {
    const userId = VOLUNTEER_IDS[i];
    const locIdx = (userId * 3) % LOCATIONS.length;

    rows.push({
      profile_id: VOLUNTEER_PROFILE_IDS[i],
      user_id: userId,
      phone_num: `+855-${String(2000000000 + userId * 1000).slice(0, 9)}`,
      profile_picture: null,
      date_of_birth: new Date(`198${i % 9 + 1}-0${(i % 9) + 1}-15`),
      location: LOCATIONS[locIdx],
      gender: GENDERS[i % GENDERS.length],
      bio: bios[i % bios.length],
    });
  }

  return rows;
}

function buildOpportunities() {
  const rows = [];
  let oppId = 1;

  for (let catIdx = 0; catIdx < CATEGORY_NAMES.length; catIdx++) {
    const categoryName = CATEGORY_NAMES[catIdx];
    const titles = OPPORTUNITY_TITLES_BY_CATEGORY[categoryName];

    for (let orgIdx = 0; orgIdx < ORG_OWNER_COUNT; orgIdx++) {
      const orgId = ORG_IDS[orgIdx];
      const ownerId = ORG_OWNER_IDS[orgIdx];
      const categoryId = CATEGORY_IDS[catIdx];
      const title = titles[orgIdx % titles.length];

      rows.push({
        opp_id: oppId,
        title,
        description: `Join us as a ${title.toLowerCase()} at ${ORG_NAMES[orgIdx]}. Make a real impact in ${categoryName.toLowerCase()} this year.`,
        requirement: 'Must be at least 18 years old. Prior experience preferred but not required.',
        benefits: 'Certificate of participation, networking opportunities, skill development.',
        location: LOCATIONS[(oppId * 7) % LOCATIONS.length],
        work_time: orgIdx % 3 === 0 ? 'weekdays' : orgIdx % 3 === 1 ? 'weekends' : 'flexible',
        start_date: '2025-08-01',
        end_date: '2025-12-31',
        format: orgIdx % 2 === 0 ? 'onsite' : 'hybrid',
        org_id: orgId,
        posted_by: ownerId,
        category_id: categoryId,
        image: `https://picsum.photos/seed/${oppId}/800/450`,
        max_volunteers: (orgIdx + 1) * 5,
        external_link: orgIdx % 4 === 0 ? `https://${ORG_NAMES[orgIdx].toLowerCase().replace(/\s+/g, '')}.org/apply` : null,
        status: 'open',
        created_at: new Date('2025-03-01'),
        updated_at: new Date('2025-03-01'),
      });

      oppId++;
    }
  }

  return rows;
}

function buildOpportunitySkills() {
  const rows = [];
  const usedPairs = new Set();

  for (let oppIdx = 0; oppIdx < OPPORTUNITY_IDS.length; oppIdx++) {
    const oppId = OPPORTUNITY_IDS[oppIdx];
    const skillCount =
      oppIdx % 2 === 0
        ? SKILLS_PER_OPP_RANGE[0]
        : SKILLS_PER_OPP_RANGE[1];

    for (let s = 0; s < skillCount; s++) {
      const skillId = ((oppIdx + s * 3) % SKILL_IDS.length) + 1;
      const key = `${oppId}-${skillId}`;

      if (!usedPairs.has(key)) {
        usedPairs.add(key);
        rows.push({ opp_id: oppId, skill_id: skillId });
      }
    }
  }

  return rows;
}

function buildApplications() {
  const rows = [];
  const statusDistribution = [0.4, 0.3, 0.3];
  const counts = statusDistribution.map((pct) =>
    Math.round(APPLICATION_COUNT * pct),
  );
  counts[counts.length - 1] =
    APPLICATION_COUNT - counts.slice(0, -1).reduce((a, b) => a + b, 0);

  let statusPtr = 0;
  let statusIdx = 0;

  for (let i = 0; i < APPLICATION_COUNT; i++) {
    const volunteerIdx = i % VOLUNTEER_COUNT;
    const userId = VOLUNTEER_IDS[volunteerIdx];
    const oppIdx = (i * 3 + 7) % OPPORTUNITY_IDS.length;
    const oppId = OPPORTUNITY_IDS[oppIdx];

    if (statusPtr >= counts[statusIdx]) {
      statusPtr = 0;
      statusIdx++;
    }
    const status = APPLICATION_STATUSES[Math.min(statusIdx, APPLICATION_STATUSES.length - 1)];
    statusPtr++;

    rows.push({
      application_id: i + 1,
      user_id: userId,
      opp_id: oppId,
      status,
      applied_at: new Date('2025-04-01'),
      updated_at: new Date('2025-04-15'),
    });
  }

  return rows;
}

function buildSavedOpportunities() {
  const rows = [];
  const usedPairs = new Set();
  let savedId = 1;

  for (let i = 0; i < SAVED_COUNT; i++) {
    const volunteerIdx = i % VOLUNTEER_COUNT;
    const batch = Math.floor(i / VOLUNTEER_COUNT);
    const userId = VOLUNTEER_IDS[volunteerIdx];
    const oppIdx = (batch * 7 + volunteerIdx * 3 + 11) % OPPORTUNITY_IDS.length;
    const oppId = OPPORTUNITY_IDS[oppIdx];
    const key = `${userId}-${oppId}`;

    if (!usedPairs.has(key)) {
      usedPairs.add(key);
      rows.push({
        saved_id: savedId++,
        user_id: userId,
        opp_id: oppId,
        saved_at: new Date('2025-05-01'),
      });
    }
  }

  return rows;
}

// -------------------------------------------------------------------
// Sequence helpers  (Postgres)
// -------------------------------------------------------------------

const SEQUENCE_TABLES = [
  ['User', 'user_id', USER_IDS.length],
  ['Organization', 'org_id', ORG_IDS.length],
  ['Category', 'category_id', CATEGORY_IDS.length],
  ['Skill', 'skill_id', SKILL_IDS.length],
  ['VolunteerProfile', 'profile_id', VOLUNTEER_PROFILE_IDS.length],
  ['Opportunity', 'opp_id', OPPORTUNITY_IDS.length],
  ['Application', 'application_id', APPLICATION_COUNT],
];

async function resetSequences(queryInterface) {
  for (const [table, column, maxId] of SEQUENCE_TABLES) {
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('"${table}"', '${column}'), ${maxId})`,
    );
  }
}

// -------------------------------------------------------------------
// Seeder
// -------------------------------------------------------------------

module.exports = {
  async up(queryInterface) {
    // Clean existing demo data first (makes seeding idempotent)
    await queryInterface.bulkDelete('SavedOpportunity', {
      user_id: { [Op.in]: VOLUNTEER_IDS },
    });
    await queryInterface.bulkDelete('Application', {
      user_id: { [Op.in]: VOLUNTEER_IDS },
    });
    await queryInterface.bulkDelete('OpportunitySkill', {
      opp_id: { [Op.in]: OPPORTUNITY_IDS },
    });
    await queryInterface.bulkDelete('Opportunity', {
      opp_id: { [Op.in]: OPPORTUNITY_IDS },
    });
    await queryInterface.bulkDelete('VolunteerProfile', {
      user_id: { [Op.in]: VOLUNTEER_IDS },
    });
    await queryInterface.bulkDelete('Organization', {
      org_id: { [Op.in]: ORG_IDS },
    });
    await queryInterface.bulkDelete('Category', {
      category_id: { [Op.in]: CATEGORY_IDS },
    });
    await queryInterface.bulkDelete('Skill', {
      skill_id: { [Op.in]: SKILL_IDS },
    });
    await queryInterface.bulkDelete('User', {
      user_id: { [Op.in]: USER_IDS },
    });

    // 1. Users
    await queryInterface.bulkInsert('User', buildUsers());

    // 2. Categories  (no FK dependencies)
    await queryInterface.bulkInsert('Category', buildCategories());

    // 3. Skills  (no FK dependencies)
    await queryInterface.bulkInsert('Skill', buildSkills());

    // 4. Organizations  (FK: owner_id -> User, reviewed_by -> User)
    await queryInterface.bulkInsert('Organization', buildOrganizations());

    // 5. VolunteerProfiles  (FK: user_id -> User)
    await queryInterface.bulkInsert(
      'VolunteerProfile',
      buildVolunteerProfiles(),
    );

    // 6. Opportunities  (FK: org_id -> Organization, category_id -> Category,
    //                    posted_by -> User)
    await queryInterface.bulkInsert('Opportunity', buildOpportunities());

    // 7. OpportunitySkill  (FK: opp_id -> Opportunity, skill_id -> Skill)
    await queryInterface.bulkInsert(
      'OpportunitySkill',
      buildOpportunitySkills(),
    );

    // 8. Applications  (FK: user_id -> User, opp_id -> Opportunity)
    await queryInterface.bulkInsert('Application', buildApplications());

    // 9. SavedOpportunities  (FK: user_id -> User, opp_id -> Opportunity)
    const savedRows = buildSavedOpportunities();
    if (savedRows.length > 0) {
      await queryInterface.bulkInsert('SavedOpportunity', savedRows);
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('"SavedOpportunity"', 'saved_id'), ${savedRows.length})`,
      );
    }

    // Reset all auto-increment sequences to avoid future collisions
    await resetSequences(queryInterface);
  },

  async down(queryInterface) {
    // Delete in reverse FK-dependency order
    await queryInterface.bulkDelete('SavedOpportunity', {
      user_id: { [Op.in]: VOLUNTEER_IDS },
    });
    await queryInterface.bulkDelete('Application', {
      user_id: { [Op.in]: VOLUNTEER_IDS },
    });
    await queryInterface.bulkDelete('OpportunitySkill', {
      opp_id: { [Op.in]: OPPORTUNITY_IDS },
    });
    await queryInterface.bulkDelete('Opportunity', {
      opp_id: { [Op.in]: OPPORTUNITY_IDS },
    });
    await queryInterface.bulkDelete('VolunteerProfile', {
      user_id: { [Op.in]: VOLUNTEER_IDS },
    });
    await queryInterface.bulkDelete('Organization', {
      org_id: { [Op.in]: ORG_IDS },
    });
    await queryInterface.bulkDelete('Category', {
      category_id: { [Op.in]: CATEGORY_IDS },
    });
    await queryInterface.bulkDelete('Skill', {
      skill_id: { [Op.in]: SKILL_IDS },
    });
    await queryInterface.bulkDelete('User', {
      user_id: { [Op.in]: USER_IDS },
    });
  },
};
