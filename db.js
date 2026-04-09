const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
require('dotenv').config();

const dbFile = path.resolve(__dirname, '../database/edu_bridge.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

// Set defaults
db.defaults({
  users: [],
  student_profiles: [],
  company_profiles: [],
  projects: [],
  internships: [],
  skill_assessments: [],
}).write();

function nextId(collection) {
  const items = db.get(collection).value();
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map(i => i.id || 0)) + 1;
}

const queries = {
  // Users
  findUserByEmail(email) {
    return db.get('users').find({ email }).value() || null;
  },
  findUserById(id) {
    return db.get('users').find({ id }).value() || null;
  },
  insertUser({ email, password_hash, user_type, full_name }) {
    const id = nextId('users');
    const user = { id, email, password_hash, user_type, full_name, created_at: new Date().toISOString() };
    db.get('users').push(user).write();
    return id;
  },

  // Student profiles
  findStudentProfile(user_id) {
    return db.get('student_profiles').find({ user_id }).value() || null;
  },
  insertStudentProfile(user_id) {
    const profile = { id: nextId('student_profiles'), user_id, bio: '', education: '', skills: [], interests: [] };
    db.get('student_profiles').push(profile).write();
  },
  upsertStudentProfile(user_id, { bio, education, skills, interests }) {
    const existing = db.get('student_profiles').find({ user_id }).value();
    if (existing) {
      db.get('student_profiles').find({ user_id }).assign({ bio, education, skills, interests }).write();
    } else {
      db.get('student_profiles').push({ id: nextId('student_profiles'), user_id, bio, education, skills, interests }).write();
    }
  },

  // Company profiles
  findCompanyProfile(user_id) {
    return db.get('company_profiles').find({ user_id }).value() || null;
  },
  insertCompanyProfile(user_id) {
    const profile = { id: nextId('company_profiles'), user_id, company_name: '', description: '', industry: '', location: '' };
    db.get('company_profiles').push(profile).write();
  },
  upsertCompanyProfile(user_id, { company_name, description, industry, location }) {
    const existing = db.get('company_profiles').find({ user_id }).value();
    if (existing) {
      db.get('company_profiles').find({ user_id }).assign({ company_name, description, industry, location }).write();
    } else {
      db.get('company_profiles').push({ id: nextId('company_profiles'), user_id, company_name, description, industry, location }).write();
    }
  },

  // Internships
  getAllActiveInternships() {
    return db.get('internships').filter({ is_active: true }).value().map(i => {
      const company = queries.findCompanyProfile(i.company_id) || {};
      const user = queries.findUserById(i.company_id) || {};
      return { ...i, type: 'internship', company_name: company.company_name || user.full_name || '', poster_name: user.full_name || '' };
    });
  },
  getCompanyInternships(company_id) {
    return db.get('internships').filter({ company_id }).value().map(i => ({ ...i, type: 'internship' }));
  },
  insertInternship({ company_id, title, description, required_skills, location }) {
    const id = nextId('internships');
    db.get('internships').push({ id, company_id, title, description, required_skills, location, is_active: true, created_at: new Date().toISOString() }).write();
    return id;
  },
  deactivateInternship(id, company_id) {
    const item = db.get('internships').find({ id, company_id }).value();
    if (!item) return false;
    db.get('internships').find({ id, company_id }).assign({ is_active: false }).write();
    return true;
  },

  // Projects
  getAllActiveProjects() {
    return db.get('projects').filter({ is_active: true }).value().map(p => {
      const company = queries.findCompanyProfile(p.company_id) || {};
      const user = queries.findUserById(p.company_id) || {};
      return { ...p, type: 'project', location: '', company_name: company.company_name || user.full_name || '', poster_name: user.full_name || '' };
    });
  },
  getCompanyProjects(company_id) {
    return db.get('projects').filter({ company_id }).value().map(p => ({ ...p, type: 'project' }));
  },
  insertProject({ company_id, title, description, required_skills }) {
    const id = nextId('projects');
    db.get('projects').push({ id, company_id, title, description, required_skills, is_active: true, created_at: new Date().toISOString() }).write();
    return id;
  },
  deactivateProject(id, company_id) {
    const item = db.get('projects').find({ id, company_id }).value();
    if (!item) return false;
    db.get('projects').find({ id, company_id }).assign({ is_active: false }).write();
    return true;
  },
};

console.log('✅ Database initialized:', dbFile);
module.exports = { db, queries };
