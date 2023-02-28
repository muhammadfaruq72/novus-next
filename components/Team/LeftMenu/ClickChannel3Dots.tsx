import styles from "@/styles/components/Team/LeftMenu/ClickChannel3Dots.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";
import LogOut from "@/public/LogOut.svg";
import Delete from "@/public/delete-icon.svg";
import Lock from "@/public/Lock.svg";
import Client from "@/public/Client.svg";
import { gql, useMutation, useQuery } from "@apollo/client";
import AuthContext from "@/components/CreateContext";
import { useState, useRef, useEffect, useContext } from "react";

interface props {
  setMenuIsOpen: any;
  HamburgerRef: any;
  style3Dots: any;
  setChannelsState?: any;
  ChannelsState?: any;
  setpreventSelectedChannel?: any;
  setchannelCount?: any;
}

export default function ClickChannel3Dots(Props: props) {
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    DeleteMembercount,
    setDeleteMembercount,
    LoggedUser,
  } = useContext(AuthContext);
  const {
    HamburgerRef,
    setMenuIsOpen,
    style3Dots,
    setChannelsState,
    ChannelsState,
    setpreventSelectedChannel,
    setchannelCount,
  } = Props;
  // interface MenuData {
  //   title: string;
  //   icon: any;
  //   click: any;
  // }

  // const Clicked = () => {
  //   alert("Button triggered");
  // };

  // const MenuData: MenuData[] = [
  //   // { title: "Create Task List", icon: Plus, click: Clicked },
  //   { title: "Private channel", icon: Lock, click: Clicked },
  //   { title: "Leave TaskSpace", icon: LogOut, click: Clicked },
  //   { title: "Delete TaskSpace", icon: Delete, click: Clicked },
  // ];

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

  const Mutation = gql`
    mutation MyMutation(
      $ChannelName: String!
      $spaceId: String!
      $WorkSpaceMemberUsername: String
      $Leave: Boolean
      $Delete: Boolean
      $Public: Boolean
    ) {
      DeleteChannel(
        ChannelName: $ChannelName
        spaceId: $spaceId
        WorkSpaceMemberUsername: $WorkSpaceMemberUsername
        Leave: $Leave
        Delete: $Delete
        Public: $Public
      ) {
        ChannelName
        operation
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        if (data.DeleteChannel !== null) {
          // console.log(data);
          setpreventSelectedChannel(false);
          if (
            data.DeleteChannel.operation === "Public False" ||
            data.DeleteChannel.operation === "Public True"
          ) {
            setChannelsState(
              ChannelsState.map((Channel: any) => {
                // console.log(Channel);
                if (Channel.Channel.Name === data.DeleteChannel.ChannelName) {
                  return {
                    ...Channel,
                    Channel: {
                      ...Channel.Channel,
                      isPublic: !Channel.Channel.isPublic,
                    },
                  };
                } else {
                  return Channel;
                }
              })
            );
          }
          // ------------- //
          if (data.DeleteChannel.operation === "Leave") {
            setChannelsState(
              ChannelsState.filter(
                (Channel: any) =>
                  Channel.Channel.Name !== data.DeleteChannel.ChannelName
              )
            );
            setchannelCount((prev: any) => prev - 1);
          }
          // ------------- //
          if (data.DeleteChannel.operation === "Deleted") {
            setChannelsState(
              ChannelsState.filter(
                (Channel: any) =>
                  Channel.Channel.Name !== data.DeleteChannel.ChannelName
              )
            );
            setchannelCount((prev: any) => prev - 1);
          }
        } else {
          alert("You can't do this operation!");
        }
      },
    }
  );

  // useEffect(() => {
  //   console.log("ChannelsState", ChannelsState);
  //   // if (Name !== null) {
  //   //   console.log("....SelectedChannel", SelectedChannel, Name);

  //   //   setSelectedChannel({
  //   //     key: Key,
  //   //     Name: Name,
  //   //   });
  //   //   Name = null;
  //   //   Key = null;
  //   //   // console.log(Name);
  //   // }
  // }, [ChannelsState]);

  let handler = (Public: any, Leave: any, Delete: any) => {
    var ChannelName = SelectedChannel.Name;
    var spaceId = userExistsInSpace.space_id;
    var WorkSpaceMemberUsername = LoggedUser.username;
    // var Public = null;
    // var Leave = null;
    // var Delete = null;

    if (SelectedChannel.Name === "General" && SelectedChannel.key === 0) {
      alert("You can't do this operation on channel General!");
    } else {
      mutate({
        variables: {
          ChannelName,
          spaceId,
          WorkSpaceMemberUsername,
          Leave,
          Delete,
          Public,
        },
      });
    }
  };

  return (
    <div style={style3Dots} className={styles.Menu}>
      {LoggedUser.isAdmin && (
        <div>
          {SelectedChannel.isPublic ? (
            <div onClick={() => handler(false, null, null)}>
              {" "}
              <div className={styles.MenuItem}>
                <Lock className={styles.SvgLock} />
                <p className={styles.greyBody16px}>Private Channel</p>
              </div>
            </div>
          ) : (
            <div onClick={() => handler(true, null, null)}>
              {" "}
              <div className={styles.MenuItem}>
                <Client className={styles.Svg} />
                <p className={styles.greyBody16px}>Public Channel</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div onClick={() => handler(null, true, null)}>
        {" "}
        <div className={styles.MenuItem}>
          <LogOut className={styles.Svg} />
          <p className={styles.greyBody16px}>Leave TaskSpace</p>
        </div>
      </div>
      {LoggedUser.isAdmin && (
        <div onClick={() => handler(null, null, true)}>
          {" "}
          <div className={styles.MenuItem}>
            <Delete className={styles.Svg} />
            <p className={styles.greyBody16px}>Delete TaskSpace</p>
          </div>
        </div>
      )}
    </div>
  );
}
