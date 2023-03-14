import { Line } from "rc-progress";
import styles from "@/styles/components/Team/LeftMenu/LeftMenu.module.css";
import fonts from "@/styles/fonts.module.css";
import Database from "@/public/Database.svg";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";

export default function Progressbar() {
  const { userExistsInSpace } = useContext(AuthContext);
  const [Filestorate, setFilestorate] = useState({ GB: 0, percentage: 0 });

  useEffect(() => {
    try {
      const s3Client = new S3Client({
        credentials: {
          accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
          secretAccessKey: `${process.env.NEXT_PUBLIC_SECRETECCESSKEY}`,
        },
        region: "ap-south-1",
      });

      const bucketParams = {
        Bucket: "novus-bucket-by-the-handler",
        Prefix: userExistsInSpace.space_id,
      };

      const run = async () => {
        try {
          const data: any = await s3Client.send(
            new ListObjectsCommand(bucketParams)
          );

          let GB: any = 0.0;
          data.Contents.forEach((item: any) => {
            GB += item.Size;
          });
          GB = (GB / 8589934592).toFixed(1);
          let percentage = ((GB / 5) * 100).toFixed(1);
          setFilestorate({ GB: GB, percentage: parseFloat(percentage) });

          return data; // For unit tests.
        } catch (err) {
          console.log("Error", err);
        }
      };
      run();
    } catch (err) {
      console.log("Error", err);
    }
  }, []);

  return (
    <>
      <div className={styles.Progress}>
        <div className={styles.Database}>
          <Database />
          <p className={fonts.lightBlack13px}> {Filestorate.GB} GB of 5 GB</p>
        </div>
        <Line
          style={{ width: "100%" }}
          percent={Filestorate.percentage}
          strokeWidth={1}
          trailWidth={1}
          strokeColor="#364590"
          trailColor={"#E2DFE7"}
        />
      </div>
    </>
  );
}
