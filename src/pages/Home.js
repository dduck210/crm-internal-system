import { useEffect, useState, useCallback, useRef } from "react"; // Hooks imported
import axios from "axios"; // axios imported
import TodoForm from "../components/TodoForm"; // Custom component imported
import SearchUser from "../components/SearchUser"; // Custom component imported
import { CircularProgress, Tooltip } from "@mui/material"; // MUI Components imported
import { toast } from "react-toastify"; // react-toastify imported
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // DND imported

// Import Icons
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import GetAppIcon from "@mui/icons-material/GetApp";
import PublishIcon from "@mui/icons-material/Publish";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
// All necessary icons are now imported

const API_URL = "https://todo-backend-6c6i.onrender.com/todos";
const USERS_API = "https://todo-backend-6c6i.onrender.com/users";

// Helper component definitions moved above Home component
const IconButton = ({ title, onClick, children, className }) => (
  <Tooltip title={title} placement="top" arrow>
    <button
      onClick={onClick}
      className={`p-1.5 rounded-full transition-all duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  </Tooltip> //
);

const InlineSearchTask = ({ onSearch }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        className="
          block w-full h-11 pl-10 pr-4
          text-sm text-slate-800 dark:text-slate-200
          bg-white dark:bg-slate-700/50
          border border-slate-300 dark:border-slate-700
          rounded-lg
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 focus:border-blue-500
        "
        placeholder="Search by task name..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

const InlineSearchUsername = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <AccountCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        className="
          block w-full h-11 pl-10 pr-4
          text-sm text-slate-800 dark:text-slate-200
          bg-white dark:bg-slate-700/50
          border border-slate-300 dark:border-slate-700
          rounded-lg
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 focus:border-blue-500
        "
        placeholder="Search by username..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// ========================================================================
// COMPONENT TASK CARD MỚI (ĐÃ CẬP NHẬT HIỆU ỨNG KÉO)
// ========================================================================
const TaskCard = ({
  todo,
  user,
  provided,
  snapshot,
  onCheckboxChange,
  isSelected,
  onStatusToggle,
  changingStatusId,
  onPriorityToggle,
  changingPriorityId,
  onViewDetails,
  onEdit,
  onDelete,
  editingId,
  editText,
  setEditText,
  handleSaveEdit,
  handleCancelEdit,
}) => {
  const isEditingThis = editingId === todo.id;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700
        p-4 flex flex-col justify-between space-y-3 
        transition-all duration-200 ease-in-out
        ${
          snapshot.isDragging
            ? "ring-2 ring-blue-500 shadow-2xl scale-[1.03] bg-slate-50 dark:bg-slate-700/80" // 1. Thẻ BẠN ĐANG KÉO
            : "hover:shadow-lg" // 2. Trạng thái hover chuột bình thường
        }
        ${
          snapshot.isDraggingOver && !snapshot.isDragging // 3. Thẻ ĐANG BỊ KÉO QUA bởi thẻ khác
            ? "bg-slate-100 dark:bg-slate-700 scale-[1.02]" // Hiệu ứng sáng lên và phóng to nhẹ
            : ""
        }
        ${isEditingThis ? "ring-2 ring-blue-400" : ""}
      `}
    >
      {/* Phần Header Card: Checkbox và Priority */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 bg-transparent dark:bg-slate-700"
            checked={isSelected}
            onChange={onCheckboxChange}
          />
          <Tooltip
            title={todo.priority ? "High priority" : "Normal priority"}
            arrow
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPriorityToggle();
              }}
              disabled={changingPriorityId === todo.id}
              className={`${changingPriorityId === todo.id ? "animate-pulse" : ""} transition-transform transform hover:scale-125`}
            >
              {todo.priority ? (
                <StarIcon className="text-yellow-400 w-5 h-5" />
              ) : (
                <StarBorderIcon className="text-slate-400 dark:text-slate-500 hover:text-yellow-400 w-5 h-5" />
              )}
            </button>
          </Tooltip>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ID: {todo.id}
        </span>
      </div>

      {/* Phần Nội dung Card: Task Text hoặc Input Edit */}
      <div
        className="flex-grow min-h-[60px]"
        onClick={(e) => isEditingThis && e.stopPropagation()}
      >
        {isEditingThis ? (
          <textarea
            className="w-full px-2 py-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm resize-none h-16"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={async (e) => {
              e.stopPropagation();
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const success = await handleSaveEdit();
                if (success) handleCancelEdit();
              }
              if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
            autoFocus
          />
        ) : (
          <p
            className={`text-sm font-medium break-words ${todo.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-white"}`}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            {todo.todo}
          </p>
        )}
      </div>
      {/* Nút Save/Cancel khi đang Edit */}
      {isEditingThis && (
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const success = await handleSaveEdit();
              if (success) handleCancelEdit();
            }}
            className="px-2.5 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelEdit();
            }}
            className="px-2.5 py-1 text-xs text-slate-700 bg-slate-200 rounded hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Phần Footer Card: User, Status, Actions */}
      <div className="flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-3">
        <Tooltip
          title={`Assigned to ${user?.username || "N/A"}`}
          placement="top"
          arrow
        >
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
            <AccountCircleIcon style={{ fontSize: 16 }} />
            {user?.username || "N/A"}
          </span>
        </Tooltip>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút Status */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusToggle();
            }}
            disabled={changingStatusId === todo.id}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center min-w-[75px] ${
              todo.completed === true
                ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200"
                : todo.completed === false
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-200"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
            } ${changingStatusId === todo.id ? "opacity-50 cursor-wait" : "hover:opacity-80"}`}
          >
            {changingStatusId === todo.id
              ? "..."
              : todo.completed === true
                ? "Completed"
                : todo.completed === false
                  ? "Incomplete"
                  : "New"}
          </button>

          {/* Actions (chỉ hiển thị nếu không đang edit) */}
          {!isEditingThis && (
            <div className="flex items-center">
              <IconButton
                title="View Details"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <VisibilityIcon style={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                title="Edit Task"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-slate-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
              >
                <EditIcon style={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                title="Delete Task"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                <DeleteIcon style={{ fontSize: 18 }} />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========================================================================
// COMPONENT HOME
// ========================================================================
const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [notification, setNotification] = useState(""); // Removed unused state
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const [dragActive, setDragActive] = useState(false);
  const [changingPriorityId, setChangingPriorityId] = useState(null);
  const fileInputRef = useRef(null);

  // --- Derived State Calculations (defined before use) ---
  const filteredTodos = todos.filter((todo) => {
    const matchUser =
      !isAdmin || !searchUserId || String(todo.userId) === String(searchUserId);
    const matchFilter =
      (filter === "completed" && todo.completed === true) ||
      (filter === "uncompleted" && todo.completed === false) ||
      (filter === "new" &&
        (todo.completed === null || todo.completed === undefined)) ||
      filter === "all";
    const matchSearch = (todo.todo || "")
      .toLowerCase()
      .includes((search || "").trim().toLowerCase());
    const userObj = users.find((u) => String(u.id) === String(todo.userId));
    const username = userObj ? userObj.username : "";
    const matchUsername =
      searchUsername.trim() === "" ||
      username.toLowerCase().includes(searchUsername.trim().toLowerCase());
    const matchPriority =
      priorityFilter === "all" ||
      (priorityFilter === "priority" && !!todo.priority) ||
      (priorityFilter === "normal" && !todo.priority);
    return (
      matchUser && matchFilter && matchSearch && matchUsername && matchPriority
    );
  });

  const paginatedTodos = filteredTodos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const listToRender = dragActive ? filteredTodos : paginatedTodos;

  // Stats Calculations (defined before use)
  const totalTasks = filteredTodos.length;
  const completedTasks = filteredTodos.filter(
    (t) => t.completed === true
  ).length;
  const uncompletedTasks = filteredTodos.filter(
    (t) => t.completed === false
  ).length;
  const newTasks = filteredTodos.filter(
    (t) => t.completed === null || t.completed === undefined
  ).length;
  const totalPriority = filteredTodos.filter((t) => t.priority).length;
  const calcPercent = (value) =>
    totalTasks > 0 ? Math.round((value / totalTasks) * 100) : 0;

  // --- Event Handlers ---
  const handleImportClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target.result;
      console.log("CSV Content:", csvContent);
      toast.info("File uploaded. Check console."); /* TODO: Process CSV */
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  // --- Data Fetching and Effects ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${USERS_API}/${token}`)
        .then((res) => {
          setIsAdmin(res.data.role === "admin");
          setUserId(res.data.id);
        })
        .catch(() => {
          setIsAdmin(false);
          setUserId(null);
          localStorage.removeItem("token");
          setLoading(false);
          toast.error("Invalid session.");
        });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(USERS_API);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  const fetchData = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) setLoading(true);
      try {
        const res = await axios.get(API_URL);
        let todoData = res.data || [];
        const sortFn = (a, b) => {
          const orderA = a.order ?? Infinity;
          const orderB = b.order ?? Infinity;
          if (orderA !== Infinity || orderB !== Infinity) {
            if (orderA !== orderB) return orderA - orderB;
          }
          const da = new Date(a.createdAt || 0).getTime();
          const db = new Date(b.createdAt || 0).getTime();
          if (db !== da) return db - da;
          return Number(b.id) - Number(a.id);
        };
        if (!isAdmin && userId !== null) {
          todoData = todoData.filter(
            (todo) => String(todo.userId) === String(userId)
          );
        }
        todoData.sort(sortFn);
        setTodos(todoData);
      } catch (error) {
        toast.error("Could not load tasks.");
        console.error("Fetch tasks error:", error);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, userId]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    if (userId !== null) {
      fetchData(true);
    }
  }, [fetchData, userId]);

  useEffect(() => {
    setEditingId(null);
  }, [search, filter, searchUserId, searchUsername, priorityFilter, page]);
  useEffect(() => {
    const currentVisibleIds = listToRender.map((t) => t.id);
    setSelectedIds((prev) =>
      prev.filter((id) => currentVisibleIds.includes(id))
    );
  }, [listToRender]);
  useEffect(() => {
    setPage(1);
  }, [filter, priorityFilter, search, searchUserId, searchUsername]);

  // --- CRUD Handlers ---
  const handleAdd = async (text, assignedUserId) => {
    if (!text || text.trim() === "") {
      toast.warn("Task description needed.");
      return;
    }
    const tempId = `temp-${Date.now()}`;
    const newOrder =
      todos.length > 0
        ? Math.min(...todos.map((t) => t.order ?? Infinity)) - 1
        : 0;
    const newTask = {
      id: tempId,
      todo: text.trim(),
      completed: null,
      userId: isAdmin ? assignedUserId : userId,
      priority: false,
      order: newOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos((prev) =>
      [newTask, ...prev].sort(
        (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
      )
    );
    try {
      // Removed unused 'res' variable
      await axios.post(API_URL, {
        todo: newTask.todo,
        completed: newTask.completed,
        userId: newTask.userId,
        priority: newTask.priority,
        order: newTask.order,
      });
      // We must call fetchData to get the REAL ID from the server
      await fetchData();
      toast.success("Task added!");
      // Since fetchData replaces all todos, we don't need the optimistic replacement logic
    } catch (err) {
      toast.error("Failed to add task!");
      console.error("Add error:", err);
      setTodos((prev) => prev.filter((t) => t.id !== tempId)); // Revert optimistic add
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    const originalTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Delete failed!");
      console.error("Delete error:", err);
      setTodos(originalTodos);
    }
  };

  const handleToggle = async (id, completed) => {
    if (changingStatusId === id) return;
    setChangingStatusId(id);
    const originalTodos = [...todos];
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === id ? { ...t, completed } : t))
    );
    try {
      const found = originalTodos.find((todo) => todo.id === id);
      if (!found) throw new Error("Task not found.");
      await axios.put(`${API_URL}/${id}`, { ...found, completed });
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Status update failed!");
      console.error("Toggle status error:", err);
      setTodos(originalTodos);
    } finally {
      setChangingStatusId(null);
    }
  };

  const handleEdit = async (id, text) => {
    const found = todos.find((todo) => todo.id === id);
    if (!found) return false;
    const trimmedText = text.trim();
    if (!trimmedText) {
      toast.error("Description cannot be empty!");
      return false;
    }
    if (trimmedText === found.todo) {
      setEditingId(null);
      return true;
    }
    const originalTodos = [...todos];
    const updatedTodoLocal = { ...found, todo: trimmedText };
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === id ? updatedTodoLocal : t))
    );
    setEditingId(null);
    try {
      await axios.put(`${API_URL}/${id}`, updatedTodoLocal);
      toast.success("Task updated!");
      return true;
    } catch (err) {
      toast.error("Update failed!");
      console.error("Edit error:", err);
      setTodos(originalTodos);
      return false;
    }
  };

  const handleSelectTask = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async (e) => {
    e.stopPropagation();
    if (selectedIds.length === 0) {
      toast.warn("No tasks selected.");
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} task(s)?`)) return;
    const originalTodos = [...todos];
    setTodos((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    const deletedIds = [...selectedIds];
    setSelectedIds([]);
    try {
      setLoading(true);
      await Promise.all(
        deletedIds.map((id) => {
          const found = originalTodos.find((todo) => todo.id === id);
          if (found && (isAdmin || String(found.userId) === String(userId)))
            return axios.delete(`${API_URL}/${id}`);
          return Promise.resolve();
        })
      );
      toast.success("Selected tasks deleted!");
    } catch (err) {
      toast.error("Bulk delete failed! Restoring.");
      console.error("Bulk delete error:", err);
      setTodos(originalTodos);
      setSelectedIds(deletedIds);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatus = async (e, status) => {
    e.stopPropagation();
    if (selectedIds.length === 0) {
      toast.warn("No tasks selected.");
      return;
    }
    const statusText =
      status === true ? "Completed" : status === false ? "Incomplete" : "New";
    if (!window.confirm(`Mark ${selectedIds.length} task(s) as ${statusText}?`))
      return;
    const originalTodos = [...todos];
    const idsToUpdate = selectedIds.filter((id) => {
      const currentTodo = originalTodos.find((t) => t.id === id);
      return (
        currentTodo &&
        currentTodo.completed !== status &&
        (isAdmin || String(currentTodo.userId) === String(userId))
      );
    });
    if (idsToUpdate.length === 0) {
      toast.info("No tasks need update or permission denied.");
      return;
    }
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        idsToUpdate.includes(t.id) ? { ...t, completed: status } : t
      )
    );
    try {
      setLoading(true);
      await Promise.all(
        idsToUpdate.map(async (id) => {
          const found = originalTodos.find((t) => t.id === id);
          await axios.put(`${API_URL}/${id}`, { ...found, completed: status });
        })
      );
      toast.success(`Selected tasks marked as ${statusText}!`);
    } catch (err) {
      toast.error("Bulk status update failed! Restoring.");
      console.error("Bulk status error:", err);
      setTodos(originalTodos);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePriority = async (todo) => {
    if (changingPriorityId === todo.id) return;
    setChangingPriorityId(todo.id);
    const originalTodos = [...todos];
    const newPriority = !todo.priority;
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id ? { ...t, priority: newPriority } : t
      )
    );
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        ...todo,
        priority: newPriority,
      });
      toast.success(newPriority ? "Prioritized!" : "Priority removed!");
    } catch (err) {
      toast.error("Failed to update priority! Reverting.");
      console.error("Priority toggle error:", err);
      setTodos(originalTodos);
    } finally {
      setChangingPriorityId(null);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = () => {
    setDragActive(true);
  };
  const handleDragEnd = async (result) => {
    setDragActive(false);
    if (
      !result.destination ||
      (result.source.index === result.destination.index &&
        result.source.droppableId === result.destination.droppableId)
    ) {
      return;
    }

    // const currentRenderedList = listToRender; // Removed unused variable

    const offset = !dragActive ? (page - 1) * itemsPerPage : 0;
    const actualSourceIndex = result.source.index + offset;
    const actualDestinationIndex = result.destination.index + offset;

    const reorderedFilteredItems = Array.from(filteredTodos);
    if (
      actualSourceIndex < 0 ||
      actualSourceIndex >= reorderedFilteredItems.length ||
      actualDestinationIndex < 0 ||
      actualDestinationIndex >= reorderedFilteredItems.length
    ) {
      console.error("Drag index out of bounds.");
      return;
    }

    const [movedItem] = reorderedFilteredItems.splice(actualSourceIndex, 1);
    reorderedFilteredItems.splice(actualDestinationIndex, 0, movedItem);

    const updatedTodosMap = new Map(todos.map((t) => [t.id, { ...t }]));
    const finalUpdatedTodos = [];
    let currentOrder = 0;

    reorderedFilteredItems.forEach((item) => {
      const originalTodo = updatedTodosMap.get(item.id);
      if (originalTodo) {
        finalUpdatedTodos.push({ ...originalTodo, order: currentOrder });
        updatedTodosMap.delete(item.id);
        currentOrder++;
      }
    });

    const remainingItems = Array.from(updatedTodosMap.values()).sort(
      (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
    );
    remainingItems.forEach((item) => {
      finalUpdatedTodos.push({ ...item, order: currentOrder });
      currentOrder++;
    });

    const originalTodosState = [...todos];
    setTodos(finalUpdatedTodos);

    try {
      const updatePromises = finalUpdatedTodos
        .map((updatedTodo) => {
          const originalTodo = originalTodosState.find(
            (t) => t.id === updatedTodo.id
          );
          if (!originalTodo || originalTodo.order !== updatedTodo.order) {
            return axios.put(`${API_URL}/${updatedTodo.id}`, {
              order: updatedTodo.order,
            });
          }
          return null;
        })
        .filter(Boolean);
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        toast.success("Task order saved!");
      }
    } catch (err) {
      toast.error("Failed to save order! Reverting.");
      console.error("DragEnd API Error:", err);
      setTodos(originalTodosState);
    }
  };

  // Export to CSV Handler (Moved before return)
  const exportToCSV = (e) => {
    e.stopPropagation();
    if (!filteredTodos.length) {
      toast.warn("No tasks to export!");
      return;
    }
    const fields = [
      "id",
      "todo",
      "username",
      "completed",
      "priority",
      "order",
      "createdAt",
      "updatedAt",
    ];
    const BOM = "\uFEFF";
    const rows = [
      fields.join(","),
      ...filteredTodos.map((todo) => {
        const userObj =
          users.find((u) => String(u.id) === String(todo.userId)) || {};
        const safeTodo = todo.todo || "";
        const statusText =
          todo.completed === true
            ? "Completed"
            : todo.completed === false
              ? "Incomplete"
              : "New";
        const formatCsvValue = (value) => {
          const s = String(value);
          return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
        };
        return [
          todo.id,
          formatCsvValue(safeTodo),
          formatCsvValue(userObj.username || ""),
          statusText,
          todo.priority ? "Priority" : "Normal",
          todo.order ?? "",
          todo.createdAt
            ? new Date(todo.createdAt).toLocaleString("vi-VN")
            : "",
          todo.updatedAt
            ? new Date(todo.updatedAt).toLocaleString("vi-VN")
            : "",
        ].join(",");
      }),
    ].join("\r\n");
    const blob = new Blob([BOM + rows], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo-list.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // --- Render Logic ---
  if (loading && todos.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">
          Loading Workspace...
        </span>
        <CircularProgress color="inherit" />
      </div>
    );
  }

  // StatCard Component defined locally (Moved before return)
  const StatCard = ({ title, value, percentage, colorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {value}
        </p>
        <span className={`text-sm font-semibold ${colorClass}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Task Dashboard
          </h1>
          <p className="mt-2 text-md text-slate-600 dark:text-slate-400">
            Welcome back! Here's an overview of your team's tasks.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            percentage={100}
            colorClass="text-blue-500"
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            percentage={calcPercent(completedTasks)}
            colorClass="text-green-500"
          />
          <StatCard
            title="Incomplete"
            value={uncompletedTasks}
            percentage={calcPercent(uncompletedTasks)}
            colorClass="text-orange-500"
          />
          <StatCard
            title="New"
            value={newTasks}
            percentage={calcPercent(newTasks)}
            colorClass="text-slate-500"
          />
          <StatCard
            title="Priority"
            value={totalPriority}
            percentage={calcPercent(totalPriority)}
            colorClass="text-purple-500"
          />
        </div>

        <main>
          {/* Main Card Container */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 space-y-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row items-center flex-wrap gap-4">
                {/* Search/Filter Group */}
                <div className="flex-1 w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                  {isAdmin && (
                    <div className="w-full sm:w-auto">
                      <SearchUser
                        users={users}
                        value={searchUserId}
                        onChange={setSearchUserId}
                      />
                    </div>
                  )}
                  <div className="w-full sm:flex-1">
                    <InlineSearchTask onSearch={setSearch} />
                  </div>
                  <div className="w-full sm:flex-1">
                    <InlineSearchUsername
                      value={searchUsername}
                      onChange={setSearchUsername}
                    />
                  </div>
                </div>
                {/* Add Task Group */}
                <div className="w-full md:w-auto">
                  <TodoForm
                    onAdd={handleAdd}
                    users={users}
                    isAdmin={isAdmin}
                    currentUserId={userId}
                  />
                </div>
              </div>
              {/* Filter/Actions Row */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                {/* Status Filters */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg flex-wrap">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "all" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "completed" ? "bg-white dark:bg-slate-700 text-green-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setFilter("uncompleted")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "uncompleted" ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}
                  >
                    Incomplete
                  </button>
                  <button
                    onClick={() => setFilter("new")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "new" ? "bg-white dark:bg-slate-700 text-slate-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}
                  >
                    New
                  </button>
                  <button
                    onClick={() =>
                      setPriorityFilter((prev) =>
                        prev === "priority" ? "all" : "priority"
                      )
                    }
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${priorityFilter === "priority" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}
                  >
                    <StarIcon style={{ fontSize: 16 }} /> Priority
                  </button>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  {selectedIds.length > 0 && (
                    <>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {selectedIds.length} selected
                      </span>
                      <button
                        onClick={(e) => handleBulkStatus(e, true)}
                        className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/50 rounded-md hover:bg-green-200 dark:hover:bg-green-900 transition-colors"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={(e) => handleBulkStatus(e, false)}
                        className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 dark:bg-orange-900/50 rounded-md hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors"
                      >
                        Mark Incomplete
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleImportClick}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                  >
                    <PublishIcon style={{ fontSize: 18 }} /> Import CSV
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                  >
                    <GetAppIcon style={{ fontSize: 18 }} /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Task Grid */}
            <div className="p-4">
              <DragDropContext
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <Droppable droppableId="taskGrid">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[200px] transition-colors duration-200 ease-in-out ${snapshot.isDraggingOver ? "bg-blue-50 dark:bg-slate-700/50" : ""}`}
                    >
                      {listToRender.length === 0 && !loading ? (
                        <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400">
                          No tasks found for the current filters.
                        </div>
                      ) : (
                        listToRender.map((todo, idx) => {
                          const user = users.find(
                            (u) => String(u.id) === String(todo.userId)
                          );
                          return (
                            <Draggable
                              key={todo.id}
                              draggableId={String(todo.id)}
                              index={idx}
                            >
                              {(providedDraggable, snapshotDraggable) => (
                                <TaskCard
                                  todo={todo}
                                  user={user}
                                  provided={providedDraggable}
                                  snapshot={snapshotDraggable}
                                  isSelected={selectedIds.includes(todo.id)}
                                  onCheckboxChange={() =>
                                    handleSelectTask(todo.id)
                                  }
                                  onStatusToggle={() => {
                                    let next =
                                      todo.completed === null
                                        ? false
                                        : todo.completed === false
                                          ? true
                                          : null;
                                    handleToggle(todo.id, next);
                                  }}
                                  changingStatusId={changingStatusId}
                                  onPriorityToggle={() =>
                                    handleTogglePriority(todo)
                                  }
                                  changingPriorityId={changingPriorityId}
                                  onViewDetails={() => {
                                    setSelectedTask(todo);
                                    setShowDetail(true);
                                  }}
                                  onEdit={() => {
                                    setEditingId(todo.id);
                                    setEditText(todo.todo);
                                  }}
                                  onDelete={() => handleDelete(todo.id)}
                                  editingId={editingId}
                                  editText={editText}
                                  setEditText={setEditText}
                                  handleSaveEdit={() =>
                                    handleEdit(todo.id, editText)
                                  }
                                  handleCancelEdit={() => setEditingId(null)}
                                />
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {/* Loading indicator */}
              {loading && todos.length > 0 && (
                <div className="flex justify-center items-center py-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                  <CircularProgress
                    size={24}
                    color="inherit"
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    Loading...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {!dragActive && totalPages > 1 && (
            <div className="mt-6 mb-6 flex justify-center items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon fontSize="small" />{" "}
                <span className="ml-1">Previous</span>
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {" "}
                Page {page} of {totalPages}{" "}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="mr-1">Next</span>{" "}
                <ChevronRightIcon fontSize="small" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Hidden Input for CSV Import */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Task Detail Modal */}
      {showDetail && selectedTask && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity animate-fade-in"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-lg m-4 transform transition-all animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Task Details
              </h3>
              <button
                onClick={() => setShowDetail(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Task ID
                </span>
                <span className="w-2/3">{selectedTask.id}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Task
                </span>
                <span className="w-2/3 break-words">{selectedTask.todo}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Assigned to
                </span>
                <span className="w-2/3">
                  {users.find(
                    (u) => String(u.id) === String(selectedTask.userId)
                  )?.username || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Priority
                </span>
                <span className="w-2/3">
                  {selectedTask.priority ? "High ⭐" : "Normal"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Status
                </span>
                <span
                  className={`w-2/3 font-semibold ${selectedTask.completed === true ? "text-green-600 dark:text-green-400" : selectedTask.completed === false ? "text-orange-500 dark:text-orange-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {selectedTask.completed === true
                    ? "Completed"
                    : selectedTask.completed === false
                      ? "Incomplete"
                      : "New"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Created At
                </span>
                <span className="w-2/3">
                  {selectedTask.createdAt
                    ? new Date(selectedTask.createdAt).toLocaleString("vi-VN")
                    : "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/3 font-medium text-slate-500 dark:text-slate-400">
                  Last Updated
                </span>
                <span className="w-2/3">
                  {selectedTask.updatedAt
                    ? new Date(selectedTask.updatedAt).toLocaleString("vi-VN")
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="mt-8 text-right">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all"
                onClick={() => setShowDetail(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
