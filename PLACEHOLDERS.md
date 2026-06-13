# Template Placeholder Reference

Use these exact placeholders in your Word document. The system will automatically replace them with actual participant data.

## Copy & Paste Ready

### Participant Personal Information

**Full Name**
```
{{participant_full_name}}
```
Example output: John Michael Smith

**First Name Only**
```
{{participant_first_name}}
```
Example output: John

**Last Name Only**
```
{{participant_last_name}}
```
Example output: Smith

### NDIS Details

**NDIS Number**
```
{{ndis_number}}
```
Example output: 1234567

**Date of Birth**
```
{{date_of_birth}}
```
Example output: 15 January 1990

### Contact Information

**Email Address**
```
{{email}}
```
Example output: john.smith@example.com

**Phone Number**
```
{{phone_number}}
```
Example output: (02) 9555 1234

**Complete Address**
```
{{address}}
```
Example output: 123 Main Street, Sydney NSW 2000

**Street Only**
```
{{address_street}}
```
Example output: 123 Main Street

**Suburb Only**
```
{{address_suburb}}
```
Example output: Sydney

**State Only**
```
{{address_state}}
```
Example output: NSW

**Postcode Only**
```
{{address_postcode}}
```
Example output: 2000

### Emergency Contact

**Emergency Contact Full Name**
```
{{emergency_contact_name}}
```
Example output: Jane Mary Smith

**Emergency Contact Phone**
```
{{emergency_contact_phone}}
```
Example output: (02) 9555 5678

**Emergency Contact Relationship**
```
{{emergency_contact_relationship}}
```
Example output: Mother / Father / Sister / Brother

### Agreement Dates

**Agreement Start Date**
```
{{agreement_start_date}}
```
Example output: 1 June 2024

**Agreement End Date**
```
{{agreement_end_date}}
```
Example output: 31 May 2025

### Additional Fields

**Agreement Notes**
```
{{agreement_notes}}
```
Example output: This service agreement covers SIL support...

**Document Generated Date**
```
{{generated_date}}
```
Example output: 12/6/2026

---

## How to Use in Your Template

### Example 1: Simple Replacement
```
Original:  "This agreement is with Kylie Furgusson"
Updated:   "This agreement is with {{participant_full_name}}"
Result:    "This agreement is with John Michael Smith"
```

### Example 2: Table Cell
| Field | Value |
|-------|-------|
| Participant Name | {{participant_full_name}} |
| NDIS Number | {{ndis_number}} |
| Date of Birth | {{date_of_birth}} |

### Example 3: Multiple Fields in One Line
```
Original:  "Service agreement for Kylie Furgusson (1234567)"
Updated:   "Service agreement for {{participant_full_name}} ({{ndis_number}})"
Result:    "Service agreement for John Michael Smith (1234567)"
```

### Example 4: Full Address Block
```
{{participant_full_name}}
{{address}}

Contact: {{phone_number}}
Email: {{email}}
```

Result:
```
John Michael Smith
123 Main Street, Sydney NSW 2000

Contact: (02) 9555 1234
Email: john.smith@example.com
```

### Example 5: Agreement Period
```
This agreement commences on {{agreement_start_date}}
and concludes on {{agreement_end_date}}.
```

Result:
```
This agreement commences on 1 June 2024
and concludes on 31 May 2025.
```

---

## Step-by-Step: Adding Placeholders to Your Template

### In Microsoft Word:

1. **Open** your template: `SA SIL - Kylie Furgusson.docx`

2. **Find the field** you want to replace
   - Example: "Kylie Furgusson"

3. **Select the text** (Ctrl+H for Find & Replace)
   - Find: `Kylie Furgusson`
   - Replace: `{{participant_full_name}}`
   - Click Replace All

4. **Repeat** for other fields:
   - Participant NDIS number → `{{ndis_number}}`
   - Date of birth → `{{date_of_birth}}`
   - Address → `{{address}}`
   - Phone → `{{phone_number}}`
   - Agreement start date → `{{agreement_start_date}}`
   - Agreement end date → `{{agreement_end_date}}`
   - Notes → `{{agreement_notes}}`

5. **Save** the file
   - File → Save (keep as .docx)

6. **Test** by generating a document
   - All {{placeholders}} should be replaced with actual data

---

## Important Notes

✅ **Case Sensitive**: Use exact names
- `{{participant_full_name}}` ✓
- `{{Participant_Full_Name}}` ✗
- `{{PARTICIPANT_FULL_NAME}}` ✗

✅ **Exact Format**: Must use double braces
- `{{field_name}}` ✓
- `{field_name}` ✗
- `[ field_name ]` ✗

✅ **No Extra Spaces**: Placeholder must be exact
- `{{participant_full_name}}` ✓
- `{{ participant_full_name }}` ✗

✅ **Field Names Only**: Use provided names
- `{{participant_full_name}}` ✓
- `{{person_name}}` ✗ (not defined)

---

## Testing Your Template

1. **Save template** with placeholders
2. **Restart backend**: `npm run dev`
3. **Create test participant** with all fields filled:
   - John Michael Smith
   - NDIS: 1234567
   - DOB: 15/01/1990
   - Email: john@example.com
   - Phone: (02) 9555 1234
   - Address: 123 Main St, Sydney NSW 2000
   - Emergency Contact: Jane Smith, (02) 9555 5678

4. **Generate agreement** document
5. **Check** all fields replaced correctly
6. **Verify** formatting looks good

---

## Custom Additions

Want to add more fields? Let me know and I can add:
- Service descriptions
- Support worker name
- Funding amounts
- Special requirements
- Signature blocks
- Witness information
- Any NDIS-specific fields

Just provide:
1. Field name
2. Where data comes from
3. Format needed (text, date, currency, etc.)

---

**Your template is now ready for document generation!** 📄
