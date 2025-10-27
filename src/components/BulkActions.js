import React from "react";

const BulkActions = ({
  selectedIds,
  handleBulkStatus,
  handleBulkDelete,
  exportToCSV,
}) => {
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="max-w-md mx-auto md:max-w-full md:mx-0 flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
      <button
        className="flex-1 px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
        onClick={() => handleBulkStatus(true)}
        disabled={!hasSelection}
      >
        Mark as completed
      </button>
      <button
        className="flex-1 px-3 py-2 bg-orange-600 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
        onClick={() => handleBulkStatus(false)}
        disabled={!hasSelection}
      >
        Mark as incomplete
      </button>
      <button
        className="flex-1 px-3 py-2 bg-yellow-400 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
        onClick={() => handleBulkStatus(null)}
        disabled={!hasSelection}
      >
        Mark as new
      </button>
      <button
        className="flex-1 px-3 py-2 bg-red-500 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
        onClick={handleBulkDelete}
        disabled={!hasSelection}
      >
        Delete selected
      </button>
      <button
        className="flex-1 px-3 py-2 bg-blue-800 text-white rounded h-12 whitespace-nowrap"
        onClick={exportToCSV}
      >
        Export CSV 🡇
      </button>
    </div>
  );
};

export default React.memo(BulkActions);
