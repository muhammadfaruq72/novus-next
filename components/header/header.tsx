import Logo from "@/public/LOGO.svg";
import styles from "@/styles/components/header/header.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import { useEffect, useState } from "react";
import LogIn from "../global/login";
import SignUp from "../global/signUp";

interface Header {
  setIsLoggedIn: any;
}

export default function Header(header: Header) {
  const [openSignUp, setSignUp] = useState<Boolean>(false);
  const [openLogIn, setLogIn] = useState<Boolean>(false);
  const [UpOrIn, setUpOrIn] = useState<null | string>(null);

  const { setIsLoggedIn } = header;

  const LogInOnCluck: any = () => {
    setLogIn(true);
    setUpOrIn("login");
  };

  useEffect(() => {
    if (localStorage.getItem("loginRequired") && UpOrIn === null) {
      setUpOrIn("login");
      setLogIn(true);
      localStorage.removeItem("loginRequired");
    }
  });

  return (
    <>
      {UpOrIn === "login" && (
        <LogIn
          closeLogIn={setLogIn}
          hidden={openLogIn}
          setUpOrIn={setUpOrIn}
          closeSignup={setSignUp}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {UpOrIn === "signup" && (
        <SignUp
          closeSignup={setSignUp}
          hidden={openSignUp}
          setUpOrIn={setUpOrIn}
          closeLogIn={setLogIn}
        />
      )}

      <header className={styles.Wrapper}>
        <Logo />
        <div className={styles.menuButton}>
          <p className={fonts.greyText19px}>Pricing</p>
          <p className={fonts.greyText19px}>Features</p>
          <button className={buttons.ButtonBlack187x62} onClick={LogInOnCluck}>
            Sign in
          </button>
        </div>
      </header>
    </>
  );
}
