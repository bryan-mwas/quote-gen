import "./App.css";
import jsPDF from "jspdf";
import { PdfPreview } from "./pdfPreview";
import { useRef } from "react";

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
      <button onClick={handlePdfGeneration}>Gen PDF</button>
      <div ref={reportTemplateRef}>
        <PdfPreview />
      </div>
    </div>
  );
}

export default App;
