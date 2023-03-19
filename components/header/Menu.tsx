import styles from "@/styles/components/header/Menu.module.css";
import fonts from "@/styles/fonts.module.css";
import Setting from "@/public/Setting.svg";
import LogOut from "@/public/LogOut.svg";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface props {
  menuIsOpen: any;
  setMenuIsOpen: any;
  HamburgerRef: any;
  setIsLoggedIn: any;
}

export default function Menu(Props: props) {
  const { pathname } = useRouter();
  interface MenuData {
    title: string;
    icon: any;
    click: any;
  }

  const Clicked = () => {
    alert("Button triggered");
  };
  let Details = () => {
    alert("This feature is Coming Soon");
  };
  let LogOutUser = () => {
    localStorage.removeItem("email");
    Props.setIsLoggedIn(false);
  };
  const MenuData: MenuData[] = [
    { title: "Account details", icon: Setting, click: Clicked },
    { title: "Exit Space", icon: LogOut, click: Clicked },
  ];

  useEffect(() => {
    function ToggleMenu(event: any) {
      if (event.target !== Props.HamburgerRef.current) {
        Props.setMenuIsOpen(false);
      }
    }
    window.addEventListener("click", ToggleMenu);
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("click", ToggleMenu);
    };
  });

  return (
    <div
      className={`${Props.menuIsOpen === true ? styles.Menu : styles.hidden}`}
    >
      <div>
        {" "}
        <div
          className={styles.MenuItem}
          onClick={() => {
            Details();
          }}
        >
          <Setting style={{ width: "36px" }} className={styles.Svg} />

          <p className={styles.greyBody16px}>Account details</p>
        </div>
        <div
        // className={`${index !== MenuData.length - 1 && styles.Divider}`}
        ></div>
      </div>
      {pathname === "/" && (
        <div onClick={LogOutUser}>
          {" "}
          <div className={styles.MenuItem}>
            <LogOut style={{ width: "36px" }} className={styles.Svg} />

            <p className={styles.greyBody16px}>Exit Space</p>
          </div>
          <div className={`${styles.Divider}`}></div>
        </div>
      )}
      {pathname !== "/" && (
        <Link href="/">
          {" "}
          <div>
            {" "}
            <div className={styles.MenuItem}>
              <LogOut style={{ width: "36px" }} className={styles.Svg} />

              <p className={styles.greyBody16px}>Log out</p>
            </div>
            <div className={`${styles.Divider}`}></div>
          </div>
        </Link>
      )}
    </div>
  );
}
