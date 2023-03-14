import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import styles from "@/styles/components/Client/Client.module.css";
import Plus from "@/public/Plus.svg";
import Database from "@/public/Database.svg";
import Send from "@/public/Send.svg";
import DropMenu from "@/public/DropMenu.svg";
import Image from "next/image";
import LeftMenu from "./LeftMenu/LeftMenu";
import Chat from "./Chat/Chat";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import FileSpace from "./FileSpace/FileSpace";

export default function Client() {
  const { userExistsInSpace, LoggedUser, setLoggedUser } =
    useContext(AuthContext);

  const checkMembersQUERY = gql`
    query MyQuery($spaceId: String!, $Useremail: String!) {
      checkMember(spaceId: $spaceId, Useremail: $Useremail) {
        isAdmin
        Workspace {
          spaceId
        }
        User {
          username
          email
        }
      }
    }
  `;

  const {
    data: MembersData,
    loading: MembersLoading,
    refetch: MembersRefetch,
  } = useQuery(checkMembersQUERY, {
    variables: {
      spaceId: userExistsInSpace.space_id,
      Useremail: localStorage.getItem("email"),
    },
  });

  useEffect(() => {
    if (typeof MembersData !== "undefined") {
      setLoggedUser({
        username: MembersData.checkMember.User.username,
        isAdmin: MembersData.checkMember.isAdmin,
      });
    }
  }, [MembersLoading]);

  return (
    <>
      <div className={styles.Wrapper}>
        <LeftMenu />
        <div className={styles.SubWrapper}>
          <Chat />
          <FileSpace />
        </div>
      </div>
    </>
  );
}
