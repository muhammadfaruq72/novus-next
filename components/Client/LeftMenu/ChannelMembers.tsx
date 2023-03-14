import styles from "@/styles/components/Team/LeftMenu/ChannelMembers.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Plus from "@/public/Plus.svg";
import Search from "@/public/search-icon.svg";
import Image from "next/image";
import DropDown from "./DropDown";
import ThreeDots from "@/public/ThreeDots.svg";
import ManageMembers3Dots from "./ManageMembers3Dots";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import InfiniteScroll from "react-infinite-scroll-component";
import AddChannelMembers from "./addChannelMembers";

let ThreedotRef: any;

interface Close {
  setOpen: any;
  Open: any;
  setMembersState: any;
  MembersState: any;
  setChannelsState?: any;
  ChannelsState?: any;
}

export default function ChannelMembers(Close: Close) {
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
  const handleThreedotRef = (src: any) => {
    ThreedotRef = src;
  };

  const [style3Dots, setStyle3Dots] = useState({});

  const clickPosition = (event: any) => {
    // console.log(event.pageY, event.pageX);
    setStyle3Dots({
      top: `${event.pageY - 80}px`,
      left: `${event.pageX - 160}px`,
    });
  };

  const [manageMembersState, setmanageMembersState] = useState([]);
  const [managememberpage, setmanagememberpage] = useState(1);
  const [managehasNextPagemember, setmanagehasNextPagemember] = useState(false);
  const [styleSubmit, setStyleSubmit] = useState({});
  const [isQuerySearch, setisQuerySearch] = useState({
    Bool: false,
    filter: "",
  });

  const [chMember, setChMember] = useState(true);

  const MembersQUERY = gql`
    query MyQuery(
      $ChMember: Boolean!
      $page: Int!
      $perPage: Int!
      $spaceId: String!
      $channelName: String!
      $UserContains: String
    ) {
      QueryChannelMembers(
        ChMember: $ChMember
        page: $page
        perPage: $perPage
        spaceId: $spaceId
        channelName: $channelName
        UserContains: $UserContains
      ) {
        items {
          User {
            id
            username
            Image {
              url
            }
          }
          isAdded
        }
        hasNextPage
      }
    }
  `;

  const [
    channelMembersQuery,
    {
      // data: manageMembersData,
      loading: manageMembersLoading,
      refetch: manageMembersRefetch,
    },
  ] = useLazyQuery(MembersQUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted: (data) => {
      if (typeof data !== "undefined") {
        setmanageMembersState(
          manageMembersState.concat(data.QueryChannelMembers.items)
        );

        if (isQuerySearch.Bool) {
          setFilter(isQuerySearch.filter);
          setisQuerySearch({ Bool: false, filter: "" });
        } else {
          if (data.QueryChannelMembers.hasNextPage === true) {
            setmanagehasNextPagemember(true);
          } else {
            if (chMember === true) {
              // console.log("chMember", chMember);
              setChMember(false);

              if (managememberpage !== 1) {
                setmanagememberpage(1);
              } else {
                channelMembersQuery({
                  variables: {
                    ChMember: false,
                    page: 1,
                    perPage: 10,
                    spaceId: userExistsInSpace.space_id,
                    channelName: SelectedChannel.Name,
                    UserContains: null,
                  },
                });
              }
            }
            if (chMember === false) {
              setmanagehasNextPagemember(false);
            }
          }
          if (
            data.QueryChannelMembers.hasNextPage === true &&
            manageMembersState.length < 10
          ) {
            setmanagememberpage((prev) => prev + 1);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (Close.Open === true) {
      channelMembersQuery({
        variables: {
          ChMember: chMember,
          page: managememberpage,
          perPage: 10,
          spaceId: userExistsInSpace.space_id,
          channelName: SelectedChannel.Name,
          UserContains: null,
        },
      });
    }
  }, [Close.Open]);

  // useEffect(() => {
  //   console.log("manageMembersState", manageMembersState);
  // }, [manageMembersState]);

  const fetchMoreDataManageMembers = () => {
    // console.log("fetchMoreDataManageMembers");
    setmanagememberpage((prev) => prev + 1);
  };

  useEffect(() => {
    // console.log("managememberpage", managememberpage);
    if (Close.Open === true) {
      channelMembersQuery({
        variables: {
          ChMember: chMember,
          page: managememberpage,
          perPage: 10,
          spaceId: userExistsInSpace.space_id,
          channelName: SelectedChannel.Name,
          UserContains: null,
        },
      });
    }
  }, [managememberpage]);

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

  const handleSearch = (event: any) => {
    event.preventDefault();
    setisQuerySearch({ Bool: true, filter: event.target.text.value });
    channelMembersQuery({
      variables: {
        ChMember: chMember,
        page: 1,
        perPage: 10,
        spaceId: userExistsInSpace.space_id,
        channelName: SelectedChannel.Name,
        UserContains: event.target.text.value,
      },
    });
  };

  return (
    <>
      <div
        onClick={() => {
          Close.setOpen(false);
          setmanageMembersState([]);
          setmanagememberpage(1);
          setChMember(true);
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
              setMenuIsOpen({
                Bool: false,
                key: null,
              });
            }}
            className={styles.Wrapper}
          >
            <Plus
              className={styles.SVGCross}
              onClick={() => {
                Close.setOpen(false);
                setmanageMembersState([]);
                setmanagememberpage(1);
                setChMember(true);
              }}
            />

            <div className={styles.ContentWrapper}>
              <div style={{ marginTop: "15px" }}>
                <h1 className={fonts.blackHeading21px}>
                  {SelectedChannel.Name}
                </h1>
                <p
                  style={{ marginTop: "5px", maxWidth: "400px" }}
                  className={fonts.greyBody14px}
                >
                  Members
                </p>
              </div>

              <form
                className={styles.forms}
                onSubmit={(event: any) => {
                  handleSearch(event);
                }}
              >
                <input
                  name="text"
                  type={"text"}
                  required={true}
                  placeholder="Ex: David_Expinosa"
                  onChange={(event) => {
                    if (event.target.value === "") {
                      setFilter("");
                    }
                  }}
                ></input>
                <label>
                  <input type="submit" style={{ display: "none" }}></input>
                  <div className={styles.searchWrapper} style={styleSubmit}>
                    <Search className={styles.search_svg} />
                  </div>
                </label>
              </form>
              <div
                id="scrollableDivChannelMember"
                className={styles.MemberScroll}
              >
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
                  scrollableTarget="scrollableDivChannelMember"
                >
                  {manageMembersState
                    .filter((value: any, index) => {
                      if (filter === "") {
                        return (
                          index ===
                          manageMembersState.findIndex(
                            (o: any) => value.User.username === o.User.username
                          )
                        );
                      } else if (
                        value.User.username
                          .toLowerCase()
                          .includes(filter.toLowerCase())
                      ) {
                        return (
                          index ===
                          manageMembersState.findIndex(
                            (o: any) => value.User.username === o.User.username
                          )
                        );
                      }
                    })
                    .map((Member: any, index: any) => (
                      <div className={styles.WrapperMembers} key={index}>
                        <div className={styles.Members}>
                          <img
                            style={{ borderRadius: "5px" }}
                            src={
                              process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                              Member.User.Image.url
                            }
                            alt=""
                            height={35}
                            width={35}
                          />
                          <div className={styles.manageMembersData}>
                            <div className={fonts.lightBlack15px}>
                              {Member.User.username}
                            </div>
                            <div className={fonts.greyBody13px}>
                              {Member.isAdded ? "Member" : "Not a member"}
                            </div>
                          </div>
                        </div>
                        {LoggedUser.isAdmin && (
                          <AddChannelMembers
                            Member={Member}
                            setmanageMembersState={setmanageMembersState}
                            manageMembersState={manageMembersState}
                            setChannelsState={Close.setChannelsState}
                            ChannelsState={Close.ChannelsState}
                          />
                        )}
                      </div>
                    ))}
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
