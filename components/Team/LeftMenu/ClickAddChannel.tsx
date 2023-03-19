import styles from "@/styles/components/Team/LeftMenu/ClickAddChannel.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";
import LogOut from "@/public/LogOut.svg";
import Delete from "@/public/delete-icon.svg";
import { useEffect, useState, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import AuthContext from "@/components/CreateContext";

interface props {
  setMenuIsOpen: any;
  HamburgerRef: any;
  setChannelsState: any;
  setchannelCount: any;
  clickAddchannel: any;
}

export default function ClickAddChannel(Props: props) {
  const [styleSubmit, setStyleSubmit] = useState({});
  const { userExistsInSpace } = useContext(AuthContext);
  const {
    HamburgerRef,
    setMenuIsOpen,
    setChannelsState,
    setchannelCount,
    clickAddchannel,
  } = Props;
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

  //Code for Mutation

  const Mutation = gql`
    mutation MyMutation(
      $CreatorEmail: String!
      $ChannelName: String!
      $spaceId: String!
    ) {
      Channel(
        ChannelName: $ChannelName
        CreatorEmail: $CreatorEmail
        spaceId: $spaceId
      ) {
        channelCount
        memberCount
        Channel {
          Name
          isPublic
          Workspace {
            spaceId
          }
        }
        message
      }
    }
  `;

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        if (data.Channel !== null) {
          setMenuIsOpen(false);
          setChannelsState((prevArr: any) => [...prevArr, data.Channel]);
          setchannelCount(data.Channel.channelCount);
        }
        if (data.Channel === null) {
          alert("This Channel name already exits. Please try another name.");
        }
      },
    }
  );

  let CreateWorkSpace = (event: any) => {
    event.preventDefault();
    var ChannelName = event.target.text.value;
    var CreatorEmail = localStorage.getItem("email");
    var spaceId = userExistsInSpace.space_id;
    mutate({ variables: { CreatorEmail, ChannelName, spaceId } });
  };

  useEffect(() => {
    if (loading === true) {
      setStyleSubmit({
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        pointerEvents: "none",
      });
    }
    if (loading === false) {
      setStyleSubmit({
        backgroundColor: "#364590",
        pointerEvents: "auto",
      });
    }
  }, [loading]);

  return (
    <div
      className={styles.Menu}
      style={clickAddchannel}
      onClick={(e: any) => e.stopPropagation()}
    >
      <p className={fonts.lightBlack14px}>Create a Channel</p>
      <form className={styles.Wrapper} onSubmit={CreateWorkSpace}>
        <input
          name="text"
          type={"text"}
          required={true}
          placeholder="Ex: Marketing"
        ></input>
        <label className={styles.label} style={styleSubmit}>
          <input type="submit" />
          <Plus className={styles.Svg} />
        </label>
      </form>
    </div>
  );
}
