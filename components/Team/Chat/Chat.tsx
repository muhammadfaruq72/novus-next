import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import styles from "@/styles/components/Team/Chat/Chat.module.css";
import Plus from "@/public/Plus.svg";
import Send from "@/public/Send.svg";
import Reply from "@/public/Reply.svg";
import useAutosizeTextArea from "./useAutosizeTextArea";
import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import AuthContext from "@/components/CreateContext";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import miniComponents from "@/styles/miniComponents.module.css";
import useWebSocket from "react-use-websocket";

export default function Chat() {
  const { userExistsInSpace, SelectedChannel, setSelectedChannel } =
    useContext(AuthContext);

  const [ChatsState, setChatsState] = useState([]);
  const [hasNextPageChat, setNextPageChat] = useState(false);

  const ChatsQUERY = gql`
    query MyQuery(
      $ChannelName: String!
      $page: Int!
      $perPage: Int!
      $spaceId: String!
      $AfterID: Int
    ) {
      Chat(
        ChannelName: $ChannelName
        page: $page
        perPage: $perPage
        spaceId: $spaceId
        AfterID: $AfterID
      ) {
        hasNextPage
        items {
          id
          Reply
          Message
          Username {
            username
            Image {
              url
            }
          }
          ReplyUsername {
            username
            Image {
              url
            }
          }
          Channel {
            Name
          }
        }
      }
    }
  `;

  const [
    ChatsLazyQuery,
    { data: ChatsData, loading: ChatsLoading, refetch: ChatsRefetch },
  ] = useLazyQuery(ChatsQUERY);

  const fetchMoreDataChats = () => {
    // console.log("fetchMoreDataMembers");

    try {
      var a: any = ChatsState.filter((o: any) => {
        return o.Channel.Name === SelectedChannel.Name;
      });
      a = parseInt(a[a.length - 1].id);
      // console.log("Last Element", a);
    } catch (err) {
      // console.log(err);
      a = null;
    }

    ChatsLazyQuery({
      variables: {
        ChannelName: SelectedChannel.Name,
        page: 1,
        perPage: 18,
        spaceId: userExistsInSpace.space_id,
        AfterID: a,
      },
    });
  };

  useEffect(() => {
    // console.log(ChatsData, "ChatsData");
    if (typeof ChatsData !== "undefined" && ChatsData.Chat !== null) {
      setChatsState(ChatsState.concat(ChatsData.Chat.items));
      if (ChatsData.Chat.hasNextPage === true) {
        setNextPageChat(true);
      } else {
        setNextPageChat(false);
      }
    }
  }, [ChatsLoading]);

  useEffect(() => {
    var filteredChat = ChatsState.filter((o: any) => {
      return o.Channel.Name === SelectedChannel.Name;
    });
    console.log("ChatsState", filteredChat, hasNextPageChat);
  }, [ChatsState]);

  useEffect(() => {
    if (SelectedChannel.Name !== null) {
      // console.log("SelectedChannel", SelectedChannel);
      fetchMoreDataChats();
    }
  }, [SelectedChannel]);

  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    // console.log(textAreaRef.current?.clientHeight);
    // setStyleSpace({ height: `${textAreaRef.current?.clientHeight}px` });
    setValue(val);
  };

  // const chatHeight = useRef();

  // const handleResize = () => {
  //   console.log(chatHeight.current!.style.height);
  // };

  // useEffect(() => {
  //   console.log(chatHeight.current?.style.height);
  // });

  const [replyOpen, setreplyOpen] = useState({
    Bool: false,
    username: null,
    message: null,
  });
  // const [styleSpace, setStyleSpace] = useState({ height: "0px" });

  const WrapperConversation = useRef<HTMLDivElement | null>(null);

  // var ws: any;

  // useEffect(() => {
  //   ws = new WebSocket("ws://127.0.0.1:8000/chat/", [
  //     "DataScienceTeam1",
  //     "abcd",
  //   ]);

  //   ws.onopen = function () {
  //     console.log("Connection Established");
  //   };

  //   ws.onclose = function () {
  //     console.log("Connection Closed");
  //   };
  //   return () => {
  //     ws.close();
  //   };
  // });

  // let socket: any;
  // useEffect(() => {
  //     socket = socketio('ws://localhost:3001')
  //     return () => {
  //       socket.off('message:new', listener)
  //     }
  //   },[])

  // var ws: any;
  // useEffect(() => {
  //   ws = new WebSocket("ws://127.0.0.1:8000/chat/", userExistsInSpace.space_id);
  //   ws.onopen = () => {
  //     console.log("Connection Established");
  //   };

  //   // ws.send(JSON.stringify({"Message": "Hello from the client"}))

  //   ws.onclose = () => {
  //     console.log("Connection disconnected");
  //   };
  //   // Close socket on unmount:
  //   return () => ws.close();
  // }, []); // <-- empty dependency array; only run callback once, on mount

  const sendHandler = () => {
    console.log(textAreaRef.current?.value);
    sendJsonMessage({
      Channel: SelectedChannel.Name,
      username: localStorage.getItem("username"),
      Message: textAreaRef.current?.value,
      ReplyUsername: replyOpen.username,
      Reply: replyOpen.message,
    });
    setValue("");
  };

  // ws.onmessage = (event: any) => {
  //   console.log("message Recieved", event);
  // };

  const processMessages = (event: any) => {
    var message: any = [JSON.parse(event.data).message];
    setChatsState(message.concat(ChatsState));
    console.log(message);
  };

  // useEffect(() => {
  //   console.log("value", value);
  // }, [value]);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket("ws://127.0.0.1:8000/chat/", {
    onOpen: () => console.log("WebSocket connection opened."),
    protocols: userExistsInSpace.space_id,
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => processMessages(event),
  });

  return (
    <>
      <div className={styles.ChatWrapper}>
        <div className={styles.Chat}>
          {" "}
          <div className={styles.Conversation}>
            <div id="scrollableDivChat" className={styles.WrapperConversation}>
              <InfiniteScroll
                dataLength={ChatsState.length}
                next={() => {
                  fetchMoreDataChats();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
                inverse={true}
                hasMore={hasNextPageChat}
                loader={
                  <div className={miniComponents.center}>
                    <div className={miniComponents.loader}></div>
                  </div>
                }
                scrollableTarget="scrollableDivChat"
              >
                {ChatsState.filter((o: any) => {
                  return o.Channel.Name === SelectedChannel.Name;
                }).map((Chat: any, index: any) => (
                  <div
                    className={styles.hoverMessage}
                    key={index}
                    style={
                      index === 0
                        ? {
                            marginBottom: "15px",
                          }
                        : {
                            marginBottom: "0px",
                          }
                    }
                  >
                    <Reply
                      className={styles.svg_Reply}
                      onClick={() =>
                        setreplyOpen({
                          Bool: true,
                          username: Chat.Username.username,
                          message: Chat.Message,
                        })
                      }
                    />
                    <div className={styles.Messagereply} key={index}>
                      <div className={styles.massage}>
                        <img
                          src={
                            process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                            Chat.Username.Image.url
                          }
                          alt=""
                          height={35}
                          width={35}
                          style={{ borderRadius: "5px" }}
                        />
                        <div className={styles.messageText}>
                          <div className={fonts.blackBody15px}>
                            {Chat.Username.username}
                          </div>
                          <div className={fonts.lightBlack16px}>
                            {Chat.Message}-------{Chat.id} {Chat.Channel.Name}{" "}
                            {index}
                          </div>
                        </div>
                      </div>
                      {Chat.ReplyUsername !== null ? (
                        <div className={styles.reply}>
                          <div className={styles.Reply_css}></div>
                          <div
                            className={styles.massage}
                            style={{ gap: "10px" }}
                          >
                            <img
                              src={
                                process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                                Chat.ReplyUsername.Image.url
                              }
                              alt=""
                              height={25}
                              width={25}
                              style={{ borderRadius: "5px" }}
                            />
                            <div
                              style={{ gap: "0px" }}
                              className={styles.messageText}
                            >
                              <div className={fonts.blackBody12px}>
                                {Chat.ReplyUsername.username}
                              </div>
                              <div className={fonts.lightBlack11px}>
                                {Chat.Reply}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
              <div style={{ height: "0px" }}></div>
            </div>{" "}
          </div>
          <div className={styles.WrapperSendBar}>
            {replyOpen.Bool && (
              <div className={styles.SendBarReply}>
                <p className={fonts.lightBlack13px}>
                  Replying to{" "}
                  <strong className={fonts.lightBlack15px}>
                    {replyOpen.username}
                  </strong>{" "}
                  "{replyOpen.message}"
                </p>
                <div className={styles.svg_CrossWrapper}>
                  <Plus
                    className={styles.svg_Cross}
                    onClick={() =>
                      setreplyOpen({
                        Bool: false,
                        username: null,
                        message: null,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <div className={styles.SendBar}>
              <Plus className={styles.svg_Plus} />
              <textarea
                id="review-text"
                onChange={handleChange}
                placeholder="Type a massage"
                ref={textAreaRef}
                rows={1}
                value={value}
                // ref={WrapperConversation}
              ></textarea>
              <Send onClick={sendHandler} className={styles.svg_Send} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
