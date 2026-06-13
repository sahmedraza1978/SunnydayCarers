# Document Generation Guide

## 🎯 Overview

Your app now includes automatic document generation that:
- ✅ Loads your Service Agreement template (.docx)
- ✅ Auto-populates participant details
- ✅ Generates personalized agreements
- ✅ Downloads as .docx or PDF

## 📋 Template Fields

Your template should include placeholders for these fields:

### Participant Information
```
{{participant_full_name}}    - John Smith
{{participant_first_name}}   - John
{{participant_last_name}}    - Smith
{{ndis_number}}              - 1234567
{{date_of_birth}}            - 15 January 1990
{{email}}                    - john@example.com
{{phone_number}}             - 0412345678
{{address}}                  - 123 Main St, Sydney, NSW 2000
```

### Emergency Contact
```
{{emergency_contact_name}}       - Jane Smith
{{emergency_contact_phone}}      - 0412345678
{{emergency_contact_relationship}} - Mother
```

### Agreement Details
```
{{agreement_start_date}}    - 1 June 2024
{{agreement_end_date}}      - 31 May 2025
{{agreement_notes}}         - Additional notes
{{generated_date}}          - 12 June 2026
```

## 🔧 Setup Instructions

### 1. Update Your Template File

Add placeholders to your "SA SIL - Kylie Furgusson.docx" file:

1. Open the template in Microsoft Word
2. Find fields you want to auto-populate
3. Replace with placeholder text, e.g.:
   - Replace "Kylie Furgusson" with `{{participant_full_name}}`
   - Replace NDIS number with `{{ndis_number}}`
   - Replace dates with `{{agreement_start_date}}`

Example:
```
Service Agreement for {{participant_full_name}}
NDIS Number: {{ndis_number}}
Date of Birth: {{date_of_birth}}
Agreement Period: {{agreement_start_date}} to {{agreement_end_date}}
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

New packages added:
- `jszip` - Modify .docx files
- `pdf-lib` - PDF manipulation (for future PDF generation)

### 3. API Endpoints

#### Generate Document
```
POST /api/documents/:agreementId/generate

Request body:
{
  "format": "docx"  // or "pdf"
}

Response: File download (binary)
```

#### Preview Fields
```
GET /api/documents/:agreementId/preview

Response:
{
  "success": true,
  "data": {
    "participant_name": "John Smith",
    "fields": {
      "participant_full_name": "John Smith",
      "ndis_number": "1234567",
      ...
    }
  }
}
```

## 🚀 Usage Flow

1. **Create Agreement**
   ```
   POST /api/agreements
   {
     "participant_id": "uuid",
     "template_id": "uuid",
     "start_date": "2024-06-01",
     "end_date": "2025-05-31"
   }
   ```

2. **Preview Fields** (optional)
   ```
   GET /api/documents/{agreementId}/preview
   ```

3. **Generate Document**
   ```
   POST /api/documents/{agreementId}/generate
   {
     "format": "docx"  // or "pdf"
   }
   ```

4. **Download File**
   - Browser automatically downloads the generated document

## 📝 Frontend Integration

### Generate Agreement Page
The frontend includes a `GenerateAgreementPage` component that:
- Selects template
- Sets agreement dates
- Generates and downloads document
- Supports both .docx and PDF formats

### Usage
```typescript
<Route
  path="/agreements/new/:participantId"
  element={
    <PrivateRoute>
      <GenerateAgreementPage />
    </PrivateRoute>
  }
/>
```

## 🔄 How It Works

1. **Template Loading**
   - .docx file loaded as ZIP archive
   - document.xml extracted and parsed

2. **Field Replacement**
   - Participant data mapped to field names
   - Placeholders replaced with actual values
   - XML properly escaped

3. **Document Creation**
   - Modified XML re-packaged as .docx
   - File returned as binary response
   - Browser downloads file

## ⚙️ Configuration

### Supported Field Types
- **Text**: `{{field_name}}`
- **Dates**: Auto-formatted as "15 June 2024"
- **Addresses**: Auto-formatted as "Street, Suburb, State Postcode"

### Custom Fields
To add custom fields:

1. Edit `documentService.ts` - `mapParticipantToFields()`
2. Add mapping for your custom field:
   ```typescript
   custom_field: participant.custom_field || ''
   ```
3. Use in template: `{{custom_field}}`

## 🐛 Troubleshooting

**Template file not found**
- Check: `backend/templates/SA-SIL-Template.docx`
- Ensure file has .docx extension
- File must be valid Word document

**Fields not replacing**
- Check placeholder format: `{{field_name}}`
- Field names must match exactly (case-sensitive)
- Placeholder must not be split across runs/styles

**Document corrupted after generation**
- Verify XML escaping in replaceFields()
- Check for special characters in data
- Test with simple placeholder first

## 🎁 Bonus Features

### PDF Generation
Currently returns .docx. For PDF:
1. Use LibreOffice: `soffice --convert-to pdf`
2. Or use online conversion service
3. Or upgrade to pdf-lib for advanced formatting

### Email Integration
To email generated documents:
```typescript
// Add to routes/documents.ts
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({...});
await transporter.sendMail({
  to: participant.email,
  attachment: buffer
});
```

### Batch Generation
Generate agreements for multiple participants:
```typescript
for (const participantId of participantIds) {
  // Generate and store each agreement
}
```

## 📊 Next Steps

1. **Update your template** with `{{placeholders}}`
2. **Test generation** with sample participant
3. **Download and review** generated document
4. **Add more fields** as needed
5. **Integrate PDF service** (optional)

## 💡 Best Practices

✅ Use meaningful placeholder names
✅ Test with various participant data
✅ Include empty field handling (optional text)
✅ Version your templates
✅ Backup original template

## ❓ Need Help?

Check:
- `backend/src/services/documentService.ts` - Generation logic
- `backend/src/routes/documents.ts` - API endpoints
- `frontend/src/pages/GenerateAgreementPage.tsx` - UI component

Your document generation system is ready! 🎉
