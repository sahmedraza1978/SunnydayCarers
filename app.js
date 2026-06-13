'use strict';

// ── Supabase client ───────────────────────────────────────────────────────────

const _url  = window.SUPABASE_URL      || '';
const _key  = window.SUPABASE_ANON_KEY || '';
const db    = (_url && _key) ? supabase.createClient(_url, _key) : null;

if (!db) {
  console.warn('Supabase not configured. Fill in config.js with your project URL and anon key.');
}

// ── In-memory cache (populated from Supabase on load) ────────────────────────

let participantStore = [];
let houseData        = [];

// ── Mapper: DB row → JS object ────────────────────────────────────────────────

function rowToParticipant(r) {
  return {
    id:            r.id,
    first:         r.first         || '',
    last:          r.last          || '',
    ndis:          r.ndis          || '',
    dob:           r.dob           || '',
    gender:        r.gender        || '',
    disability:    r.disability    || '',
    service:       r.service       || 'sil_cp',
    cp:            r.cp            || 'sunnyday',
    status:        r.status        || 'onboarding',
    planStart:     r.plan_start    || '',
    planEnd:       r.plan_end      || '',
    phone:         r.phone         || '',
    email:         r.email         || '',
    address:       r.address       || '',
    guardian:      r.guardian      || '',
    guardianRel:   r.guardian_rel  || '',
    guardianPhone: r.guardian_phone|| '',
    lac:           r.lac           || '',
    lacOrg:        r.lac_org       || '',
    houseId:       r.house_id      || null,
  };
}

function participantToRow(p) {
  return {
    first:          p.first,
    last:           p.last,
    ndis:           p.ndis,
    dob:            p.dob,
    gender:         p.gender,
    disability:     p.disability,
    service:        p.service,
    cp:             p.cp,
    status:         p.status,
    plan_start:     p.planStart,
    plan_end:       p.planEnd,
    phone:          p.phone,
    email:          p.email,
    address:        p.address,
    guardian:       p.guardian,
    guardian_rel:   p.guardianRel,
    guardian_phone: p.guardianPhone,
    lac:            p.lac,
    lac_org:        p.lacOrg,
    house_id:       p.houseId || null,
  };
}

function rowToHouse(r) {
  return {
    id:         r.id,
    name:       r.name       || '',
    street:     r.street     || '',
    suburb:     r.suburb     || '',
    state:      r.state      || 'NSW',
    postcode:   r.postcode   || '',
    phone:      r.phone      || '',
    rooms:      r.rooms      || 4,
    manager:    r.manager    || '',
    mgrPhone:   r.mgr_phone  || '',
    silModel:   r.sil_model  || 'SIL + CP',
    ratioDay:   r.ratio_day  || '1:2 (shared)',
    ratioNight: r.ratio_night|| 'Sleepover',
    notes:      r.notes      || '',
  };
}

function houseToRow(h) {
  return {
    name:        h.name,
    street:      h.street,
    suburb:      h.suburb,
    state:       h.state,
    postcode:    h.postcode,
    phone:       h.phone,
    rooms:       h.rooms,
    manager:     h.manager,
    mgr_phone:   h.mgrPhone,
    sil_model:   h.silModel,
    ratio_day:   h.ratioDay,
    ratio_night: h.ratioNight,
    notes:       h.notes,
  };
}

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadData() {
  if (!db) return;
  showLoadingOverlay(true);
  try {
    const [{ data: homes, error: e1 }, { data: parts, error: e2 }] = await Promise.all([
      db.from('group_homes').select('*').order('id'),
      db.from('participants').select('*').order('id'),
    ]);
    if (e1) throw e1;
    if (e2) throw e2;
    houseData        = (homes || []).map(rowToHouse);
    participantStore = (parts || []).map(rowToParticipant);
  } catch (err) {
    console.error('Failed to load data from Supabase:', err);
    showError('Could not load data. Check your Supabase credentials in config.js and the browser console.');
  } finally {
    showLoadingOverlay(false);
  }
}

async function initApp() {
  await loadData();
  refreshDashboard();
}

function showLoadingOverlay(visible) {
  let el = document.getElementById('loading-overlay');
  if (!el) return;
  el.style.display = visible ? 'flex' : 'none';
}

function showError(msg) {
  const el = document.getElementById('loading-overlay');
  if (el) {
    el.innerHTML = `<div style="text-align:center;padding:32px">
      <div style="font-size:32px;margin-bottom:12px">⚠️</div>
      <div style="font-size:14px;font-weight:600;color:#1A1D23;margin-bottom:6px">Connection error</div>
      <div style="font-size:12px;color:#4A5068;max-width:320px">${msg}</div>
    </div>`;
    el.style.display = 'flex';
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────

function showPage(page) {
  document.querySelectorAll('[id^="page-"]').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.remove('hidden');
  const navMap = { dashboard:0, participants:1, onboarding:2, 'group-homes':3, 'in-home':4, 'day-program':5, compliance:6, reports:7 };
  const navItems = document.querySelectorAll('.nav-item');
  const idx = navMap[page];
  if (idx !== undefined && navItems[idx]) navItems[idx].classList.add('active');
  if (page === 'participants') renderParticipants(participantStore);
  if (page === 'group-homes')  renderGroupHomes();
  if (page === 'in-home')      renderInHome();
  if (page === 'day-program')  renderDayProgram();
  if (page === 'dashboard')    refreshDashboard();
}

// ── Modal helpers ─────────────────────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'saModal') populateSASelect();
  if (id === 'onboardingModal') { obCurrentStep = 1; renderObStep(); }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });
});

// ── Participant rendering ─────────────────────────────────────────────────────

function avatarColor(name) {
  const colors = [
    ['#EAF2FB','#1A5A9A'],['#E8F5EF','#255C47'],['#FEF3DC','#C17D12'],
    ['#FDEEE9','#E05C3B'],['#F0EBF9','#7B5EA7'],['#F7F8FA','#4A5068'],
  ];
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length;
  return colors[idx];
}

function initials(p) { return (p.first[0] + p.last[0]).toUpperCase(); }

function buildServiceBadge(service) {
  const map = { sil_cp:['badge-gold','SIL + CP'], sil:['badge-sky','SIL'], inhome:['badge-sage','In Home'], day:['badge-lavender','Day Program'] };
  const [cls, label] = map[service] || ['badge-gray', service];
  return `<span class="badge ${cls}">${label}</span>`;
}

function buildCPBadge(cp, service) {
  if (service !== 'sil_cp' && service !== 'sil') return '<span style="color:var(--text-3);font-size:12px">—</span>';
  return cp === 'sunnyday'
    ? '<span class="badge badge-gold">☀️ Sunnyday</span>'
    : '<span class="badge badge-gray">External</span>';
}

function buildStatusBadge(status) {
  const map = {
    active:     `<span class="badge badge-sage"><span class="status-dot dot-active"></span>Active</span>`,
    onboarding: `<span class="badge badge-gold"><span class="status-dot dot-onboarding"></span>Onboarding</span>`,
    review:     `<span class="badge badge-coral"><span class="status-dot dot-review"></span>Plan Review</span>`,
    inactive:   `<span class="badge badge-gray"><span class="status-dot dot-inactive"></span>Inactive</span>`,
  };
  return map[status] || `<span class="badge badge-gray">${status}</span>`;
}

function renderParticipants(list) {
  const tbody = document.getElementById('participantBody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3)">No participants found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg}">${initials(p)}</div>
        <div>
          <div class="participant-name" style="cursor:pointer" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div>
          <div class="participant-ndis">${p.ndis}</div>
        </div>
      </div></td>
      <td style="font-size:12px">${p.dob}</td>
      <td>${buildServiceBadge(p.service)}</td>
      <td>${buildCPBadge(p.cp, p.service)}</td>
      <td style="font-size:12px">${p.planEnd}</td>
      <td>${buildStatusBadge(p.status)}</td>
      <td>
        <button class="btn btn-sm" onclick="openParticipant(${p.id})"><i class="ti ti-eye"></i></button>
        <button class="btn btn-sm" style="margin-left:4px" onclick="openEditParticipant(${p.id})"><i class="ti ti-edit"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterTable(q) {
  const lower = q.toLowerCase();
  const filtered = participantStore.filter(p =>
    (p.first + ' ' + p.last).toLowerCase().includes(lower) ||
    p.ndis.replace(/\s/g,'').includes(q.replace(/\s/g,''))
  );
  renderParticipants(filtered);
}

function filterService(type, btn) {
  document.querySelectorAll('#segment-bar .seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = type === 'all' ? participantStore : participantStore.filter(p => {
    if (type === 'sil')    return p.service === 'sil' || p.service === 'sil_cp';
    if (type === 'inhome') return p.service === 'inhome';
    if (type === 'day')    return p.service === 'day';
    return true;
  });
  renderParticipants(filtered);
}

// ── Participant profile ───────────────────────────────────────────────────────

let currentProfileId = null;

function openParticipant(id) {
  const p = participantStore.find(x => x.id === id);
  if (!p) return;
  currentProfileId = id;
  const [bg, fg] = avatarColor(p.first);

  document.getElementById('profileName').textContent = p.first + ' ' + p.last;
  document.getElementById('profileNdis').textContent = 'NDIS ' + p.ndis;
  document.getElementById('prof-name').textContent   = p.first + ' ' + p.last;
  document.getElementById('prof-ndis').textContent   = 'NDIS ' + p.ndis;
  document.getElementById('prof-avatar').style.cssText = `background:${bg};color:${fg}`;
  document.getElementById('prof-avatar').textContent    = initials(p);
  document.getElementById('prof-status-badge').innerHTML = buildStatusBadge(p.status);

  const house = p.houseId ? houseData.find(h => h.id === p.houseId) : null;
  document.getElementById('prof-details').innerHTML = `
    <div class="info-row"><span class="info-label">DOB</span><span class="info-val">${p.dob}</span></div>
    <div class="info-row"><span class="info-label">Gender</span><span class="info-val">${p.gender}</span></div>
    <div class="info-row"><span class="info-label">Disability</span><span class="info-val">${p.disability}</span></div>
    <div class="info-row"><span class="info-label">Service</span><span class="info-val">${buildServiceBadge(p.service)}</span></div>
    <div class="info-row"><span class="info-label">CP provider</span><span class="info-val">${buildCPBadge(p.cp, p.service)}</span></div>
    <div class="info-row"><span class="info-label">Plan ends</span><span class="info-val">${p.planEnd}</span></div>
    ${house ? `<div class="info-row"><span class="info-label">Group Home</span><span class="info-val" style="font-size:11px">${house.name}</span></div>` : ''}
  `;

  const contacts = [];
  if (p.phone)         contacts.push(`<div class="info-row"><span class="info-label">Phone</span><span class="info-val">${p.phone}</span></div>`);
  if (p.email)         contacts.push(`<div class="info-row"><span class="info-label">Email</span><span class="info-val" style="font-size:11px">${p.email}</span></div>`);
  if (p.guardian)      contacts.push(`<div class="info-row"><span class="info-label">Guardian</span><span class="info-val">${p.guardian}</span></div>`);
  if (p.guardianPhone) contacts.push(`<div class="info-row"><span class="info-label">Guardian ph.</span><span class="info-val">${p.guardianPhone}</span></div>`);
  if (p.lac)           contacts.push(`<div class="info-row"><span class="info-label">LAC</span><span class="info-val">${p.lac}</span></div>`);
  document.getElementById('prof-contacts').innerHTML = contacts.join('') ||
    '<div style="padding:10px 0;font-size:12px;color:var(--text-3)">No contact details recorded.</div>';

  document.getElementById('prof-funding').innerHTML = `
    <div class="support-item">
      <div><div style="font-size:13px;font-weight:600">Core Supports</div><div style="font-size:11px;color:var(--text-3)">Daily activities, personal care</div></div>
      <div style="text-align:right"><div style="font-size:13px;font-weight:600">$42,500</div>
        <div class="budget-bar-wrap"><div class="budget-bar" style="width:120px"><div class="budget-fill" style="width:62%;background:var(--sky)"></div></div></div>
        <div style="font-size:11px;color:var(--text-3)">$26,350 remaining</div></div>
    </div>
    <div class="support-item">
      <div><div style="font-size:13px;font-weight:600">Capacity Building</div><div style="font-size:11px;color:var(--text-3)">Skills, employment, social</div></div>
      <div style="text-align:right"><div style="font-size:13px;font-weight:600">$18,200</div>
        <div class="budget-bar-wrap"><div class="budget-bar" style="width:120px"><div class="budget-fill" style="width:35%;background:var(--sage)"></div></div></div>
        <div style="font-size:11px;color:var(--text-3)">$11,830 remaining</div></div>
    </div>
    <div class="support-item">
      <div><div style="font-size:13px;font-weight:600">Capital Supports</div><div style="font-size:11px;color:var(--text-3)">AT, home mods, SIL</div></div>
      <div style="text-align:right"><div style="font-size:13px;font-weight:600">$6,800</div>
        <div class="budget-bar-wrap"><div class="budget-bar" style="width:120px"><div class="budget-fill" style="width:80%;background:var(--coral)"></div></div></div>
        <div style="font-size:11px;color:var(--text-3)">$1,360 remaining</div></div>
    </div>
  `;

  document.getElementById('prof-compliance-list').innerHTML = `
    <div class="check-item done"><div class="check-icon ci-done">✓</div><div class="check-text"><strong>NDIS plan current</strong><span>Plan expires ${p.planEnd}</span></div></div>
    <div class="check-item ${p.status==='onboarding'?'missing':'done'}">
      <div class="check-icon ${p.status==='onboarding'?'ci-missing':'ci-done'}">${p.status==='onboarding'?'!':'✓'}</div>
      <div class="check-text"><strong>Service agreement</strong><span>${p.status==='onboarding'?'Not yet generated':'Signed and on file'}</span></div>
    </div>
    <div class="check-item done"><div class="check-icon ci-done">✓</div><div class="check-text"><strong>Privacy consent</strong><span>Signed ${p.planStart}</span></div></div>
    <div class="check-item pending"><div class="check-icon ci-pending">~</div><div class="check-text"><strong>Support plan review</strong><span>Due within 6 months of plan start</span></div></div>
    <div class="check-item done"><div class="check-icon ci-done">✓</div><div class="check-text"><strong>Worker screening</strong><span>All assigned workers cleared</span></div></div>
  `;

  document.getElementById('prof-notes').innerHTML = `
    <div class="note-item">
      <div class="note-dot-col"><div class="note-dot"></div><div class="note-line"></div></div>
      <div class="note-content"><strong>Intake completed</strong><p>Onboarding intake form completed. Documents collected.</p><div class="note-meta">${p.planStart} · Sarah Mitchell</div></div>
    </div>
    <div class="note-item">
      <div class="note-dot-col"><div class="note-dot" style="background:var(--sage)"></div></div>
      <div class="note-content"><strong>Service commenced</strong><p>Support services commenced as per service agreement.</p><div class="note-meta">${p.planStart} · System</div></div>
    </div>
  `;

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab')[0].classList.add('active');
  document.getElementById('tab-plan').classList.add('active');

  showPage('profile');
}

function switchTab(panel, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + panel).classList.add('active');
}

// ── Edit participant ──────────────────────────────────────────────────────────

let editingParticipantId = null;

function openEditParticipant(id) {
  const p = participantStore.find(x => x.id === id);
  if (!p) return;
  editingParticipantId = id;
  document.getElementById('editParticipantTitle').textContent = p.first + ' ' + p.last;
  document.getElementById('ep-first').value   = p.first;
  document.getElementById('ep-last').value    = p.last;
  document.getElementById('ep-ndis').value    = p.ndis;
  document.getElementById('ep-dob').value     = p.dob;
  setSelectValue('ep-gender',     p.gender);
  setSelectValue('ep-disability', p.disability);
  document.getElementById('ep-phone').value   = p.phone;
  document.getElementById('ep-email').value   = p.email;
  document.getElementById('ep-address').value = p.address;
  setSelectValue('ep-service', p.service);
  setSelectValue('ep-status',  p.status);
  document.getElementById('ep-plan-start').value = p.planStart;
  document.getElementById('ep-plan-end').value   = p.planEnd;
  document.getElementById('ep-gname').value   = p.guardian;
  setSelectValue('ep-grel',       p.guardianRel);
  document.getElementById('ep-gphone').value  = p.guardianPhone;
  document.getElementById('ep-gemail').value  = '';
  document.getElementById('ep-lac').value     = p.lac;
  document.getElementById('ep-lac-org').value = p.lacOrg;

  const ghSel = document.getElementById('ep-group-home');
  ghSel.innerHTML = '<option value="">— Not assigned —</option>' +
    houseData.map(h => `<option value="${h.id}" ${p.houseId===h.id?'selected':''}>${h.name} — ${h.suburb}</option>`).join('');

  toggleEditCPField();
  openModal('editParticipantModal');
}

function toggleEditCPField() {
  const svc = document.getElementById('ep-service').value;
  const isSil = svc === 'sil_cp' || svc === 'sil';
  document.getElementById('ep-cp-field').style.display    = isSil ? '' : 'none';
  document.getElementById('ep-cp-na-field').style.display = isSil ? 'none' : '';
  document.getElementById('ep-house-section').style.display = isSil ? '' : 'none';
}

function setSelectValue(id, val) {
  const sel = document.getElementById(id);
  if (!sel) return;
  for (const opt of sel.options) {
    if (opt.value === val || opt.text === val) { opt.selected = true; break; }
  }
}

async function saveEditParticipant() {
  const p = participantStore.find(x => x.id === editingParticipantId);
  if (!p) return;

  const updated = {
    ...p,
    first:         document.getElementById('ep-first').value.trim() || p.first,
    last:          document.getElementById('ep-last').value.trim()  || p.last,
    ndis:          document.getElementById('ep-ndis').value.trim()  || p.ndis,
    dob:           document.getElementById('ep-dob').value.trim(),
    gender:        document.getElementById('ep-gender').value,
    disability:    document.getElementById('ep-disability').value,
    phone:         document.getElementById('ep-phone').value.trim(),
    email:         document.getElementById('ep-email').value.trim(),
    address:       document.getElementById('ep-address').value.trim(),
    service:       document.getElementById('ep-service').value,
    status:        document.getElementById('ep-status').value,
    planStart:     document.getElementById('ep-plan-start').value,
    planEnd:       document.getElementById('ep-plan-end').value,
    guardian:      document.getElementById('ep-gname').value.trim(),
    guardianRel:   document.getElementById('ep-grel').value,
    guardianPhone: document.getElementById('ep-gphone').value.trim(),
    lac:           document.getElementById('ep-lac').value.trim(),
    lacOrg:        document.getElementById('ep-lac-org').value.trim(),
    houseId:       document.getElementById('ep-group-home').value
                     ? parseInt(document.getElementById('ep-group-home').value) : null,
  };

  if (db) {
    const { error } = await db.from('participants').update(participantToRow(updated)).eq('id', updated.id);
    if (error) { alert('Save failed: ' + error.message); return; }
  }

  Object.assign(p, updated);
  closeModal('editParticipantModal');
  refreshDashboard();
  if (currentProfileId === editingParticipantId) openParticipant(editingParticipantId);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function refreshDashboard() {
  const total          = participantStore.length;
  const onboardingCount = participantStore.filter(p => p.status === 'onboarding').length;
  const silCount        = participantStore.filter(p => p.service === 'sil' || p.service === 'sil_cp').length;

  document.getElementById('stat-total').textContent        = total;
  document.getElementById('stat-total-sub').textContent    = 'registered participants';
  document.getElementById('stat-onboarding').textContent   = onboardingCount;
  document.getElementById('stat-onboarding-sub').textContent = 'pending intake tasks';
  document.getElementById('stat-sil').textContent          = silCount;
  document.getElementById('stat-sil-sub').textContent      = 'in ' + houseData.length + ' group homes';
  document.getElementById('stat-alerts').textContent       = '4';
  document.getElementById('stat-alerts-sub').textContent   = 'action required';
  document.getElementById('nav-badge').textContent         = total;

  const recent = participantStore.slice(-8).reverse();
  document.getElementById('dashboard-recent-body').innerHTML = recent.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg};width:26px;height:26px;font-size:10px">${initials(p)}</div>
        <div class="participant-name" style="cursor:pointer;font-size:12px" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div>
      </div></td>
      <td>${buildServiceBadge(p.service)}</td>
      <td>${buildStatusBadge(p.status)}</td>
    </tr>`;
  }).join('');

  document.getElementById('dashboard-date-sub').textContent =
    'Welcome back, Sarah — ' +
    new Date().toLocaleDateString('en-AU', {weekday:'long', day:'numeric', month:'long'});
}

// ── Group Homes ───────────────────────────────────────────────────────────────

function getOccupancy(houseId) {
  return participantStore.filter(p => p.houseId === houseId && (p.service === 'sil' || p.service === 'sil_cp')).length;
}

function renderGroupHomes() {
  const totalRooms    = houseData.reduce((s,h) => s + h.rooms, 0);
  const totalOccupied = houseData.reduce((s,h) => s + getOccupancy(h.id), 0);
  const silTotal      = participantStore.filter(p => p.houseId !== null).length;

  document.getElementById('gh-stats').innerHTML = `
    <div class="stat-card stat-accent"><div class="stat-label">Group Homes</div><div class="stat-value">${houseData.length}</div><div class="stat-sub">Active SIL properties</div></div>
    <div class="stat-card stat-accent-sky"><div class="stat-label">Total Beds</div><div class="stat-value">${totalRooms}</div><div class="stat-sub">Across all homes</div></div>
    <div class="stat-card stat-accent-sage"><div class="stat-label">Occupied</div><div class="stat-value">${totalOccupied}</div><div class="stat-sub">${totalRooms - totalOccupied} vacant beds</div></div>
    <div class="stat-card stat-accent-coral"><div class="stat-label">SIL Participants</div><div class="stat-value">${silTotal}</div><div class="stat-sub">Placed in homes</div></div>
  `;

  document.getElementById('gh-cards-grid').innerHTML = houseData.map(h => {
    const occ = getOccupancy(h.id);
    const pct = h.rooms > 0 ? Math.round((occ / h.rooms) * 100) : 0;
    const barColor = pct >= 90 ? 'var(--coral)' : pct >= 70 ? 'var(--sun-gold)' : 'var(--sky)';
    const residents = participantStore.filter(p => p.houseId === h.id);
    return `<div class="card">
      <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:600;font-size:14px">${h.name}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px">${h.street}, ${h.suburb} ${h.state}</div>
        </div>
        <span class="badge ${h.silModel.includes('CP')?'badge-gold':'badge-sky'}">${h.silModel}</span>
      </div>
      <div style="padding:12px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:12px;color:var(--text-2)">Occupancy</span>
          <span style="font-size:12px;font-weight:600">${occ}/${h.rooms}</span>
        </div>
        <div class="budget-bar"><div class="budget-fill" style="width:${pct}%;background:${barColor}"></div></div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-3)">Manager: <strong style="color:var(--text-1)">${h.manager}</strong> · ${h.mgrPhone}</div>
        ${residents.length ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">${
          residents.slice(0,4).map(p => {
            const [bg,fg] = avatarColor(p.first);
            return `<div class="avatar" style="background:${bg};color:${fg};width:24px;height:24px;font-size:9px;cursor:pointer" title="${p.first} ${p.last}" onclick="openParticipant(${p.id})">${initials(p)}</div>`;
          }).join('') +
          (residents.length > 4 ? `<div class="avatar" style="background:var(--surface-3);color:var(--text-2);width:24px;height:24px;font-size:9px">+${residents.length-4}</div>` : '')
        }</div>` : ''}
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn btn-sm" style="flex:1" onclick="openEditHouse(${h.id})"><i class="ti ti-edit"></i> Edit</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── In Home Care ──────────────────────────────────────────────────────────────

function renderInHome() {
  const list = participantStore.filter(p => p.service === 'inhome');
  document.getElementById('inhome-count').textContent = list.length;
  document.getElementById('inhome-body').innerHTML = list.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg}">${initials(p)}</div>
        <div><div class="participant-name" style="cursor:pointer" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div><div class="participant-ndis">${p.ndis}</div></div>
      </div></td>
      <td style="font-size:12px">${p.ndis}</td>
      <td style="font-size:11px;color:var(--text-2);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.address || '—'}</td>
      <td style="font-size:12px">${p.planEnd}</td>
      <td>${buildStatusBadge(p.status)}</td>
      <td><button class="btn btn-sm" onclick="openParticipant(${p.id})"><i class="ti ti-eye"></i></button></td>
    </tr>`;
  }).join('');
}

// ── Day Program ───────────────────────────────────────────────────────────────

function renderDayProgram() {
  const list = participantStore.filter(p => p.service === 'day');
  document.getElementById('day-count').textContent = list.length;
  document.getElementById('day-body').innerHTML = list.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg}">${initials(p)}</div>
        <div><div class="participant-name" style="cursor:pointer" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div><div class="participant-ndis">${p.ndis}</div></div>
      </div></td>
      <td style="font-size:12px">${p.ndis}</td>
      <td style="font-size:12px">${p.planEnd}</td>
      <td>${buildStatusBadge(p.status)}</td>
      <td><button class="btn btn-sm" onclick="openParticipant(${p.id})"><i class="ti ti-eye"></i></button></td>
    </tr>`;
  }).join('');
}

// ── Onboarding stepper ────────────────────────────────────────────────────────

let obCurrentStep = 1;
let selectedService = null;
let selectedCP      = null;

function obStep(dir) {
  const next = obCurrentStep + dir;
  if (next < 1) return;
  if (next > 5) { finaliseOnboarding(); return; }
  obCurrentStep = next;
  renderObStep();
}

function renderObStep() {
  for (let i = 1; i <= 5; i++) {
    document.getElementById('ob-step-' + i).classList.toggle('hidden', i !== obCurrentStep);
    const el = document.getElementById('step-' + i);
    el.classList.remove('active','done');
    if (i < obCurrentStep) el.classList.add('done');
    else if (i === obCurrentStep) el.classList.add('active');
  }
  document.getElementById('ob-back-btn').style.display = obCurrentStep > 1 ? '' : 'none';
  document.getElementById('ob-step-indicator').textContent = `Step ${obCurrentStep} of 5`;
  const nextBtn = document.getElementById('ob-next-btn');
  nextBtn.innerHTML = obCurrentStep === 5
    ? '<i class="ti ti-user-plus"></i> Complete onboarding'
    : 'Next <i class="ti ti-arrow-right"></i>';
}

async function finaliseOnboarding() {
  const first = document.getElementById('f-first').value.trim();
  const last  = document.getElementById('f-last').value.trim();
  const ndis  = document.getElementById('f-ndis').value.trim();
  if (!first || !last) { alert('Please enter the participant\'s first and last name.'); return; }

  const newPart = {
    first, last,
    ndis:      ndis || '',
    dob:       document.getElementById('f-dob').value || '',
    gender:    document.getElementById('f-gender').value,
    disability:'Not recorded',
    service:   selectedService || 'sil_cp',
    cp:        selectedCP || 'sunnyday',
    status:    'onboarding',
    planStart: '', planEnd: '',
    phone: '', email: '', address: '',
    guardian: '', guardianRel: '', guardianPhone: '',
    lac: '', lacOrg: '', houseId: null,
  };

  if (db) {
    const { data, error } = await db.from('participants').insert(participantToRow(newPart)).select().single();
    if (error) { alert('Could not save participant: ' + error.message); return; }
    participantStore.push(rowToParticipant(data));
  } else {
    const newId = participantStore.length ? Math.max(...participantStore.map(p => p.id)) + 1 : 1;
    participantStore.push({ id: newId, ...newPart });
  }

  closeModal('onboardingModal');
  refreshDashboard();
  showPage('participants');
}

function selectService(type, el) {
  selectedService = type;
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('cp-section').classList.toggle('hidden', type !== 'sil' && type !== 'sil_cp');
  document.getElementById('sil-house-section').classList.toggle('hidden', type !== 'sil' && type !== 'sil_cp');
  if (type === 'sil' || type === 'sil_cp') populateObHouseSelect();
}

function selectCP(type, el) {
  selectedCP = type;
  document.querySelectorAll('.cp-option').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('external-cp-fields').classList.toggle('hidden', type !== 'external');
}

function populateObHouseSelect() {
  const sel = document.getElementById('ob-house-select');
  sel.innerHTML = '<option value="">No preference</option>' +
    houseData.map(h => {
      const vac = h.rooms - getOccupancy(h.id);
      return `<option value="${h.id}" ${vac===0?'disabled':''}>${h.name} — ${h.suburb} (${vac} bed${vac!==1?'s':''} available)</option>`;
    }).join('');
}

// ── Add / Edit Group Home ─────────────────────────────────────────────────────

let editingHouseId = null;

function openAddHouseModal() {
  editingHouseId = null;
  document.getElementById('houseModalTitle').innerHTML = '<i class="ti ti-building-community" style="color:var(--sun-gold);font-size:18px;margin-right:8px;vertical-align:-2px"></i>Add Group Home';
  document.getElementById('houseModalSub').textContent = 'Register a new SIL group home · Sunnyday Carers';
  document.getElementById('houseModalSaveBtn').innerHTML = '<i class="ti ti-building-community"></i> Add group home';
  ['gh-name','gh-street','gh-suburb','gh-postcode','gh-phone','gh-manager','gh-mgr-phone','gh-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('gh-rooms').value = '';
  document.getElementById('gh-occupancy-summary').style.display = 'none';
  openModal('addHouseModal');
}

function openEditHouse(id) {
  const h = houseData.find(x => x.id === id);
  if (!h) return;
  editingHouseId = id;
  document.getElementById('houseModalTitle').innerHTML = '<i class="ti ti-edit" style="color:var(--sky);font-size:18px;margin-right:8px;vertical-align:-2px"></i>Edit Group Home';
  document.getElementById('houseModalSub').textContent = h.name + ' · Sunnyday Carers';
  document.getElementById('houseModalSaveBtn').innerHTML = '<i class="ti ti-device-floppy"></i> Save changes';
  document.getElementById('gh-name').value    = h.name;
  document.getElementById('gh-street').value  = h.street;
  document.getElementById('gh-suburb').value  = h.suburb;
  document.getElementById('gh-postcode').value = h.postcode;
  document.getElementById('gh-phone').value   = h.phone;
  document.getElementById('gh-rooms').value   = h.rooms;
  document.getElementById('gh-manager').value = h.manager;
  document.getElementById('gh-mgr-phone').value = h.mgrPhone;
  document.getElementById('gh-notes').value   = h.notes;
  setSelectValue('gh-state',       h.state);
  setSelectValue('gh-sil-model',   h.silModel);
  setSelectValue('gh-ratio-day',   h.ratioDay);
  setSelectValue('gh-ratio-night', h.ratioNight);
  recalcOccupancy();
  openModal('addHouseModal');
}

function closeHouseModal() { closeModal('addHouseModal'); }

async function saveHouse() {
  const name    = document.getElementById('gh-name').value.trim();
  const street  = document.getElementById('gh-street').value.trim();
  const suburb  = document.getElementById('gh-suburb').value.trim();
  const rooms   = parseInt(document.getElementById('gh-rooms').value);
  const manager = document.getElementById('gh-manager').value.trim();
  if (!name || !street || !suburb || !rooms || !manager) {
    alert('Please fill in all required fields (name, street, suburb, rooms, manager).');
    return;
  }

  const row = {
    name, street, suburb,
    state:       document.getElementById('gh-state').value,
    postcode:    document.getElementById('gh-postcode').value,
    phone:       document.getElementById('gh-phone').value,
    rooms,
    manager,
    mgr_phone:   document.getElementById('gh-mgr-phone').value,
    sil_model:   document.getElementById('gh-sil-model').value,
    ratio_day:   document.getElementById('gh-ratio-day').value,
    ratio_night: document.getElementById('gh-ratio-night').value,
    notes:       document.getElementById('gh-notes').value,
  };

  if (editingHouseId) {
    if (db) {
      const { error } = await db.from('group_homes').update(row).eq('id', editingHouseId);
      if (error) { alert('Save failed: ' + error.message); return; }
    }
    const h = houseData.find(x => x.id === editingHouseId);
    Object.assign(h, rowToHouse({ id: editingHouseId, ...row }));
  } else {
    if (db) {
      const { data, error } = await db.from('group_homes').insert(row).select().single();
      if (error) { alert('Save failed: ' + error.message); return; }
      houseData.push(rowToHouse(data));
    } else {
      const newId = houseData.length ? Math.max(...houseData.map(h => h.id)) + 1 : 1;
      houseData.push(rowToHouse({ id: newId, ...row }));
    }
  }

  closeHouseModal();
  renderGroupHomes();
}

function recalcOccupancy() {
  const rooms = parseInt(document.getElementById('gh-rooms').value) || 0;
  const occ   = editingHouseId ? getOccupancy(editingHouseId) : 0;
  const vacant = Math.max(0, rooms - occ);
  const pct    = rooms > 0 ? Math.round((occ / rooms) * 100) : 0;
  const summary = document.getElementById('gh-occupancy-summary');
  summary.style.display = rooms > 0 ? '' : 'none';
  if (rooms > 0) {
    document.getElementById('occ-total').textContent    = rooms;
    document.getElementById('occ-occupied').textContent = occ;
    document.getElementById('occ-vacant').textContent   = vacant;
    document.getElementById('occ-bar').style.width      = pct + '%';
    document.getElementById('occ-pct').textContent      = pct + '%';
  }
}

// ── Service Agreement ─────────────────────────────────────────────────────────

function populateSASelect() {
  const sel = document.getElementById('sa-participant');
  sel.innerHTML = '<option value="">— Select participant —</option>' +
    participantStore
      .filter(p => p.service === 'sil_cp' || p.service === 'sil')
      .sort((a,b) => (a.first+a.last).localeCompare(b.first+b.last))
      .map(p => `<option value="${p.id}">${p.first} ${p.last} — ${p.ndis}</option>`)
      .join('');
  document.getElementById('sa-preview').style.display = 'none';
}

function prefillSA() {
  const id = parseInt(document.getElementById('sa-participant').value);
  const p  = participantStore.find(x => x.id === id);
  if (!p) { document.getElementById('sa-preview').style.display = 'none'; return; }
  document.getElementById('prev-name').textContent = p.first + ' ' + p.last;
  document.getElementById('prev-ndis').textContent = p.ndis;
  document.getElementById('prev-dob').textContent  = p.dob;
  document.getElementById('prev-plan').textContent = p.planEnd || 'Not recorded';
  document.getElementById('sa-preview').style.display = '';
}

function generateSA() {
  const id = parseInt(document.getElementById('sa-participant').value);
  const p  = participantStore.find(x => x.id === id);
  if (!p) { alert('Please select a participant first.'); return; }
  const type  = document.getElementById('sa-type').value;
  const start = document.getElementById('sa-start-date').value;
  const params = new URLSearchParams({ name: p.first+' '+p.last, ndis: p.ndis, dob: p.dob, planEnd: p.planEnd, type, start });
  window.open('sunnyday-sa-sil-cp?' + params.toString(), '_blank');
  closeModal('saModal');
}

function openSABlank() {
  window.open('sunnyday-sa-sil-cp', '_blank');
  closeModal('saModal');
}

// ── Import ────────────────────────────────────────────────────────────────────

let importedRows = [];

function closeImportModal() { closeModal('importModal'); impReset(); }

function impReset() {
  importedRows = [];
  document.getElementById('imp-panel-1').style.display = '';
  document.getElementById('imp-panel-2').style.display = 'none';
  document.getElementById('imp-panel-3').style.display = 'none';
  document.getElementById('imp-back-btn').style.display  = 'none';
  document.getElementById('imp-next-btn').style.display  = 'none';
  document.getElementById('imp-done-btn').style.display  = 'none';
  document.getElementById('imp-file-name').textContent   = '';
  const fi = document.getElementById('csvFileInput');
  if (fi) fi.value = '';
  setImpStep(1);
}

function setImpStep(s) {
  ['imp-step-1','imp-step-2','imp-step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active','done');
    if (i+1 < s) el.classList.add('done');
    else if (i+1 === s) el.classList.add('active');
  });
}

function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').style.borderColor = 'var(--border)';
  document.getElementById('dropZone').style.background  = 'var(--surface-2)';
  const file = e.dataTransfer.files[0];
  if (file) processImportFile(file);
}

function handleFileSelect(input) {
  if (input.files[0]) processImportFile(input.files[0]);
}

function processImportFile(file) {
  document.getElementById('imp-file-name').textContent = file.name;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb   = XLSX.read(e.target.result, { type:'binary' });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval:'' });
      importedRows = data;
      showImportPreview(data);
    } catch(err) {
      alert('Could not parse file. Please use a CSV or XLSX file with the correct column headers.');
    }
  };
  reader.readAsBinaryString(file);
}

function showImportPreview(data) {
  if (!data.length) { alert('No data rows found in file.'); return; }
  const cols   = Object.keys(data[0]);
  const errors = data.filter(r => !r.first_name || !r.last_name);

  document.getElementById('imp-panel-1').style.display = 'none';
  document.getElementById('imp-panel-2').style.display = '';
  document.getElementById('imp-back-btn').style.display = '';
  document.getElementById('imp-next-btn').style.display = '';
  document.getElementById('imp-next-btn').innerHTML = `<i class="ti ti-database-import"></i> Import ${data.length} participants`;

  document.getElementById('imp-summary').innerHTML = `
    <div style="background:var(--sky-light);border:1px solid rgba(46,127,212,0.2);border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--sky-dark)">${data.length}</div><div style="font-size:11px;color:var(--sky-dark)">Rows detected</div></div>
    <div style="background:var(--sage-light);border:1px solid rgba(58,140,110,0.25);border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--sage-dark)">${data.length-errors.length}</div><div style="font-size:11px;color:var(--sage-dark)">Valid rows</div></div>
    <div style="background:${errors.length?'var(--coral-light)':'var(--sage-light)'};border:1px solid ${errors.length?'rgba(224,92,59,0.2)':'rgba(58,140,110,0.25)'};border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:${errors.length?'var(--coral)':'var(--sage-dark)'}">${errors.length}</div><div style="font-size:11px;color:${errors.length?'var(--coral)':'var(--sage-dark)'}">Errors</div></div>
    <div style="background:var(--surface-3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--text-2)">${cols.length}</div><div style="font-size:11px;color:var(--text-3)">Columns</div></div>
  `;

  document.getElementById('imp-preview-head').innerHTML =
    '<tr>' + cols.map(c => `<th style="padding:8px 12px;font-size:11px;text-transform:uppercase;background:var(--surface-2);border-bottom:1px solid var(--border)">${c}</th>`).join('') + '</tr>';
  document.getElementById('imp-preview-body').innerHTML = data.slice(0,10).map(row =>
    '<tr>' + cols.map(c => `<td style="padding:8px 12px;border-bottom:1px solid var(--border)">${row[c]||''}</td>`).join('') + '</tr>'
  ).join('');
  setImpStep(2);
}

function downloadTemplate(format) {
  const headers = ['first_name','last_name','ndis_number','dob','service_type','plan_start','plan_end','cp_provider','disability','guardian_name','guardian_phone','status'];
  const sample  = [['John','Smith','43 123 456 789','15 Mar 1990','sil_cp','1 Jul 2026','30 Jun 2027','sunnyday','Autism Spectrum Disorder','Mary Smith','0412 345 678','active']];
  if (format === 'csv') {
    const blob = new Blob([[headers.join(','), ...sample.map(r => r.join(','))].join('\n')], {type:'text/csv'});
    Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download:'sunnyday-participant-template.csv'}).click();
  } else {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers,...sample]), 'Participants');
    XLSX.writeFile(wb, 'sunnyday-participant-template.xlsx');
  }
}

async function impConfirm() {
  if (!importedRows.length) return;

  const rows = importedRows
    .filter(r => r.first_name && r.last_name)
    .map(r => ({
      first:         r.first_name,
      last:          r.last_name,
      ndis:          r.ndis_number   || '',
      dob:           r.dob           || '',
      gender:        r.gender        || '',
      disability:    r.disability    || '',
      service:       r.service_type  || 'sil_cp',
      cp:            r.cp_provider   || 'sunnyday',
      status:        r.status        || 'onboarding',
      plan_start:    r.plan_start    || '',
      plan_end:      r.plan_end      || '',
      phone:         r.phone         || '',
      email:         r.email         || '',
      address:       r.address       || '',
      guardian:      r.guardian_name || '',
      guardian_rel:  '',
      guardian_phone:r.guardian_phone|| '',
      lac: '', lac_org: '', house_id: null,
    }));

  if (db) {
    const { data, error } = await db.from('participants').insert(rows).select();
    if (error) { alert('Import failed: ' + error.message); return; }
    participantStore.push(...(data || []).map(rowToParticipant));
  } else {
    const maxId = participantStore.length ? Math.max(...participantStore.map(p => p.id)) : 0;
    rows.forEach((r, i) => participantStore.push(rowToParticipant({ id: maxId+i+1, ...r })));
  }

  document.getElementById('imp-panel-2').style.display = 'none';
  document.getElementById('imp-panel-3').style.display = '';
  document.getElementById('imp-next-btn').style.display = 'none';
  document.getElementById('imp-back-btn').style.display = 'none';
  document.getElementById('imp-done-btn').style.display = '';
  document.getElementById('imp-done-title').textContent = `${rows.length} participants imported`;
  document.getElementById('imp-done-sub').textContent   = 'All participants saved with status "Onboarding".';
  setImpStep(3);
  refreshDashboard();
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => { initApp(); });
