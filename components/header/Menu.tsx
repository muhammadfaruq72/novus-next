import styles from "@/styles/components/header/Menu.module.css";
import fonts from "@/styles/fonts.module.css";
import Setting from "@/public/Setting.svg";
import LogOut from "@/public/LogOut.svg";
import { useEffect } from "react";

interface props {
  menuIsOpen: any;
  setMenuIsOpen: any;
  HamburgerRef: any;
  setIsLoggedIn: any;
}

export default function Menu(Props: props) {
  interface MenuData {
    title: string;
    icon: any;
    click: any;
  }

  const Clicked = () => {
    alert("Button triggered");
  };
  let LogOutUser = () => {
    localStorage.removeItem("email");
    Props.setIsLoggedIn(false);
  };
  const MenuData: MenuData[] = [
    { title: "Account details", icon: Setting, click: Clicked },
    { title: "Log out", icon: LogOut, click: Clicked },
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
      {MenuData.map((item, index) => (
        <div key={index}>
          {" "}
          <div
            className={styles.MenuItem}
            onClick={() => {
              if (item.title === "Log out") {
                LogOutUser();
              }
            }}
          >
            <item.icon style={{ width: "36px" }} className={styles.Svg} />

            <p className={styles.greyBody16px}>{item.title}</p>
          </div>
          <div
            className={`${index !== MenuData.length - 1 && styles.Divider}`}
          ></div>
        </div>
      ))}
    </div>
  );
}
