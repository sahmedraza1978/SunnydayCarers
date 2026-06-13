# NDIS Participant Onboarding System

## 🎯 Overview

A comprehensive 4-step onboarding process that captures all essential NDIS participant information based on their service type and plan management structure.

## 📋 Onboarding Steps

### Step 1: Service Type Selection
Participants select which services they'll receive:
- **SIL - Group Home** (Supported Independent Living in group accommodation)
- **SIL + CP** (SIL with Capacity Building services)
- **In-Home Care Support** (Support in participant's own home)
- **Day Program** (Structured day-time activities)

### Step 2: Plan Management
Determine who manages their NDIS plan:
- **Support Coordinator** (Third-party plan management)
- **NDIS Planner** (NDIS manages the plan)

### Step 3: Support Coordinator Information
Always collected:
- Name
- Phone number
- Email address

### Step 4: Service-Specific Details
Conditional fields based on selections:

**If Managed by NDIS Planner (Step 2):**
- Planner name
- Planner phone & email
- Organization/NDIS office

**If SIL Group Home Service:**
- Group home name
- Group home address (required)
- Group home phone

**If In-Home Support Service:**
- Support start date (required)

**If Day Program Service:**
- Program name
- Days attended

**Always:**
- Additional notes

## 🔧 API Endpoints

### Create Onboarding Record
```
POST /api/onboarding

Request:
{
  "participant_id": "uuid",
  "service_type": "sil_group_home|sil_and_cp|in_home_support|day_program",
  "managed_by": "coordinator|planner",
  "support_coordinator_name": "string",
  "support_coordinator_phone": "string",
  "support_coordinator_email": "string",
  "planner_name": "string" (required if managed_by: planner),
  "planner_phone": "string",
  "planner_email": "string",
  "planner_organization": "string",
  "group_home_name": "string",
  "group_home_address": "string" (required if sil_group_home),
  "group_home_phone": "string",
  "in_home_support_start_date": "date" (required if in_home_support),
  "day_program_name": "string",
  "day_program_days": "string",
  "additional_notes": "string"
}

Response: {
  "success": true,
  "data": { onboarding_record }
}
```

### Get Onboarding Records
```
GET /api/onboarding/participant/:participantId

Response: {
  "success": true,
  "data": [{ onboarding_record }, ...]
}
```

### Update Onboarding Record
```
PUT /api/onboarding/:id

Request: { updated_fields }

Response: {
  "success": true,
  "data": { updated_record }
}
```

### Mark Onboarding Complete
```
PATCH /api/onboarding/:id/complete

Response: {
  "success": true,
  "data": { completed_record }
}
```

## 🎨 Frontend Integration

### Onboarding Page Route
```
/onboarding/:participantId
```

### User Flow
1. **Participant Created** → Dashboard
2. **Click "Start Onboarding"** → Multi-step form
3. **Complete 4 Steps** → Record saved
4. **Return to Dashboard** → View onboarding status

### Smart Form Behavior
- Fields appear/disappear based on selections
- Conditional validation (required fields based on service type)
- Color-coded sections for clarity
- Progress indicator (Step X of 4)

## 📊 Database Schema

### onboarding_records Table
```sql
id (UUID, primary key)
participant_id (UUID, foreign key)
service_type (VARCHAR) - sil_group_home|sil_and_cp|in_home_support|day_program
managed_by (VARCHAR) - coordinator|planner

-- Support Coordinator Info
support_coordinator_name (VARCHAR)
support_coordinator_phone (VARCHAR)
support_coordinator_email (VARCHAR)

-- Planner Info (if managed by planner)
planner_name (VARCHAR)
planner_phone (VARCHAR)
planner_email (VARCHAR)
planner_organization (VARCHAR)

-- Group Home Info (if SIL group home)
group_home_name (VARCHAR)
group_home_address (VARCHAR)
group_home_phone (VARCHAR)

-- In-Home Support Info (if in-home care)
in_home_support_start_date (DATE)

-- Day Program Info (if day program)
day_program_name (VARCHAR)
day_program_days (VARCHAR)

-- General
additional_notes (TEXT)
status (VARCHAR) - in_progress|completed
completed_at (TIMESTAMP)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## ✨ Features

✅ **Multi-Step Form** - User-friendly 4-step process
✅ **Conditional Fields** - Show/hide based on service type
✅ **Plan Management** - Support Coordinator or NDIS Planner
✅ **Service-Specific Info** - Different fields per service type
✅ **Validation** - Required fields enforced
✅ **Status Tracking** - Track completion status
✅ **Color-Coded Sections** - Visual organization
✅ **Complete History** - Keep all onboarding records

## 🚀 Usage Example

### Step-by-Step Workflow

1. **Create Participant**
   ```
   POST /api/participants
   { first_name, last_name, ndis_number, ... }
   ```

2. **Start Onboarding**
   ```
   Navigate to: /onboarding/{participantId}
   ```

3. **Complete Steps**
   - Step 1: Select service type
   - Step 2: Choose plan management
   - Step 3: Enter support coordinator info
   - Step 4: Enter service-specific details

4. **Save Onboarding**
   ```
   POST /api/onboarding
   { participant_id, service_type, managed_by, ... }
   ```

5. **Mark Complete**
   ```
   PATCH /api/onboarding/{id}/complete
   ```

## 🔐 Permissions

- **Admin**: Full access to all onboarding
- **Support Worker**: Can view and create/edit assigned participants
- **Participant**: Can view own onboarding (future)

## 📱 Mobile Responsive

- ✅ Works on desktop, tablet, mobile
- ✅ Large touch-friendly buttons
- ✅ Clear step progression
- ✅ Responsive form layout

## 🎯 Next Enhancements

- [ ] Onboarding checklist (documents to collect)
- [ ] Digital signature capture
- [ ] PDF export of onboarding summary
- [ ] Email confirmation to participant
- [ ] Photo/identity document upload
- [ ] Participant communication preferences
- [ ] Goal setting during onboarding
- [ ] Service preferences form

## 🧪 Testing

### Test Scenario 1: SIL Group Home
1. Create participant
2. Start onboarding
3. Step 1: Select "SIL - Group Home"
4. Step 2: Select "Support Coordinator"
5. Step 3: Enter coordinator info
6. Step 4: Enter group home details
7. Complete onboarding

### Test Scenario 2: In-Home Care
1. Create participant
2. Start onboarding
3. Step 1: Select "In-Home Care Support"
4. Step 2: Select "NDIS Planner"
5. Step 3: Enter coordinator info
6. Step 4: Enter planner info + start date
7. Complete onboarding

## 📞 Troubleshooting

**Conditional fields not showing?**
- Ensure service_type is selected on Step 1
- Check managed_by selection on Step 2

**Validation errors?**
- Verify all required fields are filled
- Group home address required for SIL services
- Start date required for in-home support

**Data not saving?**
- Check browser console for API errors
- Verify backend is running
- Ensure participant_id is valid

## 💡 Best Practices

✅ Complete onboarding same day as participant registration
✅ Verify contact information with participant
✅ Use consistent phone/email formats
✅ Add notes for special requirements
✅ Keep onboarding records up-to-date
✅ Export onboarding summary for file

---

**Your onboarding system is ready!** 🎉
