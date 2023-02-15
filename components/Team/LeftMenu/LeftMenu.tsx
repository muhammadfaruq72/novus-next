import fonts from "@/styles/fonts.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import styles from "@/styles/components/Team/LeftMenu/LeftMenu.module.css";
import ThreeDots from "@/public/ThreeDots.svg";
import Plus from "@/public/Plus.svg";
import Database from "@/public/Database.svg";
import User1 from "@/public/Temporary/image1.png";
import User2 from "@/public/Temporary/image2.png";
import User3 from "@/public/Temporary/image3.png";
import User4 from "@/public/Temporary/image4.png";
import User5 from "@/public/Temporary/image5.png";
import DropMenu from "@/public/DropMenu.svg";
import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import ClickChannel3Dots from "./ClickChannel3Dots";
import ClickAddChannel from "@/components/Team/LeftMenu/ClickAddChannel";
import { Line } from "rc-progress";
import ManageMembers from "./ManageMembers";
import ChannelMembers from "./ChannelMembers";
import Invite from "./Invite";
import { gql, useMutation, useQuery } from "@apollo/client";
import AuthContext from "@/components/CreateContext";
import InfiniteScroll from "react-infinite-scroll-component";

const Channels: any = [
  "Marketing Research",
  "Email Compaign",
  "Facebook Ads",
  "TikTok ads",
  "Marketing Research",
  "Email Compaign",
  "Facebook Ads",
  "TikTok ads",
  "Marketing Research",
  "Email Compaign",
  "Facebook Ads",
  "TikTok ads",
  "Marketing Research",
  "Email Compaign",
  "Facebook Ads",
  "TikTok ads",
];

interface Members {
  username: string;
  image: any;
}

const Members: Members[] = [
  { username: "Justin_Willson", image: User1 },
  { username: "Dav_Espinosa", image: User2 },
  { username: "FlyingDucky", image: User3 },
  { username: "Tebeloper", image: User4 },
  { username: "Justin_Willson", image: User1 },
  { username: "Dav_Espinosa", image: User2 },
  { username: "FlyingDucky", image: User3 },
  { username: "Tebeloper", image: User4 },
  { username: "Justin_Willson", image: User1 },
  { username: "Dav_Espinosa", image: User2 },
  { username: "FlyingDucky", image: User3 },
  { username: "Tebeloper", image: User4 },
];

interface Hover {
  Bool: Boolean;
  key: number;
}
// let ChannelItems = {
//   cursor: "inline",
// };

// let DropMenu_svg = {
//   transform: "rotate(0)",
// };

let ThreedotRef: any;

interface ChannelsState {}

export default function LeftMenu() {
  const { userExistsInSpace } = useContext(AuthContext);

  const [ChannelsState, setChannelsState] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, sethasNextPage] = useState(false);
  const [channelCount, setchannelCount] = useState(0);

  const ChannelsQUERY = gql`
    query MyQuery(
      $Useremail: String!
      $spaceId: String!
      $page: Int!
      $perPage: Int!
    ) {
      channelMembers(
        page: $page
        perPage: $perPage
        Useremail: $Useremail
        spaceId: $spaceId
      ) {
        hasNextPage
        channelCount
        items {
          memberCount
          Channel {
            Name
            Workspace {
              spaceId
            }
            isPublic
          }
        }
      }
    }
  `;

  const {
    data: ChannelsData,
    loading: ChannelsLoading,
    refetch: ChannelsRefetch,
  } = useQuery(ChannelsQUERY, {
    variables: {
      Useremail: localStorage.getItem("email"),
      spaceId: userExistsInSpace.space_id,
      page: page,
      perPage: 10,
    },
  });

  const fetchMoreData = () => {
    console.log("fetchMoreData");
    setPage((prev) => prev + 1);
    ChannelsRefetch({
      Useremail: localStorage.getItem("email"),
      spaceId: userExistsInSpace.space_id,
      page: page,
      perPage: 10,
    });
  };

  useEffect(() => {
    if (typeof ChannelsData !== "undefined") {
      setChannelsState(ChannelsState.concat(ChannelsData.channelMembers.items));
      setchannelCount(ChannelsData.channelMembers.channelCount);
      if (ChannelsData.channelMembers.hasNextPage === true) {
        sethasNextPage(true);
      } else {
        sethasNextPage(false);
      }
    }
  }, [ChannelsLoading]);

  useEffect(() => {
    console.log("ChannelsState", ChannelsState, hasNextPage);
  }, [ChannelsState]);

  //Three Dots Show hide on Channel Hover
  const [isHoverChannelItemGrid, setisHoverChannelItemGrid] = useState<Hover>({
    Bool: false,
    key: 1,
  });

  const handleMouseEnter = (key: any) => {
    setisHoverChannelItemGrid({ Bool: true, key: key });
  };

  const handleMouseOut = (key: any) => {
    setisHoverChannelItemGrid({ Bool: false, key: key });
  };

  //Open Close channel Items
  const [channelOpen, setchannelOpen] = useState(false);
  const handleChannelItems = () => {
    setchannelOpen(!channelOpen);
  };

  // Selected channel item
  const [SelectedChannel, setSelectedChannel] = useState({
    Bool: false,
    key: null,
  });
  const handleSelectedChannel = (key: any) => {
    // console.log(key);
    setSelectedChannel({ Bool: !SelectedChannel, key: key });
  };

  //Cross Show hide on Member Hover
  const [isHoverMemberItemGrid, setisHoverMemberItemGrid] = useState<Hover>({
    Bool: false,
    key: 1,
  });

  const MouseEnterMemberItemGrid = (key: any) => {
    setisHoverMemberItemGrid({ Bool: true, key: key });
  };

  const MouseOutMemberItemGrid = (key: any) => {
    setisHoverMemberItemGrid({ Bool: false, key: key });
  };

  //Open Close Members Items
  const [memberOpen, setMemberOpen] = useState(false);
  const handleMemberItems = () => {
    setMemberOpen(!memberOpen);
  };

  // On clicking three dots
  const [menuIsOpen, setMenuIsOpen] = useState({ Bool: false, key: null });
  const handleThreedotRef = (src: any) => {
    ThreedotRef = src;
  };

  // On clicking Add Channel
  const [AddChannelOpen, setAddChannelOpen] = useState(false);

  //   useEffect(() => {
  //     console.log("clicked", menuIsOpen);
  //   }, [menuIsOpen]);

  // Modal for people in Channel
  const [Open, setOpen] = useState<Boolean>(false);

  // Invite Modal for people in Channel
  const [ChannelMembersOpen, setChannelMembersOpen] = useState<Boolean>(false);

  // Invite Modal for people in Channel
  const [inviteOpen, setInviteOpen] = useState<Boolean>(false);

  const [style3Dots, setStyle3Dots] = useState({});

  const clickPosition = (event: any) => {
    console.log(event.pageY, event.pageX);
    setStyle3Dots({
      top: `${event.pageY}px`,
      left: `${event.pageX}px`,
    });
  };

  return (
    <>
      <Invite setOpen={setInviteOpen} Open={inviteOpen} />

      <ChannelMembers
        setOpen={setChannelMembersOpen}
        Open={ChannelMembersOpen}
      />
      <ManageMembers setOpen={setOpen} Open={Open} />
      <div className={styles.LeftMenu}>
        <div>
          <div style={{ cursor: "default" }} className={styles.WrapperChannel}>
            <div className={styles.Channel}>
              <div className={styles.SubChannel}>
                <DropMenu
                  className={`${styles.DropMenu_svg}`}
                  style={
                    channelOpen === true
                      ? {
                          transform: "rotate(-90deg)",
                        }
                      : {
                          transform: "rotate(0deg)",
                        }
                  }
                  onClick={handleChannelItems}
                />

                <p className={fonts.lightBlack17px}>Channels</p>
                <p
                  className={styles.greyBody15px}
                  style={{ cursor: "not-allowed !important" }}
                >
                  {channelCount}
                </p>
              </div>
              <Plus
                className={styles.Plus_svg}
                onClick={(e: any) => {
                  setAddChannelOpen(!AddChannelOpen);
                  handleThreedotRef(e.target);
                }}
              />
              {AddChannelOpen && (
                <ClickAddChannel
                  HamburgerRef={ThreedotRef}
                  setMenuIsOpen={setAddChannelOpen}
                  setChannelsState={setChannelsState}
                  setchannelCount={setchannelCount}
                />
              )}
            </div>
            <div
              id="scrollableDiv"
              className={styles.ChannelItems}
              style={
                channelOpen === true
                  ? {
                      display: "none",
                    }
                  : {
                      display: "grid",
                    }
              }
            >
              <InfiniteScroll
                dataLength={ChannelsState.length}
                next={() => fetchMoreData()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "8px 12px 5px 8px",
                }}
                inverse={false}
                hasMore={hasNextPage}
                loader={
                  <div className={miniComponents.center}>
                    <div className={miniComponents.loader}></div>
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {menuIsOpen.Bool && (
                  <ClickChannel3Dots
                    HamburgerRef={ThreedotRef}
                    setMenuIsOpen={setMenuIsOpen}
                    style3Dots={style3Dots}
                  />
                )}
                {ChannelsState.filter((obj: any, index) => {
                  return (
                    index ===
                    ChannelsState.findIndex(
                      (o: any) => obj.Channel.Name === o.Channel.Name
                    )
                  );
                }).map((Channel: any, index: any) => (
                  <div
                    key={index}
                    className={styles.ChannelItemGrid}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseOut(index)}
                    onClick={() => handleSelectedChannel(index)}
                    style={
                      SelectedChannel.Bool === true ||
                      index === SelectedChannel.key
                        ? {
                            backgroundColor: "#fbfbfb",
                            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.2)",
                          }
                        : {}
                    }
                  >
                    <p
                      className={styles.greyBody15pxNoHover}
                      style={
                        SelectedChannel.Bool === true ||
                        index === SelectedChannel.key
                          ? {
                              color: "#404040",
                            }
                          : {}
                      }
                    >
                      #&nbsp;&nbsp;{Channel.Channel.Name}
                    </p>
                    <div className={styles.ChannelIconGrid}>
                      <p
                        className={styles.greyBody15px}
                        onClick={() => setChannelMembersOpen(true)}
                      >
                        {Channel.memberCount}
                      </p>
                      {(isHoverChannelItemGrid.Bool &&
                        index === isHoverChannelItemGrid.key) ||
                      (index === menuIsOpen.key && menuIsOpen.Bool) ? (
                        <ThreeDots
                          className={styles.ThreeDots_svg}
                          // ref={HamburgerRef}
                          onClick={(e: any) => {
                            clickPosition(e);
                            handleThreedotRef(e.target);
                            setMenuIsOpen({
                              Bool: !menuIsOpen.Bool,
                              key: index,
                            });
                          }}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </div>

          <div
            className={miniComponents.lineGrey}
            style={{ margin: "20px 0px 10px 0px" }}
          ></div>
          <></>
          <></>
          <div style={{ cursor: "default" }} className={styles.WrapperChannel}>
            <div className={styles.Channel}>
              <div className={styles.SubChannel}>
                <DropMenu
                  className={`${styles.DropMenu_svg}`}
                  style={
                    memberOpen === true
                      ? {
                          transform: "rotate(-90deg)",
                        }
                      : {
                          transform: "rotate(0deg)",
                        }
                  }
                  onClick={handleMemberItems}
                />

                <p className={fonts.lightBlack17px}>Members</p>
                <p
                  className={styles.greyBody15px}
                  onClick={() => setOpen(true)}
                >
                  2
                </p>
              </div>
              <Plus
                className={styles.Plus_svg}
                onClick={() => setInviteOpen(true)}
              />
            </div>
            <div
              className={styles.MemberItems}
              style={
                memberOpen === true
                  ? {
                      display: "none",
                    }
                  : {
                      display: "grid",
                    }
              }
            >
              {Members.map((Member: any, index: any) => (
                <div
                  key={index}
                  className={styles.MemberItemGrid}
                  onMouseEnter={() => MouseEnterMemberItemGrid(index)}
                  onMouseLeave={() => MouseOutMemberItemGrid(index)}
                >
                  <div className={styles.imageWrapper}>
                    <Image src={Member.image} alt="" height={22} width={22} />
                    <div className={styles.greyBody15pxNoHover}>
                      {Member.username}
                    </div>
                  </div>

                  <div className={styles.MemberIconGrid}>
                    {isHoverMemberItemGrid.Bool &&
                    index === isHoverMemberItemGrid.key ? (
                      <Plus className={styles.Cross_svg} />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.Progress}>
          <div className={styles.Database}>
            <Database />
            <p className={fonts.lightBlack14px}> 2 GB of 5 GB</p>
          </div>
          <Line
            percent={60}
            strokeWidth={1}
            trailWidth={1}
            strokeColor="#364590"
            trailColor={"#E2DFE7"}
          />
        </div>
      </div>
    </>
  );
}
