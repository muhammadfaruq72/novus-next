import styles from "@/styles/components/App/CreateWorkspace.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Plus from "@/public/Plus.svg";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { S3 } from "@aws-sdk/client-s3";

const CreateDirectory = (Directory: string) => {
  const Obj = new S3({
    credentials: {
      accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
      secretAccessKey: `${process.env.NEXT_PUBLIC_SECRETECCESSKEY}`,
    },
    region: `${process.env.NEXT_PUBLIC_REGION}`,
  });

  Obj.putObject({
    Key: `${Directory}/`,
    Bucket: "novus-bucket-by-the-handler",
  });
};

interface Close {
  setOpen: any;
  Open: any;
  IsClient: any;
}

export default function CreateWorkspace(Close: Close) {
  const router = useRouter();
  const [styleSubmit, setStyleSubmit] = useState({});

  const Mutation = gql`
    mutation MyMutation($email: String!, $Name: String!, $isClient: Boolean) {
      Workspace(email: $email, Name: $Name, isClient: $isClient) {
        spaceId
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        console.log(data);
        if (data.Workspace !== null) {
          console.log(data.Workspace.spaceId);
          CreateDirectory(data.Workspace.spaceId);
          Close.setOpen(false);
          requestPermission();
          router.push("/" + data.Workspace.spaceId);
        }
        if (data.Workspace === null) {
          alert("This Workspace name already exits. Please try another name.");
        }
      },
    }
  );

  let CreateWorkSpace = (event: any) => {
    event.preventDefault();
    var Name = event.target.text.value;
    var email = localStorage.getItem("email");
    var isClient: Boolean = Close.IsClient;
    mutate({ variables: { email, Name, isClient } });
  };

  useEffect(() => {
    if (loading === true) {
      setStyleSubmit({
        background: "rgba(0, 0, 0, 0.3)",
        pointerEvents: "none",
      });
    }
    if (loading === false) {
      setStyleSubmit({
        background: "#364590",
        pointerEvents: "auto",
      });
    }
  }, [loading]);

  function requestPermission() {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications!");
    } else if (Notification.permission === "granted") {
      // sendNotification("message", "user");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          // sendNotification("message", "user");
        }
      });
    }
  }

  return (
    <>
      <div
        onClick={() => {
          Close.setOpen(false);
        }}
        className={`${styles.overlay} ${
          Close.Open === true ? styles.visible : styles.hidden
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
            onClick={(e: any) => e.stopPropagation()}
            className={styles.Wrapper}
          >
            <Plus
              className={styles.SVGCross}
              onClick={() => {
                Close.setOpen(false);
              }}
            />

            <div className={styles.ContentWrapper}>
              <h1 className={fonts.blackHeading21px}>
                {Close.IsClient
                  ? "Create Client Workspace"
                  : "Create Team Workspace"}
              </h1>
              <p
                style={{ marginTop: "-30px", maxWidth: "400px" }}
                className={fonts.greyBody14px}
              >
                Write the name of your workspace - choose something that users
                will recognize.
              </p>
              <form className={miniComponents.forms} onSubmit={CreateWorkSpace}>
                <input
                  name="text"
                  type={"text"}
                  required={true}
                  placeholder="Ex: Digital Marketing"
                ></input>
                <input type="submit" value="Create" style={styleSubmit}></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
