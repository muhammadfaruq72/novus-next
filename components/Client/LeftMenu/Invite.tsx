import styles from "@/styles/components/Team/LeftMenu/Invite.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";

import { useEffect, useState, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { gql, useMutation } from "@apollo/client";

var TotalPeople: number;

interface Close {
  setOpen: any;
  Open: any;
}

export default function Invite(Close: Close) {
  const [styleSubmit, setStyleSubmit] = useState({});
  const { userExistsInSpace } = useContext(AuthContext);
  // const [Textvalue, setTextvalue] = useState("Copy Invite Link");
  const [Copy, setCopy] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCreated, setIsLinkCreated] = useState(false);

  const Mutation = gql`
    mutation MyMutation($spaceId: String!, $TotalPeople: Int!) {
      CreateInviteLink(spaceId: $spaceId, TotalPeople: $TotalPeople) {
        CreatedOn
        PeopleAdded
        TotalPeople
        uuid
        Workspace {
          spaceId
        }
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        console.log(data);

        if (data.CreateInviteLink !== null) {
          setIsLinkCreated(true);
          setCopy(
            process.env.NEXT_PUBLIC_HOST +
              "/" +
              userExistsInSpace.space_id +
              "/" +
              data.CreateInviteLink.uuid
          );
        }
        if (data.CreateInviteLink === null) {
          alert("Something Went Wrong");
        }
      },
    }
  );

  let InviteUser = (event: any) => {
    event.preventDefault();
    try {
      TotalPeople = parseInt(event.target.number.value);
      var spaceId = userExistsInSpace.space_id;
      mutate({ variables: { spaceId, TotalPeople } });
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   if (loading === true) {
  //     setStyleSubmit({
  //       background: "rgba(0, 0, 0, 0.3)",
  //       pointerEvents: "none",
  //     });
  //   }
  // }, [loading]);

  return (
    <>
      <div
        onClick={() => {
          Close.setOpen(false);
          setIsLinkCreated(false);
          setIsCopied(false);
          setStyleSubmit({
            background: "#364590",
            pointerEvents: "auto",
          });
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
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            className={styles.Wrapper}
          >
            <Plus
              className={styles.SVGCross}
              onClick={() => {
                Close.setOpen(false);
                setIsLinkCreated(false);
                setIsCopied(false);
                setStyleSubmit({
                  background: "#364590",
                  pointerEvents: "auto",
                });
              }}
            />

            <div className={styles.ContentWrapper}>
              <h1 className={fonts.blackHeading21px}>Invite Team Members</h1>
              <p
                style={{ marginTop: "-25px", maxWidth: "400px" }}
                className={fonts.greyBody14px}
              >
                Enter number of team members to get an invite link.
              </p>
              <form
                className={styles.forms}
                onSubmit={InviteUser}
                style={
                  isLinkCreated === true
                    ? {
                        gridTemplateColumns: "auto 95px",
                      }
                    : {
                        gridTemplateColumns: "75px auto",
                      }
                }
              >
                {!isLinkCreated && (
                  <input
                    name="number"
                    type={"number"}
                    min="0"
                    required={true}
                    placeholder="Ex: 3"
                  ></input>
                )}
                {!isLinkCreated && (
                  <input type="submit" value={"Create Invite Link"}></input>
                )}
                {isLinkCreated && (
                  <input
                    name="text"
                    type={"text"}
                    required={true}
                    value={Copy}
                    readOnly
                  ></input>
                )}
                {isLinkCreated && (
                  <CopyToClipboard
                    text={Copy}
                    onCopy={() => {
                      setIsCopied(true);
                      setStyleSubmit({
                        background: "rgba(0, 0, 0, 0.3)",
                        pointerEvents: "none",
                      });
                    }}
                  >
                    <button style={styleSubmit} className={styles.CopyButton}>
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </CopyToClipboard>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
