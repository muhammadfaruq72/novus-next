import styles from "@/styles/components/Team/Chat/Chat.module.css";
import Plus from "@/public/Plus.svg";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";

interface ImagesOBJ {
  Imagename?: string;
  originalImage: string;
}

export default function InputFiles() {
  const {
    selectedImages,
    setSelectedImages,
    selectedFilesArray,
    setSelectedFilesArray,
  } = useContext(AuthContext);

  async function ManupulateFiles(Files: any) {
    console.log("ManupulateFiles");
    var selectedFiles: File[] = Array.from(Files);
    // for (const File of selectedFiles) {
    //   if (File.size > 1024000) {
    //     console.log(File.size);
    //     selectedFiles = [];
    //     alert(
    //       `"${File.name}" is larger than 1 Mb. Please, add image less than 1MB.`
    //     );
    //   }
    // }
    // if (selectedFiles.length > 1) {
    //   selectedFiles = [];
    //   alert(`You can only add 1 File at a time.`);
    // }

    setSelectedFilesArray(selectedFilesArray.concat(selectedFiles));
    //selectedFilesArray = selectedFilesArray.concat(selectedFiles);

    const imagesArray: Array<ImagesOBJ> = selectedFiles.map((image: any) => {
      return {
        Imagename: image.name,
        originalImage: URL.createObjectURL(image),
      };
    });

    selectedFiles = [];
    setSelectedImages(selectedImages.concat(imagesArray));
  }

  const onSelectFile = async (event: any) => {
    ManupulateFiles(event.target.files);
  };

  // useEffect(() => {
  //   console.log(selectedImages, selectedFilesArray);
  // }, [selectedImages, selectedFilesArray]);

  return (
    <>
      <label
        style={{ margin: "0 auto" }}
        onClick={() => {
          setSelectedImages([]);
          setSelectedFilesArray([]);
        }}
      >
        <Plus className={styles.svg_Plus} />
        <input
          style={{ display: "none" }}
          type="file"
          className={styles.inputImage}
          onChange={onSelectFile}
          multiple
          accept="image/png, image/jpeg, image/jpg, video/mp4, application/pdf"
        ></input>
      </label>
    </>
  );
}
