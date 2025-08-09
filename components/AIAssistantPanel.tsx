
import React, { useState, useRef, useEffect } from 'react';
import type { AIHistoryEntry, AIResponse } from '../types';
import { Spinner } from '../Spinner';
import { SearchIcon } from '../SearchIcon';
import React, { useState, useRef, useEffect } from "react";
import type { AIHistoryEntry, AIResponse } from "../types";
import { Spinner } from "./common/Spinner";
import { SearchIcon } from "./icons/SearchIcon";

interface AIAssistantPanelProps {
  history: AIHistoryEntry[];
  isLoading: boolean;
  onSubmit: (
    prompt: string,
    useSearch: boolean,
    systemInstruction?: string,
  ) => void;
  disabled?: boolean;
}

const AIResponseDisplay: React.FC<{ response: AIResponse }> = ({
  response,
}) => {
  return (
    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
      <p className="whitespace-pre-wrap">{response.text}</p>
      {response.sources && response.sources.length > 0 && (
        <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-2">
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Sources:
          </h4>
          <ul className="space-y-1">
            {response.sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                >
                  {index + 1}. {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  history,
  isLoading,
  onSubmit,
  disabled = false,
}) => {
  const [prompt, setPrompt] = useState("");
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const handleQuickAction = (action: "summarize" | "arguments") => {
    let systemInstruction =
      "You are a helpful AI legal assistant integrated into a virtual courtroom application.";
    let userPrompt = "";

    if (action === "summarize") {
      userPrompt =
        "Please provide a concise summary of the court proceedings based on the transcript so far.";
      systemInstruction +=
        " Your task is to summarize court transcripts accurately and neutrally.";
    } else {
      userPrompt =
        "Please analyze the transcript and identify the key arguments presented by both the Plaintiff and the Defendant. Present them clearly.";
      systemInstruction +=
        " Your task is to extract and list key legal arguments from a court transcript.";
    }
    onSubmit(userPrompt, false, systemInstruction);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const systemInstruction =
        "You are an AI Legal Research assistant. Use the provided search results to answer the user's question about legal matters. Provide citations from your sources.";
      onSubmit(prompt, true, systemInstruction);
      setPrompt("");
    }
  };

  const isFormDisabled = isLoading || disabled;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white">
          AI Legal Assistant
        </h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {history.map((entry, index) => (
          <div key={index}>
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              {entry.prompt}
            </p>
            <AIResponseDisplay response={entry.response} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center p-4">
            <Spinner />
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Thinking...
            </p>
          </div>
        )}
        <div ref={endOfHistoryRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <div>
          <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Quick Actions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickAction("summarize")}
              className="flex-1 text-sm px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFormDisabled}
            >
              Summarize
            </button>
            <button
              onClick={() => handleQuickAction("arguments")}
              className="flex-1 text-sm px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFormDisabled}
            >
              Key Arguments
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Legal Research
          </p>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                disabled ? "Demo in progress..." : "Ask a legal question..."
              }
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 disabled:opacity-50"
              disabled={isFormDisabled}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={isFormDisabled || !prompt.trim()}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
