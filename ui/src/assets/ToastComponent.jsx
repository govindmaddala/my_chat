/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastComponent = ({ message, setToastMessage }) => {
  console.log("message", message);
  useEffect(() => {
    if (message) {
      toast(message);
    }

    const timeOutId = setTimeout(() => {
      setToastMessage("");
    }, 5000);

    return () => {
      return () => {
        clearTimeout(timeOutId);
      };
    };
  }, []);

  return (
    <>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default ToastComponent;
