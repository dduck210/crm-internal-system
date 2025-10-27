import { useState, useEffect } from "react";
import axios from "axios";

const USERS_API = "https://todo-backend-6c6i.onrender.com/users";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${USERS_API}/${token}`)
        .then((res) => {
          setUser(res.data);
          setIsAdmin(res.data.role === "admin");
          setUserId(res.data.id);
        })
        .catch(() => {
          // Token không hợp lệ hoặc đã hết hạn
          setUser(null);
          setIsAdmin(false);
          setUserId(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { user, isAdmin, userId, loadingAuth: loading };
};
