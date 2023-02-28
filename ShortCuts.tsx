import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Client from "@/public/Client.svg";
import { Upload } from "@aws-sdk/lib-storage";
import {
  S3Client,
  S3,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

export default function ABC() {
  return <></>;
}

const Obj = new S3({
  credentials: {
    accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
    secretAccessKey: `${process.env.NEXT_PUBLIC_SECRETECCESSKEY}`,
  },
  region: `${process.env.NEXT_PUBLIC_REGION}`,
});

Obj.putObject({
  Key: `EmptyFolder/`,
  Bucket: "novus-bucket-by-the-handler",
});

// try {
//   const parallelUploads3 = new Upload({
//     client: new S3Client({
//       credentials: {
//         accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
//         secretAccessKey: `${process.env.NEXT_PUBLIC_SECRETECCESSKEY}`,
//       },
//       region: "ap-south-1",
//     }),
//     params: {
//       Bucket: "novus-bucket-by-the-handler",
//       Key: `Workspace/Channel/${selectedFiles[0].name}`,
//       Body: selectedFiles[0],
//     },

//     tags: [
//       /*...*/
//     ], // optional tags
//     // queueSize: 4, // optional concurrency configuration
//     // partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
//     leavePartsOnError: false, // optional manually handle dropped parts
//   });

//   parallelUploads3.on("httpUploadProgress", (progress) => {
//     console.log(progress);
//   });

//   await parallelUploads3.done();
// } catch (e) {
//   console.log(e);
// }

// try {
//   const s3Client = new S3Client({
//     credentials: {
//       accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
//       secretAccessKey: `${process.env.NEXT_PUBLIC_SECRETECCESSKEY}`,
//     },
//     region: "ap-south-1",
//   });

//   const bucketParams = {
//     Bucket: "novus-bucket-by-the-handler",
//     Key: "Workspace/Channel/image 1.jpg",
//   };

//   const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
//   console.log("Success. Object deleted.", data);
//   return data; // For unit tests.
// } catch (err) {
//   console.log("Error", err);
// }
