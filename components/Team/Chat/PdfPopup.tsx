import styles from "@/styles/components/Team/Chat/PdfPopup.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";

import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "@/components/CreateContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import NextArrow from "@/public/NextArrow.svg";
import { usePdf } from "@mikecousins/react-pdf";

interface Close {
  setOpen: any;
  Open: any;
}

export default function PdfPopup(Close: Close) {
  const [styleSubmit, setStyleSubmit] = useState({});
  const { userExistsInSpace } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument, pdfPage } = usePdf({
    file: `${process.env.NEXT_PUBLIC_AWS + Close.Open.attachment.Key}`,
    page,
    canvasRef,
  });

  return (
    <>
      <div
        onClick={() => {
          Close.setOpen({ Bool: false, attachment: null });
          setStyleSubmit({
            background: "#364590",
            pointerEvents: "auto",
          });
        }}
        className={`${styles.overlay} ${
          Close.Open.Bool === true ? styles.visible : styles.hidden
        }`}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            className={styles.Wrapper}
          >
            <div className={styles.MidWrapper}>
              <div className={styles.SubWrapper}>
                <div className={styles.ContentWrapper}>
                  <h1 className={styles.blackHeading21px}>
                    {Close.Open.attachment.Name}
                  </h1>
                </div>
                <Plus
                  className={styles.SVGCross}
                  onClick={() => {
                    Close.setOpen({ Bool: false, attachment: null });
                    setStyleSubmit({
                      background: "#364590",
                      pointerEvents: "auto",
                    });
                  }}
                />
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
