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

      if (
        typeof window !== "undefined"
          ? localStorage.getItem("email")
          : null === null
      ) {
        router.push("/");
        if (typeof window !== "undefined") {
          localStorage.setItem("loginRequired", "Please, login!");
          localStorage.setItem(
            "loginRequiredForInvite",
            "/" + query.Workspace + "/" + query.Invite
          );
        }
      } else {
        console.log(
          typeof window !== "undefined" ? localStorage.getItem("email") : null
        );
        var email =
          typeof window !== "undefined" ? localStorage.getItem("email") : null;
        var spaceId = query.Workspace;
        var uuid = query.Invite;
        mutate({ variables: { email, spaceId, uuid } });
      }
    }
  }, [query]);

  return <></>;
}
