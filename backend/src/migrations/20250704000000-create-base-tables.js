'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. User
    await queryInterface.createTable('User', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(50),
        defaultValue: 'volunteer',
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // 2. Organization
    await queryInterface.createTable('Organization', {
      org_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'User', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      contact_email: Sequelize.STRING(255),
      contact_phone: Sequelize.STRING(50),
      location: Sequelize.TEXT,
      description: Sequelize.TEXT,
      website: Sequelize.STRING(255),
      logo: Sequelize.STRING(255),
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // 3. VolunteerProfile
    await queryInterface.createTable('VolunteerProfile', {
      profile_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'User', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      phone_num: Sequelize.STRING(50),
      profile_picture: Sequelize.STRING(255),
      date_of_birth: Sequelize.DATEONLY,
      location: Sequelize.STRING(255),
      gender: Sequelize.STRING(50),
      bio: Sequelize.TEXT,
    });

    // 4. Category
    await queryInterface.createTable('Category', {
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: Sequelize.TEXT,
    });

    // 5. Skill
    await queryInterface.createTable('Skill', {
      skill_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skill_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    // 6. Opportunity (base fields; extra fields added by later migrations)
    await queryInterface.createTable('Opportunity', {
      opp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: Sequelize.TEXT,
      requirement: Sequelize.TEXT,
      benefits: Sequelize.TEXT,
      location: Sequelize.STRING(255),
      work_time: Sequelize.STRING(50),
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      format: Sequelize.STRING(50),
      org_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Organization', key: 'org_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      posted_by: Sequelize.INTEGER,
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Category', key: 'category_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      image: Sequelize.STRING(255),
      max_volunteers: Sequelize.INTEGER,
      external_link: Sequelize.STRING(500),
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'open',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // 7. Application
    await queryInterface.createTable('Application', {
      application_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      opp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Opportunity', key: 'opp_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'submitted',
      },
      applied_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // 8. OpportunitySkill (composite PK)
    await queryInterface.createTable('OpportunitySkill', {
      opp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Opportunity', key: 'opp_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      skill_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Skill', key: 'skill_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('OpportunitySkill');
    await queryInterface.dropTable('Application');
    await queryInterface.dropTable('Opportunity');
    await queryInterface.dropTable('Skill');
    await queryInterface.dropTable('Category');
    await queryInterface.dropTable('VolunteerProfile');
    await queryInterface.dropTable('Organization');
    await queryInterface.dropTable('User');
  },
};
