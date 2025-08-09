import React from "react";
import { Logo } from "./Logo";
import { PlayIcon } from "./icons/PlayIcon";
import { StopIcon } from "./icons/StopIcon";

interface HeaderProps {
  onStartDemo: () => void;
  onStopDemo: () => void;
  isDemoRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onStartDemo,
  onStopDemo,
  isDemoRunning,
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
        <Logo />
        <button
          onClick={isDemoRunning ? onStopDemo : onStartDemo}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 transition-all ${
            isDemoRunning
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
          aria-label={isDemoRunning ? "Stop Demo" : "Start Demo"}
        >
          {isDemoRunning ? (
            <StopIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">
            {isDemoRunning ? "Stop Demo" : "Start Demo"}
          </span>
        </button>
      </div>
    </header>
  );
};
