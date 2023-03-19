import { Line } from "rc-progress";
import styles from "@/styles/components/Team/LeftMenu/LeftMenu.module.css";
import fonts from "@/styles/fonts.module.css";
import Progress from "@/public/progress.svg";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import { gql, useMutation, useQuery } from "@apollo/client";

export default function TotalProgess() {
  const { userExistsInSpace } = useContext(AuthContext);
  const [percent, setPercent] = useState(0);

  const MembersQUERY = gql`
    query MyQuery($spaceId: String!) {
      ProgressTasks(spaceId: $spaceId)
    }
  `;

  const {
    data: manageMembersData,
    loading: manageMembersLoading,
    refetch: manageMembersRefetch,
  } = useQuery(MembersQUERY, {
    variables: {
      spaceId: userExistsInSpace.space_id,
    },
  });

  useEffect(() => {
    if (typeof manageMembersData !== "undefined") {
      setPercent(manageMembersData.ProgressTasks);
    }
  }, [manageMembersData]);

  return (
    <>
      <div className={styles.Progress}>
        <div className={styles.Database}>
          <Progress style={{ height: "13px", stroke: "#404040" }} />
          <p className={fonts.lightBlack13px}>Progress</p>
        </div>
        <Line
          style={{ width: "100%" }}
          percent={percent}
          strokeWidth={1}
          trailWidth={1}
          strokeColor="#364590"
          trailColor={"#E2DFE7"}
        />
      </div>
    </>
  );
}
