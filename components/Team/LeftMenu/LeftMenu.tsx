import fonts from "@/styles/fonts.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import styles from "@/styles/components/Team/LeftMenu/LeftMenu.module.css";
import ThreeDots from "@/public/ThreeDots.svg";
import Plus from "@/public/Plus.svg";
import Lock from "@/public/Lock.svg";
import DropMenu from "@/public/DropMenu.svg";
import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import ClickChannel3Dots from "./ClickChannel3Dots";
import ClickAddChannel from "@/components/Team/LeftMenu/ClickAddChannel";
import ManageMembers from "./ManageMembers";
import ChannelMembers from "./ChannelMembers";
import Invite from "./Invite";
import { gql, useMutation, useQuery } from "@apollo/client";
import AuthContext from "@/components/CreateContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Progressbar from "./Progressbar";

interface Hover {
  Bool: Boolean;
  key: number;
}
let ThreedotRef: any;

export default function LeftMenu() {
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    DeleteMembercount,
    setDeleteMembercount,
    LoggedUser,
  } = useContext(AuthContext);

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
      Useremail:
        typeof window !== "undefined" ? localStorage.getItem("email") : null,
      spaceId: userExistsInSpace.space_id,
      page: page,
      perPage: 10,
    },
  });

  const fetchMoreData = () => {
    // console.log("fetchMoreData");
    setPage((prev) => prev + 1);
    ChannelsRefetch({
      Useremail:
        typeof window !== "undefined" ? localStorage.getItem("email") : null,
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

  const [MembersState, setMembersState] = useState([]);
  const [memberpage, setmemberpage] = useState(1);
  const [hasNextPagemember, sethasNextPagemember] = useState(false);
  const [memberCount, setmemberCount] = useState(0);

  const MemberssQUERY = gql`
    query MyQuery($spaceId: String!, $page: Int!, $perPage: Int!) {
      SpaceMembers(page: $page, perPage: $perPage, spaceId: $spaceId) {
        hasNextPage
        memberCount
        items {
          isAdmin
          User {
            username
            Image {
              url
            }
          }
        }
      }
    }
  `;

  const {
    data: MembersData,
    loading: MembersLoading,
    refetch: MembersRefetch,
  } = useQuery(MemberssQUERY, {
    variables: {
      spaceId: userExistsInSpace.space_id,
      page: memberpage,
      perPage: 10,
    },
  });

  const fetchMoreDataMembers = () => {
    // console.log("fetchMoreDataMembers");
    setmemberpage((prev) => prev + 1);
    MembersRefetch({
      spaceId: userExistsInSpace.space_id,
      page: memberpage,
      perPage: 10,
    });
  };

  useEffect(() => {
    // console.log(MembersData, "MembersData");
    if (typeof MembersData !== "undefined") {
      setMembersState(MembersState.concat(MembersData.SpaceMembers.items));
      setDeleteMembercount(0);
      setmemberCount(MembersData.SpaceMembers.memberCount);
      if (MembersData.SpaceMembers.hasNextPage === true) {
        sethasNextPagemember(true);
      } else {
        sethasNextPagemember(false);
      }
    }
  }, [MembersLoading]);

  // useEffect(() => {
  //   console.log("MembersState", MembersState, hasNextPagemember);

  // }, [MembersState]);

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

  const handleSelectedChannel = (
    key: any,
    Name: any,
    isPublic: boolean,
    members: any
  ) => {
    setSelectedChannel({
      Bool: !SelectedChannel,
      key: key,
      Name: Name,
      isPublic: isPublic,
      members: members,
      MobileBool: true,
    });
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
  const [clickAddchannel, setclickAddchannel] = useState({});

  const clickPosition = (event: any) => {
    // console.log(event.pageY, event.pageX);
    setStyle3Dots({
      top: `${event.pageY}px`,
      left: `${event.pageX - 180}px`,
    });
  };

  const clickPositionAddChannel = (event: any) => {
    // console.log(event.pageY, event.pageX);
    setclickAddchannel({
      top: `${event.pageY + 3}px`,
      left: `${event.pageX - 205}px`,
    });
  };

  return (
    <>
      <Invite setOpen={setInviteOpen} Open={inviteOpen} />

      <ChannelMembers
        setOpen={setChannelMembersOpen}
        Open={ChannelMembersOpen}
        setMembersState={setMembersState}
        MembersState={MembersState}
        setChannelsState={setChannelsState}
        ChannelsState={ChannelsState}
      />
      <ManageMembers
        setOpen={setOpen}
        Open={Open}
        setMembersState={setMembersState}
        MembersState={MembersState}
        setChannelsState={setChannelsState}
        ChannelsState={ChannelsState}
      />
      {menuIsOpen.Bool && (
        <ClickChannel3Dots
          HamburgerRef={ThreedotRef}
          setMenuIsOpen={setMenuIsOpen}
          style3Dots={style3Dots}
          setChannelsState={setChannelsState}
          ChannelsState={ChannelsState}
          setchannelCount={setchannelCount}
        />
      )}
      <div
        className={
          SelectedChannel.MobileBool ? styles.LeftMenuOnClick : styles.LeftMenu
        }
      >
        <div className={styles.TopWrapper}>
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
              {LoggedUser.isAdmin && (
                <Plus
                  className={styles.Plus_svg}
                  onClick={(e: any) => {
                    setAddChannelOpen(!AddChannelOpen);
                    handleThreedotRef(e.target);
                    clickPositionAddChannel(e);
                  }}
                />
              )}

              {AddChannelOpen && (
                <ClickAddChannel
                  HamburgerRef={ThreedotRef}
                  setMenuIsOpen={setAddChannelOpen}
                  setChannelsState={setChannelsState}
                  setchannelCount={setchannelCount}
                  clickAddchannel={clickAddchannel}
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
                    onClick={() =>
                      handleSelectedChannel(
                        index,
                        Channel.Channel.Name,
                        Channel.Channel.isPublic,
                        Channel.memberCount
                      )
                    }
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
                    <div className={styles.ChannelLock}>
                      {Channel.Channel.isPublic ? (
                        <div
                          className={styles.greyBody15pxNoHover}
                          style={
                            SelectedChannel.Bool === true ||
                            index === SelectedChannel.key
                              ? {
                                  color: "#404040",
                                  fontSize: "19px",
                                }
                              : { fontSize: "19px" }
                          }
                        >
                          #
                        </div>
                      ) : (
                        <div>
                          <Lock
                            className={styles.Svg_lock}
                            style={
                              SelectedChannel.Bool === true ||
                              index === SelectedChannel.key
                                ? {
                                    stroke: "#404040",
                                  }
                                : {}
                            }
                          />
                        </div>
                      )}
                      <p
                        className={styles.greyBody15pxNoHover}
                        style={
                          SelectedChannel.Bool === true ||
                          index === SelectedChannel.key
                            ? {
                                color: "#404040",
                                // display: "grid",
                              }
                            : {}
                        }
                      >
                        {Channel.Channel.Name}
                      </p>
                    </div>
                    <div
                      className={styles.ChannelIconGrid}
                      onClick={(e) => e.stopPropagation()}
                    >
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
                          className={styles.ThreeDots_svg_None}
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
                        <></>
                      )}
                      {
                        <ThreeDots
                          className={styles.ThreeDots_svg}
                          onClick={(e: any) => {
                            clickPosition(e);
                            handleThreedotRef(e.target);
                            setMenuIsOpen({
                              Bool: !menuIsOpen.Bool,
                              key: index,
                            });
                          }}
                        />
                      }
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </div>

          {/* <div
            className={miniComponents.lineGrey}
            style={{ margin: "30px 0px 10px 0px" }}
          ></div> */}

          <div
            style={{ cursor: "default", marginTop: "20px" }}
            className={styles.WrapperChannel}
          >
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
                  {memberCount - DeleteMembercount}
                </p>
              </div>
              <Plus
                className={styles.Plus_svg}
                onClick={() => setInviteOpen(true)}
              />
            </div>
            <div
              id="scrollableDivMember"
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
              <InfiniteScroll
                dataLength={MembersState.length}
                next={() => fetchMoreDataMembers()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "8px 12px 5px 8px",
                }}
                inverse={false}
                hasMore={hasNextPagemember}
                loader={
                  <div className={miniComponents.center}>
                    <div className={miniComponents.loader}></div>
                  </div>
                }
                scrollableTarget="scrollableDivMember"
              >
                {MembersState.map((Member: any, index: any) => (
                  <div
                    key={index}
                    className={styles.MemberItemGrid}
                    onMouseEnter={() => MouseEnterMemberItemGrid(index)}
                    onMouseLeave={() => MouseOutMemberItemGrid(index)}
                  >
                    <div className={styles.imageWrapper}>
                      <img
                        style={{ borderRadius: "3px" }}
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                          Member.User.Image.url
                        }
                        alt=""
                        height={22}
                        width={22}
                      />
                      <div className={styles.greyBody15pxNoHover}>
                        {Member.User.username}{" "}
                        {/* {console.log(Member.User.username)} */}
                        {(typeof window !== "undefined"
                          ? localStorage.getItem("username")
                          : null) === Member.User.username && (
                          <span style={{ fontSize: "11px", fontWeight: "200" }}>
                            (you)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* <div className={styles.MemberIconGrid}>
                      {isHoverMemberItemGrid.Bool &&
                      index === isHoverMemberItemGrid.key ? (
                        <Plus className={styles.Cross_svg} />
                      ) : (
                        <div></div>
                      )}
                    </div> */}
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </div>
        <Progressbar />
      </div>
    </>
  );
}
