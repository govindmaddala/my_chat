/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "./NormalApp.css";
import { users } from "./data/content";
import Pill from "./components/Pill";

const NormalApp = () => {
  const inputRef = useRef(null);
  const [searchItem, setSearchItem] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUserIds, setAllUserIds] = useState(new Set());

  const adduser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setAllUserIds(new Set([...allUserIds, user.id]));
    setSearchItem("");
    inputRef.current.focus();
  };

  useEffect(() => {
    if (searchItem.trim() === "") {
      setSuggestions([]);
      return;
    }
    if (searchItem.length > 0) {
      let filteredData = users.users.filter((each) => {
        return (
          !allUserIds.has(each.id) &&
          each.firstName.toLowerCase().includes(searchItem.toLowerCase())
        );
      });
      setSuggestions(filteredData);
    }
  }, [searchItem]);

  const deleteUser = (user) => {
    // console.log(user)

    let updatedUsers = selectedUsers.filter((each) => {
      return each.id !== user.id;
    });
    setSelectedUsers(updatedUsers);
    let userIds = new Set(allUserIds);
    userIds.delete(user.id);
    setAllUserIds(userIds);
    setSearchItem("");
    inputRef.current.focus();
  };

  const deleteUserByBackspace = () => {
    if (selectedUsers.length > 0) {
      let lastUser = selectedUsers.at(-1);
      deleteUser(lastUser);
      return
    }

  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        <div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search User"
            value={searchItem}
            onChange={(e) => {
              setSearchItem(e.target.value);
            }}
            onKeyDown={(e) => {
              if (searchItem == "" && e.key === "Backspace") {
                deleteUserByBackspace();
              }
            }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((each) => {
                return (
                  <li
                    key={each.email}
                    onClick={() => {
                      adduser(each);
                    }}
                  >
                    <span className="first-name">{each.firstName[0]}</span>
                    {each.firstName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="users-selected">
          {selectedUsers.map((each) => {
            return (
              <Pill
                name={each.firstName}
                key={each.email}
                clickFun={() => deleteUser(each)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NormalApp;
