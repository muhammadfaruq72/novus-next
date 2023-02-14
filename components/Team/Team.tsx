import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import styles from "@/styles/components/Team/Team.module.css";
import Plus from "@/public/Plus.svg";
import Database from "@/public/Database.svg";
import Send from "@/public/Send.svg";
import DropMenu from "@/public/DropMenu.svg";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import LeftMenu from "./LeftMenu/LeftMenu";
import Chat from "./Chat/Chat";

export default function Team() {
  return (
    <>
      <div className={styles.Wrapper}>
        <LeftMenu />
        <Chat />
      </div>
    </>
  );
}
