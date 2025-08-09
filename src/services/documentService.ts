import Handlebars from 'handlebars';
import jsPDF from 'jspdf';
import { legalTemplates } from '../templates/legalTemplates';

export interface TemplateData {
  [key: string]: string;
}

class DocumentService {
  getTemplates(): string[] {
    return Object.keys(legalTemplates);
  }

  fillTemplate(name: string, data: TemplateData): string {
    const template = legalTemplates[name];
    if (!template) {
      throw new Error('Template not found');
    }
    const compile = Handlebars.compile(template);
    return compile(data);
  }

  exportPdf(content: string): Uint8Array {
    const doc = new jsPDF();
    const lines = content.split('\n');
    let y = 10;
    lines.forEach((line) => {
      doc.text(line, 10, y);
      y += 10;
    });
    return doc.output('arraybuffer');
  }

  async sendForSignature(pdf: Uint8Array, signerEmail: string): Promise<void> {
    const blob = new Blob([pdf], { type: 'application/pdf' });
    await fetch('https://api.example.com/esign', {
      method: 'POST',
      headers: {
        'X-Signer-Email': signerEmail
      },
      body: blob
    });
  }
}

export const documentService = new DocumentService();
