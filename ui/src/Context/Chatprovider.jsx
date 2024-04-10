/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import http, { ENDPOINT } from "../http";
// import io from "socket.io-client";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [allUserChats, setAllUserChats] = useState([]);
  // const [selectedChat, setSelectedChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [smallScreenChatBox, setSmallScreenChatBox] = useState(false);

  const [sockedConnected, setSockedConnected] = useState(false);

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   console.log("activeUser", activeUser);
  //   socket.emit("setup", JSON.parse(localStorage.getItem("data")));
  //   socket.on("connected", () => setSockedConnected(true));
  // }, []);

  useEffect(() => {
    if (!modalOpen) {
      setProfileData((prev) => {
        return {
          ...prev,
          username: "",
          pic: "",
          email: "",
        };
      });
    }
  }, [modalOpen]);

  const [activeUser, setActiveUser] = useState({
    username: "",
    pic: "",
    email: "",
    _id: "",
  });

  const getChatName = (selectedChat, activeUser) => {
    if (selectedChat.length > 0) {
      let filteredUser = selectedChat[0].users.filter(
        (each) => each._id !== activeUser._id
      );
      return filteredUser[0].name;
    }
  };

  const isSameSender = (messages, msg, indx, activeId) => {
    return (
      //in the index limits
      indx < messages.length - 1 &&
      //check next message is not from other user
      (messages[indx + 1].sender._id !== msg.sender._id ||
        messages[indx + 1].sender._id === undefined) &&
      //check current message is not current user
      messages[indx].sender._id !== activeId
    );
  };

  const isLastMessage = (messages, indx, activeId) => {
    return (
      //check if it is in index limits
      indx === messages.length - 1 &&
      //check if it is last message of user
      messages[messages.length - 1].sender._id !== activeId &&
      //check if it is not undefined
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSenderMargin = (messages, msg, indx, activeId) => {
    if (
      indx < messages.length - 1 &&
      //check next message is not from other user
      messages[indx + 1].sender._id === msg.sender._id &&
      //check current message is not current user
      messages[indx].sender._id !== activeId
    ) {
      return 33;
    } else if (
      (indx < messages.length - 1 &&
        //check next message is not from other user
        messages[indx + 1].sender._id !== msg.sender._id &&
        //check current message is not current user
        messages[indx].sender._id !== activeId) ||
      (indx === messages.length - 1 && messages[indx].sender._id !== activeId)
    ) {
      return 0;
    } else return "auto";
  };

  const isSameUser = (messages, msg, indx) => {
    return indx > 0 && messages[indx - 1].sender._id === msg.sender._id;
  };

  const [profileData, setProfileData] = useState({
    username: "",
    pic: "",
    email: "",
    _id: "",
  });

  const [options, setOptions] = useState({
    headers: {
      authorization: "",
    },
  });

  const fetchUserData = () => {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (!userData) {
      localStorage.clear();
      navigate("/login");
    } else {
      setLoading(true);
      let options = {
        headers: {
          authorization: `Bearer ${userData.message}`,
        },
      };

      http
        .get("/chats/fetchChats", options)
        .then((resp) => {
            console.log("fetchChats data", resp.data);
          setAllUserChats(resp.data);
          setLoading(false);
          setFetchAgain(false);
        })
        .catch((err) => {
          //   setLoading(false);
          console.log("fetchChats err", err);
        });

      setOptions(options);
      setProfileData((prev) => {
        return {
          ...prev,
          username: userData.username,
          pic: userData.pic,
          email: userData.email,
          _id: userData._id,
        };
      });

      setActiveUser({
        username: userData.username,
        pic: userData.pic,
        email: userData.email,
        _id: userData._id,
      });
    }
  };

  const [mode, setMode] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (fetchAgain) {
      fetchUserData();
    } else {
      return;
    }
  }, [fetchAgain]);

  const [groupName, setGroupName] = useState("");
  // const [searchInput, setSearchInput] = useState("");
  // const [users, setUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);

  const [uniqueIds, setUniqueIds] = useState([]);

  const [rawUniqueIds, setRawUniqueIds] = useState([]);

  // useEffect(() => {
  //   if (selectedChat.length > 0 && selectedChat[0].isGroupChat) {
  //     setGroupName(selectedChat[0].chatName);
  //     let uniqueId = [];
  //     let otherUsers = selectedChat[0].users.filter((each) => {
  //       if (!uniqueIds.includes(each._id)) {
  //         uniqueId.push(each._id);
  //         setUniqueIds((prev) => {
  //           return [...prev, each._id];
  //         });
  //       }
  //       return each._id !== selectedChat[0].groupAdmin._id;
  //     });
  //     console.log("otherUsers", otherUsers, uniqueId);
  //     //   setUniqueIds([...uniqueId]);
  //     setAddedUsers([...otherUsers]);
  //     setRawUniqueIds([...uniqueId]);
  //   }
  // }, [selectedChat, uniqueIds]);

  var [selectedChatCompare, setSelectedChatCompare] = useState([]);

 

  return (
    <ChatContext.Provider
      value={{
        modalOpen,
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
        groupModalOpen,
        setGroupModalOpen,
        smallScreenChatBox,
        setSmallScreenChatBox,
        mode,
        setMode,
        fetchAgain,
        setFetchAgain,

        groupName,
        setGroupName,
        addedUsers,
        setAddedUsers,
        rawUniqueIds,
        setRawUniqueIds,
        uniqueIds,
        setUniqueIds,
        isLastMessage,
        isSameSender,
        getChatName,
        isSameSenderMargin,
        isSameUser,
        selectedChatCompare,
        setSelectedChatCompare
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
