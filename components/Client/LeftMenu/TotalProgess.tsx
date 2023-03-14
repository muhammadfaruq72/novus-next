import { Line } from "rc-progress";
import styles from "@/styles/components/Team/LeftMenu/LeftMenu.module.css";
import fonts from "@/styles/fonts.module.css";
import Progress from "@/public/progress.svg";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";

export default function TotalProgess() {
  const { userExistsInSpace } = useContext(AuthContext);

  return (
    <>
      <div className={styles.Progress}>
        <div className={styles.Database}>
          <Progress />
          <p className={fonts.lightBlack13px}>Progress</p>
        </div>
        <Line
          style={{ width: "100%" }}
          percent={60}
          strokeWidth={1}
          trailWidth={1}
          strokeColor="#364590"
          trailColor={"#E2DFE7"}
        />
      </div>
    </>
  );
}
