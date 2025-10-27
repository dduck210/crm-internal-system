import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://todo-backend-6c6i.onrender.com/todos";

const sortFn = (a, b) => {
  if (a.order !== undefined || b.order !== undefined) {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    if (ao !== bo) return ao - bo;
  }
  const da = new Date(a.createdAt || 0).getTime();
  const db = new Date(b.createdAt || 0).getTime();
  if (db !== da) return db - da;
  return Number(b.id) - Number(a.id);
};

export const useTodos = (userId, isAdmin) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (userId === null) return;
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      let todoData = res.data || [];

      if (!isAdmin) {
        todoData = todoData.filter(
          (todo) => String(todo.userId) === String(userId)
        );
      }

      todoData.sort(sortFn);
      setTodos(todoData);
    } catch (error) {
      toast.error("Could not load data. Please try again later!");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimistic Add
  const handleAdd = useCallback(
    async (text, assignedUserId) => {
      const tempId = `temp-${Date.now()}`;
      const newTodo = {
        id: tempId,
        todo: text,
        completed: null,
        userId: isAdmin ? assignedUserId : userId,
        priority: false,
        createdAt: new Date().toISOString(),
        order: -1, // Luôn hiển thị ở trên cùng
      };

      setTodos((prev) => [newTodo, ...prev].sort(sortFn));

      try {
        const res = await axios.post(API_URL, { ...newTodo, id: undefined });
        setTodos((prev) =>
          prev.map((t) => (t.id === tempId ? res.data : t)).sort(sortFn)
        );
        toast.success("Task added successfully!");
      } catch {
        toast.error("An error occurred while adding the task!");
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
      }
    },
    [isAdmin, userId]
  );

  // Optimistic Delete
  const handleDelete = useCallback(
    async (id) => {
      const originalTodos = [...todos];
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Task deleted!");
      } catch (err) {
        setTodos(originalTodos);
        toast.error("Task cannot be deleted!");
      }
    },
    [todos]
  );

  // Optimistic Toggle Status
  const handleToggle = useCallback(
    async (id, completed) => {
      const originalTodos = [...todos];
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );

      try {
        await axios.put(`${API_URL}/${id}`, { completed });
        toast.success("Status updated!");
      } catch {
        setTodos(originalTodos);
        toast.error("Status update failed!");
      }
    },
    [todos]
  );

  // Optimistic Edit
  const handleEdit = useCallback(
    async (id, text) => {
      if (!text.trim()) {
        toast.error("Please enter the task description!");
        return false;
      }
      const originalTodos = [...todos];
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, todo: text } : todo))
      );

      try {
        await axios.put(`${API_URL}/${id}`, { todo: text });
        toast.success("The task has been updated!");
        return true;
      } catch {
        setTodos(originalTodos);
        toast.error("An error occurred while editing the task!");
        return false;
      }
    },
    [todos]
  );

  // Optimistic Toggle Priority
  const handleTogglePriority = useCallback(
    async (todo) => {
      const originalTodos = [...todos];
      const newPriority = !todo.priority;
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, priority: newPriority } : t
        )
      );

      try {
        await axios.put(`${API_URL}/${todo.id}`, { priority: newPriority });
        toast.success(newPriority ? "Prioritized!" : "Priority removed!");
      } catch (err) {
        setTodos(originalTodos);
        toast.error("Failed to update priority!");
      }
    },
    [todos]
  );

  return {
    todos,
    setTodos,
    loading,
    fetchData,
    handleAdd,
    handleDelete,
    handleToggle,
    handleEdit,
    handleTogglePriority,
  };
};
