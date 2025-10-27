// src/pages/Profile.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const USERS_API = "https://todo-backend-6c6i.onrender.com/users";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(USERS_API);
        const foundUser = res.data.find((u) => u.id === userId);
        if (foundUser) setUser(foundUser);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Validate từng field
  const validateField = (name, value) => {
    let error = "";

    if (name === "oldPassword") {
      if (!value) error = "Old password is required";
      else if (user && value !== user.password)
        error = "Old password is incorrect";
    }

    if (name === "newPassword") {
      if (!value) error = "New password is required";
      else if (value.length < 6)
        error = "Password must be at least 6 characters";
    }

    if (name === "confirmPassword") {
      if (!value) error = "Please confirm new password";
      else if (value !== newPassword) error = "Passwords do not match";
    }

    return error;
  };

  // Validate tất cả trước khi submit
  const validateAll = () => {
    const newErrors = {
      oldPassword: validateField("oldPassword", oldPassword),
      newPassword: validateField("newPassword", newPassword),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };
    setErrors(newErrors);
    return newErrors;
  };

  const handleUpdatePassword = async () => {
    const newErrors = validateAll();
    if (Object.values(newErrors).some((err) => err)) {
      return; // có lỗi thì dừng
    }

    try {
      await axios.patch(`${USERS_API}/${user.id}`, {
        password: newPassword,
      });
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        User information not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-6xl mx-auto border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left - Avatar + Basic Info */}
        <div className="flex flex-col items-center text-center col-span-1">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt="avatar"
            className="w-36 h-36 rounded-full border-4 border-blue-500 shadow-md"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {user.username}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {user.id}
          </p>

          <span
            className={`mt-4 px-5 py-1.5 text-sm font-semibold rounded-full shadow-sm ${
              user.role === "admin"
                ? "bg-red-100 text-red-700"
                : user.role === "manager"
                  ? "bg-blue-100 text-blue-700"
                  : user.role === "viewer"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.role.toUpperCase()}
          </span>
        </div>

        {/* Right - Detailed Info + Change Password */}
        <div className="flex flex-col justify-between col-span-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Detailed Information
            </h3>
            {/* Info */}
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Username</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Email</span>
                <span>{user.email || "not updated"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Role</span>
                <span>{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Created At</span>
                <span>{user.createdAt || "unknown"}</span>
              </div>
            </div>

            {/* Change Password Section */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              {/* Old Password */}
              <div>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      oldPassword: validateField("oldPassword", e.target.value),
                    }));
                  }}
                  className={`w-full p-3 rounded-lg border ${
                    errors.oldPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  } dark:bg-gray-800`}
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      newPassword: validateField("newPassword", e.target.value),
                    }));
                  }}
                  className={`w-full p-3 rounded-lg border ${
                    errors.newPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  } dark:bg-gray-800`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateField(
                        "confirmPassword",
                        e.target.value
                      ),
                    }));
                  }}
                  className={`w-full p-3 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  } dark:bg-gray-800`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                onClick={handleUpdatePassword}
                className="w-full px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => alert("🚧 Edit feature will be updated later")}
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
