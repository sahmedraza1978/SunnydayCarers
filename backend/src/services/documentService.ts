import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

// Map participant data to document fields
export const mapParticipantToFields = (participant: any): Record<string, string> => {
  return {
    participant_full_name: `${participant.first_name} ${participant.last_name}`,
    participant_first_name: participant.first_name,
    participant_last_name: participant.last_name,
    ndis_number: participant.ndis_number,
    date_of_birth: formatDate(participant.date_of_birth),
    email: participant.email || '',
    phone_number: participant.phone_number || '',
    address: formatAddress(participant),
    emergency_contact_name: participant.emergency_contact_name || '',
    emergency_contact_phone: participant.emergency_contact_phone || '',
    emergency_contact_relationship: participant.emergency_contact_relationship || '',
    agreement_start_date: formatDate(participant.start_date),
    agreement_end_date: formatDate(participant.end_date),
    agreement_notes: participant.notes || '',
    generated_date: new Date().toLocaleDateString(),
  };
};

// Format date for document
const formatDate = (date: any): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format address
const formatAddress = (participant: any): string => {
  const parts = [
    participant.address_street,
    participant.address_suburb,
    participant.address_state,
    participant.address_postcode,
  ].filter(Boolean);
  return parts.join(', ');
};

// Generate document by replacing placeholders in template
export const generateDocument = async (
  agreement: any,
  format: string = 'docx'
): Promise<Buffer> => {
  const templatePath = path.join(__dirname, '../../templates/SA-SIL-Template.docx');

  // Check template exists
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  // Read template file
  const templateBuffer = fs.readFileSync(templatePath);

  // Load DOCX as ZIP
  const zip = new JSZip();
  await zip.loadAsync(templateBuffer);

  // Get field data
  const fieldData = mapParticipantToFields(agreement);

  // Process document.xml (main content)
  let documentXml = await zip.file('word/document.xml')?.async('text') || '';
  documentXml = replaceFields(documentXml, fieldData);
  zip.file('word/document.xml', documentXml);

  // Process document.xml.rels if needed
  try {
    let docRels = await zip.file('word/_rels/document.xml.rels')?.async('text') || '';
    zip.file('word/_rels/document.xml.rels', docRels);
  } catch (e) {
    // Not critical
  }

  // Update document properties
  let docProps = await zip.file('docProps/core.xml')?.async('text') || '';
  docProps = docProps.replace(/<dc:date>.*?<\/dc:date>/g, `<dc:date>${new Date().toISOString()}</dc:date>`);
  zip.file('docProps/core.xml', docProps);

  // Generate new DOCX buffer
  const newDocxBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  return newDocxBuffer;
};

// Replace field placeholders in XML
const replaceFields = (xml: string, fields: Record<string, string>): string => {
  let result = xml;

  for (const [key, value] of Object.entries(fields)) {
    // Replace placeholders like {{field_name}}
    const placeholder = `{{${key}}}`;
    const regex = new RegExp(placeholder, 'g');
    result = result.replace(regex, escapeXmlValue(value || ''));
  }

  return result;
};

// Escape special XML characters
const escapeXmlValue = (value: string): string => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const documentService = {
  generateDocument,
  mapParticipantToFields,
};
