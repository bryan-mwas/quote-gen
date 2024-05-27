import "./App.css";
import jsPDF from "jspdf";
import { PdfPreview } from "./pdfPreview";
import { useRef } from "react";
import { Button } from "flowbite-react";

function App() {
  const reportTemplateRef = useRef(null);

  const handlePdfGeneration = () => {
    const doc = new jsPDF();

    doc.html(reportTemplateRef.current as unknown as HTMLElement, {
      async callback(doc) {
        doc.save();
      },
    });
  };

  return (
    <div>
      <Button onClick={handlePdfGeneration}>Gen PDF</Button>
      <div ref={reportTemplateRef}>
        <PdfPreview />
      </div>
    </div>
  );
}

export default App;
