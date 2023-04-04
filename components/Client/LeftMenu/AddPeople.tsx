import styles from "@/styles/components/Client/LeftMenu/AddPeople.module.css";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useContext } from "react";
import { useState } from "react";
import AuthContext from "@/components/CreateContext";

const Mutation = gql`
  mutation MyMutation($people: [String!]!, $spaceId: String!) {
    AddPeople(people: $people, spaceId: $spaceId)
  }
`;

interface People {
  manageMembersState: any;
  ActualManageMembersState: any;
  setActualManageMembersState: any;
  ActualChannelsState: any;
  setActualChannelsState: any;
  setOpen: any;
}

export default function AddPeople(Props: People) {
  const { userExistsInSpace, DeleteMembercount, setDeleteMembercount } =
    useContext(AuthContext);
  const [styleSubmit, setStyleSubmit] = useState({});

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        if (data.AddPeople === "Success") {
          const Member = Props.manageMembersState
            .filter(function (item: any) {
              if (item.isChecked === true) {
                return true;
              } else {
                return false;
              }
            })
            .map((Member: any) => {
              return { ...Member, isAdmin: false };
            });

          Props.setActualManageMembersState(
            Props.ActualManageMembersState.concat(Member)
          );

          Props.setActualChannelsState(
            Props.ActualChannelsState.map((Channel: any) => {
              return {
                ...Channel,
                memberCount: Channel.memberCount + Member.length,
              };
            })
          );

          setDeleteMembercount(DeleteMembercount - Member.length);

          Props.setOpen(false);
        }
      },
    }
  );

  let LoginUser = (event: any) => {
    event.preventDefault();
    let people: string[] = [];
    for (const input of Props.manageMembersState) {
      if (input.isChecked) people.push(input.User.username);
    }
    // console.log("people", people);

    let spaceId = userExistsInSpace.space_id;
    if (people.length > 0) mutate({ variables: { people, spaceId } });
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
      <button
        style={styleSubmit}
        className={styles.CopyButton}
        onClick={LoginUser}
      >
        {/* {isCopied ? "Copied" : "Copy"} */} Add people
      </button>
    </>
  );
}
