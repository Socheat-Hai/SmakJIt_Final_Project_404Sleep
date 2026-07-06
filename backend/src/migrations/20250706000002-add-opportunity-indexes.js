'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Opportunity', ['org_id'], { name: 'opportunity_org_id_idx' });
    await queryInterface.addIndex('Opportunity', ['category_id'], { name: 'opportunity_category_id_idx' });
    await queryInterface.addIndex('Opportunity', ['status'], { name: 'opportunity_status_idx' });
    await queryInterface.addIndex('Opportunity', ['created_at'], { name: 'opportunity_created_at_idx' });
    await queryInterface.addIndex('Opportunity', ['posted_by'], { name: 'opportunity_posted_by_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Opportunity', 'opportunity_org_id_idx');
    await queryInterface.removeIndex('Opportunity', 'opportunity_category_id_idx');
    await queryInterface.removeIndex('Opportunity', 'opportunity_status_idx');
    await queryInterface.removeIndex('Opportunity', 'opportunity_created_at_idx');
    await queryInterface.removeIndex('Opportunity', 'opportunity_posted_by_idx');
  },
};
