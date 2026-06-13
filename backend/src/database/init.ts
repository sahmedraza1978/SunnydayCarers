import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ndis_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

export const initializeDatabase = async () => {
  try {
    await pool.connect();
    console.log('✓ Database connected');

    await createUsersTable();
    await createParticipantsTable();
    await createGroupHomesTable();
    await createOnboardingRecordsTable();
    await createServiceAgreementsTable();
    await createAgreementItemsTable();
    await createTemplatesTable();
    await createActivityLogsTable();

    console.log('✓ All tables initialized');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    throw error;
  }
};

const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(50) DEFAULT 'support_worker',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createParticipantsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS participants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      date_of_birth DATE,
      address_street VARCHAR(255),
      address_suburb VARCHAR(100),
      address_postcode VARCHAR(10),
      address_state VARCHAR(10),
      emergency_contact_name VARCHAR(255),
      emergency_contact_phone VARCHAR(20),
      ndis_plan_start_date DATE,
      ndis_plan_end_date DATE,
      support_coordinator_name VARCHAR(255),
      support_coordinator_phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createGroupHomesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_homes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      location_street VARCHAR(255) NOT NULL,
      location_suburb VARCHAR(100) NOT NULL,
      location_postcode VARCHAR(10) NOT NULL,
      location_state VARCHAR(10) NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      assistance_type VARCHAR(255),
      max_capacity INTEGER,
      current_occupancy INTEGER DEFAULT 0,
      contact_person_name VARCHAR(255),
      contact_person_phone VARCHAR(20),
      contact_person_email VARCHAR(255),
      manager_name VARCHAR(255),
      manager_phone VARCHAR(20),
      manager_email VARCHAR(255),
      wheelchair_accessible BOOLEAN DEFAULT false,
      has_yard BOOLEAN DEFAULT false,
      has_kitchen BOOLEAN DEFAULT true,
      notes TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createOnboardingRecordsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS onboarding_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      group_home_id UUID REFERENCES group_homes(id),
      service_type VARCHAR(100),
      plan_management VARCHAR(50),
      status VARCHAR(50) DEFAULT 'in_progress',
      coordinator_name VARCHAR(255),
      coordinator_phone VARCHAR(20),
      coordinator_email VARCHAR(255),
      planner_name VARCHAR(255),
      planner_phone VARCHAR(20),
      planner_email VARCHAR(255),
      planner_organization VARCHAR(255),
      support_start_date DATE,
      day_program_name VARCHAR(255),
      day_program_days VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createServiceAgreementsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_agreements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      agreement_start_date DATE NOT NULL,
      agreement_end_date DATE,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createAgreementItemsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agreement_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agreement_id UUID NOT NULL REFERENCES service_agreements(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      rate DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createTemplatesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agreement_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createActivityLogsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      action VARCHAR(255),
      entity_type VARCHAR(100),
      entity_id UUID,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
