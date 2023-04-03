import fonts from "@/styles/fonts.module.css";
import styles from "@/styles/components/Client/FileSpace/Chat.module.css";
import Plus from "@/public/Plus.svg";
import Send from "@/public/Send.svg";
import Attachment from "@/public/attachment.svg";
import Pdf_SVG from "@/public/Pdf.svg";
import Reply from "@/public/Reply.svg";
import useAutosizeTextArea from "./useAutosizeTextArea";
import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "@/components/CreateContext";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import miniComponents from "@/styles/miniComponents.module.css";
import useWebSocket from "react-use-websocket";
import InputFiles from "./InputFiles";
import AttachmentArea from "./AttachmentArea";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto, { randomBytes } from "crypto";
import { VideoPlayer } from "@videojs-player/react";
import "video.js/dist/video-js.css";
import PdfPopup from "./PdfPopup";
import BackArrow from "@/public/BackArrow.svg";
import Progress from "@/public/progress.svg";

function splitLast(s: string, sep: string = " ") {
  let right = s.split(sep).pop();
  let left = s.substring(0, s.length - right!.length - sep.length);
  return [left, right];
}

const imageTypes = ["png", "jpeg", "jpg"];
const videoTypes = ["mp4"];
const pdfType = ["pdf"];

function CheckTypes(
  FileExtension: string,
  Image: Boolean,
  Video: Boolean,
  Pdf: Boolean
) {
  if (Image) {
    return imageTypes.some((type) => FileExtension.includes(type));
  }
  if (Video) {
    return videoTypes.some((type) => FileExtension.includes(type));
  }
  if (Pdf) {
    return pdfType.some((type) => FileExtension.includes(type));
  }
}

interface fileSpace {
  setShowSpace: any;
  showSpace: any;
}

export default function FileSpace(Props: fileSpace) {
  const { setShowSpace, showSpace } = Props;
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    ClientsselectedFilesArray,
    setClientsSelectedFilesArray,
    setClientsSelectedImages,
    ClientselectedImages,
  } = useContext(AuthContext);

  const [ChatsState, setChatsState] = useState([]);
  const [hasNextPageChat, setNextPageChat] = useState(false);
  const [sendLoading, setsendLoading] = useState(false);
  const [PdfPopupOpen, setPdfPopup] = useState({
    Bool: false,
    attachment: null,
  });

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const ChatsQUERY = gql`
    query MyQuery(
      $ChannelName: String!
      $page: Int!
      $perPage: Int!
      $spaceId: String!
      $AfterID: Int
    ) {
      FileSpace(
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
          attachment
          ReplyAttachment
          isClient
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
    if (typeof ChatsData !== "undefined" && ChatsData.FileSpace !== null) {
      setChatsState(ChatsState.concat(ChatsData.FileSpace.items));
      if (ChatsData.FileSpace.hasNextPage === true) {
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
    // console.log("ChatsState", filteredChat, hasNextPageChat);
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
  const [replyOpen, setreplyOpen] = useState({
    Bool: false,
    username: null,
    message: null,
    attachment: null,
  });

  const sendHandler = () => {
    if (ClientsselectedFilesArray.length <= 0) {
      console.log(textAreaRef.current?.value);
      sendJsonMessage({
        Channel: SelectedChannel.Name,
        username:
          typeof window !== "undefined"
            ? localStorage.getItem("username")
            : null,
        Message: textAreaRef.current?.value,
        ReplyUsername: replyOpen.username,
        Reply: replyOpen.message,
        attachment: { Key: null, Name: null, No_Of_Files: null },
        ReplyAttachment: replyOpen.attachment,
        isClient: true,
      });
      setValue("");
      setreplyOpen({
        Bool: false,
        username: null,
        message: null,
        attachment: null,
      });
    } else {
      const myPromise = new Promise(async function (Resolve, Reject) {
        setsendLoading(true);
        let [left, right] = splitLast(ClientsselectedFilesArray[0].name, ".");
        const ImageKey = crypto.randomBytes(16).toString("hex") + "." + right;
        const key = `${userExistsInSpace.space_id}/${SelectedChannel.Name}/${ImageKey}`;

        console.log(ImageKey);

        try {
          const parallelUploads3 = new Upload({
            client: new S3Client({
              credentials: {
                accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
                secretAccessKey: `${process.env.NEXT_PUBLIC_SECRETECCESSKEY}`,
              },
              region: "ap-south-1",
            }),
            params: {
              Bucket: "novus-bucket-by-the-handler",
              Key: key,
              Body: ClientsselectedFilesArray[0],
            },

            tags: [
              /*...*/
            ], // optional tags
            queueSize: 4, // optional concurrency configuration
            partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
            leavePartsOnError: false, // optional manually handle dropped parts
          });

          parallelUploads3.on("httpUploadProgress", (progress) => {
            console.log(progress);
          });

          await parallelUploads3.done();
          Resolve(key);
        } catch (e) {
          console.log(e);
        }
      });

      myPromise.then(function (value) {
        console.log(textAreaRef.current?.value);
        sendJsonMessage({
          Channel: SelectedChannel.Name,
          username:
            typeof window !== "undefined"
              ? localStorage.getItem("username")
              : null,
          Message: textAreaRef.current?.value,
          ReplyUsername: replyOpen.username,
          Reply: replyOpen.message,
          attachment: {
            Key: `${value}`,
            Name: ClientsselectedFilesArray[0].name,
            No_Of_Files: ClientsselectedFilesArray.length,
          },
          ReplyAttachment: replyOpen.attachment,
          isClient: true,
        });
        setValue("");
        setreplyOpen({
          Bool: false,
          username: null,
          message: null,
          attachment: null,
        });
        setClientsSelectedImages([]);
        setClientsSelectedFilesArray([]);
        setsendLoading(false);
      });
    }
  };

  function sendNotification(
    message: string,
    user: string,
    Channel: string,
    Space: string
  ) {
    const notification = new Notification(`@${user}: ${message}`, {
      icon: process.env.NEXT_PUBLIC_HOST + "/favicon.png",
      body: `${Space} | ${Channel}`,
    });
    notification.onclick = () =>
      function () {
        window.open(process.env.NEXT_PUBLIC_HOST);
      };
  }

  function requestPermission(
    message: string,
    user: string,
    Channel: string,
    Space: string
  ) {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications!");
    } else if (Notification.permission === "granted") {
      sendNotification(message, user, Channel, Space);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          sendNotification(message, user, Channel, Space);
        }
      });
    }
  }

  const processMessages = (event: any) => {
    var notification: any = JSON.parse(event.data).message;
    if (
      typeof window !== "undefined"
        ? localStorage.getItem("username")
        : null !== notification.Username.username
    ) {
      requestPermission(
        notification.Message,
        notification.Username.username,
        notification.Channel.Name,
        userExistsInSpace.spaceName
      );
    }

    var message: any = [JSON.parse(event.data).message];
    setChatsState(message.concat(ChatsState));
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
  } = useWebSocket(`${process.env.NEXT_PUBLIC_WSS}`, {
    onOpen: () => console.log("WebSocket connection opened."),
    protocols: userExistsInSpace.space_id,
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => processMessages(event),
  });

  const [ConversationStyle, setConversationStyle] = useState(
    styles.WrapperConversation
  );

  useEffect(() => {
    if (replyOpen.Bool) {
      setConversationStyle(styles.WrapperConversationReplyTrue);
    } else {
      setConversationStyle(styles.WrapperConversation);
    }
    if (replyOpen.Bool && ClientselectedImages.length > 0) {
      setConversationStyle(styles.WrapperConversationReplyAndselectedImages);
    } else if (ClientselectedImages.length > 0) {
      setConversationStyle(styles.WrapperConversationselectedImages);
    }
  }, [replyOpen, ClientselectedImages]);

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  return (
    <>
      <div
        className={
          SelectedChannel.MobileBool && showSpace === "FileSpace"
            ? styles.ChatWrapperOnClick
            : styles.ChatWrapper
        }
      >
        <div className={styles.ChatHeader}>
          <div className={styles.ContentWrapper}>
            <BackArrow
              className={styles.BackArrow_svg}
              onClick={() =>
                setSelectedChannel((prev: any) => ({
                  ...prev,
                  MobileBool: false,
                }))
              }
            />
            <div className={styles.textWrapper}>
              <h1 className={fonts.blackBody15px}>Filespace</h1>
              {SelectedChannel.members !== 0 && (
                <p className={fonts.greyBody13px}># {SelectedChannel.Name}</p>
              )}
            </div>
          </div>
          <Progress
            className={styles.Progress_svg}
            onClick={() => {
              setShowSpace("Chat");
            }}
          />
        </div>
        {PdfPopupOpen.Bool && (
          <PdfPopup setOpen={setPdfPopup} Open={PdfPopupOpen} />
        )}
        <div className={styles.Chat}>
          {" "}
          <div className={styles.Conversation}>
            <div id="scrollableDivFileSpace" className={ConversationStyle}>
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
                scrollableTarget="scrollableDivFileSpace"
              >
                {ChatsState.filter((o: any) => {
                  return (
                    o.Channel.Name === SelectedChannel.Name &&
                    o.isClient === true
                  );
                }).map((Chat: any, index: any, { length }) => (
                  <div
                    className={styles.hoverMessage}
                    key={index}
                    style={
                      length === 1
                        ? {
                            margin: "10px 0px 10px 0px",
                          }
                        : {
                            margin: "0",
                          } && index === 0
                        ? {
                            margin: "0px 0px 10px 0px",
                          }
                        : {
                            margin: "0",
                          } && length - 1 === index
                        ? {
                            margin: "13px 0px 0px 0px",
                          }
                        : {
                            margin: "0",
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
                          attachment: Chat.attachment,
                        })
                      }
                    />
                    <div className={styles.Messagereply} key={index}>
                      <div className={styles.massage}>
                        <img
                          className={styles.ProfileImage}
                          src={
                            process.env.NEXT_PUBLIC_BACKEND_GRAPHQL +
                            Chat.Username.Image.url
                          }
                          alt=""
                        />
                        <div className={styles.messageText}>
                          <div className={fonts.blackBody15px}>
                            {Chat.Username.username}
                          </div>
                          <div className={styles.MessageWrapper}>
                            <div className={fonts.lightBlack16px}>
                              {Chat.Message}
                            </div>
                            <div
                              style={{
                                width: `${
                                  windowSize.innerWidth > 600
                                    ? 400
                                    : windowSize.innerWidth - 55
                                }px`,
                              }}
                            >
                              {Chat.attachment.Key !== null &&
                                CheckTypes(
                                  Chat.attachment.Key.split(".")[1],
                                  true,
                                  false,
                                  false
                                ) && (
                                  <img
                                    className={styles.attachImage}
                                    src={
                                      process.env.NEXT_PUBLIC_AWS +
                                      Chat.attachment.Key
                                    }
                                    alt=""
                                  />
                                )}
                              {Chat.attachment.Key !== null &&
                                CheckTypes(
                                  Chat.attachment.Key.split(".")[1],
                                  false,
                                  true,
                                  false
                                ) && (
                                  <div
                                    className={styles.videoPlayer}
                                    onContextMenu={(e) => e.preventDefault()}
                                  >
                                    <VideoPlayer
                                      src={
                                        process.env.NEXT_PUBLIC_AWS +
                                        Chat.attachment.Key
                                      }
                                      controls
                                      loop={false}
                                      volume={0.6}
                                      fluid={true}
                                    />
                                  </div>
                                )}
                              {Chat.attachment.Key !== null &&
                                CheckTypes(
                                  Chat.attachment.Key.split(".")[1],
                                  false,
                                  false,
                                  true
                                ) && (
                                  <div
                                    className={styles.DocAttaachment}
                                    onClick={() =>
                                      setPdfPopup({
                                        Bool: true,
                                        attachment: Chat.attachment,
                                      })
                                    }
                                  >
                                    <Pdf_SVG />
                                    <div
                                      style={{ display: "grid", gap: "6px" }}
                                    >
                                      <p className={styles.lightBlack15px}>
                                        {Chat.attachment.Name}
                                      </p>
                                      <p className={fonts.greyBody13px}>PDF</p>
                                    </div>
                                  </div>
                                )}
                            </div>
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
                            <div className={styles.ReplyAttachment}>
                              <div
                                style={{ gap: "0px" }}
                                className={styles.messageText}
                              >
                                <div className={fonts.blackBody12px}>
                                  {Chat.ReplyUsername.username}
                                </div>
                                <div className={fonts.lightBlack11px}>
                                  {Chat.ReplyAttachment.Key !== null &&
                                  Chat.Reply === "" ? (
                                    <div style={{ color: "#364590" }}>
                                      Attachment
                                    </div>
                                  ) : (
                                    Chat.Reply
                                  )}
                                </div>
                              </div>
                              {Chat.ReplyAttachment.Key !== null && (
                                <Attachment />
                              )}
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
                  "
                  {replyOpen.attachment !== null && replyOpen.message === ""
                    ? "Attachment"
                    : replyOpen.message}
                  "
                </p>
                <div className={styles.svg_CrossWrapper}>
                  <Plus
                    className={styles.svg_Cross}
                    onClick={() =>
                      setreplyOpen({
                        Bool: false,
                        username: null,
                        message: null,
                        attachment: null,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <AttachmentArea />
            <div className={styles.SendBar}>
              <InputFiles />
              <textarea
                id="review-text"
                onChange={handleChange}
                placeholder="Type a massage"
                ref={textAreaRef}
                rows={1}
                value={value}
              ></textarea>
              {sendLoading ? (
                <div
                  className={miniComponents.center}
                  style={{ margin: "auto" }}
                >
                  <div className={miniComponents.loader}></div>
                </div>
              ) : (
                <Send
                  onClick={() => {
                    if (
                      textAreaRef.current?.value === "" &&
                      ClientsselectedFilesArray.length <= 0
                    ) {
                      console.log("Message is empty");
                    } else {
                      sendHandler();
                    }
                  }}
                  className={styles.svg_Send}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
