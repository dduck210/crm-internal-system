import { useReducer, useMemo, useCallback } from "react";

const initialState = {
  filter: "all",
  priorityFilter: "all",
  search: "",
  searchUserId: "",
  searchUsername: "",
  page: 1,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const useFilters = (allTodos, users, isAdmin) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const setFilter = useCallback((key, value) => {
    dispatch({ type: "SET_STATE", payload: { [key]: value } });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const filteredTodos = useMemo(() => {
    return allTodos.filter((todo) => {
      const { filter, priorityFilter, search, searchUserId, searchUsername } =
        state;

      const matchUser =
        !isAdmin ||
        !searchUserId ||
        String(todo.userId) === String(searchUserId);

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
        matchUser &&
        matchFilter &&
        matchSearch &&
        matchUsername &&
        matchPriority
      );
    });
  }, [allTodos, users, isAdmin, state]);

  return {
    ...state,
    setFilter,
    setPage,
    filteredTodos,
  };
};
