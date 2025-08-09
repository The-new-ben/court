import React from "react";

export const Logo: React.FC = () => {
  return (
    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 font-serif tracking-tight">
      <span>jus</span>
      <span className="relative inline-block text-blue-600 dark:text-blue-400">
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full">
          <span className="absolute -left-1 top-0 w-2 h-2 border-2 border-gray-400 dark:border-gray-500 rounded-full bg-white dark:bg-gray-800 transform -translate-y-1/2"></span>
          <span className="absolute -right-1 top-0 w-2 h-2 border-2 border-gray-400 dark:border-gray-500 rounded-full bg-white dark:bg-gray-800 transform -translate-y-1/2"></span>
        </span>
        T
      </span>
      <span>ice</span>
      <span className="text-lg font-sans font-medium text-gray-500 dark:text-gray-400">
        .com
      </span>
    </h1>
  );
};
