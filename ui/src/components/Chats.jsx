/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../Context/Chatprovider";
import "./chart.css";
import AntdModal from "../assets/Misc/AntdModal";
import { Dropdown, Tooltip, Drawer } from "antd";
import { Link } from "react-router-dom";
import BellImage from "../assets/images/bell.png";
import http, { ENDPOINT } from "../http";
import Pill from "./Pill";
import GroupChatModal from "../assets/Misc/GroupChatModal";
import AvatarIcon from "../assets/images/Avatar.jpg";
import { io } from "socket.io-client";

const Chats = () => {
  // console.log("ChatState12345",ChatState())
  const {
    setModalOpen,
    navigate,
    profileData,
    setProfileData,
    options,
    allUserChats,
    setAllUserChats,
    // selectedChat,
    // setSelectedChats,
    activeUser,
    loading,
    setLoading,
    setGroupModalOpen,
    smallScreenChatBox,
    setSmallScreenChatBox,
    setMode,
    groupName,
    setGroupName,
    addedUsers,
    setAddedUsers,
    rawUniqueIds,
    setRawUniqueIds,
    uniqueIds,
    setUniqueIds,
    chatSelected,
    setChatSelected,
    isLastMessage,
    isSameSender,
    getChatName,
    isSameSenderMargin,
    isSameUser,
    selectedChatCompare,
    setSelectedChatCompare,
  } = ChatState();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [selectedChat, setSelectedChats] = useState([]);

  useEffect(() => {
    if (selectedChat.length > 0 && selectedChat[0].isGroupChat) {
      setGroupName(selectedChat[0].chatName);
      let uniqueId = [];
      let otherUsers = selectedChat[0].users.filter((each) => {
        if (!uniqueIds.includes(each._id)) {
          uniqueId.push(each._id);
          setUniqueIds((prev) => {
            return [...prev, each._id];
          });
        }
        return each._id !== selectedChat[0].groupAdmin._id;
      });
      console.log("otherUsers", otherUsers, uniqueId);
      //   setUniqueIds([...uniqueId]);
      setAddedUsers([...otherUsers]);
      setRawUniqueIds([...uniqueId]);
    }
  }, [selectedChat, uniqueIds]);

  // const [selectedChatCompare, setSelectedChatCompare] = useState([]);

  const text = <span>Click to Search User</span>;

  const [notificationCount, setNotificationCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (searchInput.length === 0) {
      setUsers([]);
    }
  }, [searchInput]);

  const searchUsers = () => {
    setLoading(true);
    http
      .get(`/users/allusers?search=${searchInput}`, options)
      .then((resp) => {
        setUsers(resp.data.users);
        setLoading(false);
        console.log("All Users", resp.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log("All Users", err);
      });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  var socket;

  socket = io(ENDPOINT);

  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket.emit("setup", JSON.parse(localStorage.getItem("data")));
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", (room) => setIsTyping(false));
  });

  const items = [
    {
      key: "1",
      label: (
        <span onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-user-tie"></i>
          <span style={{ marginLeft: "5px" }}>Profile</span>
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={logout}>
          <i className="fa-solid fa-power-off"></i>
          <span style={{ marginLeft: "5px" }}>Logout</span>
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Assuming messages is the state containing all messages

  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    if (
      selectedChat.length > 0 &&
      selectedChat[0].isGroupChat &&
      activeUser._id === selectedChat[0].groupAdmin._id
    ) {
      setIsReadOnly(null);
    } else if (
      selectedChat.length > 0 &&
      selectedChat[0].isGroupChat &&
      activeUser._id !== selectedChat[0].groupAdmin._id
    ) {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(null);
    }
  }, [activeUser._id, selectedChat]);

  const renderProfileDetails = (pic, name, email) => {
    setProfileData((prev) => {
      return {
        ...prev,
        username: name,
        pic: pic,
        email: email,
      };
    });
    setModalOpen(true);
    setOpen(false);
  };

  const openGroupChatModal = () => {
    setGroupModalOpen(true);
  };

  const accessChat = (userId) => {
    console.log(options, userId);
    let payload = {
      userId,
    };
    setLoading(true);
    http
      .post("/chats/accessChat", payload, options)
      .then((resp) => {
        console.log("accessChat", resp.data.fullChat);
        setLoading(false);
        if (!allUserChats.find((each) => each._id === resp.data.fullChat._id)) {
          setAllUserChats((prev) => {
            return [resp.data.fullChat, ...prev];
          });
        }
        onClose();
        setSearchInput("");
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  const viewOrUpdateGroupDetails = (groupDetails) => {
    setSelectedChats([groupDetails]);
    setSelectedChatCompare([groupDetails]);
    setMode("Update");
    // console.log("viewOrUpdateGroupDetails", groupDetails);
    // setGroupModalOpen(true);
    setGroupModelOpenedBy("");

    openGroupChatModal();
  };

  const [messageTyped, setMessageTyped] = useState("");

  // useEffect(() => {
  //   if (selectedChat) {
  //     setSelectedChatCompare(selectedChat);
  //   }
  // }, [selectedChat]);

  // console.log("selectedChatCompare", selectedChatCompare)

  useEffect(() => {
    if (!socketConnected) return;
    if (messageTyped.length > 0) {
      setTyping(true);
      setIsTyping(true);
      socket.emit("typing", selectedChat[0]._id);
    } else {
      setTyping(false);
      setIsTyping(false);
      socket.emit("stop typing", selectedChat[0]._id);
    }
  }, [messageTyped]);

  const handleChange = (e) => {
    setMessageTyped(e.target.value);
  };

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log(
        "selectedChat[0]._id",
        selectedChat,
        newMessageReceived.chat._id,
        selectedChatCompare
      );
      // setMessages((prev) => {
      //   return [...prev, newMessageReceived];
      // });
      // console.log("selectedChatCompare", selectedChatCompare);
      if (
        selectedChat.length > 0 &&
        selectedChat[0]._id !== newMessageReceived.chat._id
      ) {
        //give notification
      } else {
        console.log("eneterd");
        setMessages((prev) => {
          return [...prev, newMessageReceived];
        });
      }
    });
  });

  const [selectedUserDetails, setSelectedUserDetails] = useState({
    name: "",
    pic: "",
    email: "",
  });

  useEffect(() => {
    if (selectedChat.length > 0) {
      let filteredUser = selectedChat[0].users.filter(
        (e) => e._id != activeUser._id
      );
      console.log("filteredUser", filteredUser);
      let { name, pic, email } = filteredUser[0];
      setSelectedUserDetails({
        name,
        pic,
        email,
      });
    }
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (messageTyped && e.key === "Enter" && selectedChat.length > 0) {
      let payload = {
        chat_id: selectedChat[0]._id,
        content: messageTyped,
      };
      setMessageTyped("");

      let data = [];

      await http
        .post("/messages/sendMessage", payload, options)
        .then((resp) => {
          data = resp.data;
          setMessages((prev) => {
            return [...prev, resp.data];
          });
          console.log("sendMessage data", selectedChat);
        })
        .catch((err) => {
          console.log("sendMessage err", err);
        });

      await socket.emit("new message", data);
      await socket.emit("stop typing", selectedChat[0]._id);
    }
  };

  useEffect(() => {
    if (selectedChat.length > 0) {
      setMessages([]);
      http
        .get(`/messages/${selectedChat[0]._id}`, options)
        .then((resp) => {
          setMessages((prev) => {
            return [...prev, ...resp.data];
          });
          console.log("messages data", resp.data);
        })
        .catch((err) => {
          console.log("messages err", err);
        });
      socket.emit("join chat", selectedChat[0]._id);
    }
  }, [options, selectedChat]);

  const [groupModelOpenedBy, setGroupModelOpenedBy] = useState("");

  return (
    <div className={loading ? "auth_card loading__class" : "auth_card"}>
      <GroupChatModal
        renderProfileDetails={renderProfileDetails}
        selectedChat={selectedChat}
        setGroupModelOpenedBy={setGroupModelOpenedBy}
        groupName={groupName}
        setGroupName={setGroupName}
        addedUsers={addedUsers}
        setAddedUsers={setAddedUsers}
        setSelectedChats={setSelectedChats}
        isReadOnly={isReadOnly}
        rawUniqueIds={rawUniqueIds}
      />
      <Drawer
        title="Search User"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <span className="d-flex">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button
            className="btn btn-primary"
            onClick={searchUsers}
            disabled={searchInput.length > 0 ? null : "disabled"}
          >
            Go
          </button>
        </span>
        <div className="mt-2">
          {users.map((each) => {
            let { _id, pic, name, email } = each;
            return (
              <div
                key={_id}
                className="align-items-center d-flex my-2 px-1 user__class"
                style={{ border: "1px solid", borderRadius: "5px" }}
              >
                <Tooltip placement="bottom" title={`View Profile of ${name}`}>
                  <div
                    className="col-2 cursor__class"
                    style={{ borderRight: "1px solid" }}
                    onClick={() => renderProfileDetails(pic, name, email)}
                  >
                    <img
                      className="user_img"
                      src={pic}
                      alt={name}
                      onError={(e) => {
                        e.target.src = AvatarIcon;
                      }}
                    />
                  </div>
                </Tooltip>
                <Tooltip
                  placement="bottom"
                  title={`Click to chat with ${name}`}
                >
                  <div
                    className="col-10 px-1 cursor__class"
                    onClick={() => accessChat(_id)}
                  >
                    <h6 style={{ position: "relative", top: "8px" }}>{name}</h6>
                    <p>
                      <b>Email: </b> {email}
                    </p>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </Drawer>

      <div className="pt-3 mx-2 row" style={{ height: "98vh" }}>
        {/* Chat List */}
        <div
          className={
            "chat__card chats__card p-3 col-12 col-md-4"
            // : "d-none"
          }
        >
          <div className="align-items-center d-flex justify-content-between">
            <Tooltip placement="bottom" title={text}>
              <div className="col-8 search__card" onClick={showDrawer}>
                <button className="btn btn-close-white w-100">
                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={{ marginRight: "5px" }}
                  ></i>
                  Search
                </button>
              </div>
            </Tooltip>

            <div className="col-4 profile__card d-flex">
              <Tooltip placement="bottom" title="Create Group Chat">
                <i
                  className="fa-brands fa-rocketchat mt-3 px-3 fa-2x"
                  onClick={() => {
                    openGroupChatModal();
                    setGroupModelOpenedBy("Create");
                    setGroupName("");
                    setAddedUsers([]);
                    setUniqueIds([]);
                    setSelectedChats([]);
                    setSelectedChatCompare([]);
                    setMode("Create");
                  }}
                ></i>
              </Tooltip>

              <span style={{ position: "relative", marginRight: "8px" }}>
                <img
                  src={BellImage}
                  alt=""
                  style={{ width: "29px" }}
                  className="mt-3"
                />
                <span className="notification__count">{notificationCount}</span>
              </span>

              <div>
                <Dropdown
                  menu={{
                    items,
                  }}
                  className=""
                  placement="bottomRight"
                  arrow
                >
                  <img
                    className="profile_img"
                    src={activeUser.pic}
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = AvatarIcon;
                    }}
                  />
                </Dropdown>
              </div>
            </div>
          </div>
          <AntdModal user={profileData} setProfileData={setProfileData} />

          <hr />
          <div style={{ height: "91%", overflowY: "auto" }}>
            {allUserChats.map((each) => {
              let { _id, users, isGroupChat } = each;

              if (isGroupChat) {
                return (
                  <div
                    key={_id}
                    className="align-items-center d-flex my-2 px-1 user__class"
                    style={{
                      border: "1px solid",
                      borderRadius: "5px",
                      background: selectedChat[0] === each ? "#3593c3" : "",
                      color: selectedChat[0] === each ? "white" : "black",
                    }}
                  >
                    <div
                      className="col-2 cursor__class"
                      style={{ borderRight: "1px solid" }}
                    >
                      <img
                        className="user_img"
                        src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                        alt=""
                        onError={(e) => {
                          e.target.src = AvatarIcon;
                        }}
                      />
                    </div>
                    {/* </Tooltip> */}

                    <div
                      className="col-10 px-1 cursor__class"
                      // onClick={() => accessChat(_id)}
                      onClick={() => {
                        setSelectedChats([each]);
                        setSelectedChatCompare([each]);
                        setSmallScreenChatBox(true);
                      }}
                    >
                      <h6 style={{ position: "relative", top: "8px" }}>
                        {each.chatName}
                      </h6>
                      <p>{/* <b>Email: </b> {email} */}</p>
                    </div>
                  </div>
                );
              }

              let filteredUser = users.filter((e) => e._id != activeUser._id);
              // console.log("filteredUser", filteredUser);
              let { name, pic, email } = filteredUser[0];
              return (
                <div
                  key={_id}
                  className="align-items-center d-flex my-2 px-1 user__class"
                  style={{
                    border: "1px solid",
                    borderRadius: "5px",
                    background: selectedChat[0] === each ? "#3593c3" : "",
                    color: selectedChat[0] === each ? "white" : "black",
                  }}
                >
                  <Tooltip placement="bottom" title={`View Profile of ${name}`}>
                    <div
                      className="col-2 cursor__class"
                      style={{ borderRight: "1px solid" }}
                      onClick={() => renderProfileDetails(pic, name, email)}
                    >
                      <img
                        className="user_img"
                        src={pic}
                        alt={name}
                        onError={(e) => {
                          e.target.src = AvatarIcon;
                        }}
                      />
                    </div>
                  </Tooltip>

                  <div
                    className="col-10 px-1 cursor__class"
                    // onClick={() => accessChat(_id)}
                    onClick={() => {
                      setSelectedChats([each]);
                      setSelectedChatCompare([each]);
                      setSmallScreenChatBox(true);
                    }}
                  >
                    <h6 style={{ position: "relative", top: "8px" }}>{name}</h6>
                    <p>
                      <b>Email: </b> {email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Chat List */}

        {/* Chat Details */}

        <div
          className={
            // selectedChat.length > 0 ?
            "chat__card chats__detail__card col-md-8 d-none d-md-block"
            // : "chat__card chats__detail__card col-md-8 "
          }
          style={{ position: "relative", left: "5px" }}
        >
          {selectedChat.length > 0 ? (
            <>
              <div className="row p-3">
                <div className="col-6">
                  <i
                    className="fa-solid fa-arrow-left cursor__class fa-2x"
                    onClick={() => {
                      setSelectedChats([]);
                      setSelectedChatCompare([]);
                    }}
                  ></i>
                  <span
                    className="mx-3"
                    style={{ fontSize: "larger", position: "absolute" }}
                  >
                    {selectedChat[0].isGroupChat ? (
                      <b>{selectedChat[0].chatName}</b>
                    ) : (
                      <b>{getChatName(selectedChat, activeUser)}</b>
                    )}
                  </span>
                </div>

                <div className="col-6 text-end">
                  {selectedChat[0].isGroupChat ? (
                    <>
                      <Tooltip placement="bottom" title="View Profile">
                        <img
                          className="user_img cursor__class"
                          src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          alt=""
                          onClick={() =>
                            viewOrUpdateGroupDetails(selectedChat[0])
                          }
                          onError={(e) => {
                            e.target.src = AvatarIcon;
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip placement="bottom" title="View Profile">
                        <img
                          className="user_img cursor__class"
                          onClick={() => {
                            let { pic, name, email } = selectedUserDetails;
                            renderProfileDetails(pic, name, email);
                          }}
                          src={selectedUserDetails.pic}
                          alt=""
                          onError={(e) => {
                            e.target.src = AvatarIcon;
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
              <div
                className="align-content-end chatter__box p-3 row"
                style={{ maxHeight: "87vh" }}
              >
                <div
                  className="messages__box"
                  style={{ maxHeight: "78vh", overflowY: "scroll" }}
                >
                  {messages.map((each, i) => {
                    // console.log(
                    //   `clg Same ${i}`,
                    //   isSameSender(messages, each, i, activeUser._id),
                    //   each.content
                    // );
                    // console.log(
                    //   `clg Last ${i}`,
                    //   isLastMessage(messages, i, activeUser._id),
                    //   each.content
                    // );
                    // console.log(
                    //   `clg margin ${i}`,
                    //   isSameSenderMargin(messages, each, i, activeUser._id),
                    //   each.content
                    // );
                    return (
                      <div key={each._id} className="row">
                        <div className="col-6 mb-3 w-100">
                          {(isSameSender(messages, each, i, activeUser._id) ||
                            isLastMessage(messages, i, activeUser._id)) && (
                            <Tooltip placement="bottom" title="View Profile">
                              <img
                                className="user_img cursor__class"
                                onClick={() =>
                                  renderProfileDetails(
                                    each.sender.pic,
                                    each.sender.name,
                                    each.sender.email
                                  )
                                }
                                src={each.sender.pic}
                                alt=""
                                onError={(e) => {
                                  e.target.src = AvatarIcon;
                                }}
                              />
                            </Tooltip>
                          )}

                          {each.sender._id !== activeUser._id && (
                            <>
                              <span
                                style={{
                                  backgroundColor: `${
                                    each.sender._id === activeUser._id
                                      ? "#BEE3F8"
                                      : "#B9F5D0"
                                  }`,
                                  borderRadius: "20px",
                                  padding: "5px 15px",
                                  // maxWidth: "75%",
                                  position: "relative",
                                  left: `${
                                    !(
                                      isSameSender(
                                        messages,
                                        each,
                                        i,
                                        activeUser._id
                                      ) ||
                                      isLastMessage(messages, i, activeUser._id)
                                    )
                                      ? "40px"
                                      : ""
                                  }`,
                                  // right: `${
                                  //   each.sender._id === activeUser._id
                                  //     ? "-76%"
                                  //     : ""
                                  // }`
                                  // marginLeft: isSameSenderMargin(
                                  //   messages,
                                  //   each,
                                  //   i,
                                  //   activeUser._id
                                  // ),
                                }}
                              >
                                {each.content}
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          ref={lastMessageRef}
                          className="col-6 text-end mb-3 w-100"
                        >
                          {each.sender._id === activeUser._id && (
                            <span
                              style={{
                                backgroundColor: `${
                                  each.sender._id === activeUser._id
                                    ? "#BEE3F8"
                                    : "#B9F5D0"
                                }`,
                                borderRadius: "20px",
                                padding: "5px 15px",
                              }}
                            >
                              {each.content}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="input__box">
                  {!messageTyped && isTyping && (
                    <div className="loader__class">
                      <div
                        className="spinner-grow spinner-grow-sm"
                        role="status"
                      />
                      <div
                        className="spinner-grow spinner-grow-sm"
                        role="status"
                      />
                      <div
                        className="spinner-grow spinner-grow-sm"
                        role="status"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Send Message"
                    name="messageTyped"
                    value={messageTyped}
                    onChange={handleChange}
                    onKeyDown={sendMessage}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="align-items-center d-flex h-100 justify-content-center">
                <h4>Click on a user to start chatting</h4>
              </div>
            </>
          )}
        </div>

        {/* Chat Details */}
      </div>
    </div>
  );
};

export default Chats;
