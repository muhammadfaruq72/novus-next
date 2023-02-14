import styles from "@/styles/components/Team/LeftMenu/ClickChannel3Dots.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";
import LogOut from "@/public/LogOut.svg";
import Delete from "@/public/delete-icon.svg";
import { useEffect } from "react";

interface props {
  setMenuIsOpen: any;
  HamburgerRef: any;
}

export default function ClickChannel3Dots(Props: props) {
  const { HamburgerRef, setMenuIsOpen } = Props;
  interface MenuData {
    title: string;
    icon: any;
    click: any;
  }

  const Clicked = () => {
    alert("Button triggered");
  };

  const MenuData: MenuData[] = [
    { title: "Create Task List", icon: Plus, click: Clicked },
    { title: "Leave TaskSpace", icon: LogOut, click: Clicked },
    { title: "Delete TaskSpace", icon: Delete, click: Clicked },
  ];

  useEffect(() => {
    function ToggleMenu(event: any) {
      if (event.target !== HamburgerRef) {
        setMenuIsOpen(false);
      }
    }
    window.addEventListener("click", ToggleMenu);
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("click", ToggleMenu);
    };
  });

  return (
    <div className={styles.Menu}>
      {MenuData.map((item, index) => (
        <div key={index}>
          {" "}
          <div className={styles.MenuItem} onClick={item.click}>
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
