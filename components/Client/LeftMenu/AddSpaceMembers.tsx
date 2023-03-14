import styles from "@/styles/components/Client/LeftMenu/AddSpaceMembers.module.css";
import fonts from "@/styles/fonts.module.css";
import Plus from "@/public/Plus.svg";
import miniComponents from "@/styles/miniComponents.module.css";
import { useEffect, useState, useContext, useRef, use } from "react";
import AuthContext from "@/components/CreateContext";
import NextArrow from "@/public/NextArrow.svg";
import { usePdf } from "@mikecousins/react-pdf";
import InfiniteScroll from "react-infinite-scroll-component";
import Search from "@/public/search-icon.svg";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import AddSpaceMembers_sub from "./AddSpaceMembers_sub";
import AddPeople from "./AddPeople";
// import ThreeDots from "@/public/ThreeDots.svg";

// let ThreedotRef: any;

interface Close {
  setOpen: any;
  Open: any;
  setMembersState?: any;
  MembersState?: any;
  setChannelsState?: any;
  ChannelsState?: any;
  setInviteOpen: any;
}

export default function AddSpaceMembers(Close: Close) {
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    LoggedUser,
    setLoggedUser,
  } = useContext(AuthContext);

  const [isOpen, setisOpen] = useState({ Bool: false, key: null });
  const [filter, setFilter] = useState("");

  // On clicking three dots
  const [menuIsOpen, setMenuIsOpen] = useState({ Bool: false, key: null });
  // const handleThreedotRef = (src: any) => {
  //   ThreedotRef = src;
  // };

  const [style3Dots, setStyle3Dots] = useState({});

  const clickPosition = (event: any) => {
    // console.log(event.pageY, event.pageX);
    setStyle3Dots({
      top: `${event.pageY - 80}px`,
      left: `${event.pageX - 160}px`,
    });
  };

  const [manageMembersState, setmanageMembersState] = useState([]);
  const [manageMembersState_, setmanageMembersState_] = useState<any>([]);

  const [managememberpage, setmanagememberpage] = useState(1);
  const [managehasNextPagemember, setmanagehasNextPagemember] = useState(false);
  const [styleSubmit, setStyleSubmit] = useState({});
  const [memberScrollStyle, setmemberScrollStyle] = useState({
    display: "none",
  });
  const [memberScrollStyle_, setmemberScrollStyle_] = useState({
    display: "none",
  });
  const [isQuerySearch, setisQuerySearch] = useState({
    Bool: false,
    filter: "",
  });
  const [selectedSpace, setselectedSpace] = useState({
    spaceId: null,
    Name: "",
  });

  const inputTextRef: any = useRef();

  const MembersQUERY = gql`
    query MyQuery(
      $FilterUserId: String!
      $page: Int!
      $perPage: Int!
      $SpaceContains: String
    ) {
      recentlyOpenedSpaceAddMembers(
        FilterUserId: $FilterUserId
        page: $page
        perPage: $perPage
        SpaceContains: $SpaceContains
      ) {
        hasNextPage
        items {
          LastOpened
          count
          workspace {
            Name
            spaceId
            isClient
            Image {
              url
            }
          }
        }
      }
    }
  `;

  const [spaceQuery] = useLazyQuery(MembersQUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted: (data) => {
      if (typeof data !== "undefined") {
        // console.log("data", data);
        setmanageMembersState(
          manageMembersState.concat(data.recentlyOpenedSpaceAddMembers.items)
        );
        if (isQuerySearch.Bool) {
          setFilter(isQuerySearch.filter);
          setisQuerySearch({ Bool: false, filter: "" });
        } else {
          if (data.recentlyOpenedSpaceAddMembers.hasNextPage === true) {
            setmanagehasNextPagemember(true);
          } else {
            setmanagehasNextPagemember(false);
          }
        }
      }
    },
  });

  const fetchMoreDataManageMembers = () => {
    // console.log("fetchMoreDataManageMembers");
    setmanagememberpage((prev) => prev + 1);
    spaceQuery({
      variables: {
        FilterUserId: localStorage.getItem("email"),
        page: managememberpage,
        perPage: 10,
        SpaceContains: null,
      },
    });
  };

  useEffect(() => {
    if (isQuerySearch.Bool === true) {
      setStyleSubmit({
        background: "rgba(0, 0, 0, 0.3)",
        pointerEvents: "none",
      });
    }
    if (isQuerySearch.Bool === false) {
      setStyleSubmit({
        background: "#364590",
        pointerEvents: "auto",
      });
    }
  }, [isQuerySearch]);

  // useEffect(() => {
  //   console.log("isQuerySearch", isQuerySearch);
  // }, [isQuerySearch]);

  // useEffect(() => {
  //   console.log("managehasNextPagemember", managehasNextPagemember);
  // }, [managehasNextPagemember]);

  const handleSearch = (event: any) => {
    event.preventDefault();
    setisQuerySearch({ Bool: true, filter: event.target.text.value });
    spaceQuery({
      variables: {
        FilterUserId: localStorage.getItem("email"),
        page: 1,
        perPage: 20,
        SpaceContains: event.target.text.value,
      },
    });
  };

  // const [threeDots, setThreeDots] = useState({ username: null, isAdmin: null });

  return (
    <>
      <div
        onClick={() => {
          Close.setOpen(false);
          setStyleSubmit({
            background: "#364590",
            pointerEvents: "auto",
          });
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
              setmemberScrollStyle({ display: "none" });
              setmemberScrollStyle_({ display: "none" });
            }}
            className={styles.Wrapper}
          >
            <div className={styles.MidWrapper}>
              <div className={styles.TopVerticleWrapper}>
                <div className={styles.VerticleWrapper}>
                  <div className={styles.SubWrapper}>
                    <div className={styles.ContentWrapper}>
                      <h1 className={styles.blackHeading21px}>
                        Add team members to workspace{" "}
                      </h1>
                      {/* <p
                      className={fonts.greyBody14px}
                      style={{ width: "400px" }}
                    >
                      Select the members to add.
                    </p> */}
                    </div>
                    <Plus
                      className={styles.SVGCross}
                      onClick={() => {
                        Close.setOpen(false);
                        setStyleSubmit({
                          background: "#364590",
                          pointerEvents: "auto",
                        });
                      }}
                    />
                  </div>
                  <div className={styles.PositionWrapper}>
                    <div className={styles.FormWrapper}>
                      <p className={fonts.greyBody13px}>
                        Select Team Workspace to choose team members from
                      </p>
                      <form
                        className={styles.forms}
                        onSubmit={(event: any) => {
                          handleSearch(event);
                        }}
                      >
                        <input
                          ref={inputTextRef}
                          name="text"
                          type={"text"}
                          required={true}
                          placeholder={selectedSpace.Name}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (memberScrollStyle_.display === "block") {
                              setmemberScrollStyle_({ display: "none" });
                            }
                            setmemberScrollStyle({ display: "block" });

                            if (managememberpage == 1) {
                              fetchMoreDataManageMembers();
                            }

                            setselectedSpace({
                              spaceId: null,
                              Name: "",
                            });
                          }}
                          onChange={(event) => {
                            if (event.target.value === "") {
                              setFilter("");
                            }
                          }}
                        ></input>
                        <label
                          onClick={(e) => {
                            e.stopPropagation();
                            setmemberScrollStyle({ display: "block" });
                          }}
                        >
                          <input
                            type="submit"
                            style={{ display: "none" }}
                          ></input>
                          <div
                            className={styles.searchWrapper}
                            style={styleSubmit}
                          >
                            <Search className={styles.search_svg} />
                          </div>
                        </label>
                      </form>
                    </div>

                    <div
                      id="RecentlyOpenedAddmember"
                      className={styles.MemberScroll}
                      style={memberScrollStyle}
                    >
                      {manageMembersState.filter((value: any, index) => {
                        if (filter === "") {
                          return (
                            index ===
                            manageMembersState.findIndex(
                              (o: any) =>
                                value.workspace.Name === o.workspace.Name
                            )
                          );
                        } else if (
                          value.workspace.Name.toLowerCase().includes(
                            filter.toLowerCase()
                          )
                        ) {
                          return (
                            index ===
                            manageMembersState.findIndex(
                              (o: any) =>
                                value.workspace.Name === o.workspace.Name
                            )
                          );
                        }
                      }).length <= 0 && (
                        <div
                          className={fonts.greyBody13px}
                          style={{
                            marginLeft: "calc(50% - 70px)",
                            marginTop: "10px",
                          }}
                        >
                          No Members to show
                        </div>
                      )}
                      <InfiniteScroll
                        dataLength={manageMembersState.length}
                        next={() => fetchMoreDataManageMembers()}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                        inverse={false}
                        hasMore={managehasNextPagemember}
                        loader={
                          <div className={miniComponents.center}>
                            <div className={miniComponents.loader}></div>
                          </div>
                        }
                        scrollableTarget="RecentlyOpenedAddmember"
                      >
                        {manageMembersState
                          .filter((value: any, index) => {
                            if (filter === "") {
                              return (
                                index ===
                                manageMembersState.findIndex(
                                  (o: any) =>
                                    value.workspace.Name === o.workspace.Name
                                )
                              );
                            } else if (
                              value.workspace.Name.toLowerCase().includes(
                                filter.toLowerCase()
                              )
                            ) {
                              return (
                                index ===
                                manageMembersState.findIndex(
                                  (o: any) =>
                                    value.workspace.Name === o.workspace.Name
                                )
                              );
                            }
                          })
                          .map((Member: any, index: any) => (
                            <div
                              className={styles.WrapperMembers}
                              key={index}
                              onClick={() => {
                                // console.log(Member);
                                setselectedSpace({
                                  spaceId: Member.workspace.spaceId,
                                  Name: Member.workspace.Name,
                                });
                                inputTextRef.current.value = "";
                                setFilter("");
                              }}
                            >
                              <div className={styles.Members}>
                                <img
                                  style={{ borderRadius: "5px" }}
                                  src={
                                    process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                                    Member.workspace.Image.url
                                  }
                                  alt=""
                                  height={35}
                                  width={35}
                                />
                                <div className={styles.manageMembersData}>
                                  <div className={styles.lightBlack15px}>
                                    {Member.workspace.Name}
                                  </div>
                                  <div className={fonts.greyBody13px}>
                                    {Member.count}{" "}
                                    {Member.count <= 1 ? "member" : "members"}
                                  </div>
                                </div>
                              </div>
                              {/* {LoggedUser.isAdmin && (
                          <div className={styles.MembeButtons}>
                            <ThreeDots
                              className={styles.ThreeDots_svg}
                              // ref={HamburgerRef}
                              onClick={(e: any) => {
                                e.stopPropagation();
                                clickPosition(e);
                                handleThreedotRef(e.target);
                                setMenuIsOpen({
                                  Bool: !menuIsOpen.Bool,
                                  key: index,
                                });
                                setThreeDots({
                                  username: Member.User.username,
                                  isAdmin: Member.isAdmin,
                                });
                              }}
                            />
                          </div>
                        )} */}
                            </div>
                          ))}
                      </InfiniteScroll>
                    </div>
                  </div>
                  <AddSpaceMembers_sub
                    memberScrollStyle={memberScrollStyle_}
                    setmemberScrollStyle={setmemberScrollStyle_}
                    selectedSpace={selectedSpace}
                    manageMembersState={manageMembersState_}
                    setmanageMembersState={setmanageMembersState_}
                  />
                </div>
                <div style={{ margin: "0px 0px 10px 5px" }}>
                  <AddPeople
                    manageMembersState={manageMembersState_}
                    ActualManageMembersState={Close.MembersState}
                    setActualManageMembersState={Close.setMembersState}
                    ActualChannelsState={Close.ChannelsState}
                    setActualChannelsState={Close.setChannelsState}
                    setOpen={Close.setOpen}
                  />
                  <p>
                    or{" "}
                    <span
                      style={{ color: "#364590", cursor: "pointer" }}
                      onClick={() => {
                        Close.setInviteOpen(true);
                        Close.setOpen(false);
                      }}
                    >
                      Invite with link
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
