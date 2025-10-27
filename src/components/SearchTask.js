import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchTask = ({ onSearch }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        className="
          block w-full h-11 pl-10 pr-4 
          text-sm text-gray-900 dark:text-gray-200
          bg-white dark:bg-gray-700 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          placeholder:text-gray-500 dark:placeholder:text-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 focus:border-indigo-500
        "
        placeholder="Search by task name..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchTask;
