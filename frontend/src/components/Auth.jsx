export const BACKEND_URL = "http://localhost:5000";

import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Auth = ({ type }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const sendRequest = async () => {
    if (!postInputs.username || !postInputs.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs,
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
    <div className="w-full max-w-sm p-4 bg-zinc-900 border-gray-700 border rounded-lg shadow sm:p-6 md:p-8">
      <form className="space-y-6" action="#">
        <h5 className="text-2xl font-medium text-white">
          {type === "signup" ? "Create an account" : "Sign in"}
        </h5>
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-white"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="bg-gray-600 border-gray-500 placeholder-gray-400 text-white border rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
            placeholder="youremail@example.com"
            required
            onChange={(e) => {
              setPostInputs({
                ...postInputs,
                username: e.target.value,
              });
              setError("");
            }}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="mb-7 bg-gray-600 border-gray-500 placeholder-gray-400 text-white border rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
            required
            onChange={(e) => {
              setPostInputs({
                ...postInputs,
                password: e.target.value,
              });
              setError("");
            }}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            sendRequest();
          }}
          type="submit"
          className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800"
        >
          {type === "signup" ? "Sign up" : "Login"}
        </button>
        <div className="text-sm font-medium text-gray-300">
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            to={type === "signin" ? "/signup" : "/signin"}
            className="text-red-700 hover:underline text-red-500"
          >
            {type === "signup" ? "Login" : "Sign up"}
          </Link>
        </div>
      </form>
    </div>
  );
};
