/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import ToastComponent from "../../assets/ToastComponent";
import axios from "axios";
import http from "../../http";
import Loader from "../../assets/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    signInTabActive: true,
    signUpTabActive: false,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (userData) {
      let options = {
        headers: {
          authorization: `Bearer ${userData.message}`,
        },
      };

      http.get("/users/verifyWithToken", options).then((resp) => {
        if (resp.data.message) {
          navigate("/");
        }
      });
    }
  }, [navigate]);

  const [toastMessage, setToastMessage] = useState("");

  const [signinDetails, setSigninDetails] = useState({
    signin_email: "",
    signin_password: "",
  });
  const [signupDetails, setSignupDetails] = useState({
    signup_username: "",
    signup_email: "",
    signup_password: "",
    signup_image: "",
  });

  const handleProfilePic = (pic) => {
    if (!pic) {
      setToastMessage("Please select an image");
      return;
    }
    setLoader(true);

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      // setToastMessage("Image is not uploaded");
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dd14skyqk");
      let url = "https://api.cloudinary.com/v1_1/dd14skyqk/image/upload";
      axios
        .post(url, data)
        .then((resp) => {
          setSignupDetails((prev) => {
            return {
              ...prev,
              signup_image: resp.data.url,
            };
          });
          setLoader(false);
          console.log(resp.data);
        })
        .catch((err) => {
          console.log("err", err);
          setToastMessage(err.response.data.error.message);
          setLoader(false);
        });

      return;
    }

    setSignupDetails((prev) => {
      return {
        ...prev,
        signup_image: pic,
      };
    });
  };

  const handleChange = (formType, event) => {
    const { name, value } = event;
    if (formType === "Login") {
      setSigninDetails((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      setSignupDetails((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleTabs = (tabName) => {
    setTimeout(() => {
      if (tabName === "signInTabActive") {
        setState((prev) => {
          return {
            ...prev,
            signInTabActive: true,
            signUpTabActive: false,
          };
        });
      } else {
        setState((prev) => {
          return {
            ...prev,
            signInTabActive: false,
            signUpTabActive: true,
          };
        });
      }
    }, 0);
  };

  const signInUser = (e) => {
    e.preventDefault();

    setLoader(true);

    let payload = {
      email: signinDetails.signin_email,
      password: signinDetails.signin_password,
    };

    http
      .post("/users/login", payload)
      .then((resp) => {
        localStorage.setItem("data", JSON.stringify(resp.data));
        navigate("/");
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setToastMessage(err.response.data.message);
        setLoader(false);
      });
  };
  const signUpUser = (e) => {
    e.preventDefault();
    setLoader(true);
    // const [signupDetails, setSignupDetails] = useState({
    //   signup_username: "",
    //   signup_email: "",
    //   signup_password: "",
    //   signup_image: "",
    // });

    let payload = {
      name: signupDetails.signup_username,
      email: signupDetails.signup_email,
      password: signupDetails.signup_password,
      pic: signupDetails.signup_image ? signupDetails.signup_image : "",
    };

    http
      .post("/users/register", payload)
      .then((resp) => {
        localStorage.setItem("data", JSON.stringify(resp.data));
        setLoader(false);
        navigate("/");
      })
      .catch((err) => {
        setLoader(false);
        setToastMessage(err.response.data.message);
      });
  };

  const loginAsGuest = () => {
    setToastMessage("Logged in as guest");
  };

  const [loader, setLoader] = useState(false);

  return (
    <>
      {toastMessage && (
        <ToastComponent
          message={toastMessage}
          setToastMessage={setToastMessage}
        />
      )}

      {loader && <Loader visible={true} />}

      <div className={loader ? "auth_card loading__class" : "auth_card"}>
        <div
          className={
            state.signInTabActive
              ? "app__heading card app__heading__signin"
              : "app__heading card app__heading__signup"
          }
        >
          <h3>Talk-A-Tive</h3>
        </div>
        <div
          className={
            state.signInTabActive
              ? "auth__card__main signin__card card"
              : "auth__card__main signup__card card"
          }
        >
          <div className="tab__card d-flex row mx-0">
            <div
              onClick={() => handleTabs("signInTabActive")}
              className={
                state.signInTabActive
                  ? "col-6 text-center card active__tab cursor__class"
                  : "col-6 text-center cursor__class"
              }
            >
              <h4>Login</h4>
            </div>

            <div
              onClick={() => handleTabs("signUpTabActive")}
              className={
                state.signUpTabActive
                  ? "col-6 text-center card active__tab cursor__class"
                  : "col-6 text-center cursor__class"
              }
            >
              <h4>Sign Up</h4>
            </div>
          </div>

          {state.signInTabActive ? (
            <>
              <div className="common__card card">
                <form className="mt-3" onSubmit={signInUser}>
                  <div>
                    <label htmlFor="signin_email">Email*</label>
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      name="signin_email"
                      id="signin_email"
                      value={signinDetails.signin_email}
                      required
                      placeholder="Email Address"
                      onChange={(e) => handleChange("Login", e.target)}
                    />
                  </div>

                  <div>
                    <label htmlFor="signin_password">Password*</label>
                  </div>
                  <div className="mb-2">
                    <input
                      type="password"
                      name="signin_password"
                      id="signin_password"
                      placeholder="Password"
                      value={signinDetails.signin_password}
                      onChange={(e) => handleChange("Login", e.target)}
                      required
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <Link to={"/reset-password"}>Forgot Password ?</Link>
                  </div>

                  <div className="mt-3">
                    <button className="btn btn-primary w-100" type="submit">
                      Login
                    </button>
                  </div>
                </form>

                <button
                  className="btn btn-danger w-100 mt-3"
                  onClick={loginAsGuest}
                >
                  Login as Guest
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="common__card card">
                <form className="mt-3" onSubmit={signUpUser}>
                  <div>
                    <label htmlFor="signup_username">Username*</label>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="signup_username"
                      id="signup_username"
                      required
                      placeholder="Email Address"
                      value={signupDetails.signup_username}
                      onChange={(e) => handleChange("Signup", e.target)}
                    />
                  </div>
                  <div>
                    <label htmlFor="signup_email">Email*</label>
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      name="signup_email"
                      id="signup_email"
                      required
                      placeholder="Email Address"
                      value={signupDetails.signup_email}
                      onChange={(e) => handleChange("Signup", e.target)}
                    />
                  </div>

                  <div>
                    <label htmlFor="signup_password">Password*</label>
                  </div>
                  <div className="mb-2">
                    <input
                      type="password"
                      name="signup_password"
                      id="signup_password"
                      placeholder="Password"
                      value={signupDetails.signup_password}
                      onChange={(e) => handleChange("Signup", e.target)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="signup_password">Profile Pic*</label>
                  </div>
                  <div className="mb-2">
                    <input
                      type="file"
                      name="signup_image"
                      id="signup_image"
                      placeholder="Password"
                      accept="image/*"
                      onChange={(e) => handleProfilePic(e.target.files[0])}
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <div
                      className="anchor__tab cursor__class"
                      onClick={() => handleTabs("signInTabActive")}
                    >
                      Already a User ?
                    </div>
                  </div>

                  <div className="mt-3">
                    <button className="btn btn-primary w-100" type="submit">
                      Register
                    </button>
                  </div>
                </form>

                <button
                  className="btn btn-danger w-100 mt-3"
                  onClick={loginAsGuest}
                >
                  Login as Guest
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
