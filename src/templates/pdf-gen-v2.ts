import PDFDocument from "pdfkit";
import { Quotation } from "../schemas/quotation.schema";
import fs from "fs";

export function createInvoice(_quote: Quotation, path: string) {
  const doc: PDFKit.PDFDocument = new PDFDocument({ size: "A4", margin: 50 });
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}
