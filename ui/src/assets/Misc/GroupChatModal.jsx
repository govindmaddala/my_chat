/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal, Tooltip } from "antd";
import { ChatState } from "../../Context/Chatprovider";
import AvatarIcon from "../images/Avatar.jpg";
import http from "../../http";

const GroupChatModal = (props) => {
  const {
    options,
    setLoading,
    groupModalOpen,
    setGroupModalOpen,
    allUserChats,
    setAllUserChats,
    mode,
    setMode,
    activeUser,
    setFetchAgain,
    rawUniqueIds,
    setRawUniqueIds,
    uniqueIds,
    setUniqueIds,
  } = ChatState();
  console.log("activeUser", activeUser);

  //   useEffect(() => {
  //     if (props.groupModelOpenedBy === "Create") {
  //       setSearchInput("");
  //       setGroupName("");
  //       props.setAddedUsers([]);
  //       props.setSelectedChats([]);
  //     }
  //   }, [props.groupModelOpenedBy]);

  const [isChanged, setIsChanged] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);

  //   const [uniqueIds, setUniqueIds] = useState([]);

  const [userApiLoading, setUserApiLoading] = useState(false);
  const searchUsers = () => {
    setLoading(true);
    setUserApiLoading(true);
    http
      .get(`/users/allusers?search=${searchInput}`, options)
      .then((resp) => {
        setUsers(resp.data.users);
        setLoading(false);
        setUserApiLoading(false);
        console.log("All Users", resp.data);
      })
      .catch((err) => {
        setLoading(false);
        setUserApiLoading(false);
        console.log("All Users", err);
      });
  };


  const addUserIntoGroup = (userToAdd) => {
    setIsChanged(true);
    console.log("uniqueIds", uniqueIds, userToAdd._id);
    if (uniqueIds.includes(userToAdd._id)) {
      return;
    }
    setUniqueIds([...uniqueIds, userToAdd._id]);
    props.setAddedUsers([...props.addedUsers, userToAdd]);

    // if (
    //   props.selectedChat.length > 0 &&
    //   props.selectedChat.isGroupChat &&
    //   !props.addedIds.includes(userToAdd._id)
    // ) {
    //   props.setAddedIds([...props.addedIds, userToAdd._id]);
    // }
  };

  const deleteUserFromGroup = (id) => {
    setIsChanged(true);
    let index = uniqueIds.findIndex((e) => e === id);
    let restIds = [...uniqueIds];
    restIds.splice(index, 1);
    setUniqueIds([...restIds]);

    props.setAddedUsers((prev) => {
      return prev.filter((e) => e._id !== id);
    });

    // if (
    //   props.selectedChat.length > 0 &&
    //   props.selectedChat.isGroupChat &&
    //   !props.deletedIds.includes(id)
    // ) {
    //   props.setDeletedIds([...props.deletedIds, id]);
    // }
  };

  const createOrUpdateGroup = (e) => {
    e.preventDefault();
    console.log("mode", mode, props.groupName, props.addedUsers);

    if (mode === "Create" && props.groupName && props.addedUsers.length > 0) {
      let payload = {
        group_name: props.groupName,
        users: JSON.stringify(props.addedUsers.map((u) => u._id)),
      };
      http
        .post("/chats/createGroupChat", payload, options)
        .then((resp) => {
          setUsers(resp.data.users);
          setLoading(false);
          setUserApiLoading(false);
          setAllUserChats((prev) => {
            return [resp.data, ...prev];
          });
          setSearchInput("");
          setGroupModalOpen(false);
          // closeModal()
          props.setAddedUsers([]);
          setUniqueIds([]);
          console.log("All Users", resp.data);
        })
        .catch((err) => {
          setLoading(false);
          setUserApiLoading(false);
          console.log("All Users", err);
        });
      return;
    }

    if (props.addedUsers.length === 0) {
      alert("Atleast 1 user is need");
      return;
    }

    let payload = {
      group_name: props.groupName,
      chat_id: props.selectedChat[0]._id,
      user_ids: JSON.stringify([
        ...props.addedUsers.map((u) => u._id),
        activeUser._id,
      ]),
    };

    http
      .put("/chats/updateGroupDetails", payload, options)
      .then((resp) => {
        closeModal();
        setFetchAgain(true);
        // setUsers(resp.data.users);
        // setLoading(false);
        // setUserApiLoading(false);
        // setAllUserChats((prev) => {
        //   return [resp.data, ...prev];
        // });
        // setSearchInput("");
        // setGroupModalOpen(false);
        props.setSelectedChats([])
        console.log("updateGroupDetails", resp.data);
      })
      .catch((err) => {
        setLoading(false);
        setUserApiLoading(false);
        console.log("All Users", err);
      });

    // console.log(props.addedUsers)
  };

  const leaveGroup = () => {
    //readOnly true means normal user
    if (props.isReadOnly) {
      let payload = {
        user_ids: JSON.stringify([activeUser._id]),
        chat_id: props.selectedChat[0]._id,
      };
      http
        .put("/chats/removeFromGroup", payload, options)
        .then((resp) => {
          closeModal();
          setFetchAgain(true);
          props.setSelectedChats([]);
        })
        .catch((err) => {
          console.log("removeFromGroup err", err);
        });
    } else {
      //Here we have to delete by Group
      let payload = {
        chat_id: props.selectedChat[0]._id,
      };

      http
        .put("/chats/deleteGroup", payload, options)
        .then((resp) => {
          closeModal();
          setFetchAgain(true);
          props.setSelectedChats([]);
          console.log("removeFromGroup data", resp.data);
        })
        .catch((err) => {
          console.log("removeFromGroup err", err);
        });
    }
    // const isAdmin
  };

  useEffect(() => {
    if (groupModalOpen) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [groupModalOpen]);

  useEffect(() => {
    if (searchInput) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchInput]);

  console.log("props.isReadOnly", props.isReadOnly);

  const closeModal = () => {
    setGroupModalOpen(false);
    props.setGroupModelOpenedBy("");
    setSearchInput("");
    setGroupName("");
    props.setAddedUsers([]);
  };

  return (
    <>
      <Modal
        title={
          props.selectedChat.length === 0
            ? "Create Group Chat"
            : props.selectedChat[0].chatName
        }
        centered
        open={groupModalOpen}
        onCancel={closeModal}
      >
        <div>
          <form onSubmit={createOrUpdateGroup}>
            <input
              type="text"
              placeholder="Group Name"
              name="groupName"
              value={props.groupName}
              onChange={(e) => {
                setIsChanged(true);
                props.setGroupName(e.target.value);
              }}
              required
              readOnly={props.isReadOnly}
            />
            <br />
            <br />
            {props.selectedChat.length > 0 &&
            props.selectedChat[0].isGroupChat &&
            props.isReadOnly ? (
              <>
                <div className="mt-3">
                  {props.addedUsers.map((each) => {
                    let { _id, name, pic, email } = each;
                    return (
                      <span key={_id}>
                        <Tooltip
                          placement="bottom"
                          title={`View profile of ${name}`}
                        >
                          <span
                            className="pill"
                            onClick={() =>
                              props.renderProfileDetails(pic, name, email)
                            }
                            // onClick={() => deleteUserFromGroup(_id)}
                          >
                            <span className="first-name">{name}</span>
                            &nbsp;
                            {/* <span className="pill-cross">&times;</span> */}
                          </span>
                        </Tooltip>
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Add Users eg: John, Govi"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  readOnly={props.isReadOnly}
                />
                <div className="mt-3">
                  {props.addedUsers.map((each) => {
                    let { _id, name } = each;
                    return (
                      <span key={_id}>
                        <Tooltip placement="bottom" title={`Delete ${name}`}>
                          <span
                            className="pill"
                            onClick={() => deleteUserFromGroup(_id)}
                          >
                            <span className="first-name">{name}</span>
                            &nbsp;
                            <span className="pill-cross">&times;</span>
                          </span>
                        </Tooltip>
                      </span>
                    );
                  })}
                </div>
              </>
            )}

            <div>
              {userApiLoading ? (
                <p>Loading</p>
              ) : (
                users.slice(0, 4).map((each) => {
                  let { _id, pic, name, email } = each;
                  return (
                    <div
                      key={_id}
                      className="align-items-center d-flex my-2 px-1 user__class"
                      style={{ border: "1px solid", borderRadius: "5px" }}
                    >
                      <Tooltip
                        placement="bottom"
                        title={`View Profile of ${name}`}
                      >
                        <div
                          className="col-2 cursor__class"
                          style={{ borderRight: "1px solid" }}
                          onClick={() =>
                            props.renderProfileDetails(pic, name, email)
                          }
                        >
                          <img
                            className="user_img"
                            src={pic}
                            alt={name}
                            onError={(e) => {
                              e.target.src = AvatarIcon;
                            }}
                          />
                          {name}
                        </div>
                      </Tooltip>
                      <Tooltip
                        placement="bottom"
                        title={`Click to Add ${name}`}
                      >
                        <div
                          className="col-10 px-1 cursor__class"
                          onClick={() => addUserIntoGroup(each)}
                        >
                          <h6 style={{ position: "relative", top: "8px" }}>
                            {name}
                          </h6>
                          <p>
                            <b>Email: </b> {email}
                          </p>
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              )}
            </div>
            <br />
            {props.selectedChat.length > 0 ? (
              <>
                {props.selectedChat.length > 0 &&
                props.selectedChat[0].isGroupChat &&
                props.isReadOnly ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      //   disabled={isChanged ? null : "disabled"}
                      onClick={leaveGroup}
                    >
                      Leave Group
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="btn btn-danger"
                      //   disabled={isChanged ? null : "disabled"}
                      onClick={leaveGroup}
                    >
                      Leave Group
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isChanged ? null : "disabled"}
                    >
                      Update Group
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={props.addedUsers.length > 0 ? null : "disabled"}
                >
                  Create Group
                </button>
              </>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
};

export default GroupChatModal;
