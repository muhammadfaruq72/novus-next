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
// import ThreeDots from "@/public/ThreeDots.svg";

// let ThreedotRef: any;

interface AddSpaceMembers {
  memberScrollStyle: any;
  setmemberScrollStyle: any;
  selectedSpace: any;
  manageMembersState: any;
  setmanageMembersState: any;
}

export default function AddSpaceMembers_sub(Props: AddSpaceMembers) {
  const {
    memberScrollStyle,
    setmemberScrollStyle,
    selectedSpace,
    manageMembersState,
    setmanageMembersState,
  } = Props;
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    LoggedUser,
    setLoggedUser,
  } = useContext(AuthContext);

  const [filter, setFilter] = useState("");

  const [ManageMemberPage, setManageMemberPage] = useState(1);
  const [managehasNextPagemember, setmanagehasNextPagemember] = useState(false);
  const [styleSubmit, setStyleSubmit] = useState({});

  const [isQuerySearch, setisQuerySearch] = useState({
    Bool: false,
    filter: "",
  });

  const inputTextRef: any = useRef();

  const [selectedMrmberCount, setselectedMrmberCount] = useState(0);

  const handleCheckOnChange = (username: string) => {
    setmanageMembersState(
      manageMembersState.map((Member: any) => {
        if (Member.User.username === username) {
          return { ...Member, isChecked: !Member.isChecked };
        } else {
          return Member;
        }
      })
    );
  };

  useEffect(() => {
    setselectedMrmberCount(
      manageMembersState.filter(function (item: any) {
        if (item.isChecked === true) {
          return true;
        } else {
          return false;
        }
      }).length
    );
    // console.log("peoples", manageMembersState);
  }, [manageMembersState]);

  useEffect(() => {
    setmanageMembersState([]);
    setManageMemberPage(1);
  }, [selectedSpace]);

  const MembersQUERY = gql`
    query MyQuery(
      $page: Int!
      $perPage: Int!
      $SelectedSpace: String!
      $spaceId: String!
      $UserContains: String
    ) {
      SpaceMembersAddQuery(
        page: $page
        perPage: $perPage
        SelectedSpace: $SelectedSpace
        spaceId: $spaceId
        UserContains: $UserContains
      ) {
        hasNextPage
        items {
          id
          isChecked
          User {
            username
            id
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
          manageMembersState.concat(data.SpaceMembersAddQuery.items)
        );
        if (isQuerySearch.Bool) {
          setFilter(isQuerySearch.filter);
          setisQuerySearch({ Bool: false, filter: "" });
        } else {
          if (data.SpaceMembersAddQuery.hasNextPage === true) {
            setmanagehasNextPagemember(true);
          } else {
            setmanagehasNextPagemember(false);
          }
        }
      }
    },
  });

  const fetchMoreDataManageMembers = () => {
    setManageMemberPage((prev) => prev + 1);
    spaceQuery({
      variables: {
        page: ManageMemberPage,
        perPage: 10,
        SelectedSpace: selectedSpace.spaceId,
        spaceId: userExistsInSpace.space_id,
        UserContains: null,
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
    // console.log("handleSearch");
    spaceQuery({
      variables: {
        page: 1,
        perPage: 20,
        SelectedSpace: selectedSpace.spaceId,
        spaceId: userExistsInSpace.space_id,
        UserContains: event.target.text.value,
      },
    });
  };

  return (
    <>
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
              placeholder={`${
                selectedMrmberCount != 0
                  ? `${selectedMrmberCount} Selected`
                  : ``
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (memberScrollStyle.display === "none") {
                  setmemberScrollStyle({ display: "block" });
                } else {
                  setmemberScrollStyle({ display: "none" });
                }

                // console.log("ManageMemberPage", ManageMemberPage);
                if (ManageMemberPage == 1) {
                  fetchMoreDataManageMembers();
                }
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
              <input type="submit" style={{ display: "none" }}></input>
              <div className={styles.searchWrapper} style={styleSubmit}>
                <Search className={styles.search_svg} />
              </div>
            </label>
          </form>
        </div>

        <div
          id="RecentlyOpenedAddmemberr"
          className={styles.MemberScroll}
          style={memberScrollStyle}
        >
          {manageMembersState.filter((value: any, index: number) => {
            if (filter === "") {
              return (
                index ===
                manageMembersState.findIndex(
                  (o: any) => value.User.username === o.User.username
                )
              );
            } else if (
              value.User.username.toLowerCase().includes(filter.toLowerCase())
            ) {
              return (
                index ===
                manageMembersState.findIndex(
                  (o: any) => value.User.username === o.User.username
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
            scrollableTarget="RecentlyOpenedAddmemberr"
          >
            {manageMembersState
              .filter((value: any, index: number) => {
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
                <div
                  className={styles.WrapperMembers}
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    // inputTextRef.current.value = "";
                    // setFilter("");
                  }}
                >
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
                      <div className={styles.lightBlack15px}>
                        {Member.User.username}
                      </div>
                      <div className={fonts.greyBody13px}>
                        {selectedSpace.spaceId}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Member.isChecked}
                    onChange={() => handleCheckOnChange(Member.User.username)}
                  ></input>
                </div>
              ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}
