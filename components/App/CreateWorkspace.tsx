import styles from "@/styles/components/App/CreateWorkspace.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Plus from "@/public/Plus.svg";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

interface Close {
  setOpen: any;
  Open: any;
}

export default function CreateWorkspace(Close: Close) {
  const [styleSubmit, setStyleSubmit] = useState({});

  const Mutation = gql`
    mutation MyMutation($email: String!, $Name: String!) {
      Workspace(email: $email, Name: $Name) {
        message
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        console.log(data);
        if (data.Workspace.message === "Success") {
          console.log(data.Workspace.message);
          Close.setOpen(false);
        }
        if (data.Workspace.message === "Failed") {
          alert("This Workspace name already exits. Please try another name.");
        }
      },
    }
  );

  let CreateWorkSpace = (event: any) => {
    event.preventDefault();
    var Name = event.target.text.value;
    var email = localStorage.getItem("email");
    mutate({ variables: { email, Name } });
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
                Create Client Workspace
              </h1>
              <p
                style={{ marginTop: "-30px", maxWidth: "400px" }}
                className={fonts.greyBody14px}
              >
                Write the name of your workspace - choose something that your
                client will recognize.
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
