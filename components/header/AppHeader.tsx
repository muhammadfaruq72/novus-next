import Logo from "@/public/LOGO.svg";
import User from "@/public/User.png";
import Marketing from "@/public/Marketing.png";
import styles from "@/styles/components/header/AppHeader.module.css";
import Image from "next/image";
import Menu from "@/components/header/Menu";
import { useState, useRef, useEffect, useContext } from "react";
import fonts from "@/styles/fonts.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import AuthContext from "@/components/CreateContext";

interface AppHeader {
  spaceHeader: Boolean;
  setIsLoggedIn: any;
  spaceName?: string;
  spaceImage?: string;
  isClient?: string;
}

interface customUser {
  url: string;
}

export default function AppHeader(Props: AppHeader) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [CustomUser, setCustomUser] = useState<customUser | null>(null);
  const { SelectedChannel } = useContext(AuthContext);

  const CustomUserQUERY = gql`
    query MyQuery($Useremail: String!) {
      customUsers(Useremail: $Useremail) {
        username
        email
        Image {
          url
        }
      }
    }
  `;

  const { data: CustomUserSpace, loading: CustomUserLoading } = useQuery(
    CustomUserQUERY,
    {
      variables: { Useremail: localStorage.getItem("email") },
    }
  );

  useEffect(() => {
    if (typeof CustomUserSpace !== "undefined") {
      setCustomUser({ url: CustomUserSpace.customUsers.Image.url });
    }
  }, [CustomUserLoading]);

  const HamburgerRef: any = useRef();
  return (
    <>
      <header
        className={
          SelectedChannel.MobileBool ? styles.WrapperOnClick : styles.Wrapper
        }
      >
        {!Props.spaceHeader && (
          <div className={styles.ContentWrapper}>
            <img
              src={process.env.NEXT_PUBLIC_BACKEND_GRAPHQL + Props.spaceImage!}
              alt=""
              style={{ width: "35px", height: "35px", borderRadius: "5px" }}
            />
            <div className={styles.textWrapper}>
              <h1 className={fonts.blackBody16px}>{Props.spaceName}</h1>
              <p className={fonts.greyBody13px}>
                {Props.isClient ? "Client Workspace" : "Team Workspace"}
              </p>
            </div>
          </div>
        )}
        {Props.spaceHeader && <Logo className={styles.LOGO} />}
        {CustomUser !== null && (
          <img
            onClick={() => setMenuIsOpen(!menuIsOpen)}
            ref={HamburgerRef}
            src={process.env.NEXT_PUBLIC_BACKEND_GRAPHQL + CustomUser!.url}
            alt=""
            style={{ width: "35px", height: "35px", borderRadius: "5px" }}
          />
        )}
        {menuIsOpen && (
          <Menu
            HamburgerRef={HamburgerRef}
            menuIsOpen={menuIsOpen}
            setMenuIsOpen={setMenuIsOpen}
            setIsLoggedIn={Props.setIsLoggedIn}
          />
        )}
      </header>
    </>
  );
}
