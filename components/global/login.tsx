import styles from "@/styles/components/global/login.module.css";
import fonts from "@/styles/fonts.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Plus from "@/public/Plus.svg";
import V_Logo from "@/public/V_Logo.svg";
import Cross from "@/public/Cross.svg";
import { useEffect, useContext } from "react";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

var email: string;

interface Close {
  closeLogIn: any;
  hidden: any;
  setUpOrIn: any;
  closeSignup: any;
  setIsLoggedIn: any;
}

export default function LogIn(Close: Close) {
  const [warningBool, setWarningBool] = useState(false);
  const [warningtext, setWarningText] = useState("This is a warning pop up!");
  const [styleSubmit, setStyleSubmit] = useState({});
  const router = useRouter();

  const Mutation = gql`
    mutation MyMutation($email: String!, $password: String!) {
      tokenAuth(email: $email, password: $password) {
        errors
        refreshToken {
          isExpired
          token
        }
        token {
          payload {
            username
          }
          token
        }
        user {
          email
        }
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        if (data.tokenAuth.errors !== null) {
          setWarningBool(true);
          setWarningText("Please, enter valid credentials.");
        }
        if (data.tokenAuth.errors === null) {
          setWarningBool(false);

          if (typeof window !== "undefined") {
            localStorage.setItem("tokenAuth", JSON.stringify(data));
            localStorage.setItem("email", email);
            localStorage.setItem(
              "username",
              data.tokenAuth.token.payload.username
            );

            if (localStorage.getItem("loginRequiredForInvite") !== null) {
              router.push(localStorage.getItem("loginRequiredForInvite")!);
              localStorage.removeItem("loginRequiredForInvite");
            }
          }

          Close.closeLogIn(false);
          Close.setIsLoggedIn(true);
        }
      },
    }
  );

  let LoginUser = (event: any) => {
    event.preventDefault();
    email = event.target.email.value;
    var password = event.target.password.value;
    mutate({ variables: { email, password } });
  };

  useEffect(() => {
    if (loading === true) {
      setStyleSubmit({
        background: "rgba(0, 0, 0, 0.3)",
        pointerEvents: "none",
      });
    }
    if (loading === false) {
      setStyleSubmit({
        background: "#364590",
        pointerEvents: "auto",
      });
    }
  }, [loading]);

  return (
    <>
      <div
        onClick={() => {
          Close.closeLogIn(false);
          setWarningBool(false);
        }}
        className={`${styles.overlay} ${
          Close.hidden === true ? styles.visible : styles.hidden
        }`}
      >
        <div
          className={`${styles.warning} ${
            warningBool === true ? styles.visible : styles.hidden
          }`}
        >
          <Cross className={styles.SVGCrossRed} />
          <p className={styles.paragraph}>{warningtext}</p>
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            onClick={(e: any) => e.stopPropagation()}
            className={styles.Wrapper}
          >
            <Plus
              className={styles.SVGCross}
              onClick={() => {
                Close.closeLogIn(false);
                setWarningBool(false);
              }}
            />

            <div className={styles.ContentWrapper}>
              <div className={styles.WrapperImage}>
                <V_Logo className={styles.Image} />
              </div>

              <div className={styles.SignUpWrapper}>
                <h2 className={fonts.blackHeading36px}>Log in</h2>
                <p className={fonts.greyBody14px}>
                  Access to AI tools, that open up a new door for creativity
                </p>
                <form className={miniComponents.forms} onSubmit={LoginUser}>
                  <input
                    name="email"
                    type={"email"}
                    required={true}
                    placeholder="Email"
                  ></input>
                  <input
                    name="password"
                    type={"password"}
                    required={true}
                    placeholder="Password"
                  ></input>
                  <input
                    type="submit"
                    value="Sign in"
                    style={styleSubmit}
                  ></input>
                </form>
                <div className={miniComponents.line}></div>
                <div className={styles.PwithLink}>
                  <p className={fonts.greyBody14px}>
                    Don&apos;t have an account?
                  </p>
                  <p
                    className={fonts.greyBody14px}
                    style={{ color: "#364590", cursor: "pointer" }}
                    onClick={() => {
                      Close.setUpOrIn("signup");
                      Close.closeSignup(true);
                      setWarningBool(false);
                    }}
                  >
                    Sign Up
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
