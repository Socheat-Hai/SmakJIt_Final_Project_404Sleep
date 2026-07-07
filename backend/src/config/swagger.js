const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    security:[
        {
            bearerAuth:[]
        }
    ],
    info: {
      title: 'Volunteer Management API',
      version: '1.0.0',
      description:
        'REST API for managing volunteers, organizations, and opportunities.',
      license:{
        name:'MIT'
      },
      contact:{
        name:'404Sleep',
        email:'team@example.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            full_name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: {
              type: 'string',
              enum: ['volunteer', 'organization', 'admin'],
              example: 'volunteer',
            },
            status: {
              type: 'string',
              enum: ['active', 'banned', 'inactive'],
              example: 'active',
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['full_name', 'email', 'password'],
          properties: {
            full_name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'securePass123' },
            role: {
              type: 'string',
              enum: ['volunteer', 'organization'],
              example: 'volunteer',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Organization: {
          type: 'object',
          properties: {
            org_id: { type: 'integer', example: 1 },
            owner_id: { type: 'integer', example: 2 },
            name: { type: 'string', example: 'Helping Hands NGO' },
            contact_email: { type: 'string', format: 'email', example: 'contact@helpinghands.org' },
            contact_phone: { type: 'string', example: '+1-555-1234' },
            location: { type: 'string', example: 'New York, NY' },
            description: { type: 'string', example: 'A non-profit focused on community development.' },
            website: { type: 'string', format: 'uri', example: 'https://helpinghands.org' },
            logo: { type: 'string', example: '/uploads/logos/logo-123.png' },
            social_link: { type: 'string',format: 'uri', example: 'https://twitter.com/helpinghands' },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              example: 'pending',
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        OrganizationInput: {
          type: 'object',
          required: [ 'name', 'contact_email'],
          properties: {
            name: { type: 'string', example: 'Helping Hands NGO' },
            contact_email: { type: 'string', format: 'email' },
            contact_phone: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            website: { type: 'string', format: 'uri'},
            logo: { type: 'string' },
            social_link: { type: 'string', format: 'uri' },
          },
        },
        Opportunity: {
          type: 'object',
          properties: {
            opp_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Beach Cleanup Drive' },
            description: { type: 'string', example: 'Join us to clean the local beach.' },
            requirement: { type: 'string', example: 'Must be 18+ and comfortable outdoors.' },
            benefits: { type: 'string', example: 'Free lunch and certificate.' },
            location: { type: 'string', example: 'Santa Monica Beach, CA' },
            work_time: { type: 'string', example: 'Weekends' },
            start_date: { type: 'string', format: 'date', example: '2025-06-01' },
            end_date: { type: 'string', format: 'date', example: '2025-06-30' },
            format: {
              type: 'string',
              enum: ['online', 'onsite', 'hybrid'],
              example: 'onsite',
            },
            org_id: { type: 'integer', example: 1 },
            posted_by: { type: 'integer', example: 2 },
            category_id: { type: 'integer', example: 3 },
            image: { type: 'string', example: '/uploads/opportunities/opp-123.png' },
            max_volunteers: { type: 'integer', example: 50 },
            external_link: { type: 'string', example: 'https://signup.example.com' },
            status: {
              type: 'string',
              enum: ['open', 'closed', 'cancelled'],
              example: 'open',
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        OpportunityInput: {
          type: 'object',
          required: ['title', 'org_id'],
          properties: {
            title: { type: 'string', example: 'Beach Cleanup Drive' },
            description: { type: 'string' },
            requirement: { type: 'string' },
            benefits: { type: 'string' },
            location: { type: 'string' },
            work_time: { type: 'string' },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date' },
            format: { type: 'string', enum: ['online', 'onsite', 'hybrid'] },
            org_id: { type: 'integer' },
            category_id: { type: 'integer' },
            max_volunteers: { type: 'integer' },
            external_link: { type: 'string', format: 'uri'},
          },
        },
        Application: {
          type: 'object',
          properties: {
            application_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 5 },
            opp_id: { type: 'integer', example: 10 },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected'],
              example: 'pending',
            },
            applied_at: { type: 'string', format: 'date-time' },
          },
        },
        ApplicationInput: {
          type: 'object',
          required: ['opp_id'],
          properties: {
            opp_id: { type: 'integer', example: 10 },
          },
        },
        Category: {
          type: 'object',
          properties: {
            category_id: { type: 'integer', example: 1 },
            category_name: { type: 'string', example: 'Environment' },
            description: { type: 'string', example: 'Environmental conservation activities.' },
          },
        },
        CategoryInput: {
          type: 'object',
          required:['category_name'],
          properties:{
            category_name:{
              type:'string'
            },
            description:{
              type:'string'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'An error occurred' },
          },
        },
        AdminStats: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer', example: 150 },
            totalOrgs: { type: 'integer', example: 25 },
            totalOpportunities: { type: 'integer', example: 80 },
            totalApplications: { type: 'integer', example: 300 },
            pendingOrgs: { type: 'integer', example: 5 },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints – register, login, profile' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Organizations', description: 'Organization management endpoints' },
      { name: 'Opportunities', description: 'Volunteer opportunity endpoints' },
      { name: 'Applications', description: 'Application submission & review endpoints' },
      { name: 'Categories', description: 'Opportunity category endpoints' },
      { name: 'Uploads', description: 'File upload endpoints' },
      { name: 'Admin', description: 'Admin dashboard & management endpoints' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
