import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(__dirname, '../../templates');

export const templateService = {
  // Get template file path
  getTemplatePath: (filename: string) => {
    return path.join(TEMPLATES_DIR, filename);
  },

  // List all template files
  listTemplateFiles: () => {
    if (!fs.existsSync(TEMPLATES_DIR)) {
      return [];
    }
    return fs.readdirSync(TEMPLATES_DIR).filter((file) => file.endsWith('.docx'));
  },

  // Get template file content
  getTemplateFile: (filename: string): Buffer => {
    const filePath = path.join(TEMPLATES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Template file not found: ${filename}`);
    }
    return fs.readFileSync(filePath);
  },

  // Create template structure for storing in database
  createTemplateContent: (
    templateName: string,
    description: string,
    fields: Record<string, string>
  ) => {
    return {
      name: templateName,
      description,
      template_file: templateName,
      fields: fields,
      created_at: new Date().toISOString(),
    };
  },
};
