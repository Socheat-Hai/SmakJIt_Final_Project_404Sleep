let users = [
  { _id: '1', name: 'John Volunteer', email: 'john@test.com', role: 'user', status: 'active', createdAt: '2025-01-15T10:00:00Z' },
  { _id: '2', name: 'Green Earth Org', email: 'org@test.com', role: 'organization', status: 'active', verificationStatus: 'approved', createdAt: '2025-02-01T10:00:00Z' },
  { _id: '3', name: 'Admin User', email: 'admin@test.com', role: 'admin', status: 'active', createdAt: '2024-12-01T10:00:00Z' },
  { _id: '4', name: 'Teach For Tomorrow', email: 'teach@test.com', role: 'organization', status: 'active', verificationStatus: 'approved', createdAt: '2025-03-01T10:00:00Z' },
  { _id: '5', name: 'Sarah Helper', email: 'sarah@test.com', role: 'user', status: 'active', createdAt: '2025-04-10T10:00:00Z' },
  { _id: '6', name: 'Hope Foundation', email: 'hope@test.com', role: 'organization', status: 'active', verificationStatus: 'pending', createdAt: '2025-05-01T10:00:00Z' },
  { _id: '7', name: 'Community Builders', email: 'build@test.com', role: 'organization', status: 'suspended', verificationStatus: 'pending', createdAt: '2025-05-10T10:00:00Z' },
  { _id: '8', name: 'Care Alliance', email: 'care@test.com', role: 'organization', status: 'active', verificationStatus: 'rejected', createdAt: '2025-04-20T10:00:00Z' },
];

let nextUserId = 9;
let nextOppId = 10;
let nextAppId = 10;

let opportunities = [
  { _id: '1', title: 'Community Garden Volunteer', orgName: 'Green Earth Org', organization: { _id: '2', name: 'Green Earth Org', email: 'org@test.com' }, category: 'Environment', description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks.', location: 'Downtown Area', date: 'Flexible', spots: 12, requirements: 'No experience needed', commitment: '2-4 hrs/week', status: 'open', createdAt: '2025-02-10T10:00:00Z' },
  { _id: '2', title: 'Math Tutor for Teens', orgName: 'Teach For Tomorrow', organization: { _id: '4', name: 'Teach For Tomorrow', email: 'teach@test.com' }, category: 'Education', description: 'Tutor high school students in math.', location: 'Online', date: 'Weekdays', spots: 5, requirements: 'Strong math skills', commitment: '2 hrs/week', status: 'open', createdAt: '2025-03-05T10:00:00Z' },
  { _id: '3', title: 'Health Screening Assistant', orgName: 'HealthBridge', organization: { _id: '4', name: 'HealthBridge', email: 'health@test.com' }, category: 'Healthcare', description: 'Assist with health screening events.', location: 'Community Center', date: 'Sat, Jun 20', spots: 8, requirements: 'Training provided', commitment: 'Full day', status: 'open', createdAt: '2025-03-10T10:00:00Z' },
  { _id: '4', title: 'Animal Shelter Caretaker', orgName: 'Paws & Claws Rescue', organization: { _id: '4', name: 'Paws & Claws Rescue', email: 'paws@test.com' }, category: 'Animal Welfare', description: 'Care for rescued animals.', location: 'North Side Shelter', date: 'Flexible', spots: 3, requirements: 'Love for animals', commitment: '3-4 hr shifts', status: 'open', createdAt: '2025-03-15T10:00:00Z' },
  { _id: '5', title: 'Community Clean-Up Lead', orgName: 'Green Earth Org', organization: { _id: '2', name: 'Green Earth Org', email: 'org@test.com' }, category: 'Environment', description: 'Lead community clean-up events.', location: 'Various Parks', date: 'Jun 25', spots: 20, requirements: 'Leadership skills', commitment: 'Event day', status: 'open', createdAt: '2025-04-01T10:00:00Z' },
  { _id: '6', title: 'Coding Workshop Mentor', orgName: 'Tech for Good', organization: { _id: '4', name: 'Tech for Good', email: 'tech@test.com' }, category: 'Technology', description: 'Mentor beginners in coding.', location: 'Online', date: 'Weekends', spots: 8, requirements: 'Coding experience', commitment: '4 hrs/weekend', status: 'open', createdAt: '2025-04-05T10:00:00Z' },
  { _id: '7', title: 'IT Support for Seniors', orgName: 'Silver Tech Bridge', organization: { _id: '4', name: 'Silver Tech Bridge', email: 'silver@test.com' }, category: 'Technology', description: 'Help seniors with technology.', location: 'Senior Center', date: 'Tue & Thu', spots: 5, requirements: 'Patient demeanor', commitment: '2 hrs/session', status: 'open', createdAt: '2025-04-10T10:00:00Z' },
  { _id: '8', title: 'Food Bank Sorters', orgName: 'Community Food Network', organization: { _id: '4', name: 'Community Food Network', email: 'food@test.com' }, category: 'Food', description: 'Sort and pack donated food.', location: 'Food Bank Warehouse', date: 'Flexible', spots: 15, requirements: 'Able to lift 30lbs', commitment: '2-4 hr shifts', status: 'closed', createdAt: '2025-02-20T10:00:00Z' },
  { _id: '9', title: 'Youth Soccer Coach', orgName: 'Active Kids Alliance', organization: { _id: '4', name: 'Active Kids Alliance', email: 'active@test.com' }, category: 'Sports', description: 'Coach youth soccer.', location: 'City Park Field', date: 'Sat & Sun', spots: 4, requirements: 'Soccer knowledge', commitment: 'Weekend mornings', status: 'open', createdAt: '2025-04-15T10:00:00Z' },
];

let applications = [
  { _id: '1', opportunity: '1', opportunityTitle: 'Community Garden Volunteer', volunteer: { _id: '1', name: 'John Volunteer', email: 'john@test.com' }, volunteerName: 'John Volunteer', volunteerEmail: 'john@test.com', status: 'pending', message: 'I love gardening! I have been growing vegetables at home for 3 years.', createdAt: '2025-03-01T10:00:00Z' },
  { _id: '2', opportunity: '2', opportunityTitle: 'Math Tutor for Teens', volunteer: { _id: '1', name: 'John Volunteer', email: 'john@test.com' }, volunteerName: 'John Volunteer', volunteerEmail: 'john@test.com', status: 'accepted', message: '', createdAt: '2025-03-10T10:00:00Z' },
  { _id: '3', opportunity: '1', opportunityTitle: 'Community Garden Volunteer', volunteer: { _id: '5', name: 'Sarah Helper', email: 'sarah@test.com' }, volunteerName: 'Sarah Helper', volunteerEmail: 'sarah@test.com', status: 'pending', message: 'I have volunteered at community gardens before and would love to help again!', createdAt: '2025-04-01T10:00:00Z' },
  { _id: '4', opportunity: '3', opportunityTitle: 'Health Screening Assistant', volunteer: { _id: '5', name: 'Sarah Helper', email: 'sarah@test.com' }, volunteerName: 'Sarah Helper', volunteerEmail: 'sarah@test.com', status: 'rejected', message: 'I have medical assistant training.', createdAt: '2025-04-05T10:00:00Z' },
  { _id: '5', opportunity: '5', opportunityTitle: 'Community Clean-Up Lead', volunteer: { _id: '1', name: 'John Volunteer', email: 'john@test.com' }, volunteerName: 'John Volunteer', volunteerEmail: 'john@test.com', status: 'pending', message: 'I can lead a team!', createdAt: '2025-04-15T10:00:00Z' },
  { _id: '6', opportunity: '6', opportunityTitle: 'Coding Workshop Mentor', volunteer: { _id: '5', name: 'Sarah Helper', email: 'sarah@test.com' }, volunteerName: 'Sarah Helper', volunteerEmail: 'sarah@test.com', status: 'pending', message: '', createdAt: '2025-04-20T10:00:00Z' },
  { _id: '7', opportunity: '4', opportunityTitle: 'Animal Shelter Caretaker', volunteer: { _id: '1', name: 'John Volunteer', email: 'john@test.com' }, volunteerName: 'John Volunteer', volunteerEmail: 'john@test.com', status: 'pending', message: 'I love animals and have experience with dogs and cats.', createdAt: '2025-05-01T10:00:00Z' },
];

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const setMockToken = (token) => {
  localStorage.setItem('token', token);
};

const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length === 3) { return JSON.parse(atob(parts[1])); }
    return JSON.parse(atob(token));
  } catch { return null; }
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) return null;
  const user = users.find((u) => u._id === decoded.id || u._id === decoded.sub);
  return user || decoded;
};

const findUserByEmail = (email) => users.find((u) => u.email === email);

const getCategoryStats = () => {
  const counts = {};
  opportunities.forEach((o) => { counts[o.category] = (counts[o.category] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count }));
};

const getMonthlyApps = () => {
  const months = {};
  applications.forEach((a) => {
    const m = a.createdAt.slice(0, 7);
    months[m] = (months[m] || 0) + 1;
  });
  return Object.entries(months).sort().map(([month, count]) => ({ month, count }));
};

export const mockHandler = async (config) => {
  const { method, url, data, params } = config;
  const baseUrl = url.replace(/^https?:\/\/[^\/]+/, '');
  const path = baseUrl.replace('/api', '');

  await delay();

  // Auth: Register
  if (method === 'post' && path === '/auth/register') {
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    if (findUserByEmail(body.email)) { throw { response: { status: 400, data: { message: 'Email already in use' } } }; }
    const newUser = { _id: String(nextUserId++), name: body.name, email: body.email, role: body.role === 'volunteer' ? 'user' : body.role || 'user', status: 'active', verificationStatus: body.role === 'organization' ? 'pending' : undefined, createdAt: new Date().toISOString() };
    users.push(newUser);
    const token = btoa(JSON.stringify({ id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }));
    setMockToken(token);
    return { data: { token, user: newUser }, status: 201 };
  }

  // Auth: Login
  if (method === 'post' && path === '/auth/login') {
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    const user = findUserByEmail(body.email);
    if (!user) { throw { response: { status: 401, data: { message: 'Invalid email or password' } } }; }
    if (user.status === 'suspended') { throw { response: { status: 403, data: { message: 'Your account has been suspended. Contact support.' } } }; }
    if (user.status === 'banned') { throw { response: { status: 403, data: { message: 'Your account has been banned.' } } }; }
    const token = btoa(JSON.stringify({ id: user._id, name: user.name, email: user.email, role: user.role }));
    setMockToken(token);
    return { data: { token, user }, status: 200 };
  }

  // Auth: Get Profile
  if (method === 'get' && path === '/auth/profile') {
    const user = getCurrentUser();
    if (!user) throw { response: { status: 401, data: { message: 'Not authenticated' } } };
    return { data: user, status: 200 };
  }

  // Auth: Update Profile
  if (method === 'put' && path === '/auth/profile') {
    const current = getCurrentUser();
    if (!current) throw { response: { status: 401, data: { message: 'Not authenticated' } } };
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    const idx = users.findIndex((u) => u._id === current._id || u._id === current.id);
    if (idx !== -1) users[idx] = { ...users[idx], ...body };
    return { data: { ...current, ...body }, status: 200 };
  }

  // Auth: Change Password
  if (method === 'put' && path === '/auth/password') {
    return { data: { message: 'Password changed' }, status: 200 };
  }

  // Opportunities: List
  if (method === 'get' && path === '/opportunities') {
    let result = [...opportunities];
    if (params?.status) result = result.filter((o) => o.status === params.status);
    if (params?.category) result = result.filter((o) => o.category === params.category);
    if (params?.search) { const s = params.search.toLowerCase(); result = result.filter((o) => o.title.toLowerCase().includes(s) || o.orgName.toLowerCase().includes(s)); }
    return { data: result, status: 200 };
  }

  // Opportunities: Get by ID
  const oppMatch = path.match(/^\/opportunities\/([a-zA-Z0-9]+)$/);
  if (method === 'get' && oppMatch) {
    const opp = opportunities.find((o) => o._id === oppMatch[1]);
    if (!opp) throw { response: { status: 404, data: { message: 'Opportunity not found' } } };
    return { data: opp, status: 200 };
  }

  // Opportunities: Create
  if (method === 'post' && path === '/opportunities') {
    const current = getCurrentUser();
    if (!current) throw { response: { status: 401, data: { message: 'Not authenticated' } } };
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    const newOpp = { _id: String(nextOppId++), ...body, orgName: current.name, organization: { _id: current.id || current._id, name: current.name, email: current.email }, status: 'open', createdAt: new Date().toISOString() };
    opportunities.push(newOpp);
    return { data: newOpp, status: 201 };
  }

  // Opportunities: Update
  if (method === 'put' && oppMatch) {
    const idx = opportunities.findIndex((o) => o._id === oppMatch[1]);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Opportunity not found' } } };
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    opportunities[idx] = { ...opportunities[idx], ...body };
    return { data: opportunities[idx], status: 200 };
  }

  // Applications: List
  if (method === 'get' && path === '/applications') {
    let result = [...applications];
    if (params?.status) result = result.filter((a) => a.status === params.status);
    if (params?.volunteer) result = result.filter((a) => a.volunteer?._id === params.volunteer || a.volunteer?.id === params.volunteer);
    if (params?.opportunity) result = result.filter((a) => a.opportunity === params.opportunity);
    return { data: result, status: 200 };
  }

  // Applications: Create
  if (method === 'post' && path === '/applications') {
    const current = getCurrentUser();
    if (!current) throw { response: { status: 401, data: { message: 'Not authenticated' } } };
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    const opp = opportunities.find((o) => o._id === body.opportunityId);
    if (!opp) throw { response: { status: 404, data: { message: 'Opportunity not found' } } };
    if (opp.status === 'closed') throw { response: { status: 400, data: { message: 'This opportunity is no longer accepting applications' } } };
    const already = applications.find((a) => a.opportunity === body.opportunityId && a.volunteer?._id === (current.id || current._id));
    if (already) throw { response: { status: 400, data: { message: 'You have already applied to this opportunity' } } };
    const newApp = { _id: String(nextAppId++), opportunity: body.opportunityId, opportunityTitle: opp.title, volunteer: { _id: current.id || current._id, name: current.name, email: current.email }, volunteerName: current.name, volunteerEmail: current.email, status: 'pending', message: body.message || '', createdAt: new Date().toISOString() };
    applications.push(newApp);
    return { data: newApp, status: 201 };
  }

  // Applications: Update Status
  const appStatusMatch = path.match(/^\/applications\/([a-zA-Z0-9]+)\/status$/);
  if (method === 'put' && appStatusMatch) {
    const idx = applications.findIndex((a) => a._id === appStatusMatch[1]);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Application not found' } } };
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    if (!['pending', 'accepted', 'rejected'].includes(body.status)) { throw { response: { status: 400, data: { message: 'Status must be pending, accepted, or rejected' } } }; }
    applications[idx] = { ...applications[idx], status: body.status };
    return { data: applications[idx], status: 200 };
  }

  // -------------------------------------------------------
  // ADMIN ENDPOINTS
  // -------------------------------------------------------

  // Admin: Stats
  if (method === 'get' && path === '/admin/stats') {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    return {
      data: {
        totalUsers: users.filter((u) => u.role !== 'admin').length,
        totalOrgs: users.filter((u) => u.role === 'organization').length,
        totalVolunteers: users.filter((u) => u.role === 'user').length,
        totalOpportunities: opportunities.length,
        totalApplications: applications.length,
        pendingVerifications: users.filter((u) => u.role === 'organization' && u.verificationStatus === 'pending').length,
        pendingApplications: applications.filter((a) => a.status === 'pending').length,
        usersByRole: users.filter((u) => u.role !== 'admin').reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {}),
        oppsByStatus: opportunities.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {}),
        appsByStatus: applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {}),
        topCategories: getCategoryStats(),
        applicationsOverTime: getMonthlyApps(),
      },
      status: 200,
    };
  }

  // Admin: Users list
  if (method === 'get' && path === '/admin/users') {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    let result = [...users];
    if (params?.role) result = result.filter((u) => u.role === params.role);
    if (params?.status) result = result.filter((u) => u.status === params.status);
    if (params?.verification) result = result.filter((u) => u.verificationStatus === params.verification);
    if (params?.search) { const s = params.search.toLowerCase(); result = result.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)); }
    return { data: result, status: 200 };
  }

  // Admin: User by ID
  const adminUserMatch = path.match(/^\/admin\/users\/([a-zA-Z0-9]+)$/);
  if (method === 'get' && adminUserMatch) {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    const user = users.find((u) => u._id === adminUserMatch[1]);
    if (!user) throw { response: { status: 404, data: { message: 'User not found' } } };
    return { data: user, status: 200 };
  }

  // Admin: Update User
  if (method === 'put' && adminUserMatch) {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    const idx = users.findIndex((u) => u._id === adminUserMatch[1]);
    if (idx === -1) throw { response: { status: 404, data: { message: 'User not found' } } };
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    if (body.role && !['user', 'admin', 'organization'].includes(body.role)) { throw { response: { status: 400, data: { message: 'Invalid role' } } }; }
    if (body.status && !['active', 'suspended', 'banned'].includes(body.status)) { throw { response: { status: 400, data: { message: 'Invalid status' } } }; }
    if (body.verificationStatus && !['pending', 'approved', 'rejected'].includes(body.verificationStatus)) { throw { response: { status: 400, data: { message: 'Invalid verification status' } } }; }
    users[idx] = { ...users[idx], ...body };
    return { data: users[idx], status: 200 };
  }

  // Admin: Delete User
  if (method === 'delete' && adminUserMatch) {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    const idx = users.findIndex((u) => u._id === adminUserMatch[1]);
    if (idx === -1) throw { response: { status: 404, data: { message: 'User not found' } } };
    users.splice(idx, 1);
    return { data: { message: 'User deleted successfully' }, status: 200 };
  }

  // Admin: Verifications (pending orgs)
  if (method === 'get' && path === '/admin/verifications') {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    const pending = users.filter((u) => u.role === 'organization');
    return { data: pending, status: 200 };
  }

  // Admin: Opportunities
  if (method === 'get' && path === '/admin/opportunities') {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    let result = [...opportunities];
    if (params?.status) result = result.filter((o) => o.status === params.status);
    if (params?.search) { const s = params.search.toLowerCase(); result = result.filter((o) => o.title.toLowerCase().includes(s) || o.orgName.toLowerCase().includes(s)); }
    return { data: result, status: 200 };
  }

  // Admin: Delete Opportunity
  const adminOppMatch = path.match(/^\/admin\/opportunities\/([a-zA-Z0-9]+)$/);
  if (method === 'delete' && adminOppMatch) {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    const idx = opportunities.findIndex((o) => o._id === adminOppMatch[1]);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Opportunity not found' } } };
    opportunities.splice(idx, 1);
    applications = applications.filter((a) => a.opportunity !== adminOppMatch[1]);
    return { data: { message: 'Opportunity removed successfully' }, status: 200 };
  }

  // Admin: Applications
  if (method === 'get' && path === '/admin/applications') {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') throw { response: { status: 403, data: { message: 'Forbidden' } } };
    let result = [...applications];
    if (params?.status) result = result.filter((a) => a.status === params.status);
    return { data: result, status: 200 };
  }

  throw { response: { status: 404, data: { message: `Mock: No handler for ${method} ${path}` } } };
};
