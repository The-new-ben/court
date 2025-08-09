import React, { useState, useCallback, useRef, useEffect } from "react";
import Header from "./src/components/Header";
import { CaseInfoPanel } from "./components/CaseInfoPanel";
import { TranscriptPanel } from "./components/TranscriptPanel";
import { UserInputPanel } from "./components/UserInputPanel";
import { AIAssistantPanel } from "./components/AIAssistantPanel";
import { VideoPanel } from "./components/VideoPanel";
import { AudiencePanel } from "./components/AudiencePanel";
import VerdictVote from "./src/components/viewer/VerdictVote";
import type {
  TranscriptEntry,
  Role,
  AIHistoryEntry,
  AIResponse,
} from "./types";
import { getAiResponse } from "./services/geminiService";
import { demoScript, DemoActionType } from "./services/demoScript";

export default function App() {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [aiHistory, setAiHistory] = useState<AIHistoryEntry[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const demoTimeoutRef = useRef<number[]>([]);

  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stopDemo = useCallback(() => {
    demoTimeoutRef.current.forEach(clearTimeout);
    demoTimeoutRef.current = [];
    setIsDemoRunning(false);
  }, []);

  // Cleanup timeouts on component unmount
  useEffect(() => {
    return () => {
      demoTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleVote = useCallback((party: "plaintiff" | "defendant") => {
    setVotes((prev) => ({ ...prev, [party]: prev[party] + 1 }));
  }, []);

  const handleStatementSubmit = useCallback(
    (role: Role, name: string, text: string) => {
      const newEntry = {
        role,
        name,
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
  const handleStatementSubmit = useCallback((role: Role, name: string, text: string) => {
    const newEntry = {
      role,
      name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTranscript(prev => [...prev, { ...newEntry, id: prev.length + 1 }]);
  }, []);

  const handleAiPromptSubmit = useCallback(async (prompt: string, useSearch: boolean, systemInstruction?: string) => {
    setIsAiLoading(true);
    const fullTranscriptText = transcriptRef.current.map(entry => `${entry.role} (${entry.name}): ${entry.text}`).join('\n');
    
    try {
      const response: AIResponse = await getAiResponse(prompt, fullTranscriptText, useSearch, systemInstruction);
      setAiHistory(prev => [...prev, { prompt, response }]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorResponse: AIResponse = {
        text: "I'm sorry, I encountered an error. Please check the console for details or try again later."
      };
      setTranscript((prev) => [...prev, { ...newEntry, id: prev.length + 1 }]);
    },
    [],
  );

  const handleAiPromptSubmit = useCallback(
    async (prompt: string, useSearch: boolean, systemInstruction?: string) => {
      setIsAiLoading(true);
      const fullTranscriptText = transcriptRef.current
        .map((entry) => `${entry.role} (${entry.name}): ${entry.text}`)
        .join("\n");

      try {
        const response: AIResponse = await getAiResponse(
          prompt,
          fullTranscriptText,
          useSearch,
          systemInstruction,
        );
        setAiHistory((prev) => [...prev, { prompt, response }]);
      } catch (error) {
        console.error("AI Error:", error);
        const errorResponse: AIResponse = {
          text: "I'm sorry, I encountered an error. Please check the console for details or try again later.",
        };
        setAiHistory((prev) => [...prev, { prompt, response: errorResponse }]);
      } finally {
        setIsAiLoading(false);
      }
    },
    [],
  );

  const startDemo = useCallback(() => {
    stopDemo();
    setIsDemoRunning(true);

    // Reset state for demo
    setTranscript([]);
    setAiHistory([]);

    let cumulativeDelay = 500;

    demoScript.forEach((action, index) => {
      cumulativeDelay += action.delay;
      const timeoutId = window.setTimeout(() => {
        switch (action.type) {
          case DemoActionType.TRANSCRIPT:
            if (action.role && action.name && action.text) {
              handleStatementSubmit(action.role, action.name, action.text);
            }
            break;
          case DemoActionType.AI_ACTION:
            let aiPrompt = action.prompt || "";
            let systemInstruction = action.systemInstruction;
            let useSearch = action.useSearch || false;

            if (action.isQuickAction) {
              if (action.quickActionType === "summarize") {
                aiPrompt =
                  "Please provide a concise summary of the court proceedings based on the transcript so far.";
                systemInstruction =
                  "You are a helpful AI legal assistant integrated into a virtual courtroom application. Your task is to summarize court transcripts accurately and neutrally.";
              } else {
                aiPrompt =
                  "Please analyze the transcript and identify the key arguments presented by both the Plaintiff and the Defendant. Present them clearly.";
                systemInstruction =
                  "Your task is to extract and list key legal arguments from a court transcript.";
              }
            }
            handleAiPromptSubmit(aiPrompt, useSearch, systemInstruction);
            break;
          case DemoActionType.PAUSE:
            // This is just a delay, do nothing.
            break;
        }

        if (index === demoScript.length - 1) {
          setTimeout(() => setIsDemoRunning(false), 500);
        }
      }, cumulativeDelay);
      demoTimeoutRef.current.push(timeoutId);
    });
  }, [stopDemo, handleStatementSubmit, handleAiPromptSubmit]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header
        onStartDemo={startDemo}
        onStopDemo={stopDemo}
        isDemoRunning={isDemoRunning}
      />
      <main className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <CaseInfoPanel />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <VideoPanel />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 flex-grow flex flex-col h-[calc(100vh-480px)] lg:h-[calc(100vh-420px)]">
              <TranscriptPanel transcript={transcript} />
              <UserInputPanel
                onSubmit={handleStatementSubmit}
                disabled={isDemoRunning}
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <AudiencePanel votes={votes} onVote={handleVote} />
            <VerdictVote caseId="demo" />
            <AIAssistantPanel
              history={aiHistory}
              isLoading={isAiLoading}
              onSubmit={handleAiPromptSubmit}
              disabled={isDemoRunning}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
