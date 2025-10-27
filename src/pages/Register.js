// src/pages/Register.js
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import getUserByUsername, { createUser } from "../api/users";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false); // thêm cảnh báo CapsLock
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const validate = () => {
    const errs = {};
    const uname = username.trim();
    if (!uname) errs.username = "Please enter your username.";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(uname))
      errs.username =
        "Username must be 3–20 characters and contain only letters, numbers, or underscores (_).";
    if (!password) errs.password = "Please enter your password.";
    else if (password.length < 4)
      errs.password = "Password must be at least 4 characters long.";
    if (!confirmPassword) errs.confirm = "Please re-enter your password.";
    else if (password && password !== confirmPassword)
      errs.confirm = "Passwords do not match.";
    return errs;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setErrors({});

    const errs = validate();
    setErrors(errs);

    if (errs.username) {
      usernameRef.current?.focus();
      return;
    }
    if (errs.password) {
      passwordRef.current?.focus();
      return;
    }
    if (errs.confirm) {
      confirmRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const existedUser = await getUserByUsername(username.trim());
      if (existedUser) {
        setErrors({ username: "Username already exists." });
        usernameRef.current?.focus();
        toast.warning("Username already exists.");
        setIsSubmitting(false);
        return;
      }

      const user = await createUser({ username: username.trim(), password });

      const minimalUser = { id: user.id, username: user.username };
      localStorage.setItem("token", minimalUser.id);
      localStorage.setItem("user", JSON.stringify(minimalUser));

      toast.success("Registration successful!");
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/");
      }, 500);
    } catch (error) {
      setErrors({ other: "Registration failed!" });
      toast.error("Registration failed!");
      setIsSubmitting(false);
    }
  };

  const handleInput = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
    if (field === "confirm") setConfirmPassword(value);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/40" aria-hidden />
      <form
        onSubmit={handleRegister}
        autoComplete="on"
        className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-[1.01]"
      >
        <h2 className="text-4xl text-center font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Register
        </h2>

        {(errors.username ||
          errors.password ||
          errors.confirm ||
          errors.other) && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {errors.username ||
              errors.password ||
              errors.confirm ||
              errors.other}
          </div>
        )}

        {/* Username */}
        <div className="relative mb-5">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-user" />
          </span>
          <input
            className={`w-full pl-10 pr-4 py-3 border ${
              errors.username
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="Username"
            value={username}
            onChange={(e) => handleInput("username", e.target.value)}
            autoComplete="username"
            ref={usernameRef}
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-lock" />
          </span>
          <input
            type="password"
            className={`w-full pl-10 pr-4 py-3 border ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="Password"
            value={password}
            onChange={(e) => handleInput("password", e.target.value)}
            onKeyUp={(e) => setIsCapsLockOn(e.getModifierState("CapsLock"))} // cảnh báo CapsLock
            autoComplete="new-password"
            ref={passwordRef}
          />

          {isCapsLockOn && (
            <p className="text-yellow-500 text-sm mt-1">
              Warning: Caps Lock is on
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative mb-8">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-check" />
          </span>
          <input
            type="password"
            className={`w-full pl-10 pr-4 py-3 border ${
              errors.confirm
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => handleInput("confirm", e.target.value)}
            onKeyUp={(e) => setIsCapsLockOn(e.getModifierState("CapsLock"))} // cảnh báo CapsLock
            autoComplete="new-password"
            ref={confirmRef}
          />

          {isCapsLockOn && (
            <p className="text-yellow-500 text-sm mt-1">
              Warning: Caps Lock is on
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all text-lg flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Register"
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-200">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-300 hover:text-indigo-600 font-semibold underline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
