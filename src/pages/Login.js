// src/pages/Login.js
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import getUserByUsername from "../api/users";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

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

    return errs;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrors({});
    setUsername(username.trim());
    setPassword(password);

    const errs = validate();
    setErrors(errs);

    if (errs.username) {
      usernameRef.current?.focus();
      setIsSubmitting(false);
      return;
    }
    if (errs.password) {
      passwordRef.current?.focus();
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await getUserByUsername(username.trim());
      if (!user) {
        setErrors({ username: "Username does not exist." });
        usernameRef.current?.focus();
        setIsSubmitting(false);
        return;
      }

      // kiểm tra phân biệt hoa thường
      if (user.password !== password) {
        if (user.password.toLowerCase() === password.toLowerCase()) {
          setErrors({
            password:
              "Sai mật khẩu (chú ý: mật khẩu phân biệt chữ hoa/chữ thường).",
          });
        } else {
          setErrors({ password: "Incorrect username or password." });
        }
        passwordRef.current?.focus();
        setIsSubmitting(false);
        return;
      }

      // lưu user khi đăng nhập thành công
      localStorage.setItem("userId", user.id);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        })
      );
      localStorage.setItem("token", user.id);

      toast.success("Login successful!");
      setIsSubmitting(false);
      navigate("/");
    } catch (err) {
      toast.error("An unknown error occurred. Please try again!");
      setIsSubmitting(false);
    }
  };

  const handleInput = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
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
      <div className="absolute inset-0 bg-black/40 z-0" aria-hidden />
      <form
        className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-[1.01]"
        onSubmit={handleLogin}
      >
        <h2 className="text-4xl text-center font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Login
        </h2>

        {(errors.username || errors.password) && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {errors.username || errors.password}
          </div>
        )}

        <div className="relative mb-5">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-user" />
          </span>
          <input
            className={`w-full pl-10 pr-4 py-3 border ${
              errors.username
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="Username"
            value={username}
            onChange={(e) => handleInput("username", e.target.value)}
            autoComplete="username"
            ref={usernameRef}
          />
        </div>

        <div className="relative mb-8">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-lock" />
          </span>
          <input
            type="password"
            className={`w-full pl-10 pr-4 py-3 border ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="Password"
            value={password}
            onChange={(e) => handleInput("password", e.target.value)}
            onKeyUp={(e) => setIsCapsLockOn(e.getModifierState("CapsLock"))} // CapsLock warning
            autoComplete="current-password"
            ref={passwordRef}
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
            "Login"
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-200">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-300 underline hover:text-indigo-600 transition font-semibold"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
