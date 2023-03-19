import Head from "next/head";
import Image from "next/image";
import Header from "@/components/header/header";
import styles from "@/styles/pages/index.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import WorkspaceImg from "@/public/WorkSpaceImg.png";
import App from "@/components/App/App";
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";

export default function Home() {
  const { isloggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("email") !== null) {
      // console.log("Email exitss");
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <>
      {isloggedIn === false && (
        <div>
          <Head>
            <title>NOVUS | Create Your Custom Workspace</title>
            <link rel="apple-touch-icon" href="/favicon.png"></link>
            <link rel="apple-touch-startup-image" href="/favicon.png"></link>
            <meta
              name="apple-mobile-web-app-title"
              content="NOVUS Designed for Clients and Agencies"
            ></meta>
            <meta name="apple-mobile-web-app-capable" content="yes"></meta>
            {/* <meta name="apple-mobile-web-app-status-bar-style" content="black"></meta> */}
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
          <Header setIsLoggedIn={setIsLoggedIn} />
          <main className={styles.Wrapper}>
            <div className={styles.ContentWrapper}>
              <h1 className={styles.Heading}>
                Create Your Custom{" "}
                <span className={styles.HeadingSpan}>Workspace</span>
              </h1>
              <p
                className={fonts.greyBody17px}
                style={{ marginTop: "-30px", lineHeight: "20px" }}
              >
                Designed for Clients and Agencies
              </p>
              <button className={buttons.Blue187x62}>Explore</button>
            </div>
            <Image
              className={styles.WorkspaceImg}
              src={WorkspaceImg}
              alt="Picture of the author"
            />
          </main>
        </div>
      )}{" "}
      {isloggedIn === true && <App setIsLoggedIn={setIsLoggedIn} />}
    </>
  );
}
