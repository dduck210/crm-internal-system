import React from "react";

const FilterButton = ({
  label,
  value,
  activeValue,
  onClick,
  colorClass,
  activeColorClass,
}) => (
  <button
    className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
      activeValue === value
        ? activeColorClass
        : `bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 ${colorClass}`
    }`}
    onClick={() => onClick(value)}
  >
    {label}
  </button>
);

const FilterControls = ({
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
}) => {
  return (
    <div className="max-w-md mx-auto md:max-w-full md:mx-0 flex flex-wrap gap-2 justify-center md:justify-start mb-2">
      <FilterButton
        label="All"
        value="all"
        activeValue={filter}
        onClick={(val) => setFilter("filter", val)}
        activeColorClass="bg-blue-600 text-white shadow"
        colorClass="hover:bg-blue-50 dark:hover:bg-gray-600"
      />
      <FilterButton
        label="Completed"
        value="completed"
        activeValue={filter}
        onClick={(val) => setFilter("filter", val)}
        activeColorClass="bg-green-600 text-white shadow"
        colorClass="hover:bg-green-50 dark:hover:bg-gray-600"
      />
      <FilterButton
        label="Incomplete"
        value="uncompleted"
        activeValue={filter}
        onClick={(val) => setFilter("filter", val)}
        activeColorClass="bg-orange-500 text-white shadow"
        colorClass="hover:bg-orange-50 dark:hover:bg-gray-600"
      />
      <FilterButton
        label="New"
        value="new"
        activeValue={filter}
        onClick={(val) => setFilter("filter", val)}
        activeColorClass="bg-yellow-400 text-white shadow"
        colorClass="hover:bg-yellow-50 dark:hover:bg-gray-600"
      />

      <span className="w-px bg-gray-300 dark:bg-gray-600 mx-2"></span>

      <FilterButton
        label="All Priority"
        value="all"
        activeValue={priorityFilter}
        onClick={(val) => setFilter("priorityFilter", val)}
        activeColorClass="bg-purple-600 text-white shadow"
        colorClass="text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-600"
      />
      <FilterButton
        label="Priority ⭐"
        value="priority"
        activeValue={priorityFilter}
        onClick={(val) => setFilter("priorityFilter", val)}
        activeColorClass="bg-yellow-400 text-white shadow"
        colorClass="text-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-gray-600"
      />
      <FilterButton
        label="Normal"
        value="normal"
        activeValue={priorityFilter}
        onClick={(val) => setFilter("priorityFilter", val)}
        activeColorClass="bg-gray-600 text-white shadow"
        colorClass="text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      />
    </div>
  );
};

export default React.memo(FilterControls);
