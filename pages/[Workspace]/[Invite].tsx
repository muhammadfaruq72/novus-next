import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useContext, useEffect } from "react";

export default function InviteCheck() {
  const { query } = useRouter();
  const router = useRouter();

  const Mutation = gql`
    mutation MyMutation($email: String!, $spaceId: String!, $uuid: String!) {
      addMemberThroughInviteLink(email: $email, spaceId: $spaceId, uuid: $uuid)
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        console.log(data);
        if (data.addMemberThroughInviteLink === null) {
          alert(
            "The invitation Link is Expired or you are already a member of this Workspace."
          );
        } else {
          router.push("/" + query.Workspace);
        }
      },
    }
  );

  useEffect(() => {
    if (typeof query.Invite !== "undefined") {
      console.log(query);

      if (localStorage.getItem("email") === null) {
        router.push("/");
        localStorage.setItem("loginRequired", "Please, login!");
        localStorage.setItem(
          "loginRequiredForInvite",
          "/" + query.Workspace + "/" + query.Invite
        );
      } else {
        console.log(localStorage.getItem("email"));
        var email = localStorage.getItem("email");
        var spaceId = query.Workspace;
        var uuid = query.Invite;
        mutate({ variables: { email, spaceId, uuid } });
      }

      //   checkMembersQuery({
      //     variables: {
      //       UserEmail: localStorage.getItem("email"),
      //       space_id: query.Workspace,
      //     },
      //   });
    }
  }, [query]);

  return <></>;
}
