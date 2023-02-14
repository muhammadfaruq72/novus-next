import AppHeader from "@/components/header/AppHeader";
import styles from "@/styles/components/App/App.module.css";
import Client from "@/public/Client.svg";
import Team from "@/public/Team.svg";
import WS_image from "@/public/WS_image.png";
import buttons from "@/styles/buttons.module.css";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import CreateWorkspace from "./CreateWorkspace";
import { gql, useMutation, useQuery } from "@apollo/client";

interface App {
  setIsLoggedIn: any;
}

export default function App(app: App) {
  const { setIsLoggedIn } = app;
  const [Open, setOpen] = useState<Boolean>(false);
  const [recentSpaces, setRecentSpaces] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, sethasNextPage] = useState<Boolean | null>(null);

  const RecentlyOpenedQUERY = gql`
    query MyQuery($FilterUserId: String!, $page: Int!, $perPage: Int!) {
      recentlyOpenedSpace(
        FilterUserId: $FilterUserId
        page: $page
        perPage: $perPage
      ) {
        hasNextPage
        items {
          LastOpened
          count
          workspace {
            Name
            spaceId
            Image {
              url
            }
          }
        }
      }
    }
  `;

  const {
    data: recentlyOpenedSpace,
    loading: RecentlyLoading,
    refetch: recentlyRefetch,
  } = useQuery(RecentlyOpenedQUERY, {
    variables: {
      FilterUserId: localStorage.getItem("email"),
      page: page,
      perPage: 2,
    },
  });

  // console.log(recentlyOpenedSpace);

  // recentlyOpenedSpace.recentlyOpenedSpace.items.map((Space: any, index: any) =>
  //   console.log(Space)
  // );

  useEffect(() => {
    if (typeof recentlyOpenedSpace !== "undefined") {
      setRecentSpaces(
        recentSpaces.concat(recentlyOpenedSpace.recentlyOpenedSpace.items)
      );
      if (recentlyOpenedSpace.recentlyOpenedSpace.hasNextPage === true) {
        console.log("true tru");
        sethasNextPage(true);
      } else {
        sethasNextPage(false);
      }
      // console.log(
      //   recentlyOpenedSpace.recentlyOpenedSpace.items,
      //   recentlyOpenedSpace.recentlyOpenedSpace.hasNextPage
      // );
    }
  }, [RecentlyLoading]);

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <>
      <CreateWorkspace setOpen={setOpen} Open={Open} />
      <AppHeader spaceHeader={true} setIsLoggedIn={setIsLoggedIn} />
      <div className={styles.Wrapper}>
        <div className={styles.ContentWrapper}>
          <div className={styles.SubWrapper} onClick={() => setOpen(true)}>
            <div className={styles.ClientBg}>
              <Client className={styles.Svg} />
            </div>
            <div className={styles.TextWrapper}>
              <h1 className={styles.Heading24px}>Create Client Workspace</h1>
              <p className={styles.Body24px}>
                Want to use Novus with a different Client?
              </p>
            </div>
          </div>
          <div className={styles.SubWrapper} onClick={() => setOpen(true)}>
            <div className={styles.ClientBg}>
              <Team className={styles.Svg} />
            </div>
            <div className={styles.TextWrapper}>
              <h1 className={styles.Heading24px}>Create Team Workspace</h1>
              <p className={styles.Body24px}>
                Want to use Novus with a different Team?
              </p>
            </div>
          </div>
        </div>
        <div className={styles.Browse}>
          <h1 className={styles.Heading24px}>Browse all Workspaces</h1>
          <button className={buttons.Blue187x62}>Workspaces</button>
        </div>
        {recentSpaces.map((Space: any, index: any) => (
          <div className={styles.Browse} key={index}>
            <div className={styles.Launch}>
              <img
                className={styles.img}
                src={
                  process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                  Space.workspace.Image.url
                }
                alt=""
              />
              <div className={styles.LaunchTextWrapper}>
                <h1 className={styles.Heading24px}>{Space.workspace.Name}</h1>
                <div className={styles.membersWrapper}>
                  <p className={styles.Body24px}>Team Workspace</p>
                  <div className={styles.members}>
                    <p style={{ fontSize: "16px", color: "#404040" }}>
                      {Space.count} {Space.count <= 1 ? "member" : "members"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className={buttons.Blue187x62}>Launch</button>
          </div>
        ))}

        <div style={{ margin: "0 auto" }}>
          {hasNextPage === true && (
            <button
              className={buttons.blueOutline101x28}
              onClick={() => {
                setPage((prev) => prev + 1);
                recentlyRefetch({
                  FilterUserId: localStorage.getItem("email"),
                  page: page,
                  perPage: 2,
                });
              }}
            >
              See more
            </button>
          )}
        </div>
      </div>
    </>
  );
}
