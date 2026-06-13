import pool from '../database/init';

export interface GroupHome {
  id: string;
  name: string;
  location_street: string;
  location_suburb: string;
  location_postcode: string;
  location_state: string;
  bedrooms: number;
  bathrooms: number;
  assistance_type: string;
  max_capacity: number;
  current_occupancy: number;
  contact_person_name: string;
  contact_person_phone: string;
  contact_person_email: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  wheelchair_accessible: boolean;
  has_yard: boolean;
  has_kitchen: boolean;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function getAllGroupHomes(): Promise<GroupHome[]> {
  const result = await pool.query(
    'SELECT * FROM group_homes WHERE status = $1 ORDER BY name ASC',
    ['active']
  );
  return result.rows;
}

export async function getGroupHomeById(id: string): Promise<GroupHome | null> {
  const result = await pool.query('SELECT * FROM group_homes WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createGroupHome(
  data: Partial<GroupHome>
): Promise<GroupHome> {
  const {
    name,
    location_street,
    location_suburb,
    location_postcode,
    location_state,
    bedrooms,
    bathrooms,
    assistance_type,
    max_capacity,
    contact_person_name,
    contact_person_phone,
    contact_person_email,
    manager_name,
    manager_phone,
    manager_email,
    wheelchair_accessible,
    has_yard,
    has_kitchen,
    notes,
  } = data;

  const result = await pool.query(
    `INSERT INTO group_homes (
      name, location_street, location_suburb, location_postcode, location_state,
      bedrooms, bathrooms, assistance_type, max_capacity,
      contact_person_name, contact_person_phone, contact_person_email,
      manager_name, manager_phone, manager_email,
      wheelchair_accessible, has_yard, has_kitchen, notes, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING *`,
    [
      name,
      location_street,
      location_suburb,
      location_postcode,
      location_state,
      bedrooms,
      bathrooms,
      assistance_type,
      max_capacity,
      contact_person_name,
      contact_person_phone,
      contact_person_email,
      manager_name,
      manager_phone,
      manager_email,
      wheelchair_accessible || false,
      has_yard || false,
      has_kitchen !== false,
      notes,
      'active',
    ]
  );

  return result.rows[0];
}

export async function updateGroupHome(
  id: string,
  data: Partial<GroupHome>
): Promise<GroupHome | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    return getGroupHomeById(id);
  }

  fields.push(`updated_at = $${paramIndex}`);
  values.push(new Date());
  values.push(id);

  const result = await pool.query(
    `UPDATE group_homes SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteGroupHome(id: string): Promise<boolean> {
  const result = await pool.query(
    'UPDATE group_homes SET status = $1 WHERE id = $2 RETURNING id',
    ['inactive', id]
  );
  return result.rows.length > 0;
}

export async function getGroupHomeStats(): Promise<{
  total: number;
  active: number;
  totalCapacity: number;
  totalOccupancy: number;
  averageOccupancy: number;
}> {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
      COALESCE(SUM(max_capacity), 0) as total_capacity,
      COALESCE(SUM(current_occupancy), 0) as total_occupancy
    FROM group_homes
  `);

  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    active: parseInt(row.active, 10),
    totalCapacity: parseInt(row.total_capacity, 10),
    totalOccupancy: parseInt(row.total_occupancy, 10),
    averageOccupancy:
      row.total > 0
        ? Math.round((parseInt(row.total_occupancy, 10) / parseInt(row.total_capacity, 10)) * 100)
        : 0,
  };
}

export async function searchGroupHomes(query: string): Promise<GroupHome[]> {
  const searchTerm = `%${query}%`;
  const result = await pool.query(
    `SELECT * FROM group_homes 
     WHERE status = 'active' AND (
       name ILIKE $1 OR 
       location_suburb ILIKE $1 OR 
       assistance_type ILIKE $1
     )
     ORDER BY name ASC`,
    [searchTerm]
  );
  return result.rows;
}

export async function updateGroupHomeOccupancy(id: string, occupancy: number): Promise<boolean> {
  const result = await pool.query(
    'UPDATE group_homes SET current_occupancy = $1 WHERE id = $2 RETURNING id',
    [occupancy, id]
  );
  return result.rows.length > 0;
}
