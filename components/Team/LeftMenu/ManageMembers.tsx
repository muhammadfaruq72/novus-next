import styles from "@/styles/components/Team/LeftMenu/ManageMembers.module.css";
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
import { useState } from "react";

interface Members {
  username: string;
  email: string;
  image: any;
}

const Members: Members[] = [
  {
    username: "Justin_Willson",
    email: "Justin_Willson@gmail.com",
    image: User1,
  },
  { username: "Dav_Espinosa", email: "Dav_Espinosa@gmail.com", image: User2 },
  { username: "FlyingDucky", email: "FlyingDucky@gmail.com", image: User3 },
  { username: "Tebeloper", email: "Tebeloper@gmail.com", image: User4 },
  { username: "DanielLyons", email: "DanielLyons@gmail.com", image: User5 },
  {
    username: "Justin_Willson",
    email: "Justin_Willson@gmail.com",
    image: User1,
  },
  { username: "Dav_Espinosa", email: "Dav_Espinosa@gmail.com", image: User2 },
  { username: "FlyingDucky", email: "FlyingDucky@gmail.com", image: User3 },
  { username: "Tebeloper", email: "Tebeloper@gmail.com", image: User4 },
  { username: "DanielLyons", email: "DanielLyons@gmail.com", image: User5 },
];

interface Close {
  setOpen: any;
  Open: any;
}

export default function ManageMembers(Close: Close) {
  const [isOpen, setisOpen] = useState({ Bool: false, key: null });
  const [filter, setFilter] = useState("");
  return (
    <>
      <div
        onClick={() => {
          Close.setOpen(false);
          setisOpen({ Bool: false, key: null });
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
              setisOpen({ Bool: false, key: null });
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
              <h1 className={fonts.blackHeading21px}>Manage members</h1>
              <p
                style={{ marginTop: "-25px", maxWidth: "400px" }}
                className={fonts.greyBody14px}
              >
                You can permanently delete a user or assign roles to a user.
              </p>
              <form className={styles.forms}>
                <input
                  name="text"
                  type={"text"}
                  required={true}
                  placeholder="Ex: David_Expinosa"
                  onChange={(event) => setFilter(event.target.value)}
                ></input>
              </form>
              <div className={styles.MemberScroll}>
                {Members.filter((value) => {
                  if (filter === "") {
                    return value;
                  } else if (
                    value.username.toLowerCase().includes(filter.toLowerCase())
                  ) {
                    return value;
                  }
                }).map((Member: any, index: any) => (
                  <div className={styles.WrapperMembers} key={index}>
                    <div className={styles.Members}>
                      <Image src={Member.image} alt="" height={35} width={35} />
                      <div className={styles.MembersData}>
                        <div className={fonts.lightBlack15px}>
                          {Member.username}
                        </div>
                        <div className={fonts.greyBody14px}>{Member.email}</div>
                      </div>
                    </div>
                    <div className={styles.MembeButtons}>
                      <DropDown
                        isOpen={isOpen}
                        setisOpen={setisOpen}
                        index={index}
                      />

                      <button className={buttons.Red101x28}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
