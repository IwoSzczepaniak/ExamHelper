import { usePdf } from "@mikecousins/react-pdf";
import { useRef, useState, useEffect } from "react";
import { usePdfSearch } from "../contexts/PdfSearchContext";

interface MyPdfViewerProps {
  file: string;
  query?: string;
}

const MyPdfViewer: React.FC<MyPdfViewerProps> = ({ file, query }) => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);
  const { searchQuery } = usePdfSearch();

  const { pdfDocument } = usePdf({
    file: `${process.env.REACT_APP_API_URL}/${file}`,
    page,
    canvasRef,
  });

  useEffect(() => {
    const searchInPdf = async () => {
      const querySth = searchQuery || query;
      if (!pdfDocument || !querySth) return;

      // Search through pages until we find a match
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(" ");

        const queryWords = querySth.toLowerCase().split(' ');
        const matchCount = queryWords.filter(word => 
          text.toLowerCase().includes(word)
        ).length;
        const matchPercentage = (matchCount / queryWords.length) * 100;
        
        if (matchPercentage >= 80) {
          setPage(pageNum);
          break;
        }
      }
    };

    searchInPdf();
  }, [pdfDocument, query, searchQuery]);

  return (
    <div className="pdf-viewer">
      {pdfDocument && pdfDocument.numPages && (
        <nav className="pdf-navigation">
          <button
            className="pdf-nav-button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="pdf-page-info">
            Page {page} of {pdfDocument?.numPages}
          </span>
          <button
            className="pdf-nav-button"
            disabled={page === pdfDocument?.numPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
      <div className="pdf-canvas-container">
        {!pdfDocument && <span>Loading...</span>}
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default MyPdfViewer;
