import pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { Quotation } from "../schemas/quotation.schema";
import { format } from "date-fns";
import { vfs as initVFS } from "../assets/fonts/vfs_fonts";

// Defining and Using Custom Fonts
const pdfMakeFonts = {
  "Courier Prime": {
    normal: "CourierPrime-Regular.ttf",
    bold: "CourierPrime-Bold.ttf",
    italics: "CourierPrimeItalic.ttf",
    bolditalics: "CourierPrimeBoldItalic.ttf",
  },
};

// const COL_HEADER_FONT_SIZE = 12

export const pdfMaker = async (quotation: Quotation) => {
  const PDF_NAME = `${quotation.to.name}-${quotation.id}-${quotation.createdAt}`;
  const vfs = initVFS;
  if (!vfs) {
    console.error("Unable to init VFS");
  }
  pdfMake.vfs = vfs;

  const docDefinition: TDocumentDefinitions = {
    info: {
      author: "Quote Gen App",
      title: PDF_NAME,
      subject: "Quotation/Invoice",
    },
    images: {
      companyLogo: { url: quotation.companyLogo },
    },
    content: [
      {
        columns: [
          {
            image: "companyLogo",
            width: 100,
            height: 100,
          },
          {
            stack: [
              { text: quotation.from.name, style: "companyName" },
              {
                text: `
                ${quotation.from.address}\n
                ${quotation.from.phoneNumber}\n
                KRA PIN: ${quotation.from.taxID}`,
                style: "companyInfo",
              },
            ],
            alignment: "right",
          },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 2.5,
            lineColor: "black",
          },
        ],
        margin: [0, 5, 0, 10],
      },
      {
        columns: [
          {
            text: [
              {
                text: `To:\n`,
                style: "billedToLabel",
              },
              {
                text: `${quotation.to.name}\n`,
                style: "billedTo",
              },
              {
                text: `${quotation.to.address}\n`,
                style: "billedTo",
              },
            ],
            width: "60%",
          },
          {
            text: [
              {
                text: "Quote #\n",
                style: "invoiceLabel",
              },
              {
                text: `${quotation.id}\n`,
                style: "invoiceNumber",
              },
              {
                text: "Date:\n",
                style: "invoiceLabel",
              },
              {
                text: `${format(quotation.createdAt, "do MMMM yyyy")}\n`,
                style: "invoiceDate",
              },
            ],
            alignment: "right",
            width: "40%",
          },
        ],
        margin: [0, 10, 0, 20],
      },
      {
        style: "itemsTable",
        table: {
          widths: ["*", 75, 100, 100],
          headerRows: 1,
          body: [
            [
              {
                text: "Description",
                style: "tableHeader",
              },
              { text: "QTY", style: "tableHeaderRight" },
              {
                text: "Unit Price",
                style: "tableHeaderRight",
              },
              { text: "Total", style: "tableHeaderRight" },
            ],
            ...quotation.items.map((it) => [
              { text: it.description },
              { text: it.qty, style: "numericCol" },
              { text: it.price.toLocaleString(), style: "numericCol" },
              {
                text: (it.price * it.qty).toLocaleString(),
                style: "numericCol",
              },
            ]),
            [
              {
                text: "Total",
                colSpan: 3,
                alignment: "right",
                style: "totalLabel",
              },
              {},
              {},
              {
                text: `Ksh ${quotation.items
                  .reduce((acc, curr) => (acc += curr.price * curr.qty), 0)
                  .toLocaleString()}`,
                style: {
                  bold: true,
                },
                alignment: "right",
              },
            ],
            [
              {
                text: "Prices inclusive of 16% VAT",
                colSpan: 4,
                alignment: "center",
                style: "invoiceLabel",
                margin: [0, 10],
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      logo: { fontSize: 30, bold: true, color: "#4736e7" },
      numericCol: { alignment: "right" },
      companyName: {
        fontSize: 16,
        bold: true,
        color: "#333333",
      },
      companyInfo: { fontSize: 10, color: "#555555", lineHeight: 0.8 },
      billedToLabel: {
        bold: true,
        fontSize: 12,
        color: "#333333",
      },
      billedTo: {
        fontSize: 10,
        color: "#555555",
        lineHeight: 1.5,
      },
      invoiceLabel: {
        fontSize: 10,
        bold: true,
        color: "#333333",
      },
      invoiceNumber: { fontSize: 10, color: "#555555" },
      invoiceDate: { fontSize: 10, color: "#555555" },
      paymentMethod: { fontSize: 10, color: "#555555" },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "black",
      },
      tableHeaderRight: {
        bold: true,
        fontSize: 12,
        color: "black",
        alignment: "right",
      },
      totalLabel: { bold: true, fontSize: 12 },
    },
    defaultStyle: {
      columnGap: 20,
      font: "Courier Prime",
    },
  };

  pdfMake.fonts = pdfMakeFonts;

  return pdfMake.createPdf(docDefinition).download(`${PDF_NAME}.pdf`);
};
