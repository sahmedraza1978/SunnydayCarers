# Group Home Management Guide

## Overview

The Group Home Management system allows administrators to register and manage Supported Independent Living (SIL) group homes. This is essential for tracking participant placements and managing facility-specific information including location, capacity, amenities, and contact details.

## Accessing Group Homes

### From Dashboard
1. Click the **"Group Homes"** card on the main dashboard (🏠 icon)
2. Or navigate to: `/group-homes`

## Group Home Information Fields

### Location Details
- **Name** - Official name of the group home
- **Street Address** - Full street address
- **Suburb** - Suburb/locality name
- **Postcode** - Postal code
- **State** - Australian state (NSW, VIC, QLD, WA, SA, TAS, ACT, NT)

### Facility Details
- **Bedrooms** - Number of bedrooms (required)
- **Bathrooms** - Number of bathrooms (required)
- **Max Capacity** - Maximum number of residents
- **Current Occupancy** - Current number of residents
- **Assistance Type** - Type of support provided (e.g., SIL, Supported Living)

### Amenities & Accessibility
- **Wheelchair Accessible** - ♿ Checkbox for accessibility
- **Has Yard** - 🌳 Checkbox for outdoor space
- **Has Kitchen** - 🍳 Checkbox for kitchen availability

### Contact Information

#### Contact Person
- **Name** - Contact person name
- **Phone** - Contact phone number
- **Email** - Contact email address

#### Manager
- **Name** - Facility manager name
- **Phone** - Manager phone number
- **Email** - Manager email address

### Additional Details
- **Notes** - Any additional information or special requirements
- **Status** - Active/Inactive status

## Creating a Group Home

### Step-by-Step Process

1. **Navigate to Group Homes page**
   - Click "Group Homes" card on dashboard
   - Or use menu: `/group-homes`

2. **Click "+ Add Group Home" button**
   - A form will appear with all fields

3. **Fill in Required Fields**
   - Group home name *
   - Street address *
   - Suburb *
   - Postcode *
   - State *
   - Bedrooms *
   - Bathrooms *

4. **Fill in Optional Fields**
   - Max capacity
   - Assistance type
   - Contact person details
   - Manager details
   - Amenities (checkboxes)
   - Notes

5. **Click "Create Group Home"**
   - Form validates all required fields
   - System creates the group home
   - Page refreshes with new home in list

## Viewing Group Homes

### Card View
Each group home displays as a card with:
- **Header** - Name and location (suburb, state)
- **Address** - Full street address
- **Facilities Grid** - Bedrooms, bathrooms, capacity at a glance
- **Occupancy Bar** - Visual occupancy percentage
  - 🟢 Green (0-60%)
  - 🟡 Yellow (60-80%)
  - 🔴 Red (80%+)
- **Assistance Type** - Type of service provided
- **Amenities** - Visual indicators for accessibility features
- **Contact Person** - Primary contact name and phone
- **Delete Button** - To remove from system

### Occupancy Tracking
- **Current/Max Format** - Shows "3/4 (75%)"
- **Visual Bar** - Color-coded progress indicator
- **Updates** - Automatically updated when participants are assigned

## Group Home Data Usage

### Linking to Participants

When a participant with **SIL - Group Home** service type completes onboarding:

1. Select the service type "SIL - Group Home" in Step 1
2. In Step 4, select the group home from dropdown
3. System automatically links participant to facility
4. Group home occupancy updates automatically

### Admin Dashboard

The Admin Dashboard shows:
- Total group homes count
- Average occupancy percentage across all homes
- Distribution of service types
- Facility utilization metrics

## API Endpoints

### Get All Group Homes
```
GET /api/group-homes
Headers: Authorization: Bearer {token}
Response: { data: [GroupHome] }
```

### Get Specific Group Home
```
GET /api/group-homes/{id}
Headers: Authorization: Bearer {token}
Response: GroupHome object
```

### Search Group Homes
```
GET /api/group-homes/search?q={query}
Headers: Authorization: Bearer {token}
Query: q - Search by name, suburb, or assistance type
Response: { data: [GroupHome] }
```

### Create Group Home (Admin Only)
```
POST /api/group-homes
Headers: Authorization: Bearer {token}
Body: {
  name: string (required),
  location_street: string (required),
  location_suburb: string (required),
  location_postcode: string (required),
  location_state: string (required),
  bedrooms: number (required),
  bathrooms: number (required),
  assistance_type: string,
  max_capacity: number,
  contact_person_name: string,
  contact_person_phone: string,
  contact_person_email: string,
  manager_name: string,
  manager_phone: string,
  manager_email: string,
  wheelchair_accessible: boolean,
  has_yard: boolean,
  has_kitchen: boolean,
  notes: string
}
Response: GroupHome object
```

### Update Group Home (Admin Only)
```
PUT /api/group-homes/{id}
Headers: Authorization: Bearer {token}
Body: { ...partial fields to update }
Response: GroupHome object
```

### Delete Group Home (Admin Only)
```
DELETE /api/group-homes/{id}
Headers: Authorization: Bearer {token}
Response: { message: "Group home deleted successfully" }
```

### Get Group Home Statistics (Admin Only)
```
GET /api/group-homes/stats
Headers: Authorization: Bearer {token}
Response: {
  total: number,
  active: number,
  totalCapacity: number,
  totalOccupancy: number,
  averageOccupancy: number (%)
}
```

## Common Tasks

### 1. Register a New Group Home
1. Click "+ Add Group Home"
2. Fill in location and facility details
3. Add contact person and manager info
4. Select amenities (wheelchair access, yard, kitchen)
5. Add any special notes
6. Click "Create Group Home"

### 2. Update Group Home Information
1. Go to group homes list
2. Find the home you want to update
3. Edit the facility details directly (if implemented)
4. Save changes

### 3. Track Occupancy
1. View group homes list
2. Check occupancy bar on each card
3. Current/max ratio shown in footer
4. Red color indicates near capacity
5. Automatically updates when participants assigned

### 4. Find a Specific Group Home
1. Use browser Ctrl+F to search page
2. Or use search functionality (if implemented)
3. Filter by suburb, name, or assistance type

### 5. Assign Participant to Group Home
1. During participant onboarding, select "SIL - Group Home" service type
2. In Step 4, group home field appears
3. Select group home from dropdown
4. Complete onboarding
5. Occupancy automatically updates

## Role-Based Permissions

| Action | Admin | Support Worker |
|--------|-------|-----------------|
| View group homes | ✅ | ✅ |
| Create group home | ✅ | ❌ |
| Update details | ✅ | ❌ |
| Delete home | ✅ | ❌ |
| View statistics | ✅ | ❌ |

## Data Fields Reference

### Location Fields
```
location_street: "123 Main Street"
location_suburb: "Sydney"
location_postcode: "2000"
location_state: "NSW"
```

### Facility Fields
```
bedrooms: 3
bathrooms: 2
max_capacity: 4
current_occupancy: 3
assistance_type: "Supported Independent Living (SIL)"
```

### Contact Fields
```
contact_person_name: "John Smith"
contact_person_phone: "(02) 9123 4567"
contact_person_email: "john@example.com"
manager_name: "Jane Doe"
manager_phone: "(02) 9876 5432"
manager_email: "jane@example.com"
```

### Amenity Fields
```
wheelchair_accessible: true
has_yard: true
has_kitchen: true
```

## Troubleshooting

### Group Home Not Appearing in Dropdown
1. Check if group home status is "active"
2. Verify group home was created successfully
3. Try refreshing the page
4. Check database directly

### Occupancy Not Updating
1. Verify participant onboarding was completed
2. Check group home was selected in Step 4
3. Ensure participant service type is "SIL - Group Home"
4. Refresh page to see updated occupancy

### Cannot Create Group Home
1. Verify you're logged in as Admin
2. Check all required fields are filled:
   - Name
   - Address (street, suburb, postcode, state)
   - Bedrooms
   - Bathrooms
3. Check for error message at top of page
4. Try again or contact system administrator

### Cannot View Group Homes
1. Verify you're logged in
2. Check user role has view permissions
3. Check database connection
4. Hard refresh browser (Ctrl+F5)

## Best Practices

### Naming Conventions
- Use descriptive names: "Greenfield SIL Group Home - 4 Bedroom"
- Include address details in notes if not obvious
- Standardize naming across all homes

### Occupancy Management
- Update current occupancy when participants join/leave
- Monitor homes approaching capacity
- Plan new homes when demand exceeds capacity

### Contact Information
- Keep contact details current
- Update when staff changes
- Include backup contact in notes

### Amenities Documentation
- Clearly indicate accessibility features
- Document any special facilities
- Update if home renovations occur

### Notes Field Usage
- Record renovation dates
- Note any restrictions or special requirements
- Document support specializations
- Record recent incidents or updates

## Future Enhancements

- [ ] Online booking/availability system
- [ ] Waitlist management
- [ ] Maintenance request tracking
- [ ] Facility inspection records
- [ ] Staff roster management
- [ ] Emergency procedures documentation
- [ ] Incident report tracking
- [ ] Inspection compliance reports
- [ ] Quality assurance metrics
- [ ] Integration with maintenance contractors

## FAQ

**Q: Can I have multiple group homes in the same suburb?**
A: Yes, absolutely. Simply create each one with unique names and details.

**Q: What happens if I delete a group home?**
A: The group home is marked as inactive (soft delete). Existing participant links are preserved for historical records.

**Q: How is occupancy calculated?**
A: Occupancy percentage = (current occupancy / max capacity) × 100%

**Q: Can support workers create group homes?**
A: No, only admins can create, edit, or delete group homes. Support workers can only view and assign participants.

**Q: What if I don't know the max capacity?**
A: Leave it blank. The occupancy tracker won't display until max capacity is set.

**Q: Can I export group home list?**
A: Not currently - this is planned for a future release.

**Q: Is there a group home approval workflow?**
A: Currently all group homes are active on creation. An approval workflow is planned for phase 2.

**Q: Can participants be in multiple group homes?**
A: Not simultaneously. A participant can only have one current onboarding record. Historical records are preserved.

**Q: How do I track when a participant leaves a home?**
A: Create a new onboarding record when the participant moves. The system maintains history.

## Support

For technical issues or feature requests related to group home management, contact your system administrator.
