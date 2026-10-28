import type {
  Institution,
  Case,
  CaseAction,
  OverlapGroup,
  Alert,
  AuditLog,
  SLAConfig,
  User,
  DashboardStats,
  BureauWorkload,
  AgeingBucket,
  RegionStat,
  MonthlyTrend,
  EvaluationResult,
} from '../types';

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  { id: 'u1', email: 'admin@aicte.gov.in', full_name: 'Rajesh Kumar (Admin)', role: 'Admin', bureau: 'Admin', region: undefined, is_active: true },
  { id: 'u2', email: 'rb.officer@aicte.gov.in', full_name: 'Sunita Sharma', role: 'RB_Officer', bureau: 'RB', region: 'North', is_active: true },
  { id: 'u3', email: 'pgrc.officer@aicte.gov.in', full_name: 'Mohammed Irfan', role: 'PGRC_Officer', bureau: 'PGRC', region: 'South', is_active: true },
  { id: 'u4', email: 'regional.officer@aicte.gov.in', full_name: 'Priya Nair', role: 'Regional_Officer', bureau: 'Regional', region: 'South', is_active: true },
  { id: 'u5', email: 'senior.mgmt@aicte.gov.in', full_name: 'Dr. A.K. Singh', role: 'Senior_Management', bureau: 'Admin', region: undefined, is_active: true },
];

// ─── Institutions ─────────────────────────────────────────────────────────────

export const mockInstitutions: Institution[] = [
  { id: 'i1', aicte_permanent_id: 'AP100001', name: 'Swami Vivekanand Institute of Technology', aliases: ['SVIT', 'Swami Vivekanand Inst of Tech', 'S.V.I.T'], address: '12, NH-8, Surat', region: 'West', state: 'Gujarat', created_at: '2020-01-01' },
  { id: 'i2', aicte_permanent_id: 'AP100002', name: 'National Institute of Engineering and Management', aliases: ['NIEM', 'Natl Inst of Engg & Mgmt', 'National Inst. Engg. Mgmt.'], address: '45, MG Road, Nagpur', region: 'West', state: 'Maharashtra', created_at: '2020-01-01' },
  { id: 'i3', aicte_permanent_id: 'AP100003', name: 'Rajiv Gandhi Institute of Technology', aliases: ['RGIT', 'RGI Tech', 'Rajiv Gandhi Inst. of Tech.'], address: 'Mumbai-Pune Highway, Thane', region: 'West', state: 'Maharashtra', created_at: '2020-01-01' },
  { id: 'i4', aicte_permanent_id: 'AP100004', name: 'Sri Venkateswara College of Engineering', aliases: ['SVCE', 'Sri Venkateswara CE', 'Venkateswara Coll. Engg.'], address: 'Tirupati Road, Chennai', region: 'South', state: 'Tamil Nadu', created_at: '2020-01-01' },
  { id: 'i5', aicte_permanent_id: 'AP100005', name: 'Jawaharlal Nehru Engineering College', aliases: ['JNEC', 'JN Engineering College', 'Jawaharlal Nehru Engg. Coll.'], address: 'N-6, CIDCO, Aurangabad', region: 'West', state: 'Maharashtra', created_at: '2020-01-01' },
  { id: 'i6', aicte_permanent_id: 'AP100006', name: 'Guru Gobind Singh Indraprastha University', aliases: ['GGSIPU', 'IP University', 'GGS IP University'], address: 'Sector 16C, Dwarka, Delhi', region: 'North', state: 'Delhi', created_at: '2020-01-01' },
  { id: 'i7', aicte_permanent_id: 'AP100007', name: 'Maulana Azad National Institute of Technology', aliases: ['MANIT', 'Maulana Azad NIT', 'NIT Bhopal'], address: 'Link Road No.3, Bhopal', region: 'Central', state: 'Madhya Pradesh', created_at: '2020-01-01' },
  { id: 'i8', aicte_permanent_id: 'AP100008', name: 'Birla Institute of Technology and Science', aliases: ['BITS Pilani', 'BITS', 'Birla Inst. Tech. Sci.'], address: 'Vidya Vihar, Pilani', region: 'North', state: 'Rajasthan', created_at: '2020-01-01' },
  { id: 'i9', aicte_permanent_id: 'AP100009', name: 'Amrita Vishwa Vidyapeetham', aliases: ['Amrita University', 'Amrita Vishwa', 'AVV'], address: 'Ettimadai, Coimbatore', region: 'South', state: 'Tamil Nadu', created_at: '2020-01-01' },
  { id: 'i10', aicte_permanent_id: 'AP100010', name: 'Thapar Institute of Engineering and Technology', aliases: ['Thapar University', 'TIET', 'Thapar Inst.'], address: 'Bhadson Road, Patiala', region: 'North', state: 'Punjab', created_at: '2020-01-01' },
  { id: 'i11', aicte_permanent_id: 'AP100011', name: 'Vellore Institute of Technology', aliases: ['VIT', 'VIT Vellore', 'Vellore Inst. of Tech.'], address: 'Vellore, Tamil Nadu', region: 'South', state: 'Tamil Nadu', created_at: '2020-01-01' },
  { id: 'i12', aicte_permanent_id: 'AP100012', name: 'Manipal Academy of Higher Education', aliases: ['Manipal University', 'MAHE', 'Manipal Acad. Higher Edu.'], address: 'Manipal, Udupi', region: 'South', state: 'Karnataka', created_at: '2020-01-01' },
  { id: 'i13', aicte_permanent_id: 'AP100013', name: 'SRM Institute of Science and Technology', aliases: ['SRM University', 'SRMIST', 'SRM Inst. Sci. Tech.'], address: 'Kattankulathur, Chennai', region: 'South', state: 'Tamil Nadu', created_at: '2020-01-01' },
  { id: 'i14', aicte_permanent_id: 'AP100014', name: 'Lovely Professional University', aliases: ['LPU', 'Lovely Profl Univ.', 'Lovely Univ.'], address: 'Jalandhar-Delhi GT Road, Phagwara', region: 'North', state: 'Punjab', created_at: '2020-01-01' },
  { id: 'i15', aicte_permanent_id: 'AP100015', name: 'Kalinga Institute of Industrial Technology', aliases: ['KIIT', 'KIIT University', 'Kalinga Inst. Indl. Tech.'], address: 'Campus-11, KIIT Road, Bhubaneswar', region: 'East', state: 'Odisha', created_at: '2020-01-01' },
  { id: 'i16', aicte_permanent_id: 'AP100016', name: 'Symbiosis International University', aliases: ['SIU', 'Symbiosis Intl. Univ.', 'Symbiosis University'], address: 'Gram Lavale, Mulshi, Pune', region: 'West', state: 'Maharashtra', created_at: '2020-01-01' },
  { id: 'i17', aicte_permanent_id: 'AP100017', name: 'Chandigarh University', aliases: ['CU', 'Chandigarh Univ.', 'CU Gharuan'], address: 'NH-95, Ludhiana-Chandigarh State Highway, Gharuan', region: 'North', state: 'Punjab', created_at: '2020-01-01' },
  { id: 'i18', aicte_permanent_id: 'AP100018', name: 'Savitribai Phule Pune University', aliases: ['SPPU', 'Pune University', 'Savitribai Phule Univ.'], address: 'Ganeshkhind, Pune', region: 'West', state: 'Maharashtra', created_at: '2020-01-01' },
  { id: 'i19', aicte_permanent_id: 'AP100019', name: 'Jadavpur University', aliases: ['JU', 'Jadavpur Univ.', 'Jadavpur U.'], address: '188, Raja S.C. Mallick Road, Kolkata', region: 'East', state: 'West Bengal', created_at: '2020-01-01' },
  { id: 'i20', aicte_permanent_id: 'AP100020', name: 'Anna University', aliases: ['AU Chennai', 'Anna Univ.', 'AU Guindy'], address: 'Sardar Patel Road, Guindy, Chennai', region: 'South', state: 'Tamil Nadu', created_at: '2020-01-01' },
  { id: 'i21', aicte_permanent_id: 'AP100021', name: 'Delhi Technological University', aliases: ['DTU', 'Delhi Tech Univ.', 'Delhi Coll. of Engg.'], address: 'Shahbad Daulatpur, Main Bawana Road, Delhi', region: 'North', state: 'Delhi', created_at: '2020-01-01' },
  { id: 'i22', aicte_permanent_id: 'AP100022', name: 'PSG College of Technology', aliases: ['PSGCT', 'PSG Tech', 'PSG Coll. Tech.'], address: 'Peelamedu, Coimbatore', region: 'South', state: 'Tamil Nadu', created_at: '2020-01-01' },
  { id: 'i23', aicte_permanent_id: 'AP100023', name: 'Institute of Engineering and Technology', aliases: ['IET Lucknow', 'IET', 'Inst. Engg. Tech. Lucknow'], address: 'Site IV, Vikrant Khand, Gomti Nagar, Lucknow', region: 'North', state: 'Uttar Pradesh', created_at: '2020-01-01' },
  { id: 'i24', aicte_permanent_id: 'AP100024', name: 'Assam Engineering College', aliases: ['AEC', 'Assam Engg. Coll.', 'AEC Guwahati'], address: 'Jalukbari, Guwahati', region: 'North-East', state: 'Assam', created_at: '2020-01-01' },
  { id: 'i25', aicte_permanent_id: 'AP100025', name: 'Sardar Vallabhbhai National Institute of Technology', aliases: ['SVNIT', 'NIT Surat', 'SVNIT Surat'], address: 'Surat', region: 'West', state: 'Gujarat', created_at: '2020-01-01' },
];

// ─── Cases ────────────────────────────────────────────────────────────────────

export const mockCases: Case[] = [
  // SVIT (i1) – same issue across RB and PGRC (overlap pair 1)
  { id: 'CMP-2024-0001', institution_id: 'i1', raw_institution_name: 'SVIT Surat', category: 'Fees', description: 'Students allege that SVIT Surat is collecting excess tuition fees beyond the fee fixed by the fee committee, without any justification. Multiple batches affected for the academic year 2023-24.', source: 'Online Portal', date_received: '2024-01-10', current_status: 'Under Process', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Show cause notice issued to institution', next_action: 'Await institution reply', last_action_date: '2024-01-20', expected_disposal_date: '2024-03-10', confidence_score: 0.92, needs_manual_mapping: false, overlap_group_id: 'og1' },
  { id: 'CMP-2024-0002', institution_id: 'i1', raw_institution_name: 'Swami Vivekanand Inst of Tech', category: 'Fees', description: 'Complaint regarding overcharging of fees at Swami Vivekanand Institute. Students report 30% excess collection compared to approved fee structure for 2023-24. Refund demanded.', source: 'Email', date_received: '2024-01-15', current_status: 'Pending', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Complaint received, forwarded to institution', next_action: 'Seek clarification', last_action_date: '2024-01-16', expected_disposal_date: '2024-03-06', confidence_score: 0.87, needs_manual_mapping: false, overlap_group_id: 'og1' },

  // NIEM (i2) – overlap pair 2
  { id: 'CMP-2024-0003', institution_id: 'i2', raw_institution_name: 'NIEM Nagpur', category: 'Faculty', description: 'Faculty shortage at NIEM Nagpur is critical. Several courses are running without qualified faculty. Students have been complaining about substandard teaching and poor lab facilities.', source: 'Post', date_received: '2024-01-18', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Case registered', next_action: 'Site inspection', last_action_date: '2024-01-18', expected_disposal_date: '2024-03-15', confidence_score: 0.91, needs_manual_mapping: false, overlap_group_id: 'og2' },
  { id: 'CMP-2024-0004', institution_id: 'i2', raw_institution_name: 'Natl Inst of Engg & Mgmt', category: 'Faculty', description: 'Inadequate qualified faculty at National Institute of Engineering & Management. Classes frequently cancelled. Lab sessions not being conducted. Student progress severely impacted.', source: 'Online Portal', date_received: '2024-01-22', current_status: 'Under Process', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Notice sent to institution', next_action: 'Review institution reply', last_action_date: '2024-02-01', expected_disposal_date: '2024-03-15', confidence_score: 0.85, needs_manual_mapping: false, overlap_group_id: 'og2' },

  // RGIT (i3)
  { id: 'CMP-2024-0005', institution_id: 'i3', raw_institution_name: 'Rajiv Gandhi Inst. of Tech. Thane', category: 'Infrastructure', description: 'Laboratory equipment at Rajiv Gandhi Institute of Technology is outdated and non-functional. Students cannot complete practical sessions. Multiple departments affected.', source: 'Online Portal', date_received: '2024-02-01', current_status: 'Escalated', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Escalated to Director', next_action: 'Director review', last_action_date: '2024-02-20', expected_disposal_date: '2024-03-20', confidence_score: 0.88, needs_manual_mapping: false, overlap_group_id: null },

  // SVCE (i4)
  { id: 'CMP-2024-0006', institution_id: 'i4', raw_institution_name: 'Sri Venkateswara CE', category: 'Accreditation', description: 'Sri Venkateswara College of Engineering showing false accreditation status to students. NBA accreditation expired but still being used in brochures.', source: 'Email', date_received: '2024-02-05', current_status: 'Disposed', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Case closed after verification', next_action: 'None', last_action_date: '2024-03-01', expected_disposal_date: '2024-04-05', confidence_score: 0.95, needs_manual_mapping: false, overlap_group_id: null },

  // JNEC (i5)
  { id: 'CMP-2024-0007', institution_id: 'i5', raw_institution_name: 'JNEC Aurangabad', category: 'Admission', description: 'Irregular admission process at JNEC Aurangabad. Management quota seats being sold at premium amounts. Students without merit being admitted over qualified candidates.', source: 'Walk-in', date_received: '2024-02-10', current_status: 'Under Process', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Documents sought from institution', next_action: 'Analyse admission data', last_action_date: '2024-02-25', expected_disposal_date: '2024-04-10', confidence_score: 0.9, needs_manual_mapping: false, overlap_group_id: null },

  // GGSIPU (i6) – overlap pair 3
  { id: 'CMP-2024-0008', institution_id: 'i6', raw_institution_name: 'IP University Delhi', category: 'Examination', description: 'Students of Guru Gobind Singh Indraprastha University report mass failure in revaluation results. Discrepancies between original marks and revaluation marks suggest systemic error.', source: 'Online Portal', date_received: '2024-02-12', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Case registered', next_action: 'Seek examination data', last_action_date: '2024-02-12', expected_disposal_date: '2024-04-03', confidence_score: 0.89, needs_manual_mapping: false, overlap_group_id: 'og3' },
  { id: 'CMP-2024-0009', institution_id: 'i6', raw_institution_name: 'GGS IP University', category: 'Examination', description: 'Complaint against GGSIPU for irregularities in revaluation. Answer sheets being reportedly lost. Students have been waiting 6 months for results. University administration unresponsive.', source: 'Email', date_received: '2024-02-18', current_status: 'Pending', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Case logged', next_action: 'Contact university', last_action_date: '2024-02-18', expected_disposal_date: '2024-04-10', confidence_score: 0.82, needs_manual_mapping: false, overlap_group_id: 'og3' },

  // MANIT (i7)
  { id: 'CMP-2024-0010', institution_id: 'i7', raw_institution_name: 'NIT Bhopal', category: 'Harassment', description: 'Senior students at MANIT Bhopal are conducting ragging despite zero-tolerance policy. Several first-year students have complained. Institute administration has been inactive.', source: 'Helpline', date_received: '2024-02-20', current_status: 'Escalated', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Anti-ragging committee activated', next_action: 'FIR status check', last_action_date: '2024-03-01', expected_disposal_date: '2024-03-22', confidence_score: 0.93, needs_manual_mapping: false, overlap_group_id: null },

  // BITS (i8)
  { id: 'CMP-2024-0011', institution_id: 'i8', raw_institution_name: 'BITS Pilani', category: 'Fees', description: 'Complaint regarding BITS Pilani charging students for non-existent facilities. Hostel facilities are substandard but hostel fees have been raised by 40%. No prior notice given.', source: 'Online Portal', date_received: '2024-02-25', current_status: 'Under Process', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Institution asked to submit fee justification', next_action: 'Review submission', last_action_date: '2024-03-05', expected_disposal_date: '2024-04-25', confidence_score: 0.96, needs_manual_mapping: false, overlap_group_id: null },

  // Amrita (i9)
  { id: 'CMP-2024-0012', institution_id: 'i9', raw_institution_name: 'Amrita Vishwa', category: 'Accreditation', description: 'Amrita Vishwa Vidyapeetham departments not maintaining NBA accreditation requirements. Faculty publications and student-faculty ratio do not match submitted reports.', source: 'Email', date_received: '2024-03-01', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Documents requested', next_action: 'Physical verification', last_action_date: '2024-03-01', expected_disposal_date: '2024-04-15', confidence_score: 0.88, needs_manual_mapping: false, overlap_group_id: null },

  // Thapar (i10)
  { id: 'CMP-2024-0013', institution_id: 'i10', raw_institution_name: 'Thapar Inst. Patiala', category: 'Faculty', description: 'Thapar Institute of Engineering and Technology is employing faculty without requisite qualifications. Several professors do not hold PhD degrees as required by AICTE norms.', source: 'Walk-in', date_received: '2024-03-03', current_status: 'Under Process', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Faculty qualification data requested', next_action: 'Validate credentials', last_action_date: '2024-03-12', expected_disposal_date: '2024-04-24', confidence_score: 0.9, needs_manual_mapping: false, overlap_group_id: null },

  // VIT (i11) – overlap pair 4
  { id: 'CMP-2024-0014', institution_id: 'i11', raw_institution_name: 'VIT Vellore', category: 'Fees', description: 'VIT Vellore has introduced new compulsory fee components not approved by fee regulation committee. Students forced to pay for insurance, activity fund and exam fees collectively amounting to Rs.45,000 extra per year.', source: 'Online Portal', date_received: '2024-03-05', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Complaint acknowledged', next_action: 'Formal notice to institution', last_action_date: '2024-03-05', expected_disposal_date: '2024-04-19', confidence_score: 0.94, needs_manual_mapping: false, overlap_group_id: 'og4' },
  { id: 'CMP-2024-0015', institution_id: 'i11', raw_institution_name: 'Vellore Inst. of Tech.', category: 'Fees', description: 'Excess fee collection at Vellore Institute of Technology. Institution collecting additional charges not part of approved fee structure. Multiple students paid unapproved amounts totalling nearly Rs.40,000-50,000 per student.', source: 'Email', date_received: '2024-03-10', current_status: 'Pending', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Case registered', next_action: 'Coordinate with RB', last_action_date: '2024-03-10', expected_disposal_date: '2024-04-24', confidence_score: 0.86, needs_manual_mapping: false, overlap_group_id: 'og4' },

  // Manipal (i12)
  { id: 'CMP-2024-0016', institution_id: 'i12', raw_institution_name: 'Manipal Acad. Higher Edu.', category: 'Admission', description: 'Manipal Academy of Higher Education admitting students through unauthorised agents. Agents charging up to Rs.2 lakh as donation for management seats. Students not getting promised branch allocation.', source: 'Online Portal', date_received: '2024-03-12', current_status: 'Pending', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Complaint logged', next_action: 'Seek admission records', last_action_date: '2024-03-12', expected_disposal_date: '2024-04-12', confidence_score: 0.87, needs_manual_mapping: false, overlap_group_id: null },

  // SRM (i13)
  { id: 'CMP-2024-0017', institution_id: 'i13', raw_institution_name: 'SRM Inst. Sci. Tech.', category: 'Infrastructure', description: 'SRM Institute of Science and Technology - Kattankulathur campus - has non-functional computing labs. Systems are 10+ years old. Students cannot complete programming assignments. Wi-Fi connectivity extremely poor.', source: 'Post', date_received: '2024-03-15', current_status: 'Transferred', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Transferred to Regional Office for inspection', next_action: 'Regional office inspection', last_action_date: '2024-03-22', expected_disposal_date: '2024-04-15', confidence_score: 0.91, needs_manual_mapping: false, overlap_group_id: null },

  // LPU (i14)
  { id: 'CMP-2024-0018', institution_id: 'i14', raw_institution_name: 'Lovely Profl Univ.', category: 'Examination', description: 'Lovely Professional University – students report paper leaks in internal examinations. Same question papers being circulated in advance. Investigation demanded. Several departments suspected.', source: 'Online Portal', date_received: '2024-03-18', current_status: 'Under Process', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Evidence collection in progress', next_action: 'Committee review', last_action_date: '2024-03-28', expected_disposal_date: '2024-04-08', confidence_score: 0.88, needs_manual_mapping: false, overlap_group_id: null },

  // KIIT (i15)
  { id: 'CMP-2024-0019', institution_id: 'i15', raw_institution_name: 'KIIT Bhubaneswar', category: 'Harassment', description: 'Reports of hostel curfew violations and mental harassment at KIIT University. Students below 21 being subjected to invasive personal checks. CCTV installed in prohibited areas.', source: 'Email', date_received: '2024-03-20', current_status: 'Pending', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Case acknowledged', next_action: 'Fact-finding committee', last_action_date: '2024-03-20', expected_disposal_date: '2024-04-10', confidence_score: 0.89, needs_manual_mapping: false, overlap_group_id: null },

  // Needs manual mapping
  { id: 'CMP-2024-0020', institution_id: null, raw_institution_name: 'Global Inst. Mgmt Tech Hyd', category: 'Fees', description: 'Students complaining about excess fee collection and no refund policy at this institute in Hyderabad.', source: 'Online Portal', date_received: '2024-03-22', current_status: 'Pending', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Needs institution mapping', next_action: 'Manual mapping required', last_action_date: '2024-03-22', expected_disposal_date: '2024-04-20', confidence_score: 0.42, needs_manual_mapping: true, overlap_group_id: null },

  // SIU (i16)
  { id: 'CMP-2024-0021', institution_id: 'i16', raw_institution_name: 'Symbiosis Intl. Univ.', category: 'Faculty', description: 'Symbiosis International University using guest faculty for core subjects across multiple semesters. Adjunct professors teaching 70% of contact hours in violation of AICTE staffing norms.', source: 'Walk-in', date_received: '2024-03-25', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Case registered', next_action: 'Faculty data request', last_action_date: '2024-03-25', expected_disposal_date: '2024-05-09', confidence_score: 0.92, needs_manual_mapping: false, overlap_group_id: null },

  // Chandigarh U (i17)
  { id: 'CMP-2024-0022', institution_id: 'i17', raw_institution_name: 'Chandigarh Univ. Gharuan', category: 'Admission', description: 'Chandigarh University conducting lateral entry admission without proper eligibility verification. Diploma holders admitted to third semester without AICTE mandated NOC.', source: 'Email', date_received: '2024-03-28', current_status: 'Under Process', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Admission records sought', next_action: 'Verify eligibility certificates', last_action_date: '2024-04-05', expected_disposal_date: '2024-05-12', confidence_score: 0.91, needs_manual_mapping: false, overlap_group_id: null },

  // SPPU (i18)
  { id: 'CMP-2024-0023', institution_id: 'i18', raw_institution_name: 'Pune University', category: 'Accreditation', description: 'Savitribai Phule Pune University affiliated colleges misrepresenting NAAC grade. Grade A colleges promoting themselves as A+ without valid NAAC certification for the current cycle.', source: 'Online Portal', date_received: '2024-04-01', current_status: 'Pending', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Complaint registered', next_action: 'Contact NAAC for verification', last_action_date: '2024-04-01', expected_disposal_date: '2024-04-22', confidence_score: 0.84, needs_manual_mapping: false, overlap_group_id: null },

  // Jadavpur (i19)
  { id: 'CMP-2024-0024', institution_id: 'i19', raw_institution_name: 'Jadavpur Univ.', category: 'Infrastructure', description: 'Jadavpur University hostels are in a dilapidated condition. Structural safety concerns raised after partial ceiling collapse in Hostel Block D. CPWD inspection report not shared.', source: 'Post', date_received: '2024-04-03', current_status: 'Escalated', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Escalated due to safety concerns', next_action: 'Emergency safety inspection', last_action_date: '2024-04-05', expected_disposal_date: '2024-04-24', confidence_score: 0.95, needs_manual_mapping: false, overlap_group_id: null },

  // Anna Uni (i20)
  { id: 'CMP-2024-0025', institution_id: 'i20', raw_institution_name: 'AU Guindy Chennai', category: 'Examination', description: 'Anna University – large-scale discrepancies in marks entry for November 2023 examination. Students scoring below passing marks in marksheet but topper lists show higher scores. Tabulation error suspected.', source: 'Online Portal', date_received: '2024-04-05', current_status: 'Under Process', assigned_bureau: 'PGRC', assigned_officer: 'Mohammed Irfan', last_action: 'Data obtained from controller of examinations', next_action: 'Statistical analysis', last_action_date: '2024-04-10', expected_disposal_date: '2024-04-26', confidence_score: 0.88, needs_manual_mapping: false, overlap_group_id: null },

  // DTU (i21)
  { id: 'CMP-2024-0026', institution_id: 'i21', raw_institution_name: 'Delhi Tech Univ.', category: 'Fees', description: 'Delhi Technological University collecting advance fees for next year before current academic year ends. No refund policy stated. Parents object to forced advance collection without institutional transparency.', source: 'Email', date_received: '2024-04-08', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Complaint acknowledged', next_action: 'Issue notice', last_action_date: '2024-04-08', expected_disposal_date: '2024-05-23', confidence_score: 0.93, needs_manual_mapping: false, overlap_group_id: null },

  // PSGCT (i22)
  { id: 'CMP-2024-0027', institution_id: 'i22', raw_institution_name: 'PSG Tech Coimbatore', category: 'Faculty', description: 'PSG College of Technology – visiting faculty not meeting AICTE qualification norms being assigned core course work. PhD requirement being waived without proper justification.', source: 'Walk-in', date_received: '2024-04-10', current_status: 'Disposed', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Disposed after verification – faculty qualifications found adequate', next_action: 'None', last_action_date: '2024-04-20', expected_disposal_date: '2024-05-25', confidence_score: 0.92, needs_manual_mapping: false, overlap_group_id: null },

  // IET Lucknow (i23)
  { id: 'CMP-2024-0028', institution_id: 'i23', raw_institution_name: 'IET Lucknow', category: 'Admission', description: 'Institute of Engineering and Technology Lucknow not following state counselling for admission. Directly admitting students for CSE through their own process bypassing UP state quota norms.', source: 'Online Portal', date_received: '2024-04-12', current_status: 'Pending', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Case registered', next_action: 'Obtain admission data', last_action_date: '2024-04-12', expected_disposal_date: '2024-05-03', confidence_score: 0.9, needs_manual_mapping: false, overlap_group_id: null },

  // AEC (i24)
  { id: 'CMP-2024-0029', institution_id: 'i24', raw_institution_name: 'Assam Engg. Coll. Guwahati', category: 'Infrastructure', description: 'Assam Engineering College – power backup system failed. During monsoon season, frequent outages halted laboratory work. UPS systems non-functional. Generator fuel pilferage suspected.', source: 'Post', date_received: '2024-04-15', current_status: 'Under Process', assigned_bureau: 'Regional', assigned_officer: 'Priya Nair', last_action: 'Site visit scheduled', next_action: 'Inspection report', last_action_date: '2024-04-20', expected_disposal_date: '2024-05-06', confidence_score: 0.87, needs_manual_mapping: false, overlap_group_id: null },

  // SVNIT (i25)
  { id: 'CMP-2024-0030', institution_id: 'i25', raw_institution_name: 'SVNIT Surat', category: 'Accreditation', description: 'Sardar Vallabhbhai NIT Surat – departments claiming ABET accreditation in promotional materials without valid ABET certificate for engineering programmes. Misleading information on website.', source: 'Email', date_received: '2024-04-18', current_status: 'Pending', assigned_bureau: 'RB', assigned_officer: 'Sunita Sharma', last_action: 'Website snapshot archived', next_action: 'Contact ABET India coordinator', last_action_date: '2024-04-18', expected_disposal_date: '2024-05-03', confidence_score: 0.95, needs_manual_mapping: false, overlap_group_id: null },
];

// ─── Case Actions ─────────────────────────────────────────────────────────────

export const mockCaseActions: Record<string, CaseAction[]> = {
  'CMP-2024-0001': [
    { id: 'ca1', case_id: 'CMP-2024-0001', action_type: 'Created', from_bureau: null, to_bureau: 'RB', officer: 'Sunita Sharma', remarks: 'Complaint received and registered', document_url: null, timestamp: '2024-01-10T09:00:00Z' },
    { id: 'ca2', case_id: 'CMP-2024-0001', action_type: 'Notice Issued', from_bureau: 'RB', to_bureau: null, officer: 'Sunita Sharma', remarks: 'Show cause notice issued to SVIT Surat. Reply expected within 30 days.', document_url: '/docs/notice_svit_2024.pdf', timestamp: '2024-01-20T11:30:00Z' },
    { id: 'ca3', case_id: 'CMP-2024-0001', action_type: 'Overlap Detected', from_bureau: null, to_bureau: null, officer: 'System', remarks: 'Overlap detected with CMP-2024-0002 (PGRC). Text similarity 83%, same category.', document_url: null, timestamp: '2024-01-22T08:00:00Z' },
  ],
  'CMP-2024-0002': [
    { id: 'ca4', case_id: 'CMP-2024-0002', action_type: 'Created', from_bureau: null, to_bureau: 'PGRC', officer: 'Mohammed Irfan', remarks: 'Complaint received via email', document_url: null, timestamp: '2024-01-15T10:15:00Z' },
    { id: 'ca5', case_id: 'CMP-2024-0002', action_type: 'Forwarded', from_bureau: 'PGRC', to_bureau: null, officer: 'Mohammed Irfan', remarks: 'Complaint details forwarded to institution for response', document_url: null, timestamp: '2024-01-16T14:00:00Z' },
  ],
  'CMP-2024-0005': [
    { id: 'ca6', case_id: 'CMP-2024-0005', action_type: 'Created', from_bureau: null, to_bureau: 'Regional', officer: 'Priya Nair', remarks: 'Complaint about lab infrastructure received', document_url: null, timestamp: '2024-02-01T09:00:00Z' },
    { id: 'ca7', case_id: 'CMP-2024-0005', action_type: 'Escalated', from_bureau: 'Regional', to_bureau: 'RB', officer: 'Priya Nair', remarks: 'Escalated to Regional Director due to severity and repeated non-compliance', document_url: '/docs/escalation_rgit.pdf', timestamp: '2024-02-20T10:00:00Z' },
  ],
};

// ─── Overlap Groups ───────────────────────────────────────────────────────────

export const mockOverlapGroups: OverlapGroup[] = [
  {
    id: 'og1',
    institution_id: 'i1',
    institution_name: 'Swami Vivekanand Institute of Technology',
    case_ids: ['CMP-2024-0001', 'CMP-2024-0002'],
    similarity_score: 0.83,
    reasons: [
      'Same institution (SVIT Surat)',
      'Same category: Fees',
      'Text similarity: 83%',
      'Cases raised 5 days apart',
      'Both describe excess fee collection for 2023-24',
    ],
    status: 'Open',
    lead_bureau: null,
    created_at: '2024-01-22T08:00:00Z',
    notes: [
      { id: 'on1', group_id: 'og1', author: 'Sunita Sharma', author_role: 'RB_Officer', text: 'I have already issued a show-cause notice. PGRC should hold action until RB gets institution reply.', timestamp: '2024-01-23T10:00:00Z' },
    ],
  },
  {
    id: 'og2',
    institution_id: 'i2',
    institution_name: 'National Institute of Engineering and Management',
    case_ids: ['CMP-2024-0003', 'CMP-2024-0004'],
    similarity_score: 0.78,
    reasons: [
      'Same institution (NIEM Nagpur)',
      'Same category: Faculty',
      'Text similarity: 78%',
      'Cases raised 4 days apart',
      'Both describe lack of qualified faculty',
    ],
    status: 'Linked',
    lead_bureau: 'RB',
    created_at: '2024-01-25T08:00:00Z',
    notes: [
      { id: 'on2', group_id: 'og2', author: 'Sunita Sharma', author_role: 'RB_Officer', text: 'RB will lead investigation. PGRC to share all evidence gathered.', timestamp: '2024-01-26T09:00:00Z' },
      { id: 'on3', group_id: 'og2', author: 'Mohammed Irfan', author_role: 'PGRC_Officer', text: 'Understood. Sharing our case file with RB. Student testimonies attached.', timestamp: '2024-01-27T11:30:00Z' },
    ],
  },
  {
    id: 'og3',
    institution_id: 'i6',
    institution_name: 'Guru Gobind Singh Indraprastha University',
    case_ids: ['CMP-2024-0008', 'CMP-2024-0009'],
    similarity_score: 0.71,
    reasons: [
      'Same institution (IP University Delhi)',
      'Same category: Examination',
      'Text similarity: 71%',
      'Cases raised 6 days apart',
      'Both relate to revaluation irregularities',
    ],
    status: 'Open',
    lead_bureau: null,
    created_at: '2024-02-20T08:00:00Z',
    notes: [],
  },
  {
    id: 'og4',
    institution_id: 'i11',
    institution_name: 'Vellore Institute of Technology',
    case_ids: ['CMP-2024-0014', 'CMP-2024-0015'],
    similarity_score: 0.88,
    reasons: [
      'Same institution (VIT Vellore)',
      'Same category: Fees',
      'Text similarity: 88%',
      'Cases raised 5 days apart',
      'Both describe unapproved fee components of ~Rs.40-50k',
    ],
    status: 'Open',
    lead_bureau: null,
    created_at: '2024-03-12T08:00:00Z',
    notes: [],
  },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const mockAlerts: Alert[] = [
  { id: 'al1', type: 'Overlap', case_id: 'CMP-2024-0001', group_id: 'og1', target_role: 'RB_Officer', message: 'Potential Overlapping Cases – Coordination Required: SVIT Surat (CMP-2024-0001 & CMP-2024-0002)', is_read: false, created_at: '2024-01-22T08:00:00Z' },
  { id: 'al2', type: 'Overlap', case_id: 'CMP-2024-0002', group_id: 'og1', target_role: 'PGRC_Officer', message: 'Potential Overlapping Cases – Coordination Required: SVIT Surat (CMP-2024-0001 & CMP-2024-0002)', is_read: true, created_at: '2024-01-22T08:00:00Z' },
  { id: 'al3', type: 'SLA', case_id: 'CMP-2024-0002', group_id: null, target_role: 'PGRC_Officer', message: 'SLA Breach: CMP-2024-0002 (SVIT – Fees) exceeded 21-day PGRC SLA. Currently Pending.', is_read: false, created_at: '2024-02-06T08:00:00Z' },
  { id: 'al4', type: 'Escalation', case_id: 'CMP-2024-0005', group_id: null, target_role: 'Senior_Management', message: 'Case Escalated: CMP-2024-0005 (RGIT – Infrastructure) escalated by Regional Office. Review required.', is_read: false, created_at: '2024-02-20T10:00:00Z' },
  { id: 'al5', type: 'Overlap', case_id: 'CMP-2024-0008', group_id: 'og3', target_role: 'RB_Officer', message: 'Potential Overlapping Cases – Coordination Required: IP University (CMP-2024-0008 & CMP-2024-0009)', is_read: false, created_at: '2024-02-20T08:00:00Z' },
  { id: 'al6', type: 'Pending', case_id: 'CMP-2024-0020', group_id: null, target_role: 'Admin', message: 'Manual Mapping Required: CMP-2024-0020 – institution "Global Inst. Mgmt Tech Hyd" could not be resolved (confidence 42%). Admin action needed.', is_read: false, created_at: '2024-03-22T08:00:00Z' },
  { id: 'al7', type: 'SLA', case_id: 'CMP-2024-0010', group_id: null, target_role: 'PGRC_Officer', message: 'SLA Approaching: CMP-2024-0010 (MANIT – Harassment) approaches 21-day deadline in 2 days.', is_read: true, created_at: '2024-03-11T08:00:00Z' },
  { id: 'al8', type: 'Overlap', case_id: 'CMP-2024-0014', group_id: 'og4', target_role: 'RB_Officer', message: 'Potential Overlapping Cases – Coordination Required: VIT Vellore (CMP-2024-0014 & CMP-2024-0015)', is_read: false, created_at: '2024-03-12T08:00:00Z' },
];

// ─── SLA Configs ──────────────────────────────────────────────────────────────

export const mockSLAConfigs: SLAConfig[] = [
  { id: 'sla1', bureau: 'RB', category: null, days: 45 },
  { id: 'sla2', bureau: 'PGRC', category: null, days: 21 },
  { id: 'sla3', bureau: 'Regional', category: null, days: 30 },
  { id: 'sla4', bureau: 'RB', category: 'Harassment', days: 15 },
  { id: 'sla5', bureau: 'PGRC', category: 'Harassment', days: 10 },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  total: 200,
  pending: 84,
  under_process: 52,
  disposed: 38,
  transferred: 12,
  escalated: 14,
  past_sla: 23,
  overlap_groups_open: 3,
};

export const mockBureauWorkload: BureauWorkload[] = [
  { bureau: 'RB', pending: 32, under_process: 18, disposed: 15, escalated: 5 },
  { bureau: 'PGRC', pending: 28, under_process: 20, disposed: 14, escalated: 6 },
  { bureau: 'Regional', pending: 24, under_process: 14, disposed: 9, escalated: 3 },
];

export const mockAgeingBuckets: AgeingBucket[] = [
  { bucket: '0-15 days', count: 38 },
  { bucket: '16-30 days', count: 29 },
  { bucket: '31-60 days', count: 41 },
  { bucket: '60+ days', count: 30 },
];

export const mockRegionStats: RegionStat[] = [
  { region: 'North', count: 52 },
  { region: 'South', count: 61 },
  { region: 'East', count: 24 },
  { region: 'West', count: 45 },
  { region: 'Central', count: 12 },
  { region: 'North-East', count: 6 },
];

export const mockMonthlyTrend: MonthlyTrend[] = [
  { month: 'Oct 23', received: 14, disposed: 10 },
  { month: 'Nov 23', received: 18, disposed: 12 },
  { month: 'Dec 23', received: 11, disposed: 9 },
  { month: 'Jan 24', received: 22, disposed: 14 },
  { month: 'Feb 24', received: 24, disposed: 16 },
  { month: 'Mar 24', received: 28, disposed: 18 },
  { month: 'Apr 24', received: 20, disposed: 10 },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const mockAuditLogs: AuditLog[] = [
  { id: 'aul1', user: 'Sunita Sharma', action: 'STATUS_CHANGE', entity: 'Case', entity_id: 'CMP-2024-0001', before_state: { status: 'Pending' }, after_state: { status: 'Under Process' }, timestamp: '2024-01-20T11:30:00Z' },
  { id: 'aul2', user: 'Mohammed Irfan', action: 'OVERLAP_LINK', entity: 'OverlapGroup', entity_id: 'og2', before_state: { status: 'Open', lead_bureau: null }, after_state: { status: 'Linked', lead_bureau: 'RB' }, timestamp: '2024-01-26T09:00:00Z' },
  { id: 'aul3', user: 'Priya Nair', action: 'STATUS_CHANGE', entity: 'Case', entity_id: 'CMP-2024-0005', before_state: { status: 'Under Process' }, after_state: { status: 'Escalated' }, timestamp: '2024-02-20T10:00:00Z' },
  { id: 'aul4', user: 'Sunita Sharma', action: 'STATUS_CHANGE', entity: 'Case', entity_id: 'CMP-2024-0006', before_state: { status: 'Under Process' }, after_state: { status: 'Disposed' }, timestamp: '2024-03-01T14:00:00Z' },
];

// ─── Evaluation Results ───────────────────────────────────────────────────────

export const mockEvaluationResult: EvaluationResult = {
  precision: 0.875,
  recall: 0.824,
  f1: 0.849,
  true_positives: 14,
  false_positives: 2,
  false_negatives: 3,
  pair_details: [
    { case_a: 'CMP-2024-0001', case_b: 'CMP-2024-0002', predicted: true, actual: true, score: 0.83, reasons: ['Same institution', 'Same category: Fees', 'Text similarity 83%', '5 days apart'] },
    { case_a: 'CMP-2024-0003', case_b: 'CMP-2024-0004', predicted: true, actual: true, score: 0.78, reasons: ['Same institution', 'Same category: Faculty', 'Text similarity 78%', '4 days apart'] },
    { case_a: 'CMP-2024-0008', case_b: 'CMP-2024-0009', predicted: true, actual: true, score: 0.71, reasons: ['Same institution', 'Same category: Examination', 'Text similarity 71%', '6 days apart'] },
    { case_a: 'CMP-2024-0014', case_b: 'CMP-2024-0015', predicted: true, actual: true, score: 0.88, reasons: ['Same institution', 'Same category: Fees', 'Text similarity 88%', '5 days apart'] },
    { case_a: 'CMP-2024-0001', case_b: 'CMP-2024-0011', predicted: false, actual: false, score: 0.31, reasons: ['Different institution', 'Same category: Fees', 'Text similarity 31%', '46 days apart'] },
    { case_a: 'CMP-2024-0005', case_b: 'CMP-2024-0017', predicted: false, actual: false, score: 0.29, reasons: ['Different institution', 'Same category: Infrastructure', 'Text similarity 29%'] },
    { case_a: 'CMP-2024-0006', case_b: 'CMP-2024-0012', predicted: false, actual: true, score: 0.48, reasons: ['Different institution', 'Same category: Accreditation', 'Text similarity 48%'] },
  ],
};
