import styles from "@/styles/components/Team/Chat/Chat.module.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import Plus from "@/public/Plus.svg";
// import { VideoPlayer } from "@videojs-player/react";
// import "video.js/dist/video-js.css";
import { Document, Page, pdfjs } from "react-pdf";
import miniComponents from "@/styles/miniComponents.module.css";

const imageTypes = ["png", "jpeg", "jpg"];
const videoTypes = ["mp4"];
const pdfType = ["pdf"];

function CheckTypes(
  FileExtension: string,
  Image: Boolean,
  Video: Boolean,
  Pdf: Boolean
) {
  if (Image) {
    return imageTypes.some((type) => FileExtension.includes(type));
  }
  if (Video) {
    return videoTypes.some((type) => FileExtension.includes(type));
  }
  if (Pdf) {
    return pdfType.some((type) => FileExtension.includes(type));
  }
}

export default function AttachmentArea() {
  const {
    selectedImages,
    setSelectedImages,
    selectedFilesArray,
    setSelectedFilesArray,
  } = useContext(AuthContext);
  return (
    <>
      {selectedImages.length > 0 && (
        <div className={styles.attachmentWrapper}>
          <div className={styles.ImageWrapper}>
            {CheckTypes(
              selectedImages[0].Imagename.split(".")[1],
              true,
              false,
              false
            ) && (
              <img
                className={styles.Image}
                src={selectedImages[0].originalImage}
              ></img>
            )}
            {CheckTypes(
              selectedImages[0].Imagename.split(".")[1],
              false,
              true,
              false
            ) && (
              <div
                // className={styles.videoPlayer}
                onContextMenu={(e) => e.preventDefault()}
              >
                <video style={{ height: "130px" }} controls>
                  <source
                    src={selectedImages[0].originalImage}
                    type="video/mp4"
                  />
                </video>
              </div>
            )}

            {CheckTypes(
              selectedImages[0].Imagename.split(".")[1],
              false,
              false,
              true
            ) && (
              <div className={styles.ResumeContainer}>
                <Document
                  className={styles.PdfStyle}
                  loading=""
                  file={selectedImages[0].originalImage}
                >
                  <Page pageNumber={1} height={130} loading="" />
                </Document>
              </div>
            )}
            <div
              className={styles.CrossButton}
              onClick={() => {
                setSelectedImages(
                  selectedImages.filter(
                    (e: any) => e.Imagename !== selectedImages[0].Imagename
                  )
                );
                setSelectedFilesArray(
                  selectedFilesArray.filter(
                    (e: any) => e.name !== selectedFilesArray[0].name
                  )
                );
              }}
            >
              <Plus className={styles.SVGCross} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
