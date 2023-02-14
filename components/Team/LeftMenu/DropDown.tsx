import styles from "@/styles/components/Team/LeftMenu/DropDown.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";

interface DropDown {
  isOpen: any;
  setisOpen: any;
  index: any;
}

export default function DropDown(Props: DropDown) {
  const [Option, setOption] = useState("Member");
  const { isOpen, setisOpen, index } = Props;

  return (
    <>
      <div
        className={styles.parentWrapper}
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <div
          className={styles.Wrapper}
          onClick={(e) => {
            setisOpen({ Bool: !isOpen.Bool, key: index });
            // console.log(index, e);
          }}
        >
          <p style={{ color: "#fff", fontWeight: "400", fontSize: "14px" }}>
            {Option}
          </p>
        </div>
        {index === isOpen.key && (
          <div
            className={`${styles.Options} ${
              isOpen.Bool == false && styles.hidden
            }`}
          >
            <p
              onClick={() => {
                setOption("Member");
                setisOpen({ Bool: false, key: index });
              }}
              className={`${styles.dropdownItem} ${
                Option === "Member" && styles.dropdownItemSelected
              }`}
            >
              Member
            </p>
            <p
              onClick={() => {
                setOption("Admin");
                setisOpen({ Bool: false, key: index });
              }}
              className={`${styles.dropdownItem} ${
                Option === "Admin" && styles.dropdownItemSelected
              }`}
            >
              Admin
            </p>
          </div>
        )}
      </div>
    </>
  );
}
