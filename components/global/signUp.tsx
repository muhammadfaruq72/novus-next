import styles from "@/styles/components/global/signUp.module.css";
import fonts from "@/styles/fonts.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import V_Logo from "@/public/V_Logo.svg";
import Plus from "@/public/Plus.svg";
import Cross from "@/public/Cross.svg";
import { useRef, useState, useEffect, useContext } from "react";
import { gql, useMutation } from "@apollo/client";

interface Close {
  closeSignup: any;
  hidden: any;
  setUpOrIn: any;
  closeLogIn: any;
}

interface Data {
  Email: any;
  Password: any;
}

export default function SignUp(Close: Close) {
  const refEmail: any = useRef();
  const refPassword: any = useRef();
  const [warningtext, setWarningText] = useState("This is a warning pop up!");
  const refSubmit: any = useRef();
  const [warningBool, setWarningBool] = useState<Boolean | null>(null);
  var refData = useRef<Data>();

  const Mutation = gql`
    mutation MyMutation($email: String!, $password: String!) {
      register(email: $email, password1: $password, password2: $password) {
        errors
        success
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data: any) {
        if (data.register.errors !== null) {
          setWarningBool(true);
          var objects: any = Object.values(data.register.errors);
          setWarningText(objects[0][0].message);
        }
        if (data.register.errors === null) {
          setWarningBool(false);
          Close.closeLogIn(true);
          window.location.reload();
        }
      },
    }
  );

  async function Register(event: any) {
    event.preventDefault();

    refData.current = {
      Email: refEmail.current.value,
      Password: refPassword.current.value,
    };
    var email = refData.current.Email;
    var password = refData.current.Password;
    if (refEmail.current.value === "" || refPassword.current.value === "") {
      setWarningText("These fields are required.");
    } else {
      mutate({ variables: { email, password } });
      localStorage.setItem("loginRequired", "Please, login!");
    }
  }

  useEffect(() => {
    if (loading === true) {
      refSubmit.current.style.background = "rgba(0, 0, 0, 0.3)";
      refSubmit.current.style.pointerEvents = "none";
    }
    if (loading === false) {
      refSubmit.current.style.background = "#364590";
      refSubmit.current.style.pointerEvents = "auto";
    }
  }, [loading]);

  return (
    <div
      onClick={() => Close.closeSignup(false)}
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

      <div onClick={(e: any) => e.stopPropagation()} className={styles.Wrapper}>
        <Plus
          className={styles.SVGCross}
          onClick={() => {
            Close.closeSignup(false);
          }}
        />
        <div className={styles.ContentWrapper}>
          <div className={styles.WrapperImage}>
            <V_Logo className={styles.Image} />
          </div>
          <div className={styles.SignUpWrapper}>
            <h2 className={fonts.blackHeading36px}>Sign Up</h2>
            <p className={fonts.greyBody14px}>
              Access to AI tools, that open up a new door for creativity
            </p>
            <form onSubmit={Register} className={miniComponents.forms}>
              <input
                ref={refEmail}
                type={"email"}
                required={true}
                placeholder="Email"
              ></input>
              <input
                ref={refPassword}
                type={"password"}
                required={true}
                placeholder="Password"
              ></input>
              <input ref={refSubmit} type="submit" value="Sign Up"></input>
            </form>
            <p className={fonts.greyBody14px}>
              By clicking on Sign up, you agree to our Terms of service and
              Privacy policy
            </p>
            <div className={miniComponents.line}></div>
            <div className={styles.PwithLink}>
              <p className={fonts.greyBody14px}>Already have an account?</p>
              <p
                className={fonts.greyBody14px}
                style={{ color: "#364590", cursor: "pointer" }}
                onClick={() => {
                  Close.setUpOrIn("login");
                  Close.closeLogIn(true);
                }}
              >
                Sign in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
