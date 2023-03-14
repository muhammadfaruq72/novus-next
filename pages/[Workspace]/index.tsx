import { useRouter } from "next/router";
import AppHeader from "@/components/header/AppHeader";
import Team from "@/components/Team/Team";
import Client from "@/components/Client/Client";
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/components/CreateContext";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";

export default function Space() {
  const { isloggedIn, setIsLoggedIn, userExistsInSpace, setuserExistsInSpace } =
    useContext(AuthContext);

  const { query } = useRouter();

  const RecentlyOpenedQUERY = gql`
    query MyQuery($UserEmail: String!, $space_id: String!) {
      checkMember(spaceId: $space_id, Useremail: $UserEmail) {
        Workspace {
          Name
          spaceId
          Image {
            url
          }
          isClient
        }
        isAdmin
      }
    }
  `;
  const [
    checkMembersQuery,
    {
      data: checkMembers,
      loading: checkMembersLoading,
      refetch: checkMembersRefetch,
    },
  ] = useLazyQuery(RecentlyOpenedQUERY);

  useEffect(() => {
    if (typeof query.Workspace !== "undefined") {
      checkMembersQuery({
        variables: {
          UserEmail: localStorage.getItem("email"),
          space_id: query.Workspace,
        },
      });
    }
  }, [query]);

  useEffect(() => {
    if (typeof checkMembers !== "undefined") {
      if (checkMembers.checkMember === null) {
        alert("The space you are trying to access does not exits.");
      } else {
        setuserExistsInSpace({
          spaceName: checkMembers.checkMember.Workspace.Name,
          spaceImage: checkMembers.checkMember.Workspace.Image.url,
          space_id: query.Workspace,
          isClient: checkMembers.checkMember.Workspace.isClient,
        });
        // console.log(
        //   checkMembers.checkMember.Workspace.Name,
        //   checkMembers.checkMember.Workspace.Image.url
        // );
      }
    }
  }, [checkMembersLoading]);

  return (
    <>
      {userExistsInSpace !== null && (
        <div
          style={{
            position: "fixed",
            background: "#F5F5F5",
            height: "100%",
            width: "100%",
          }}
        >
          <AppHeader
            spaceHeader={false}
            setIsLoggedIn={setIsLoggedIn}
            spaceName={userExistsInSpace.spaceName}
            spaceImage={userExistsInSpace.spaceImage}
            isClient={userExistsInSpace.isClient}
          />
          {userExistsInSpace.isClient ? <Client /> : <Team />}
        </div>
      )}
    </>
  );
}
