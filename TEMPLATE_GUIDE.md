# Service Agreement Template Integration Guide

## ✅ Your Template is Ready!

Your Service Agreement template **"SA SIL - Kylie Furgusson.docx"** has been copied to:
```
backend/templates/SA-SIL-Template.docx
```

## 📋 How the Template System Works

### 1. **Backend Template Routes**
The system provides API endpoints to manage templates:

```
GET    /api/templates           - List all templates
GET    /api/templates/:id       - Get single template
POST   /api/templates           - Create new template
PUT    /api/templates/:id       - Update template
DELETE /api/templates/:id       - Delete template
```

### 2. **Template Structure in Database**
Templates are stored with:
- **name** - Template name (e.g., "SIL Service Agreement")
- **description** - What this template is for
- **content** - JSON structure with template fields
- **file_path** - Path to the .docx file
- **version** - Template version number
- **is_active** - Whether template is available for use

### 3. **Workflow**

```
1. Admin creates template record in database
2. Template references the .docx file
3. When creating agreement:
   - User selects template
   - System loads .docx file
   - Populates participant fields
   - Generates personalized agreement
   - Output as PDF or .docx
```

## 🚀 Quick Setup

### Step 1: Register Your Template

After starting the backend, create a template record:

```bash
curl -X POST http://localhost:5000/api/templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SIL Service Agreement",
    "description": "Standard Service Agreement for SIL participants",
    "content": {
      "template_file": "SA-SIL-Template.docx",
      "fields": {
        "participant_name": "",
        "ndis_number": "",
        "date_of_birth": "",
        "start_date": "",
        "end_date": "",
        "services_provided": "",
        "support_worker_name": "",
        "support_worker_phone": ""
      }
    },
    "file_path": "SA-SIL-Template.docx"
  }'
```

### Step 2: Use Template When Creating Agreement

```bash
curl -X POST http://localhost:5000/api/agreements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_id": "PARTICIPANT_UUID",
    "template_id": "TEMPLATE_UUID",
    "start_date": "2024-06-01",
    "end_date": "2025-05-31",
    "notes": "Initial service agreement"
  }'
```

## 📝 Template Fields

Your template should support these standard NDIS fields:

**Participant Information:**
- First Name
- Last Name
- NDIS Number
- Date of Birth
- Email
- Phone Number
- Address

**Agreement Details:**
- Start Date
- End Date
- Services Provided
- Support Hours
- Support Worker Name & Contact

**Terms & Conditions:**
- Payment terms
- Cancellation policy
- Confidentiality
- Signature blocks

## 🔧 Advanced: Custom Fields

If your template has custom fields, update the template content:

```json
{
  "fields": {
    "participant_name": "Full name",
    "ndis_number": "NDIS number",
    "custom_service_area": "Your service area",
    "custom_goal_1": "Participant goal",
    "custom_funding_amount": "Allocated funding"
  }
}
```

## 📄 Generating Documents (Next Phase)

Once template is registered, you can generate personalized agreements:

```bash
POST /api/agreements/:id/generate-pdf
POST /api/agreements/:id/generate-docx
```

We'll implement document generation using:
- **python-docx** - Modify .docx files
- **PDFKit** - Convert to PDF

## 🎯 Next Steps

1. **Frontend Template Management UI**
   - Admin page to upload/manage templates
   - Template preview
   - Field mapping interface

2. **Document Generation**
   - Auto-populate participant data into template
   - Generate PDF output
   - Download/email functionality

3. **Template Versioning**
   - Track template changes
   - Agreements reference specific version
   - Deprecate old templates

4. **Field Validation**
   - Ensure all required fields filled before generation
   - Validate date ranges
   - Check participant completeness

## 📁 File Structure

```
backend/
├── templates/
│   └── SA-SIL-Template.docx      ← Your template file
├── src/
│   ├── routes/
│   │   └── templates.ts          ← Template API endpoints
│   ├── services/
│   │   └── templateService.ts    ← Template file operations
│   └── ...
└── ...
```

## 🔐 Permissions

- **Admin**: Can create, edit, delete templates
- **Support Workers**: Can only view and use templates
- **Participants**: Cannot access template management

## ❓ Troubleshooting

**Template file not found:**
```
Check file exists: backend/templates/SA-SIL-Template.docx
Verify file permissions are readable
```

**Cannot create agreement with template:**
```
1. Ensure template_id exists
2. Verify participant_id exists
3. Check all required fields are provided
```

**Template data not populating:**
```
This requires document generation service (coming next)
For now, template is stored as reference
```

## 📞 Need Help?

The template system is now integrated! Your .docx file is securely stored and ready to use. 

**Next phase will add:**
- ✅ Template management UI in frontend
- ✅ Document generation & personalization
- ✅ PDF export functionality
- ✅ Agreement preview before generation
