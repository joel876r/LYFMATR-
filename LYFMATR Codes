import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ bio: '', education: '', skills: '', interests: '' });
  const [activeTab, setActiveTab] = useState('opportunities');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [profRes, oppRes] = await Promise.all([
        api.get('/students/profile'),
        api.get(`/matching/opportunities/${user.id}`),
      ]);
      setProfile(profRes.data);
      setProfileForm({
        bio: profRes.data.bio || '',
        education: profRes.data.education || '',
        skills: (profRes.data.skills || []).join(', '),
        interests: (profRes.data.interests || []).join(', '),
      });
      setOpportunities(oppRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await api.put('/students/profile', {
        bio: profileForm.bio,
        education: profileForm.education,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: profileForm.interests.split(',').map(s => s.trim()).filter(Boolean),
      });
      setMsg('Profile saved successfully!');
      setEditMode(false);
      loadData();
      setTimeout(() => setMsg(''), 3500);
    } catch { setMsg('Failed to save.'); }
    finally { setSaving(false); }
  }

  const skillCount = (profile?.skills || []).length;
  const validatedCount = (profile?.validated_skills || []).length;
  const topMatches = opportunities.filter(o => o.matchScore >= 60).length;
  const avgMatchScore = opportunities.length > 0 ? Math.round(opportunities.reduce((a, o) => a + (o.matchScore || 0), 0) / opportunities.length) : 0;

  // Career Readiness Score (0-100)
  const profileComplete = Math.min(100, Math.round((!!profile?.bio + !!profile?.education + (skillCount > 0)) / 3 * 100));
  const careerScore = Math.round(
    profileComplete * 0.30 +
    Math.min(100, skillCount * 10) * 0.25 +
    Math.min(100, validatedCount * 25) * 0.25 +
    avgMatchScore * 0.20
  );
  const scoreColor = careerScore >= 70 ? '#00897B' : careerScore >= 40 ? '#B35B00' : '#D93025';
  const scoreTip = careerScore >= 70 ? 'Industry-Ready 🚀' : careerScore >= 40 ? 'Getting There ⚡' : 'Just Starting 🌱';

  const matchColor = (s) => s >= 70 ? '#00897B' : s >= 40 ? '#B35B00' : '#D93025';
  const matchBg = (s) => s >= 70 ? '#E0F2F1' : s >= 40 ? '#FFF8E1' : '#FDECEA';
  const matchLabel = (s) => s >= 70 ? 'Strong Match' : s >= 40 ? 'Partial Match' : 'Low Match';
  const progressClass = (s) => s >= 70 ? 'progress-fill-green' : s >= 40 ? 'progress-fill-yellow' : 'progress-fill';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3.5 }} />
      <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Loading your dashboard...</p>
    </div>
  );

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header banner */}
      <div style={{ background: '#0056D2', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.3rem' }}>
                Welcome back, {user.full_name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Your personalised career dashboard</p>
            </div>
            <Link to="/student/skill-gap">
              <button className="btn-primary" style={{ background: '#fff', color: '#0056D2', fontWeight: 700 }}>🤖 Open AI Skill Analyzer</button>
            </Link>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
            {[
              { label: 'Skills Added', value: skillCount, icon: '🛠️' },
              { label: 'Validated Skills', value: validatedCount, icon: '🏅' },
              { label: 'Strong Matches', value: topMatches, icon: '⭐' },
              { label: 'Avg Match Score', value: `${avgMatchScore}%`, icon: '🎯' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.75rem 1.25rem', minWidth: 130 }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
            {/* Career Readiness Score */}
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.75rem 1.25rem', minWidth: 165, borderLeft: '3px solid rgba(255,255,255,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
                <div style={{ fontWeight: 900, fontSize: '2rem', color: '#fff', lineHeight: 1, fontFamily: 'Poppins,sans-serif' }}>{careerScore}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', paddingBottom: '0.3rem' }}>/100</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 700, marginTop: '0.1rem' }}>Career Readiness</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.15rem' }}>{scoreTip}</div>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, height: 4, marginTop: '0.5rem' }}>
                <div style={{ width: `${careerScore}%`, background: '#93C5FD', borderRadius: 999, height: 4, transition: 'width 0.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '1.75rem' }}>
        {/* Tabs */}
        <div className="tab-bar" style={{ overflowX: 'auto' }}>
          {[
            { id: 'opportunities', label: `🎯 Opportunities (${opportunities.length})` },
            { id: 'profile', label: '👤 My Profile' },
            { id: 'validated', label: `🏅 Badges (${validatedCount})` },
            { id: 'readiness', label: '📈 Career Readiness' },
          ].map(t => (
            <div key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)} style={{ whiteSpace: 'nowrap' }}>{t.label}</div>
          ))}
        </div>

        {/* ── OPPORTUNITIES TAB ── */}
        {activeTab === 'opportunities' && (
          <div>
            {opportunities.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem', maxWidth: 500, margin: '0 auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>No matches yet</h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>Add your skills in the Profile tab so we can match you with the right internships and projects.</p>
                <button className="btn-outline" onClick={() => setActiveTab('profile')}>Go to Profile →</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {opportunities.map(opp => (
                  <div key={`${opp.type}-${opp.id}`} className="course-card">
                    <div className="course-card-header">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                        <span className={`badge ${opp.type === 'internship' ? 'badge-blue' : 'badge-yellow'}`}>
                          {opp.type === 'internship' ? '💼 Internship' : '🚀 Project'}
                        </span>
                        <div style={{ background: matchBg(opp.matchScore), color: matchColor(opp.matchScore), padding: '0.22rem 0.7rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700 }}>
                          {opp.matchScore}% match
                        </div>
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1D1F', marginBottom: '0.2rem', lineHeight: 1.3 }}>{opp.title}</h3>
                      <p style={{ color: '#6B6B6B', fontSize: '0.8rem' }}>
                        {opp.company_name || opp.poster_name}
                        {opp.location ? ` · 📍 ${opp.location}` : ''}
                      </p>
                    </div>
                    <div className="course-card-body">
                      {opp.description && (
                        <p style={{ fontSize: '0.84rem', color: '#3D3D3D', lineHeight: 1.65, marginBottom: '0.9rem' }}>
                          {opp.description.length > 120 ? opp.description.slice(0, 120) + '…' : opp.description}
                        </p>
                      )}
                      <div className="progress-bg" style={{ marginBottom: '0.4rem' }}>
                        <div className={progressClass(opp.matchScore)} style={{ width: `${opp.matchScore}%` }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>{matchLabel(opp.matchScore)}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>{opp.matchedSkills?.length}/{opp.required_skills?.length} skills</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {(opp.matchedSkills || []).map(s => <span key={s} className="skill-tag matched">{s}</span>)}
                        {(opp.missingSkills || []).slice(0, 3).map(s => <span key={s} className="skill-tag missing">{s}</span>)}
                        {(opp.missingSkills || []).length > 3 && <span className="badge badge-gray">+{opp.missingSkills.length - 3} more</span>}
                      </div>
                    </div>
                    <div className="course-card-footer">
                      <Link to="/student/skill-gap">
                        <button className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}>Analyze Gap</button>
                      </Link>
                      <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Express Interest</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 700 }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1D1F' }}>Student Profile</h2>
                <button className="btn-ghost" onClick={() => { setEditMode(!editMode); setMsg(''); }} style={{ fontSize: '0.82rem' }}>
                  {editMode ? 'Cancel' : '✏️ Edit Profile'}
                </button>
              </div>
              {msg && <div className={msg.includes('Failed') ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1.1rem' }}>{msg}</div>}

              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label className="label">Bio</label><textarea className="input" rows={2} value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell recruiters about yourself" style={{ resize: 'vertical' }} /></div>
                  <div><label className="label">Education</label><input className="input" value={profileForm.education} onChange={e => setProfileForm(f => ({ ...f, education: e.target.value }))} placeholder="e.g. B.Tech Computer Science, IIT Bombay (2025)" /></div>
                  <div>
                    <label className="label">Skills <span style={{ color: '#9AA3B0', fontWeight: 400 }}>(comma-separated)</span></label>
                    <input className="input" value={profileForm.skills} onChange={e => setProfileForm(f => ({ ...f, skills: e.target.value }))} placeholder="Python, React, SQL, Machine Learning, Docker..." />
                    <p style={{ fontSize: '0.77rem', color: '#9AA3B0', marginTop: '0.3rem' }}>💡 More skills = better matches. Be specific.</p>
                  </div>
                  <div><label className="label">Interests <span style={{ color: '#9AA3B0', fontWeight: 400 }}>(comma-separated)</span></label><input className="input" value={profileForm.interests} onChange={e => setProfileForm(f => ({ ...f, interests: e.target.value }))} placeholder="AI/ML, Web Development, Data Science..." /></div>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <button className="btn-primary" onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <div className="label">Education</div>
                      <div style={{ color: profile?.education ? '#1C1D1F' : '#9AA3B0', fontSize: '0.92rem', marginTop: '0.2rem' }}>{profile?.education || 'Not added yet'}</div>
                    </div>
                    <div>
                      <div className="label">Bio</div>
                      <div style={{ color: profile?.bio ? '#1C1D1F' : '#9AA3B0', fontSize: '0.92rem', marginTop: '0.2rem' }}>{profile?.bio || 'Not added yet'}</div>
                    </div>
                  </div>
                  <div className="divider" style={{ margin: '0' }} />
                  <div>
                    <div className="label" style={{ marginBottom: '0.6rem' }}>Skills ({skillCount})</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {(profile?.skills || []).length > 0 ? profile.skills.map(s => <span key={s} className="skill-tag">{s}</span>) : (
                        <span style={{ fontSize: '0.85rem', color: '#9AA3B0' }}>No skills added — click ✏️ Edit Profile to add them</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="label" style={{ marginBottom: '0.6rem' }}>Interests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {(profile?.interests || []).length > 0 ? profile.interests.map(s => <span key={s} className="badge badge-blue">{s}</span>) : (
                        <span style={{ fontSize: '0.85rem', color: '#9AA3B0' }}>None added</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── VALIDATED SKILLS TAB ── */}
        {activeTab === 'validated' && (
          <div style={{ maxWidth: 700 }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1D1F' }}>🏅 Validated Skill Badges</h2>
                <Link to="/student/assessment"><button className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}>+ Take Assessment</button></Link>
              </div>
              {(profile?.validated_skills || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏅</div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No badges yet</h3>
                  <p style={{ color: '#6B6B6B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Take a skill assessment quiz and score 60%+ to earn a validated skill badge.</p>
                  <Link to="/student/assessment"><button className="btn-primary">Take Your First Assessment →</button></Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.9rem' }}>
                  {profile.validated_skills.map(v => (
                    <div key={v.skill} style={{ background: '#F3F0FF', border: '2px solid #7C3AED30', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🏅</div>
                      <div style={{ fontWeight: 700, color: '#7C3AED', fontSize: '0.92rem' }}>{v.skill}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9AA3B0', marginTop: '0.2rem' }}>Score: {v.score}%</div>
                      <div style={{ fontSize: '0.7rem', color: '#C4AFFF', marginTop: '0.15rem' }}>Validated {new Date(v.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CAREER READINESS TAB ── */}
        {activeTab === 'readiness' && (
          <div style={{ maxWidth: 700 }}>
            <div className="card" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${scoreColor}` }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1D1F', marginBottom: '1.5rem' }}>📈 Career Readiness Score</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: '3.5rem', color: scoreColor, fontFamily: 'Poppins,sans-serif', lineHeight: 1 }}>{careerScore}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9AA3B0', marginTop: '0.2rem' }}>out of 100</div>
                  <div style={{ fontWeight: 700, color: scoreColor, fontSize: '0.9rem', marginTop: '0.3rem' }}>{scoreTip}</div>
                </div>
                <div style={{ flex: 1, minWidth: 250 }}>
                  {[
                    { label: 'Profile Completeness (30%)', value: profileComplete, max: 100, weight: 0.30 },
                    { label: 'Skills Breadth (25%)', value: Math.min(100, skillCount * 10), max: 100, weight: 0.25 },
                    { label: 'Validated Skills (25%)', value: Math.min(100, validatedCount * 25), max: 100, weight: 0.25 },
                    { label: 'Opportunity Match Avg (20%)', value: avgMatchScore, max: 100, weight: 0.20 },
                  ].map(f => (
                    <div key={f.label} style={{ marginBottom: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#3D3D3D', fontWeight: 500 }}>{f.label}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: f.value >= 60 ? '#00897B' : '#B35B00' }}>{f.value}%</span>
                      </div>
                      <div className="progress-bg"><div className={f.value >= 70 ? 'progress-fill-green' : f.value >= 40 ? 'progress-fill-yellow' : 'progress-fill'} style={{ width: `${f.value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#F6F7FB', borderRadius: 10, padding: '1rem 1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1D1F', marginBottom: '0.6rem' }}>💡 How to improve your score:</div>
                <ul style={{ margin: 0, padding: '0 0 0 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {!profile?.bio && <li style={{ fontSize: '0.84rem', color: '#3D3D3D' }}>Add a bio to your profile (+profile points)</li>}
                  {!profile?.education && <li style={{ fontSize: '0.84rem', color: '#3D3D3D' }}>Add your education background</li>}
                  {skillCount < 5 && <li style={{ fontSize: '0.84rem', color: '#3D3D3D' }}>Add more skills — aim for at least 5</li>}
                  {validatedCount === 0 && <li style={{ fontSize: '0.84rem', color: '#3D3D3D' }}><Link to="/student/assessment" style={{ color: '#7C3AED', fontWeight: 600 }}>Take a skill assessment</Link> to earn validated badges (+25 pts each)</li>}
                  {opportunities.length === 0 && <li style={{ fontSize: '0.84rem', color: '#3D3D3D' }}>Add skills to get opportunity matches and boost your match score</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
