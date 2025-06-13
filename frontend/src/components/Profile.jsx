import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaRegAddressCard } from "react-icons/fa";
import { BACKEND_URL } from "@/config";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: null,
    name: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
      setFormData({
        username: res.data.username,
        bio: res.data.bio || "",
        profilePicture: null,
        name: res.data.name || "",
      });
    } catch (e) {
      setError(e.response?.data?.message || "Error fetching profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profilePicture: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("username", formData.username.trim());
      formDataToSubmit.append("bio", formData.bio.trim());
      formDataToSubmit.append("name", formData.name.trim());
      if (formData.profilePicture) {
        formDataToSubmit.append("profilePicture", formData.profilePicture);
      }

      const res = await axios.put(`${BACKEND_URL}/api/v1/user/profile`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      setModalOpen(false);
      setPreviewImage(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  const defaultProfilePicture =
    "https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6.jpg?w=1436&h=1078";

  return (
    <div className="w-2/4 mx-auto p-5">
      <div className="bg-soft-800 text-white shadow-lg p-6 rounded-lg">
        <div className="flex flex-col items-center mb-5">
          <div className="w-36 h-36 rounded-full border-4 border-gray-600 overflow-hidden mb-4">
            <img
              src={
                previewImage ||
                user.profilePicture ||
                defaultProfilePicture
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-semibold">Profile Information</h2>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg font-medium flex items-center">
            <FaUser className="mr-2 text-xl" />
            Name
          </label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="bg-gray-700 text-white rounded-md w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg font-medium flex items-center">
            <FaEnvelope className="mr-2 text-xl" />
            Email
          </label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="bg-gray-700 text-white rounded-md w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg font-medium flex items-center">
            <FaRegAddressCard className="mr-2 text-xl" />
            Bio
          </label>
          <input
            type="text"
            value={user.bio || "No bio available"}
            readOnly
            className="bg-gray-700 text-white rounded-md w-full p-2"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
            onClick={() => setModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-2/3 max-w-xl">
            <div className="bg-soft-500 text-white py-4 px-6 text-xl font-semibold rounded-t-lg">
              Edit Profile
            </div>
            <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6 text-gray-300">
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 mb-4">
                  <img
                    src={
                      previewImage ||
                      user.profilePicture ||
                      defaultProfilePicture
                    }
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-md"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="absolute bottom-2 right-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white p-2 rounded-full cursor-pointer shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Click the + icon to change profile picture.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-md w-full p-2"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-md w-full p-2"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-md w-full p-2"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-600 text-white hover:bg-gray-700 px-6 py-2 rounded-md shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-fuchsia-700 text-white hover:bg-fuchsia-800 px-6 py-2 rounded-md shadow-lg"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
