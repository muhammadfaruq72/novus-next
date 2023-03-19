import styles from "@/styles/components/Client/LeftMenu/DropDown.module.css";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import Image from "next/image";

interface DropDown {
  isOpen: any;
  setisOpen: any;
  index: any;
  mutate: any;
  setmanageMembersState: any;
  manageMembersState: any;
  Member: any;
}

export default function DropDown(Props: DropDown) {
  const [Option, setOption] = useState({
    status: "In Queue",
    color: "#FC7150",
  });
  const {
    isOpen,
    setisOpen,
    index,
    mutate,
    setmanageMembersState,
    manageMembersState,
    Member,
  } = Props;
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    LoggedUser,
    setLoggedUser,
  } = useContext(AuthContext);

  let Status = (status: any, ID: any) => {
    var ChannelName = SelectedChannel.Name;
    var option = "status";
    var spaceId = userExistsInSpace.space_id;
    var ExpiryDate = null;
    var task = "";
    var id: any = parseInt(ID);
    var Status = status;

    setmanageMembersState(
      manageMembersState.map((item: any) => {
        // console.log(Channel);
        if (item.id === ID) {
          return {
            ...item,
            Status: status,
          };
        } else {
          return item;
        }
      })
    );

    mutate({
      variables: { ChannelName, option, spaceId, ExpiryDate, task, id, Status },
    });
  };

  const Color = (status: string) => {
    if (status === "In Queue") {
      return "#FC7150";
    } else if (status === "In Progress") {
      return "#5185FC";
    } else if (status === "Completed") {
      return "#4DD778";
    } else if (status === "Cancelled") {
      return "#FF5B5B";
    }
  };

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
          style={{ backgroundColor: Color(Member.Status) }}
          onClick={(e) => {
            setisOpen({ Bool: !isOpen.Bool, key: index });
            // console.log(index, e);
          }}
        >
          <p style={{ color: "#fff", fontWeight: "400", fontSize: "14px" }}>
            {Member.Status}
          </p>
        </div>
        {LoggedUser.isAdmin && (
          <div>
            {index === isOpen.key && (
              <div
                className={`${styles.Options} ${
                  isOpen.Bool == false && styles.hidden
                }`}
              >
                <div
                  className={`${styles.WrapperCircle} ${
                    Option.status === "In Queue" && styles.WrapperCircleSelected
                  }`}
                  onClick={() => {
                    setOption({ status: "In Queue", color: "#FC7150" });
                    setisOpen({ Bool: false, key: index });
                    Status("In Queue", Member.id);
                  }}
                >
                  <div
                    className={styles.circle}
                    style={{ backgroundColor: "#FC7150" }}
                  ></div>
                  <p
                    className={`${styles.dropdownItem} ${
                      Option.status === "In Queue" &&
                      styles.dropdownItemSelected
                    }`}
                  >
                    In Queue
                  </p>
                </div>

                <div
                  className={`${styles.WrapperCircle} ${
                    Option.status === "In Progress" &&
                    styles.WrapperCircleSelected
                  }`}
                  onClick={() => {
                    setOption({ status: "In Progress", color: "#5185FC" });
                    setisOpen({ Bool: false, key: index });
                    Status("In Progress", Member.id);
                  }}
                >
                  <div
                    className={styles.circle}
                    style={{ backgroundColor: "#5185FC" }}
                  ></div>
                  <p
                    className={`${styles.dropdownItem} ${
                      Option.status === "In Progress" &&
                      styles.dropdownItemSelected
                    }`}
                  >
                    In Progress
                  </p>
                </div>

                <div
                  className={`${styles.WrapperCircle} ${
                    Option.status === "Cancelled" &&
                    styles.WrapperCircleSelected
                  }`}
                  onClick={() => {
                    setOption({ status: "Cancelled", color: "#FF5B5B" });
                    setisOpen({ Bool: false, key: index });
                    Status("Cancelled", Member.id);
                  }}
                >
                  <div
                    className={styles.circle}
                    style={{ backgroundColor: "#FF5B5B" }}
                  ></div>
                  <p
                    className={`${styles.dropdownItem} ${
                      Option.status === "Cancelled" &&
                      styles.dropdownItemSelected
                    }`}
                  >
                    Cancelled
                  </p>
                </div>

                <div
                  className={`${styles.WrapperCircle} ${
                    Option.status === "Completed" &&
                    styles.WrapperCircleSelected
                  }`}
                  onClick={() => {
                    setOption({ status: "Completed", color: "#4DD778" });
                    setisOpen({ Bool: false, key: index });
                    Status("Completed", Member.id);
                  }}
                >
                  <div
                    className={styles.circle}
                    style={{ backgroundColor: "#4DD778" }}
                  ></div>
                  <p
                    className={`${styles.dropdownItem} ${
                      Option.status === "Completed" &&
                      styles.dropdownItemSelected
                    }`}
                  >
                    Completed
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
