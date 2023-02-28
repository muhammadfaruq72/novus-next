import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import styles from "@/styles/components/Team/Chat/Chat.module.css";
import Plus from "@/public/Plus.svg";
import Send from "@/public/Send.svg";
import imgTemp from "@/public/favicon.png";
import Attachment from "@/public/attachment.svg";
import NextArrow from "@/public/NextArrow.svg";
import Reply from "@/public/Reply.svg";
import useAutosizeTextArea from "./useAutosizeTextArea";
import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
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
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

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

export default function Chat() {
  const {
    userExistsInSpace,
    SelectedChannel,
    setSelectedChannel,
    selectedFilesArray,
    setSelectedFilesArray,
    setSelectedImages,
    selectedImages,
  } = useContext(AuthContext);

  const [ChatsState, setChatsState] = useState([]);
  const [hasNextPageChat, setNextPageChat] = useState(false);
  const [sendLoading, setsendLoading] = useState(false);

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

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
          attachment
          ReplyAttachment
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
    if (selectedFilesArray.length <= 0) {
      console.log(textAreaRef.current?.value);
      sendJsonMessage({
        Channel: SelectedChannel.Name,
        username: localStorage.getItem("username"),
        Message: textAreaRef.current?.value,
        ReplyUsername: replyOpen.username,
        Reply: replyOpen.message,
        attachment: { Key: null, No_Of_Files: null },
        ReplyAttachment: replyOpen.attachment,
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
        let [left, right] = splitLast(selectedFilesArray[0].name, ".");
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
              Body: selectedFilesArray[0],
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
          username: localStorage.getItem("username"),
          Message: textAreaRef.current?.value,
          ReplyUsername: replyOpen.username,
          Reply: replyOpen.message,
          attachment: {
            Key: `${value}`,
            No_Of_Files: selectedFilesArray.length,
          },
          ReplyAttachment: replyOpen.attachment,
        });
        setValue("");
        setreplyOpen({
          Bool: false,
          username: null,
          message: null,
          attachment: null,
        });
        setSelectedImages([]);
        setSelectedFilesArray([]);
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
    if (localStorage.getItem("username") !== notification.Username.username) {
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
            <div
              id="scrollableDivChat"
              className={styles.WrapperConversation}
              style={
                replyOpen.Bool
                  ? { height: "calc(100vh - 113px - 34px)" }
                  : { height: "calc(100vh - 113px)" }
              }
            >
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
                          <div className={styles.MessageWrapper}>
                            <div className={fonts.lightBlack16px}>
                              {Chat.Message}
                            </div>
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
                                <div className={styles.ResumeContainer}>
                                  {
                                    <Document
                                      className={styles.PdfStyle}
                                      loading=""
                                      file={
                                        process.env.NEXT_PUBLIC_AWS +
                                        Chat.attachment.Key
                                      }
                                      onLoadSuccess={onDocumentLoadSuccess}
                                      // renderMode="canvas"
                                    >
                                      <Page
                                        pageNumber={pageNumber}
                                        width={300}
                                        loading=""
                                        // scale={2.5}
                                      />
                                    </Document>
                                  }
                                  <div className={styles.ArrowWrapper}>
                                    <NextArrow
                                      className={styles.PrevArrow}
                                      onClick={goToPrevPage}
                                      style={
                                        pageNumber <= 1
                                          ? {
                                              background: "rgba(0, 0, 0, 0.3)",
                                              pointerEvents: "none",
                                            }
                                          : {
                                              background: "#364590",
                                              pointerEvents: "auto",
                                            }
                                      }
                                    />
                                    <NextArrow
                                      className={styles.NextArrow}
                                      onClick={goToNextPage}
                                      style={
                                        pageNumber >= numPages
                                          ? {
                                              background: "rgba(0, 0, 0, 0.3)",
                                              pointerEvents: "none",
                                            }
                                          : {
                                              background: "#364590",
                                              pointerEvents: "auto",
                                            }
                                      }
                                    />
                                  </div>
                                </div>
                              )}
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
                      selectedFilesArray.length <= 0
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
