import styles from "@/styles/components/Team/LeftMenu/ManageMembers3Dots.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";
import LogOut from "@/public/LogOut.svg";
import Delete from "@/public/delete-icon.svg";
import Client from "@/public/Client.svg";
import { gql, useMutation } from "@apollo/client";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";

interface props {
  setMenuIsOpen: any;
  HamburgerRef: any;
  style3Dots: any;
  threeDots: any;
  setmanageMembersState: any;
  manageMembersState: any;
  setMembersState: any;
  MembersState: any;
  setChannelsState?: any;
  ChannelsState?: any;
}

export default function ManageMembers3Dots(Props: props) {
  const {
    HamburgerRef,
    setMenuIsOpen,
    style3Dots,
    threeDots,
    setmanageMembersState,
    manageMembersState,
    setMembersState,
    MembersState,
    setChannelsState,
    ChannelsState,
  } = Props;
  const {
    userExistsInSpace,
    setDeleteMembercount,
    DeleteMembercount,
    setLoggedUser,
    LoggedUser,
  } = useContext(AuthContext);

  const Mutation = gql`
    mutation MyMutation(
      $username: String!
      $spaceId: String!
      $setAdmin: Boolean
    ) {
      DeleteMember(
        username: $username
        spaceId: $spaceId
        setAdmin: $setAdmin
      ) {
        message
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        if (data.DeleteMember.message === "setAdmin Success") {
          setmanageMembersState(
            manageMembersState.map((Member: any) => {
              if (Member.User.username === threeDots.username) {
                if (LoggedUser.isAdmin == true) {
                }
                return { ...Member, isAdmin: !threeDots.isAdmin };
              } else {
                return Member;
              }
            })
          );
          if (LoggedUser.username === threeDots.username) {
            setLoggedUser({ isAdmin: false });
          }
        }
        if (data.DeleteMember.message === "setAdmin Failed") {
          alert("Something went Wrong!");
        }
        if (data.DeleteMember.message === "Delete Success") {
          setDeleteMembercount(DeleteMembercount + 1);
          setmanageMembersState(
            manageMembersState.filter(
              (item: any) => item.User.username !== threeDots.username
            )
          );
          setMembersState(
            MembersState.filter(
              (item: any) => item.User.username !== threeDots.username
            )
          );

          setChannelsState(
            ChannelsState.map((Channel: any) => {
              return { ...Channel, memberCount: Channel.memberCount - 1 };
            })
          );
        }
      },
    }
  );

  useEffect(() => {
    function ToggleMenu(event: any) {
      if (event.target !== HamburgerRef) {
        setMenuIsOpen(false);
      }
    }
    window.addEventListener("click", ToggleMenu);
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("click", ToggleMenu);
    };
  });

  return (
    <div style={style3Dots} className={styles.Menu}>
      <div
        onClick={() => {
          var username = threeDots.username;
          var spaceId = userExistsInSpace.space_id;
          if (threeDots.isAdmin == true) {
            var setAdmin = false;
          } else {
            var setAdmin = true;
          }

          mutate({ variables: { username, spaceId, setAdmin } });
        }}
      >
        <div className={styles.MenuItem}>
          <Client className={styles.Svg} />

          <p className={styles.greyBody16px}>
            {threeDots.isAdmin ? "Make Member" : "Make Admin"}
          </p>
        </div>
        <div className={`${styles.Divider}`}></div>
      </div>
      <div
        onClick={() => {
          var username = threeDots.username;
          var spaceId = userExistsInSpace.space_id;
          var setAdmin = null;
          const count = manageMembersState.filter(
            (value: any) => value.isAdmin
          ).length;
          if (count > 1) {
            mutate({ variables: { username, spaceId, setAdmin } });
          } else {
            alert("Atleast one admin has to be in Space.");
          }
        }}
      >
        <div className={styles.MenuItem}>
          <Delete className={styles.Svg} />

          <p className={styles.greyBody16px}>Delete Member</p>
        </div>
        <div className={`${styles.Divider}`}></div>
      </div>
    </div>
  );
}
