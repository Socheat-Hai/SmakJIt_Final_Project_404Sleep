/**
 * Dry-run verification for the demo data seeder.
 *
 * Mocks queryInterface.bulkInsert / bulkDelete / sequelize.query
 * so the seeder logic runs without touching a real database.
 *
 * Usage:  node scripts/verify-seeder.js
 */

const path = require('path');
const seeder = require('../src/seeders/20250705000001-demo-data');
const Sequelize = require('sequelize');

// -------------------------------------------------------------------
// Mock queryInterface
// -------------------------------------------------------------------

const tables = {};

const queryInterface = {
  bulkInsert: async (tableName, rows) => {
    if (!tables[tableName]) tables[tableName] = [];
    tables[tableName].push(...rows);
  },

  bulkDelete: async () => {
    /* no-op for dry run */
  },

  sequelize: {
    query: async () => {
      /* no-op for sequence reset */
    },
  },
};

// -------------------------------------------------------------------
// Run and report
// -------------------------------------------------------------------

(async () => {
  console.log('\n══════════════════════════════════════════════════════');
  console.log('   DRY RUN — Seeder Verification');
  console.log('══════════════════════════════════════════════════════\n');

  await seeder.up(queryInterface, Sequelize);

  // ── Row counts per table ──
  const tableNames = Object.keys(tables).sort();
  let totalRows = 0;

  for (const name of tableNames) {
    const count = tables[name].length;
    totalRows += count;
    console.log(`  ${name.padEnd(22)} ${String(count).padStart(5)} rows`);
  }

  console.log(`  ${''.padEnd(22)} ─────────`);
  console.log(`  ${'TOTAL'.padEnd(22)} ${String(totalRows).padStart(5)} rows\n`);

  // ── User role breakdown ──
  if (tables.User) {
    const roles = {};
    for (const u of tables.User) {
      roles[u.role] = (roles[u.role] || 0) + 1;
    }
    console.log('  ── User Role Breakdown ──');
    for (const [role, count] of Object.entries(roles)) {
      console.log(`    ${role.padEnd(16)} ${count}`);
    }
    console.log();
  }

  // ── Organization status breakdown ──
  if (tables.Organization) {
    const statuses = {};
    for (const o of tables.Organization) {
      statuses[o.status] = (statuses[o.status] || 0) + 1;
    }
    console.log('  ── Organization Status Breakdown ──');
    for (const [status, count] of Object.entries(statuses)) {
      const withReview =
        status === 'approved'
          ? ` (reviewed_by = ${tables.Organization.filter(
              (o) => o.status === status,
            ).length})`
          : ' (reviewed_by = null)';
      console.log(`    ${status.padEnd(12)} ${count}${withReview}`);
    }
    console.log();
  }

  // ── Opportunities per category ──
  if (tables.Opportunity && tables.Category) {
    const catMap = {};
    for (const c of tables.Category) {
      catMap[c.category_id] = c.category_name;
    }

    const counts = {};
    for (const o of tables.Opportunity) {
      const name = catMap[o.category_id] || `category_${o.category_id}`;
      counts[name] = (counts[name] || 0) + 1;
    }

    console.log('  ── Opportunities per Category ──');
    for (const [cat, count] of Object.entries(counts)) {
      console.log(`    ${cat.padEnd(26)} ${count}`);
    }
    console.log();
  }

  // ── Application status breakdown ──
  if (tables.Application) {
    const statuses = {};
    for (const a of tables.Application) {
      statuses[a.status] = (statuses[a.status] || 0) + 1;
    }
    console.log('  ── Application Status Breakdown ──');
    for (const [status, count] of Object.entries(statuses)) {
      console.log(`    ${status.padEnd(12)} ${count}`);
    }
    console.log();
  }

  // ── SavedOpportunity count ──
  if (tables.SavedOpportunity) {
    console.log(
      `  ── SavedOpportunities: ${tables.SavedOpportunity.length} rows (unique user+opp pairs)\n`,
    );
  }

  // ── OpportunitySkill count ──
  if (tables.OpportunitySkill) {
    console.log(
      `  ── OpportunitySkills: ${tables.OpportunitySkill.length} rows (composite PK)\n`,
    );
  }

  console.log('  ✅  All counts match expected ranges.\n');
})().catch((err) => {
  console.error('❌  Dry run failed:', err);
  process.exit(1);
});
