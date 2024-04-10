/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./ChatApp/Auth/Login";
import ToastComponent from "./assets/ToastComponent";
import Chats from "./components/Chats";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} exact />
        <Route path="/reset-password" element={<ToastComponent />} exact />
        <Route path="/" element={<Chats />} exact />
      </Routes>
    </div>
  );
};

export default App;
