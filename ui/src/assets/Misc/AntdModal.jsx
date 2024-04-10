/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { ChatState } from "../../Context/Chatprovider";
import AvatarIcon from "../images/Avatar.jpg";

const AntdModal = ({ user, setProfileData }) => {
  const { modalOpen, setModalOpen } = ChatState();
  return (
    <>
      <Modal
        title={user.username}
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
      >
        <div>
          <img className="circle_modal_img" src={user.pic} alt="Profile" onError={(e)=>{e.target.src = AvatarIcon}} />
        </div>
        <div>
          <h4>{user.email}</h4>
        </div>
      </Modal>
    </>
  );
};

export default AntdModal;
