import styles from "@/styles/components/Client/LeftMenu/ManageMembers.module.css";
import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import miniComponents from "@/styles/miniComponents.module.css";
import Plus from "@/public/Plus.svg";
import Search from "@/public/search-icon.svg";
import Image from "next/image";
import DropDown from "./DropDown";
import ThreeDots from "@/public/ThreeDots.svg";
import ManageMembers3Dots from "./ManageMembers3Dots";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import InfiniteScroll from "react-infinite-scroll-component";

let ThreedotRef: any;

interface Close {
  setOpen: any;
  Open: any;
  setChannelsState?: any;
  ChannelsState?: any;
}
let currentDate: string = "";
export default function Tasks(Close: Close) {
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    LoggedUser,
    setLoggedUser,
  } = useContext(AuthContext);

  const [isOpen, setisOpen] = useState({ Bool: false, key: null });
  //   const [filter, setFilter] = useState("");

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

  const MembersQUERY = gql`
    query MyQuery(
      $ChannelName: String!
      $spaceId: String!
      $page: Int!
      $perPage: Int!
    ) {
      Tasks(
        ChannelName: $ChannelName
        page: $page
        perPage: $perPage
        spaceId: $spaceId
      ) {
        hasNextPage
        items {
          task
          Status
          ExpiryDate
          CreatedOnDate
          id
        }
      }
    }
  `;

  const [
    TasksQuery,
    {
      // data: manageMembersData,
      loading: manageMembersLoading,
      refetch: manageMembersRefetch,
    },
  ] = useLazyQuery(MembersQUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted: (data: any) => {
      if (typeof data !== "undefined") {
        // console.log("manageMembersLoading", manageMembersLoading);

        setmanageMembersState(manageMembersState.concat(data.Tasks.items));

        if (isQuerySearch.Bool) {
          // setFilter(isQuerySearch.filter);
          setisQuerySearch({ Bool: false, filter: "" });
        } else {
          if (data.Tasks.hasNextPage === true) {
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
  };

  useEffect(() => {
    // console.log("managememberpage", managememberpage);
    if (Close.Open === true) {
      TasksQuery({
        variables: {
          spaceId: userExistsInSpace.space_id,
          page: managememberpage,
          perPage: 10,
          ChannelName: SelectedChannel.Name,
        },
      });
    }
  }, [managememberpage]);

  useEffect(() => {
    if (Close.Open === true) {
      TasksQuery({
        variables: {
          spaceId: userExistsInSpace.space_id,
          page: managememberpage,
          perPage: 10,
          ChannelName: SelectedChannel.Name,
        },
      });
    }
  }, [Close.Open]);

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

  const [DropWown, setDropWown] = useState<Boolean>(false);

  const Mutation = gql`
    mutation MyMutation(
      $ChannelName: String!
      $option: String!
      $spaceId: String!
      $task: String!
      $ExpiryDate: String
      $id: Int
      $Status: String
    ) {
      Task(
        ChannelName: $ChannelName
        option: $option
        spaceId: $spaceId
        ExpiryDate: $ExpiryDate
        task: $task
        id: $id
        Status: $Status
      )
    }
  `;

  const object = useRef({});

  const [mutate, { loading, error, data: mutateResponse }] = useMutation(
    Mutation,
    {
      onCompleted(data) {
        if (data.Task !== "delete" && data.Task !== "status") {
          const bar = { ...object.current, ...{ ["id"]: data.Task } };
          var ARRR: any = [];
          ARRR.push(bar);
          setmanageMembersState(manageMembersState.concat(ARRR));
          object.current = {};
        }
      },
    }
  );

  const [date, setDate] = useState(
    `${`${new Date().getFullYear()}`}-${`${
      new Date().getMonth() + 1
    }`}-${`${new Date().getDate()}`}`
  );
  const [value, setValue] = useState("");
  let CreateWorkSpace = (event: any) => {
    event.preventDefault();
    var ChannelName = SelectedChannel.Name;
    var option = "add";
    var spaceId = userExistsInSpace.space_id;
    var ExpiryDate = date;
    var task = event.target.text.value;
    var id = null;
    var Status = null;
    object.current = {
      CreatedOnDate: `${`${new Date().getFullYear()}`}-${`${
        new Date().getMonth() + 1
      }`}-${`${new Date().getDate()}`}`,
      ExpiryDate: date,
      Status: "In Queue",
      task: event.target.text.value,
    };
    setValue("");
    mutate({
      variables: { ChannelName, option, spaceId, ExpiryDate, task, id, Status },
    });
  };

  let Delete = (event: any, ID: any) => {
    event.preventDefault();
    var ChannelName = SelectedChannel.Name;
    var option = "delete";
    var spaceId = userExistsInSpace.space_id;
    var ExpiryDate = null;
    var task = "";
    var id: any = parseInt(ID);
    var Status = null;
    setmanageMembersState(
      manageMembersState.filter((item: any) => item.id !== ID)
    );
    mutate({
      variables: { ChannelName, option, spaceId, ExpiryDate, task, id, Status },
    });
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
    <>
      {/* {menuIsOpen.Bool && (
        <ManageMembers3Dots
          HamburgerRef={ThreedotRef}
          setMenuIsOpen={setMenuIsOpen}
          style3Dots={style3Dots}
          threeDots={threeDots}
          setmanageMembersState={setmanageMembersState}
          manageMembersState={manageMembersState}
          setMembersState={Close.setMembersState}
          MembersState={Close.MembersState}
          setChannelsState={Close.setChannelsState}
          ChannelsState={Close.ChannelsState}
        />
      )} */}
      <div
        onClick={() => {
          Close.setOpen(false);
          setisOpen({ Bool: false, key: null });
          setDropWown(false);
          setmanageMembersState([]);
          setmanagememberpage(1);
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
              setDropWown(false);
            }}
            className={styles.Wrapper}
          >
            <Plus
              className={styles.SVGCross}
              onClick={() => {
                Close.setOpen(false);
                setmanageMembersState([]);
                setmanagememberpage(1);
              }}
            />

            <div className={styles.ContentWrapper}>
              <div style={{ marginTop: "15px" }}>
                <h1 className={fonts.blackHeading21px}>Create New Task</h1>
                <p
                  style={{ marginTop: "5px", maxWidth: "400px" }}
                  className={fonts.greyBody14px}
                >
                  You can create new task in here.
                </p>
              </div>

              {LoggedUser.isAdmin && (
                <form
                  className={styles.forms}
                  style={{
                    gridTemplateColumns: "calc(55%) calc(25%) calc(15%)",
                  }}
                  onSubmit={(event: any) => {
                    CreateWorkSpace(event);
                  }}
                >
                  <input
                    name="text"
                    type={"text"}
                    required={true}
                    placeholder="Ex: Digital Marketing"
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                    }}
                  ></input>
                  <input
                    type="date"
                    name="date"
                    onChange={(event) => {
                      setDate(event.target.value);
                    }}
                  ></input>

                  <label>
                    <input type="submit" style={{ display: "none" }}></input>
                    <div className={styles.searchWrapper} style={styleSubmit}>
                      <Plus className={styles.search_svg} />
                    </div>
                  </label>
                </form>
              )}
              <div
                id="scrollableTasks"
                className={styles.MemberScroll}
                style={
                  LoggedUser.isAdmin
                    ? {
                        height: "min(100% - 0px, 405px)",
                      }
                    : {
                        height: "min(100% - 0px, 460px)",
                      }
                }
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
                  scrollableTarget="scrollableTasks"
                >
                  {manageMembersState.map(
                    (Member: any, index: any, { length }) => (
                      <div className={styles.WrapperMembers} key={index}>
                        <div className={styles.Members}>
                          {/* <img
                            style={{ borderRadius: "5px" }}
                            src={
                              process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                              Member.User.Image.url
                            }
                            alt=""
                            height={35}
                            width={35}
                          /> */}
                          <div className={styles.manageMembersData}>
                            <div className={fonts.lightBlack16px}>
                              {Member.task}
                            </div>
                            <div className={fonts.greyBody13px}>
                              {Member.CreatedOnDate} - {Member.ExpiryDate}
                            </div>
                          </div>
                        </div>
                        <div className={styles.DropDownTask}>
                          <DropDown
                            Member={Member}
                            isOpen={DropWown}
                            setisOpen={setDropWown}
                            index={index}
                            mutate={mutate}
                            setmanageMembersState={setmanageMembersState}
                            manageMembersState={manageMembersState}
                          />
                          {LoggedUser.isAdmin && (
                            <Plus
                              className={styles.SVGCrossTask}
                              onClick={(event: any) => {
                                Delete(event, Member.id);
                              }}
                            />
                          )}
                        </div>

                        {index == length - 1 && (
                          <div style={{ height: "100px" }}></div>
                        )}
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
                    )
                  )}
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
