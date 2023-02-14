import fonts from "@/styles/fonts.module.css";
import buttons from "@/styles/buttons.module.css";
import styles from "@/styles/components/Team/Chat/Chat.module.css";
import Plus from "@/public/Plus.svg";
import Send from "@/public/Send.svg";
import Reply from "@/public/Reply.svg";
import useAutosizeTextArea from "./useAutosizeTextArea";
import React, { useState, useEffect, useRef } from "react";
import User1 from "@/public/Temporary/image1.png";
import User2 from "@/public/Temporary/image2.png";
import User3 from "@/public/Temporary/image3.png";
import User4 from "@/public/Temporary/image4.png";
import User5 from "@/public/Temporary/image5.png";
import Image from "next/image";

export default function Chat() {
  const Conversation: any = [
    {
      username: "Justin_Willson",
      profilePic: User1,
      message:
        "ohhh maybe this makes a difference ??? I don't use SSD ... I have NVME right in the pcie slot 🙂",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "David_Espinosa",
      profilePic: User2,
      message:
        "so I got a macpro5,1 with the upgrade wifi/BT thing ... and no SSD ... I got the NVIDA GeForce GT 640 card which worked running 2 display for Monterey 12.0.1 ... and then a samsung nvme 1tb stick that's connected into a pcie slot",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "Justin_Willson",
      profilePic: User1,
      message: "Let me figure out whats going on, and I'll get back to you",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "David_Espinosa",
      profilePic: User2,
      message: "thank you ... thank you",
      reply: "Let me figure out whats going on, and I'll get back to you",
      replyUsername: "Justin_Willson",
      replyProfilePic: User1,
    },
    {
      username: "Justin_Willson",
      profilePic: User1,
      message: "Thanks. I’ll give it a try tomorrow",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "David_Espinosa",
      profilePic: User2,
      message: "time to buy a different gpu",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "Justin_Willson",
      profilePic: User1,
      message:
        "Theres a good chance that you'll at least have one card that works correctly with macOS",
      reply: "time to buy a different gpu",
      replyUsername: "David_Espinosa",
      replyProfilePic: User2,
    },
    {
      username: "David_Espinosa",
      profilePic: User2,
      message:
        "I know I need a car that supports metal ... cause I use logic pro and it writes what's called the playhead using metal (hopefully that made sense ) ...",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "Justin_Willson",
      profilePic: User1,
      message: "The GT720 should be fully supported in macOS",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "David_Espinosa",
      profilePic: User2,
      message: "and the Post Install Root Patch",
      reply: "The GT720 should be fully supported in macOS",
      replyUsername: "Justin_Willson",
      replyProfilePic: User1,
    },
    {
      username: "Justin_Willson",
      profilePic: User1,
      message:
        "ohhh maybe this makes a difference ??? I don't use SSD ... I have NVME right in the pcie slot 🙂",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
    {
      username: "David_Espinosa",
      profilePic: User2,
      message:
        "so I got a macpro5,1 with the upgrade wifi/BT thing ... and no SSD ... I got the NVIDA GeForce GT 640 card which worked running 2 display for Monterey 12.0.1 ... and then a samsung nvme 1tb stick that's connected into a pcie slot",
      reply: "time to buy a different gpu",
      replyUsername: "David_Espinosa",
      replyProfilePic: User2,
    },
    {
      username: "Justin_Willson",
      profilePic: User1,
      message: "Let me figure out whats going on, and I'll get back to you",
      reply: "none",
      replyUsername: "none",
      replyProfilePic: "none",
    },
  ];

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
    username: "none",
    message: "none",
  });
  // const [styleSpace, setStyleSpace] = useState({ height: "0px" });

  const WrapperConversation = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className={styles.ChatWrapper}>
        <div className={styles.Chat}>
          {" "}
          <div className={styles.Conversation}>
            <div className={styles.WrapperConversation}>
              {Conversation.map((Chat: any, index: any) => (
                <div className={styles.hoverMessage} key={index}>
                  <Reply
                    className={styles.svg_Reply}
                    onClick={() =>
                      setreplyOpen({
                        Bool: true,
                        username: Chat.username,
                        message: Chat.message,
                      })
                    }
                  />
                  <div className={styles.Messagereply} key={index}>
                    <div className={styles.massage}>
                      <Image
                        src={Chat.profilePic}
                        alt=""
                        height={35}
                        width={35}
                      />
                      <div className={styles.messageText}>
                        <div className={fonts.blackBody15px}>
                          {Chat.username}
                        </div>
                        <div className={fonts.lightBlack16px}>
                          {Chat.message}
                        </div>
                      </div>
                    </div>
                    {Chat.reply !== "none" ? (
                      <div className={styles.reply}>
                        <div className={styles.Reply_css}></div>
                        <div className={styles.massage} style={{ gap: "10px" }}>
                          <Image
                            src={Chat.replyProfilePic}
                            alt=""
                            height={25}
                            width={25}
                          />
                          <div
                            style={{ gap: "0px" }}
                            className={styles.messageText}
                          >
                            <div className={fonts.blackBody12px}>
                              {Chat.replyUsername}
                            </div>
                            <div className={fonts.lightBlack11px}>
                              {Chat.reply}
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
                        username: "none",
                        message: "none",
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
              <Send className={styles.svg_Send} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
