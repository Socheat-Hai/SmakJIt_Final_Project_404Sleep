module.exports = {
  async up(queryInterface) {
    // Update all existing opportunities to use Picsum placeholder images based on their ID
    // Using PostgreSQL string concatenation operator ||
    await queryInterface.sequelize.query(
      `UPDATE "Opportunity" SET image = 'https://picsum.photos/seed/' || opp_id || '/800/450'`
    );
  },

  async down(queryInterface) {
    // No reversible operation – we cannot recover original URLs without backup.
    // This migration is intentionally irreversible.
  },
};