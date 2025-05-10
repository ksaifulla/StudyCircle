import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from '../config';
import picture from "./picture.png";

export const Auth = ({ type }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const sendRequest = async () => {
   
    if (
      (type === "signup" && !postInputs.name) || 
      !postInputs.username || 
      !postInputs.password
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      if (res.status === 200 && res.data.token) {
        const jwt = res.data.token;
        localStorage.setItem("token", jwt);
        navigate("/");
      } else {
        throw new Error(res.data.message || "Authentication failed.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Incorrect username or password.");
    }
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Left Section: Image */}
      <div className="hidden md:flex md:w-1/2 h-full bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 items-center justify-center">
     
    <img
      src={picture}
      alt="Collaboration Illustration"
      className="max-h-full max-w-full object-cover"
    />
  
      </div>

      {/* Right Section: Welcome Message and Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-white">Welcome to Study Circle</h1>
          <p className="text-lg text-gray-200 mt-4">
            Join a vibrant community of learners and collaborators. Sign up to
            start your journey or <br/> log in to continue!
          </p>
        </div>
        <div className="w-full max-w-md p-8 bg-transparent-100 rounded-lg shadow-none  ">
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form className="space-y-6">
            {type === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full bg-customPurple-200 text-white placeholder-gray-400 border border-gray-500 rounded-lg focus:ring-red-500 focus:border-red-500 p-2.5"
                  placeholder="Enter your full name"
                  required
                  onChange={(e) => {
                    setPostInputs({ ...postInputs, name: e.target.value });
                    setError("");
                  }}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full bg-customPurple-200 text-white placeholder-gray-400 border border-gray-500 rounded-lg focus:ring-red-500 focus:border-red-500 p-2.5"
                placeholder="Enter your email"
                required
                onChange={(e) => {
                  setPostInputs({ ...postInputs, username: e.target.value });
                  setError("");
                }}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full bg-customPurple-200 text-white placeholder-gray-400 border border-gray-500 rounded-lg focus:ring-red-500 focus:border-red-500 p-2.5"
                placeholder="••••••••"
                required
                onChange={(e) => {
                  setPostInputs({ ...postInputs, password: e.target.value });
                  setError("");
                }}
              />
            </div>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                sendRequest();
              }}
              className="w-full bg-purple-700 text-white font-medium py-2.5 rounded-lg hover:bg-purple-900 transition duration-300"
            >
              {type === "signup" ? "Sign Up" : "Login"}
            </button>
            <div className="text-sm font-medium text-gray-300 mt-4">
              {type === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                to={type === "signup" ? "/signin" : "/signup"}
                className="text-purple-400 hover:underline"
              >
                {type === "signup" ? "Login" : "Sign Up"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
