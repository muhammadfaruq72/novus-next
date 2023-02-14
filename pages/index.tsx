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
              <p className={fonts.greyBody17px} style={{ marginTop: "-30px" }}>
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
