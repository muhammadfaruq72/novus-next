import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "@/styles/components/Team/Chat/Chat.module.css";
import NextArrow from "@/public/NextArrow.svg";

interface chat {
  Chat: any;
  pageNumber: any;
  setPageNumber: any;
  numPages: any;
  setNumPages: any;
}

export default function Pdf(Props: chat) {
  const { Chat, pageNumber, setPageNumber, numPages, setNumPages } = Props;

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  return (
    <>
      {" "}
      <div className={styles.ResumeContainer}>
        {
          <Document
            className={styles.PdfStyle}
            loading=""
            file={process.env.NEXT_PUBLIC_AWS + Chat.attachment.Key}
            onLoadSuccess={onDocumentLoadSuccess}
            // renderMode="canvas"
          >
            <Page
              pageNumber={pageNumber}
              width={300}
              loading=""
              // scale={2.5}
            />
          </Document>
        }
        <div className={styles.ArrowWrapper}>
          <NextArrow
            className={styles.PrevArrow}
            onClick={goToPrevPage}
            style={
              pageNumber <= 1
                ? {
                    background: "rgba(0, 0, 0, 0.3)",
                    pointerEvents: "none",
                  }
                : {
                    background: "#364590",
                    pointerEvents: "auto",
                  }
            }
          />
          <NextArrow
            className={styles.NextArrow}
            onClick={goToNextPage}
            style={
              pageNumber >= numPages
                ? {
                    background: "rgba(0, 0, 0, 0.3)",
                    pointerEvents: "none",
                  }
                : {
                    background: "#364590",
                    pointerEvents: "auto",
                  }
            }
          />
        </div>
      </div>
    </>
  );
}
