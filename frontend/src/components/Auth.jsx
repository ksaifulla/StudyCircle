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

  const sendRequest = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs,
      );
      const jwt = res.data.token;
      localStorage.setItem("token", jwt);
      navigate("/");
    } catch (e) {
      alert("Wrong Inputs");
    }
  };

  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-zinc-900 dark:border-gray-700">
      <form className="space-y-6" action="#">
        <h5 className="text-2xl font-medium text-gray-900 dark:text-white">
          {type === "signup" ? "Create an account" : "Sign in"}
        </h5>

        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            username
          </label>
          <input
            type="username"
            name="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="youremail@example.com"
            required
            onChange={(e) =>
              setPostInputs({
                ...postInputs,
                username: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="mb-7 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
            onChange={(e) =>
              setPostInputs({
                ...postInputs,
                password: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            sendRequest();
          }}
          type="submit"
          className="w-full text-white bg-red-700  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          {type === "signup" ? "Sign up" : "Login"}
        </button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            to={type === "signin" ? "/signup" : "/signin"}
            className="text-red-700 hover:underline dark:text-red-500"
          >
            {type === "signup" ? "Login" : "sign up"}
          </Link>
        </div>
      </form>
    </div>
  );
};
