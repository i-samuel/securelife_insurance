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

    // 3. Seed Master Benefits
    console.log('Seeding master benefits...');
    const masterBenefits = [
      { name: 'Comprehensive Death Benefit', description: 'Guaranteed lump sum payout to legal beneficiaries upon death.', category: 'Core' },
      { name: 'Critical Illness Shield', description: 'Up to $100k payout upon diagnosis of 36 covered critical illnesses.', category: 'Health' },
      { name: 'Hospitalization Cash Benefit', description: '$200 daily stipend during hospital stays.', category: 'Health' },
      { name: 'Accidental Disability Cover', description: 'Full coverage payout for accidental permanent disability.', category: 'Accident' },
      { name: 'Tax Savings Certificate', description: 'Eligible for maximum tax deduction under Insurance Act.', category: 'Tax' },
      { name: '24/7 Global Concierge', description: 'Global emergency medical advice and travel concierge service.', category: 'Service' },
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
        benefits: ['Comprehensive Death Benefit', 'Tax Savings Certificate'],
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
        benefits: ['Comprehensive Death Benefit', 'Critical Illness Shield', 'Hospitalization Cash Benefit', 'Tax Savings Certificate'],
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
        benefits: ['Comprehensive Death Benefit', 'Critical Illness Shield', 'Hospitalization Cash Benefit', 'Accidental Disability Cover', 'Tax Savings Certificate', '24/7 Global Concierge'],
      },
    ];

    for (const p of plansData) {
      const planRes = await targetPool.query(
        `INSERT INTO insurance_plans (name, slug, description, min_age, max_age, min_coverage, max_coverage, min_policy_term, max_policy_term, min_premium, max_premium, eligibility_description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id;`,
        [p.name, p.slug, p.description, p.minAge, p.maxAge, p.minCoverage, p.maxCoverage, p.minPolicyTerm, p.maxPolicyTerm, p.minPremium, p.maxPremium, p.eligibilityDescription]
      );
      const planId = planRes.rows[0].id;

      // Link plan to all master benefits (all master benefits will be in plan_benefits, with is_included = true for included ones)
      for (const benName of Object.keys(benefitMap)) {
        const benefitId = benefitMap[benName];
        const isIncluded = p.benefits.includes(benName);
        await targetPool.query(
          `INSERT INTO plan_benefits (plan_id, benefit_id, is_included) VALUES ($1, $2, $3);`,
          [planId, benefitId, isIncluded]
        );
      }
    }

    // 5. Seed Users (Admin & Advisors)
    console.log('Seeding system users...');
    const adminRole = await targetPool.query(`SELECT id FROM roles WHERE name = 'ADMIN';`);
    const advisorRole = await targetPool.query(`SELECT id FROM roles WHERE name = 'ADVISOR';`);

    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

    const adminRes = await targetPool.query(
      `INSERT INTO users (role_id, first_name, last_name, email, password_hash)
       VALUES ($1, 'Arthur', 'Kingsley', 'admin@securelife.com', $2) RETURNING id;`,
      [adminRole.rows[0].id, defaultPasswordHash]
    );

    const advisor1Res = await targetPool.query(
      `INSERT INTO users (role_id, first_name, last_name, email, password_hash)
       VALUES ($1, 'David', 'Miller', 'advisor.david@securelife.com', $2) RETURNING id;`,
      [advisorRole.rows[0].id, defaultPasswordHash]
    );

    const advisor2Res = await targetPool.query(
      `INSERT INTO users (role_id, first_name, last_name, email, password_hash)
       VALUES ($1, 'Nadia', 'Silva', 'advisor.nadia@securelife.com', $2) RETURNING id;`,
      [advisorRole.rows[0].id, defaultPasswordHash]
    );

    const adminId = adminRes.rows[0].id;
    const davidId = advisor1Res.rows[0].id;
    const nadiaId = advisor2Res.rows[0].id;

    // 6. Seed Leads & Activities
    console.log('Seeding initial leads & activity trail...');
    const goldPlanRes = await targetPool.query(`SELECT id FROM insurance_plans WHERE slug = 'gold-family-shield';`);
    const goldPlanId = goldPlanRes.rows[0].id;

    const lead1 = await targetPool.query(
      `INSERT INTO leads (first_name, last_name, email, phone, date_of_birth, gender, occupation, requested_coverage, requested_policy_term, monthly_budget, interested_plan_id, status, assigned_advisor_id, source)
       VALUES ('Robert', 'Chen', 'robert.chen@email.com', '+1 555-0144', '1988-04-12', 'Male', 'Software Architect', 500000, 20, 200, $1, 'QUALIFIED', $2, 'Public Website Quote') RETURNING id;`,
      [goldPlanId, davidId]
    );

    await targetPool.query(
      `INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
       VALUES ($1, $2, 'LEAD_CREATED', 'Submitted public lead quote form');`,
      [lead1.rows[0].id, davidId]
    );

    await targetPool.query(
      `INSERT INTO lead_notes (lead_id, user_id, content)
       VALUES ($1, $2, 'Applicant is looking for critical illness protection for family of 4.');`,
      [lead1.rows[0].id, davidId]
    );

    console.log('Database seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await targetPool.end();
  }
}

seed();
