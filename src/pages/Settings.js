import { useState } from "react";
import axios from "axios";

const USERS_API = "https://todo-backend-6c6i.onrender.com/users";

const Settings = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error + Success
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Validate 1 field cụ thể
  const validateField = (field, value) => {
    let message = "";

    if (field === "displayName") {
      if (!value.trim()) message = "Display Name is required";
    }

    if (field === "email") {
      if (!value.trim()) message = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = "Invalid email format";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  // Check email có tồn tại DB chưa
  const handleEmailBlur = async () => {
    if (errors.email) return; // nếu format đang sai thì khỏi check
    try {
      const res = await axios.get(`${USERS_API}?email=${email}`);
      if (res.data.length > 0) {
        setErrors((prev) => ({ ...prev, email: "Email already in use" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    } catch (err) {
      console.error("Error checking email:", err);
    }
  };

  const handleSave = async () => {
    setErrors({});
    setSuccessMessage("");

    // check lần cuối
    if (
      !validateField("displayName", displayName) ||
      !validateField("email", email)
    )
      return;

    if (errors.email) return; // nếu email duplicate thì không cho save

    setLoading(true);
    try {
      const payload = {
        displayName,
        email,
        emailNotifications,
        twoFactor,
      };

      console.log("Saving settings:", payload);
      await new Promise((res) => setTimeout(res, 1000)); // fake API call
      setSuccessMessage("Settings saved successfully");
    } catch (err) {
      setErrors({ global: "Failed to save settings" });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = "Old password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    setErrors({});
    setSuccessMessage("");

    if (!validatePassword()) return;

    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${USERS_API}/${userId}`);
      const user = res.data;

      if (user.password !== oldPassword) {
        setErrors({ oldPassword: "Old password is incorrect" });
        return;
      }

      await axios.put(`${USERS_API}/${userId}`, {
        ...user,
        password: newPassword,
      });

      setSuccessMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrors({ global: "Failed to update password" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        ⚙️ Settings
      </h1>

      {/* Profile */}
      {/* <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow space-y-4"> */}
      {/* <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Profile
        </h2>
        <div>
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              validateField("displayName", e.target.value);
            }}
            placeholder="Your name"
            className={`w-full px-4 py-2 rounded-lg border 
              ${errors.displayName ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500`}
          />
          {errors.displayName && (
            <p className="text-sm text-red-500 mt-1">{errors.displayName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            className={`w-full px-4 py-2 rounded-lg border 
              ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div> */}
      {/* </section> */}

      {/* Security */}
      {/* <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow space-y-4"> */}
      {/* <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Security
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Two-Factor Authentication
          </span>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition 
              ${twoFactor ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform transition 
                ${twoFactor ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div> */}

      {/* Change Password */}
      {/* <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className={`w-full px-4 py-2 rounded-lg border 
                ${errors.oldPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500`}
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.oldPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={`w-full px-4 py-2 rounded-lg border 
                ${errors.newPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500`}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full px-4 py-2 rounded-lg border 
                ${errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            onClick={handleUpdatePassword}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </div> */}
      {/* </section> */}

      {/* Preferences */}
      <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Preferences
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Email Notifications
          </span>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition 
              ${emailNotifications ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform transition 
                ${emailNotifications ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>
      </section>

      {/* Global Error / Success */}
      {(errors.global || successMessage) && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            errors.global
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {errors.global || successMessage}
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white transition 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
