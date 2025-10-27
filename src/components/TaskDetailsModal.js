import React from "react";

const TaskDetailsModal = ({ task, user, onClose }) => {
  if (!task) return null;

  const statusText =
    task.completed === null || task.completed === undefined
      ? "New"
      : task.completed === false
        ? "Incomplete"
        : "Completed";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg min-w-[320px] max-w-lg w-full">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Task Details
        </h3>
        <div className="space-y-3 text-gray-900 dark:text-gray-100">
          <p>
            <b>User:</b> {user?.username || "N/A"}
          </p>
          <p>
            <b>Task:</b> {task.todo}
          </p>
          <p>
            <b>Priority:</b> {task.priority ? "Priority ⭐" : "Normal"}
          </p>
          <p>
            <b>Status:</b> {statusText}
          </p>
        </div>
        <button
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
