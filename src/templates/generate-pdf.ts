import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import {
  BillingCompany,
  ClientCompany,
  OrderItem,
  Quotation,
} from "../schemas/quotation.schema";

interface TextOptions {
  x: number;
  y: number;
  size?: number;
  font?: string;
  color?: [number, number, number];
}
export class InvoiceGenerator {
  private pdfDoc!: PDFDocument;
  private page!: PDFPage;
  private fonts: { [key: string]: PDFFont } = {};
  private margin = 50;
  private pageHeight = 792; // US Letter
  private pageWidth = 612;
  private currentY: number;

  constructor() {
    this.currentY = this.pageHeight - this.margin;
  }

  private async initialize(): Promise<void> {
    this.pdfDoc = await PDFDocument.create();
    this.page = this.pdfDoc.addPage([this.pageWidth, this.pageHeight]);

    // Load standard fonts
    this.fonts = {
      regular: await this.pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await this.pdfDoc.embedFont(StandardFonts.HelveticaBold),
    };
  }

  private async addText(text: string, options: TextOptions): Promise<number> {
    const { x, y, size = 10, font = "regular", color = [0, 0, 0] } = options;

    const textFont = this.fonts[font];
    const textWidth = textFont.widthOfTextAtSize(text, size);

    this.page.drawText(text, {
      x,
      y,
      size,
      font: textFont,
      color: rgb(color[0], color[1], color[2]),
    });

    return textWidth;
  }

  private async addWrappedText(
    text: string,
    options: TextOptions & { maxWidth: number }
  ): Promise<number> {
    const { maxWidth, size = 10, font = "regular" } = options;
    const textFont = this.fonts[font];
    const words = text.split(" ");
    let line = "";
    let yOffset = 0;

    for (const word of words) {
      const testLine = line + (line ? " " : "") + word;
      const textWidth = textFont.widthOfTextAtSize(testLine, size);

      if (textWidth > maxWidth && line) {
        await this.addText(line, { ...options, y: options.y - yOffset });
        line = word;
        yOffset += size + 2;
      } else {
        line = testLine;
      }
    }

    if (line) {
      await this.addText(line, { ...options, y: options.y - yOffset });
      yOffset += size + 2;
    }

    return yOffset;
  }

  private async addLogo(logoUrl: string): Promise<void> {
    console.log("logoUrl", logoUrl);
    try {
      const imageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
      console.log("imageBytes", imageBytes);
      const image = await this.pdfDoc.embedPng(imageBytes);
      const dimensions = image.scale(0.5);

      this.page.drawImage(image, {
        x: this.margin,
        y: this.pageHeight - this.margin - dimensions.height,
        width: dimensions.width,
        height: dimensions.height,
      });

      this.currentY -= dimensions.height + 20;
    } catch (error) {
      console.error("Error loading logo:", error);
    }
  }

  private async addCompanyDetails(
    _title: string,
    details: BillingCompany | ClientCompany,
    headerText: string
  ): Promise<void> {
    // Add header
    await this.addText(headerText, {
      x: this.margin,
      y: this.currentY,
      size: 12,
      font: "bold",
    });
    this.currentY -= 20;

    // Add details
    const detailsArray = [
      details.name,
      details.address,
      `Phone: ${details.phoneNumber}`,
      `Email: ${details.email}`,
      details.taxID ? `Tax ID: ${details.taxID}` : "",
    ].filter(Boolean);

    for (const detail of detailsArray) {
      const height = await this.addWrappedText(detail, {
        x: this.margin,
        y: this.currentY,
        maxWidth: 250,
      });
      this.currentY -= height;
    }

    this.currentY -= 20;
  }

  private async addItemsTable(items: OrderItem[]): Promise<void> {
    const columns = ["Description", "Qty", "Price", "Total"];
    const columnWidths = [280, 40, 80, 80];
    const startX = this.margin;
    let x = startX;

    // Add header
    for (let i = 0; i < columns.length; i++) {
      await this.addText(columns[i], {
        x,
        y: this.currentY,
        font: "bold",
      });
      x += columnWidths[i];
    }
    this.currentY -= 20;

    // Add items
    let total = 0;
    for (const item of items) {
      const itemTotal = item.qty * item.price;
      total += itemTotal;

      // Check if we need a new page
      if (this.currentY < 100) {
        this.page = this.pdfDoc.addPage([this.pageWidth, this.pageHeight]);
        this.currentY = this.pageHeight - this.margin;

        // Repeat headers
        x = startX;
        for (let i = 0; i < columns.length; i++) {
          await this.addText(columns[i], {
            x,
            y: this.currentY,
            font: "bold",
          });
          x += columnWidths[i];
        }
        this.currentY -= 20;
      }

      x = startX;

      // Description
      await this.addWrappedText(item.description, {
        x,
        y: this.currentY,
        maxWidth: columnWidths[0],
      });
      x += columnWidths[0];

      // Quantity
      await this.addText(item.qty.toString(), {
        x,
        y: this.currentY,
      });
      x += columnWidths[1];

      // Price
      await this.addText(item.price.toFixed(2), {
        x,
        y: this.currentY,
      });
      x += columnWidths[2];

      // Total
      await this.addText(itemTotal.toFixed(2), {
        x,
        y: this.currentY,
      });

      this.currentY -= 20;
    }

    // Add total
    this.currentY -= 10;
    await this.addText("Total:", {
      x: this.pageWidth - 180,
      y: this.currentY,
      font: "bold",
    });
    await this.addText(total.toFixed(2), {
      x: this.pageWidth - 80,
      y: this.currentY,
      font: "bold",
    });
  }

  public async generateInvoice(quotation: Quotation): Promise<Uint8Array> {
    await this.initialize();

    // Add logo if provided
    if (quotation.companyLogo) {
      await this.addLogo(quotation.companyLogo);
    }

    // Add title and date
    await this.addText(quotation.title, {
      x: this.margin,
      y: this.currentY,
      size: 24,
      font: "bold",
    });

    await this.addText(
      `Date: ${new Date(quotation.createdAt).toLocaleDateString()}`,
      {
        x: this.pageWidth - 200,
        y: this.currentY,
        size: 10,
      }
    );
    this.currentY -= 40;

    // Add company details
    await this.addCompanyDetails(quotation.title, quotation.from, "From:");
    await this.addCompanyDetails(quotation.title, quotation.to, "To:");

    // Add items table
    await this.addItemsTable(quotation.items);

    // Return the PDF as bytes
    return this.pdfDoc.save();
  }
}

export const generateInvoicePDF = async (quotation: Quotation) => {
  const generator = new InvoiceGenerator();
  const pdfBytes = await generator.generateInvoice(quotation);

  // Create a blob from the PDF bytes
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quotation.id}_invoice.pdf`;

  // Append to document, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the blob URL
  window.URL.revokeObjectURL(url);
};

// Example usage:
/*
const quotationData: IQuotation = {
    companyLogo: "https://example.com/logo.png",
    createdAt: "2025-01-16",
    from: {
        name: "ABC Company",
        email: "contact@abc.com",
        phoneNumber: "123-456-7890",
        address: "123 Business St, City, Country",
        taxID: "TAX123456"
    },
    to: {
        name: "Client XYZ",
        email: "client@xyz.com",
        phoneNumber: "098-765-4321",
        address: "456 Client Ave, City, Country",
        taxID: "TAX789012"
    },
    id: "INV-2025-001",
    items: [
        {
            description: "Web Development Services",
            qty: 1,
            price: 1500.00
        },
        {
            description: "Hosting (Annual)",
            qty: 1,
            price: 200.00
        }
    ],
    title: "Invoice"
};

const generator = new InvoiceGenerator();
const pdfBytes = await generator.generateInvoice(quotationData);

// Save to file
const fs = require('fs');
fs.writeFileSync(`${quotationData.id}_invoice.pdf`, pdfBytes);
*/
