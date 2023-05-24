import Head from "next/head";
import Image from "next/image";
import Header from "@/components/header/header";
import styles from "@/styles/pages/index.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import WorkspaceImg from "@/public/WorkSpaceImg.png";
import WorkSpace from "@/public/LandingPage/WorkSpace.svg";
import Task from "@/public/LandingPage/Task.svg";
import Task_ from "@/public/LandingPage/Task_.svg";
import SectionOne from "@/public/LandingPage/SectionOne.png";
import SectionTwo from "@/public/LandingPage/SectionTwo.png";
import SectionThree from "@/public/LandingPage/SectionThree.png";
import TeamGreen from "@/public/LandingPage/TeamGreen.svg";
import Channels from "@/public/LandingPage/Channels.svg";
import Sharing from "@/public/LandingPage/Sharing.svg";
import RealTime from "@/public/LandingPage/RealTime.svg";
import Private from "@/public/LandingPage/Private.svg";
import Secure from "@/public/LandingPage/Secure.svg";
import App from "@/components/App/App";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";

export const getServerSideProps = async () => {
  // const res = await fetch("https://api.github.com/repos/vercel/next.js");
  // const data = await res.json();
  const password = { Password: process.env.SSAP };
  return { props: { password } };
};

export default function Home({ password }: any) {
  const { data: session, status } = useSession();

  const { isloggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (
      typeof window !== "undefined"
        ? localStorage.getItem("email")
        : null !== null
    ) {
      // console.log("Email exitss");
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  const TEST = gql`
    query MyQuery {
      TestApi
    }
  `;

  const { data: TESTData, loading: Loading, refetch: Refetch } = useQuery(TEST);

  useEffect(() => {
    if (typeof TESTData !== "undefined") {
      console.log(TESTData);
    }
  }, [Loading]);

  const CustomUserQUERY = gql`
    query MyQuery($Useremail: String!) {
      customUsers(Useremail: $Useremail) {
        username
        email
        Image {
          url
        }
      }
    }
  `;

  const {
    data: CustomUserSpace,
    loading: CustomUserLoading,
    refetch: refetchUser,
  } = useQuery(CustomUserQUERY, {
    variables: {
      Useremail: typeof window !== "undefined" ? session?.user?.email : null,
    },
  });

  useEffect(() => {
    if (typeof CustomUserSpace !== "undefined") {
      console.log("CustomUserSpace", CustomUserSpace);
      if (typeof window !== "undefined") {
        localStorage.setItem("tokenAuth", "GOAuth");
        localStorage.setItem("email", CustomUserSpace.customUsers.email);
        localStorage.setItem("username", CustomUserSpace.customUsers.username);
      }
      setIsLoggedIn(true);
    } else {
      if (
        typeof session !== "undefined" &&
        typeof session?.user?.email !== "undefined"
      ) {
        // console.log("UNDEEEEEEEE", session);
        const data = axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND}`,
            {
              query: `mutation MyMutation($email: String!, $password: String!, , $image: String!) {
              RegisterCustom(email: $email, password: $password, image: $image)
            }`,
              variables: {
                email: `${session?.user?.email}`,
                password: `${password.Password}`,
                image: `${session?.user?.image}`,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((result) => {
            // console.log("result", result);
            axios({
              url: `${process.env.NEXT_PUBLIC_BACKEND}`,
              method: "post",
              data: {
                query: `
                  query MyQuery($Useremail: String!) {
                    customUsers(Useremail: $Useremail) {
                      username
                      email
                      Image {
                        url
                      }
                    }
                  }
                    `,
                variables: {
                  Useremail: `${
                    typeof window !== "undefined" ? session?.user?.email : null
                  }`,
                },
              },
            }).then((result) => {
              if (result.data.data !== null) {
                console.log(result.data.data, "result.data", session);
                if (typeof window !== "undefined") {
                  localStorage.setItem("tokenAuth", "GOAuth");
                  localStorage.setItem(
                    "email",
                    result.data.data.customUsers.email
                  );
                  localStorage.setItem(
                    "username",
                    result.data.data.customUsers.username
                  );
                }
                setIsLoggedIn(true);
              }
            });
          });
      }
    }
  }, [CustomUserLoading]);

  return (
    <>
      {isloggedIn === false && (
        <div>
          <Head>
            <title>NOVUS | Create Your Custom Workspace</title>
            <link rel="apple-touch-icon" href="/favicon.png"></link>
            <link rel="apple-touch-startup-image" href="/favicon.png"></link>
            <meta name="apple-mobile-web-app-title" content="NOVUS"></meta>
            <meta name="apple-mobile-web-app-capable" content="yes"></meta>
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="default"
            ></meta>
            <meta
              name="description"
              content="Designed for Clients and Agencies"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header setIsLoggedIn={setIsLoggedIn} password={password} />
          <main className={styles.Wrapper}>
            <h1 className={styles.MainHeader}>
              <span className={styles.ClipWord}>Workspace</span> for Teams{" "}
              <br /> and Clients
            </h1>
            <h5 className={styles.HeaderBody}>
              Designed for Clients and Agencies
            </h5>
            <button className={styles.ButtonBlue187x62}>Get Started</button>
            <div className={styles.ParentWorkSpace}>
              <WorkSpace className={styles.WorkSpaceSVG} />
              <Task className={styles.TaskSVG} />
              <Task_ className={styles.TaskSVG_} />
            </div>
            <></>
            <></>
            <div className={styles.SectionOne}>
              <h4 className={styles.MobSectionHeader}>
                Productive Collaboration
              </h4>
              <Image
                className={styles.ImageSectionOne}
                src={SectionOne}
                alt="/"
              />
              <div className={styles.ContentSectionOne}>
                <h4 className={styles.SectionHeader}>
                  Productive Collaboration
                </h4>
                <div className={styles.SectionBox}>
                  <TeamGreen className={styles.SVGTeamGreen} />
                  <div className={styles.ContentSectionBox}>
                    <h5 className={styles.HeaderSectionBox}>Teams & Clients</h5>
                    <p className={styles.BodySectionBox}>
                      Collaborate with people outside of your company.
                    </p>
                  </div>
                </div>
                <div className={styles.SectionBox}>
                  <Sharing className={styles.SVGSharing} />
                  <div className={styles.ContentSectionBox}>
                    <h5 className={styles.HeaderSectionBox}>File sharing</h5>
                    <p className={styles.BodySectionBox}>
                      Send documents, images and videos.
                    </p>
                  </div>
                </div>
                <div className={styles.SectionBox}>
                  <Channels className={styles.SVGChannels} />
                  <div className={styles.ContentSectionBox}>
                    <h5 className={styles.HeaderSectionBox}>Channels</h5>
                    <p className={styles.BodySectionBox}>
                      Follow topics important to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <></>
            <></>
            <div className={styles.SectionTwo}>
              <h4 className={styles.MobSectionHeader}>
                Workspace Messaging Features
              </h4>
              <Image
                className={styles.ImageSectionTwoMobile}
                src={SectionTwo}
                alt="/"
              />
              <div className={styles.ContentSectionOne}>
                <h4 className={styles.SectionHeader}>
                  Workspace Messaging Features
                </h4>
                <div className={styles.SectionBox}>
                  <RealTime className={styles.SVGSharing} />
                  <div className={styles.ContentSectionBox}>
                    <h5 className={styles.HeaderSectionBox}>
                      Real-Time Communication
                    </h5>
                    <p className={styles.BodySectionBox}>
                      Instantly communicate with teammates & clients.
                    </p>
                  </div>
                </div>
                <div className={styles.SectionBox}>
                  <Private className={styles.SVGChannels} />
                  <div className={styles.ContentSectionBox}>
                    <h5 className={styles.HeaderSectionBox}>
                      Private Channels
                    </h5>
                    <p className={styles.BodySectionBox}>
                      Make your channels private.
                    </p>
                  </div>
                </div>
                <div className={styles.SectionBox}>
                  <Secure className={styles.SVGChannels} />
                  <div className={styles.ContentSectionBox}>
                    <h5 className={styles.HeaderSectionBox}>Fast & Secure</h5>
                    <p className={styles.BodySectionBox}>
                      Conversation is fast and encrypted.
                    </p>
                  </div>
                </div>
              </div>
              <Image
                className={styles.ImageSectionTwo}
                src={SectionTwo}
                alt="/"
              />
            </div>
            <></>
            <></>
            <div className={styles.SectionThree}>
              <div className={styles.MobSectionThreeContent}>
                <h5 className={styles.MobSectionHeader}>Chat From Anywhere</h5>
                <p
                  className={styles.BodySectionBox_}
                  style={{ padding: "10px" }}
                >
                  Optimised for Mobiles, Tablets and Desktops. <br />{" "}
                  Communicate with your team no matter what device you use.
                </p>
              </div>

              <Image
                className={styles.ImageSectionThree}
                src={SectionThree}
                alt="/"
              />
              <div className={styles.SectionThreeContent}>
                <h5 className={styles.SectionHeader}>Chat From Anywhere</h5>
                <p
                  className={styles.BodySectionBox_}
                  style={{ padding: "10px" }}
                >
                  Optimised for Mobiles, Tablets and Desktops. <br />{" "}
                  Communicate with your team no matter what device you use.
                </p>
              </div>
            </div>
          </main>
        </div>
      )}{" "}
      {isloggedIn === true && <App setIsLoggedIn={setIsLoggedIn} />}
    </>
  );
}
