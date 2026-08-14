const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'securelife_crm';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '1234';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

async function seed() {
  // 1. Connect to default postgres DB to ensure target database exists
  const rootPool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres',
  });

  try {
    const res = await rootPool.query(`SELECT 1 FROM pg_database WHERE datname = $1;`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
      await rootPool.query(`CREATE DATABASE ${dbName};`);
      console.log(`Database '${dbName}' created successfully.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await rootPool.end();
  }

  // 2. Connect to securelife_crm database
  const targetPool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
  });

  try {
    console.log('Running schema DDL...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../config/schema.sql'), 'utf-8');
    await targetPool.query(schemaSql);
    console.log('Schema DDL executed successfully.');

    // 3. Seed Master Benefits (Expanded List)
    console.log('Seeding expanded master benefits...');
    const masterBenefits = [
      { name: 'Comprehensive Death Benefit', description: 'Guaranteed lump sum payout to legal beneficiaries upon death.', category: 'Core' },
      { name: 'Critical Illness Shield', description: 'Up to $100k payout upon diagnosis of 36 covered critical illnesses.', category: 'Health' },
      { name: 'Hospitalization Cash Benefit', description: '$200 daily stipend during hospital stays.', category: 'Health' },
      { name: 'Accidental Disability Cover', description: 'Full coverage payout for accidental permanent disability.', category: 'Accident' },
      { name: 'Tax Savings Certificate', description: 'Eligible for maximum tax deduction under Insurance Act.', category: 'Tax' },
      { name: '24/7 Global Concierge', description: 'Global emergency medical advice and travel concierge service.', category: 'Service' },
      { name: 'Cashless Network Hospitalization', description: 'Direct billing across 12,000+ accredited network hospitals.', category: 'Health' },
      { name: 'Worldwide Emergency Cover', description: 'International medical repatriation and emergency evacuation.', category: 'Travel' },
      { name: 'Waiver of Premium Benefit', description: 'Waives future premiums if policyholder suffers total disability.', category: 'Protection' },
      { name: 'Terminal Illness Advance Payout', description: '100% advance payout upon terminal illness diagnosis.', category: 'Core' },
      { name: 'Annual Health Checkup Voucher', description: 'Complimentary full-body preventative health screening annually.', category: 'Wellness' },
    ];

    const benefitMap = {};
    for (const b of masterBenefits) {
      const res = await targetPool.query(
        `INSERT INTO benefits (name, description, category) VALUES ($1, $2, $3) RETURNING id, name;`,
        [b.name, b.description, b.category]
      );
      benefitMap[b.name] = res.rows[0].id;
    }

    // 4. Seed Insurance Plans
    console.log('Seeding insurance plans...');
    const plansData = [
      {
        name: 'Basic Term Protection',
        slug: 'basic-term-protection',
        description: 'Affordable essential life cover for young individuals and budget-conscious applicants.',
        minAge: 18,
        maxAge: 55,
        minCoverage: 50000,
        maxCoverage: 250000,
        minPolicyTerm: 5,
        maxPolicyTerm: 20,
        minPremium: 30,
        maxPremium: 120,
        eligibilityDescription: 'Simple health declaration required.',
        benefits: ['Comprehensive Death Benefit', 'Tax Savings Certificate', 'Terminal Illness Advance Payout'],
      },
      {
        name: 'Gold Family Shield',
        slug: 'gold-family-shield',
        description: 'Comprehensive mid-tier protection tailored for growing families with critical illness cover.',
        minAge: 21,
        maxAge: 60,
        minCoverage: 100000,
        maxCoverage: 750000,
        minPolicyTerm: 10,
        maxPolicyTerm: 30,
        minPremium: 75,
        maxPremium: 350,
        eligibilityDescription: 'Standard medical health checkup for coverage over $500k.',
        benefits: ['Comprehensive Death Benefit', 'Critical Illness Shield', 'Hospitalization Cash Benefit', 'Tax Savings Certificate', 'Cashless Network Hospitalization', 'Waiver of Premium Benefit', 'Annual Health Checkup Voucher'],
      },
      {
        name: 'Platinum Legacy Wealth',
        slug: 'platinum-legacy-wealth',
        description: 'High-value executive policy providing maximum wealth protection and 24/7 global coverage.',
        minAge: 25,
        maxAge: 65,
        minCoverage: 500000,
        maxCoverage: 2000000,
        minPolicyTerm: 15,
        maxPolicyTerm: 35,
        minPremium: 250,
        maxPremium: 1200,
        eligibilityDescription: 'Full medical examination and financial underwriting required.',
        benefits: ['Comprehensive Death Benefit', 'Critical Illness Shield', 'Hospitalization Cash Benefit', 'Accidental Disability Cover', 'Tax Savings Certificate', '24/7 Global Concierge', 'Cashless Network Hospitalization', 'Worldwide Emergency Cover', 'Waiver of Premium Benefit', 'Terminal Illness Advance Payout', 'Annual Health Checkup Voucher'],
      },
    ];

    const planIdMap = {};
    for (const p of plansData) {
      const planRes = await targetPool.query(
        `INSERT INTO insurance_plans (name, slug, description, min_age, max_age, min_coverage, max_coverage, min_policy_term, max_policy_term, min_premium, max_premium, eligibility_description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id;`,
        [p.name, p.slug, p.description, p.minAge, p.maxAge, p.minCoverage, p.maxCoverage, p.minPolicyTerm, p.maxPolicyTerm, p.minPremium, p.maxPremium, p.eligibilityDescription]
      );
      const planId = planRes.rows[0].id;
      planIdMap[p.slug] = planId;

      for (const benName of Object.keys(benefitMap)) {
        const benefitId = benefitMap[benName];
        const isIncluded = p.benefits.includes(benName);
        await targetPool.query(
          `INSERT INTO plan_benefits (plan_id, benefit_id, is_included) VALUES ($1, $2, $3);`,
          [planId, benefitId, isIncluded]
        );
      }
    }

    // 5. Seed Users (Admin & 5 Advisors)
    console.log('Seeding system users (Admin & Advisors)...');
    const adminRole = await targetPool.query(`SELECT id FROM roles WHERE name = 'ADMIN';`);
    const advisorRole = await targetPool.query(`SELECT id FROM roles WHERE name = 'ADVISOR';`);
    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

    const adminRes = await targetPool.query(
      `INSERT INTO users (role_id, first_name, last_name, email, password_hash)
       VALUES ($1, 'Arthur', 'Kingsley', 'admin@securelife.com', $2) RETURNING id;`,
      [adminRole.rows[0].id, defaultPasswordHash]
    );

    const advisorsData = [
      { firstName: 'David', lastName: 'Miller', email: 'advisor.david@securelife.com' },
      { firstName: 'Nadia', lastName: 'Silva', email: 'advisor.nadia@securelife.com' },
      { firstName: 'Marcus', lastName: 'Vance', email: 'advisor.marcus@securelife.com' },
      { firstName: 'Sarah', lastName: 'Jenkins', email: 'advisor.sarah@securelife.com' },
      { firstName: 'Elena', lastName: 'Rostova', email: 'advisor.elena@securelife.com' },
    ];

    const advisorIds = [];
    for (const adv of advisorsData) {
      const advRes = await targetPool.query(
        `INSERT INTO users (role_id, first_name, last_name, email, password_hash)
         VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
        [advisorRole.rows[0].id, adv.firstName, adv.lastName, adv.email, defaultPasswordHash]
      );
      advisorIds.push(advRes.rows[0].id);
    }

    const adminId = adminRes.rows[0].id;
    const [davidId, nadiaId, marcusId, sarahId, elenaId] = advisorIds;

    // 6. Seed 25+ Diverse Leads Across Past 6 Months
    console.log('Seeding 25+ rich leads across past 6 months...');

    const sampleLeads = [
      // March 2026
      { firstName: 'Robert', lastName: 'Chen', email: 'robert.chen@email.com', phone: '+1 555-0144', dob: '1988-04-12', gender: 'Male', occupation: 'Software Architect', coverage: 500000, term: 20, budget: 200, planSlug: 'gold-family-shield', status: 'CONVERTED', advisorId: davidId, createdDaysAgo: 165 },
      { firstName: 'Amanda', lastName: 'Foster', email: 'afoster@designcorp.io', phone: '+1 555-0188', dob: '1992-09-18', gender: 'Female', occupation: 'UX Director', coverage: 750000, term: 25, budget: 280, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: nadiaId, createdDaysAgo: 160 },
      { firstName: 'Kevin', lastName: 'Patel', email: 'kpatel@medtech.org', phone: '+1 555-0199', dob: '1985-11-03', gender: 'Male', occupation: 'Clinical Researcher', coverage: 300000, term: 15, budget: 130, planSlug: 'gold-family-shield', status: 'CONVERTED', advisorId: marcusId, createdDaysAgo: 152 },
      { firstName: 'Lisa', lastName: 'Wong', email: 'lisa.wong@financehub.com', phone: '+1 555-0211', dob: '1995-02-28', gender: 'Female', occupation: 'Financial Analyst', coverage: 200000, term: 10, budget: 90, planSlug: 'basic-term-protection', status: 'LOST', advisorId: sarahId, createdDaysAgo: 148 },

      // April 2026
      { firstName: 'Jonathan', lastName: 'Blake', email: 'jblake@realestate.com', phone: '+1 555-0233', dob: '1979-07-22', gender: 'Male', occupation: 'Real Estate Broker', coverage: 1000000, term: 30, budget: 450, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: elenaId, createdDaysAgo: 135 },
      { firstName: 'Samantha', lastName: 'Wright', email: 'swright@lawfirm.net', phone: '+1 555-0255', dob: '1990-12-05', gender: 'Female', occupation: 'Corporate Attorney', coverage: 600000, term: 20, budget: 260, planSlug: 'gold-family-shield', status: 'CONVERTED', advisorId: davidId, createdDaysAgo: 128 },
      { firstName: 'Carlos', lastName: 'Mendoza', email: 'cmendoza@logistic.io', phone: '+1 555-0277', dob: '1983-05-14', gender: 'Male', occupation: 'Logistics Manager', coverage: 250000, term: 20, budget: 110, planSlug: 'basic-term-protection', status: 'CONVERTED', advisorId: nadiaId, createdDaysAgo: 120 },
      { firstName: 'Emily', lastName: 'Taylor', email: 'etaylor@edu.org', phone: '+1 555-0299', dob: '1994-08-30', gender: 'Female', occupation: 'High School Principal', coverage: 350000, term: 25, budget: 140, planSlug: 'gold-family-shield', status: 'PROPOSAL', advisorId: marcusId, createdDaysAgo: 115 },

      // May 2026
      { firstName: 'Gregory', lastName: 'House', email: 'ghouse@diagnostics.org', phone: '+1 555-0311', dob: '1976-03-15', gender: 'Male', occupation: 'Chief Medical Officer', coverage: 1500000, term: 20, budget: 750, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: sarahId, createdDaysAgo: 102 },
      { firstName: 'Rachel', lastName: 'Green', email: 'rgreen@fashionhaus.com', phone: '+1 555-0333', dob: '1991-10-10', gender: 'Female', occupation: 'Buyer & Brand Lead', coverage: 400000, term: 15, budget: 180, planSlug: 'gold-family-shield', status: 'CONVERTED', advisorId: elenaId, createdDaysAgo: 95 },
      { firstName: 'Michael', lastName: 'Scott', email: 'mscott@dundermifflin.com', phone: '+1 555-0355', dob: '1981-01-15', gender: 'Male', occupation: 'Regional Manager', coverage: 250000, term: 20, budget: 120, planSlug: 'basic-term-protection', status: 'LOST', advisorId: davidId, createdDaysAgo: 88 },
      { firstName: 'Pamela', lastName: 'Beesly', email: 'pbeesly@artstudio.com', phone: '+1 555-0377', dob: '1989-06-21', gender: 'Female', occupation: 'Graphic Illustrator', coverage: 300000, term: 20, budget: 130, planSlug: 'gold-family-shield', status: 'QUALIFIED', advisorId: nadiaId, createdDaysAgo: 82 },

      // June 2026
      { firstName: 'Jim', lastName: 'Halpert', email: 'jhalpert@athlead.com', phone: '+1 555-0399', dob: '1987-10-01', gender: 'Male', occupation: 'Sports Marketing Director', coverage: 800000, term: 25, budget: 350, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: marcusId, createdDaysAgo: 72 },
      { firstName: 'Dwight', lastName: 'Schrute', email: 'dschrute@beetfarms.com', phone: '+1 555-0411', dob: '1982-01-20', gender: 'Male', occupation: 'Agri-Business Owner', coverage: 1200000, term: 30, budget: 600, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: sarahId, createdDaysAgo: 68 },
      { firstName: 'Angela', lastName: 'Martin', email: 'amartin@auditcorp.com', phone: '+1 555-0433', dob: '1984-04-25', gender: 'Female', occupation: 'Senior Auditor', coverage: 350000, term: 15, budget: 150, planSlug: 'gold-family-shield', status: 'CONVERTED', advisorId: elenaId, createdDaysAgo: 62 },
      { firstName: 'Oscar', lastName: 'Martinez', email: 'omartinez@accounting.net', phone: '+1 555-0455', dob: '1983-08-12', gender: 'Male', occupation: 'Tax Specialist', coverage: 500000, term: 20, budget: 220, planSlug: 'gold-family-shield', status: 'PROPOSAL', advisorId: davidId, createdDaysAgo: 58 },

      // July 2026
      { firstName: 'Ben', lastName: 'Wyatt', email: 'bwyatt@pawneegov.org', phone: '+1 555-0477', dob: '1986-11-14', gender: 'Male', occupation: 'City Administrator', coverage: 600000, term: 20, budget: 250, planSlug: 'gold-family-shield', status: 'CONVERTED', advisorId: nadiaId, createdDaysAgo: 42 },
      { firstName: 'Leslie', lastName: 'Knope', email: 'lknope@parksdept.gov', phone: '+1 555-0499', dob: '1985-01-18', gender: 'Female', occupation: 'Deputy Director', coverage: 750000, term: 25, budget: 300, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: marcusId, createdDaysAgo: 38 },
      { firstName: 'Ron', lastName: 'Swanson', email: 'rswanson@verygood.com', phone: '+1 555-0511', dob: '1975-05-06', gender: 'Male', occupation: 'Woodworking Entrepreneur', coverage: 1000000, term: 30, budget: 500, planSlug: 'platinum-legacy-wealth', status: 'QUALIFIED', advisorId: sarahId, createdDaysAgo: 32 },
      { firstName: 'April', lastName: 'Ludgate', email: 'aludgate@animalcare.org', phone: '+1 555-0533', dob: '1993-04-09', gender: 'Female', occupation: 'Veterinary Coordinator', coverage: 200000, term: 15, budget: 85, planSlug: 'basic-term-protection', status: 'PLAN_RECOMMENDED', advisorId: elenaId, createdDaysAgo: 28 },

      // August 2026 (Current Month)
      { firstName: 'Andy', lastName: 'Dwyer', email: 'adwyer@mouserat.band', phone: '+1 555-0555', dob: '1990-06-03', gender: 'Male', occupation: 'Musician & Entertainer', coverage: 150000, term: 10, budget: 60, planSlug: 'basic-term-protection', status: 'NEW', advisorId: null, createdDaysAgo: 5 },
      { firstName: 'Donna', lastName: 'Meagle', email: 'dmeagle@estateholdings.com', phone: '+1 555-0577', dob: '1982-09-12', gender: 'Female', occupation: 'Property Investor', coverage: 1500000, term: 30, budget: 800, planSlug: 'platinum-legacy-wealth', status: 'CONVERTED', advisorId: davidId, createdDaysAgo: 3 },
      { firstName: 'Tom', lastName: 'Haverford', email: 'thaverford@bistro.io', phone: '+1 555-0599', dob: '1989-12-07', gender: 'Male', occupation: 'Hospitality Founder', coverage: 500000, term: 20, budget: 240, planSlug: 'gold-family-shield', status: 'CONTACTED', advisorId: nadiaId, createdDaysAgo: 2 },
      { firstName: 'Chris', lastName: 'Traeger', email: 'ctraeger@wellnesshealth.org', phone: '+1 555-0611', dob: '1980-02-14', gender: 'Male', occupation: 'Health & Fitness Coach', coverage: 800000, term: 25, budget: 380, planSlug: 'platinum-legacy-wealth', status: 'QUALIFIED', advisorId: marcusId, createdDaysAgo: 1 },
      { firstName: 'Ann', lastName: 'Perkins', email: 'aperkins@nursingcare.org', phone: '+1 555-0633', dob: '1987-03-24', gender: 'Female', occupation: 'Registered Nurse', coverage: 400000, term: 20, budget: 175, planSlug: 'gold-family-shield', status: 'NEW', advisorId: null, createdDaysAgo: 0 },
    ];

    for (const l of sampleLeads) {
      const planId = planIdMap[l.planSlug];
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - l.createdDaysAgo);

      const leadRes = await targetPool.query(
        `INSERT INTO leads (first_name, last_name, email, phone, date_of_birth, gender, occupation, requested_coverage, requested_policy_term, monthly_budget, interested_plan_id, status, assigned_advisor_id, source, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Public Website Quote', $14)
         RETURNING id;`,
        [l.firstName, l.lastName, l.email, l.phone, l.dob, l.gender, l.occupation, l.coverage, l.term, l.budget, planId, l.status, l.advisorId, createdDate]
      );
      const leadId = leadRes.rows[0].id;

      await targetPool.query(
        `INSERT INTO lead_activities (lead_id, user_id, activity_type, description, created_at)
         VALUES ($1, $2, 'LEAD_CREATED', 'Submitted online quote application', $3);`,
        [leadId, l.advisorId || adminId, createdDate]
      );
    }

    console.log('Database seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await targetPool.end();
  }
}

seed();
