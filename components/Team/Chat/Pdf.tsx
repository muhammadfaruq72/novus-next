import { useMemo, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "@/styles/components/Team/Chat/Chat.module.css";
import NextArrow from "@/public/NextArrow.svg";
import { usePdf } from "@mikecousins/react-pdf";

interface chat {
  Chat: any;
}

export default function Pdf(Props: chat) {
  const { Chat } = Props;

  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument, pdfPage } = usePdf({
    file: `${process.env.NEXT_PUBLIC_AWS + Chat.attachment.Key}`,
    page,
    canvasRef,
  });

  return (
    <>
      <div className={styles.WrapperCanvas}>
        {/* {!pdfDocument && <span>Loading...</span>} */}
        <canvas className={styles.Canvas} ref={canvasRef} />
        {Boolean(pdfDocument && pdfDocument.numPages) && (
          <div className={styles.ArrowWrapper}>
            <NextArrow
              className={styles.PrevArrow}
              onClick={() => setPage(page - 1)}
              style={
                page === 1
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
              onClick={() => setPage(page + 1)}
              style={
                page === pdfDocument!.numPages
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
        )}
      </div>
    </>
  );
}
