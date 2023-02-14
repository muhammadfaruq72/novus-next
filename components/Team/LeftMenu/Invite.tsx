import styles from "@/styles/components/Team/LeftMenu/Invite.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Plus from "@/public/Plus.svg";

import User1 from "@/public/Temporary/image1.png";
import User2 from "@/public/Temporary/image2.png";
import User3 from "@/public/Temporary/image3.png";
import User4 from "@/public/Temporary/image4.png";
import User5 from "@/public/Temporary/image5.png";
import Image from "next/image";
import DropDown from "./DropDown";
import { useEffect, useState } from "react";

interface Close {
  setOpen: any;
  Open: any;
}

export default function Invite(Close: Close) {
  return (
    <>
      <div
        onClick={() => {
          Close.setOpen(false);
        }}
        className={`${styles.overlay} ${
          Close.Open === true ? styles.visible : styles.hidden
        }`}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            className={styles.Wrapper}
          >
            <Plus
              className={styles.SVGCross}
              onClick={() => {
                Close.setOpen(false);
              }}
            />

            <div className={styles.ContentWrapper}>
              <h1 className={fonts.blackHeading21px}>Invite Team Members</h1>
              <p
                style={{ marginTop: "-25px", maxWidth: "400px" }}
                className={fonts.greyBody14px}
              >
                Enter number of team members to get an invite link.
              </p>
              <form className={styles.forms}>
                <input
                  name="text"
                  type={"text"}
                  required={true}
                  placeholder="Ex: 3"
                ></input>
                <input type="submit" value="Copy invite link"></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
