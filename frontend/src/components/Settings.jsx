import axios from "axios";
import { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";

const Settings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    username: "",
    email: "",
    notifications: true,
    dataSharing: false,
    marketingEmails: false,
    subscriptionPlan: "basic",
  });

  const [selectedCategory, setSelectedCategory] = useState("profile");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleResetPassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/v1/user/profile/password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      setPasswordError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleSave = () => {
    alert("Settings saved!");
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case "profile":
        return (
          <div className="space-y-4 mt-8">
            <div>
              <label className="block text-lg text-gray-300 font-semibold mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-lg text-gray-300 font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 mt-2">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-500 mt-2">{passwordSuccess}</p>
            )}
            <button
              onClick={handleResetPassword}
              className="w-full px-4 py-2 bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 mt-4"
            >
              Reset Password
            </button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4 mt-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="form-checkbox text-fuchsia-500 h-6 w-6 bg-gray-800 border-gray-700"
              />
              <span className="ml-3 text-lg text-gray-300">
                Enable Notifications
              </span>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              Save Settings
            </button>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4 mt-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dataSharing"
                checked={settings.dataSharing}
                onChange={handleChange}
                className="form-checkbox text-fuchsia-500 h-6 w-6 bg-gray-800 border-gray-700"
              />
              <span className="ml-3 text-lg text-gray-300">
                Enable Data Sharing
              </span>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              Save Settings
            </button>
          </div>
        );

      case "subscriptions":
        return (
          <div className="space-y-4 mt-8">
            <div>
              <label className="block text-lg text-gray-300 font-semibold mb-2">
                Subscription Plan
              </label>
              <select
                name="subscriptionPlan"
                value={settings.subscriptionPlan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="basic">
                  Basic - Access to core features, email support
                </option>
                <option value="premium">
                  Premium - All features, priority support
                </option>
                <option value="enterprise">
                  Enterprise - Custom solutions, dedicated support
                </option>
              </select>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Choose the subscription plan that best suits your needs. Upgrade
              or downgrade at any time.
            </p>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              Save Settings
            </button>
          </div>
        );

      default:
        return (
          <div className="p-4 mt-8 text-gray-300">
            Select a category to view its settings.
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-soft-500 w-full text-white">
      <SettingsSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
};

export default Settings;
