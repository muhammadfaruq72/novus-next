import buttons from "@/styles/buttons.module.css";
import { gql, useMutation } from "@apollo/client";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";

let StyleBefore = {
  backgroundColor: "#364590",
  color: "#fff",
  border: "1px solid #364590",
};

let StyleAfter = {
  backgroundColor: "transparent",
  color: "#364590",
  border: "1px solid #364590",
};

interface AddChannelMembers {
  Member: any;
  manageMembersState: any;
  setmanageMembersState: any;
  ChannelsState: any;
  setChannelsState: any;
}

var SelectedChannelVar;

export default function addChannelMembers(
  AddChannelMembers: AddChannelMembers
) {
  const {
    Member,
    setmanageMembersState,
    manageMembersState,
    ChannelsState,
    setChannelsState,
  } = AddChannelMembers;
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    LoggedUser,
    setLoggedUser,
  } = useContext(AuthContext);

  const Mutation = gql`
    mutation MyMutation(
      $Add: Boolean!
      $ChannelName: String!
      $spaceId: String!
      $WorkSpaceMemberUsername: String!
    ) {
      AddChannelMember(
        Add: $Add
        ChannelName: $ChannelName
        spaceId: $spaceId
        WorkSpaceMemberUsername: $WorkSpaceMemberUsername
      ) {
        message
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data: any) {
        // console.log(data);
        setmanageMembersState(
          manageMembersState.map((Member: any) => {
            if (Member.User.username === data.AddChannelMember.message) {
              return { ...Member, isAdded: !Member.isAdded };
            } else {
              return Member;
            }
          })
        );

        // console.log(data);
      },
    }
  );

  let handleMember = (Add: boolean) => {
    var ChannelName = SelectedChannel.Name;
    var spaceId = userExistsInSpace.space_id;
    var WorkSpaceMemberUsername = Member.User.username;

    mutate({
      variables: { Add, ChannelName, spaceId, WorkSpaceMemberUsername },
    });
  };

  return (
    <>
      <div>
        {Member.isAdded === true ? (
          <button
            style={StyleBefore}
            className={buttons.Blue101x28}
            onClick={() => {
              if (LoggedUser.username !== Member.User.username) {
                handleMember(false);

                setChannelsState(
                  ChannelsState.map((Channel: any) => {
                    if (Channel.Channel.Name === SelectedChannel.Name) {
                      return {
                        ...Channel,
                        memberCount: Channel.memberCount - 1,
                      };
                    } else {
                      return Channel;
                    }
                  })
                );
              } else {
                alert(
                  "You can't remove yourself from the channel as you're admin!"
                );
              }
            }}
          >
            Remove
          </button>
        ) : (
          <button
            style={StyleAfter}
            className={buttons.Blue101x28}
            onClick={() => {
              handleMember(true);

              setChannelsState(
                ChannelsState.map((Channel: any) => {
                  if (Channel.Channel.Name === SelectedChannel.Name) {
                    return { ...Channel, memberCount: Channel.memberCount + 1 };
                  } else {
                    return Channel;
                  }
                })
              );
            }}
          >
            Add
          </button>
        )}
      </div>
    </>
  );
}
