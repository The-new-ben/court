import { Role } from "../types";

export enum DemoActionType {
  TRANSCRIPT,
  VOTE,
  AI_ACTION,
  PAUSE,
}

export interface DemoAction {
  type: DemoActionType;
  delay: number; // ms to wait after the previous action
  // for TRANSCRIPT
  role?: Role;
  name?: string;
  text?: string;
  // for VOTE
  party?: "plaintiff" | "defendant";
  voteCount?: number;
  // for AI_ACTION
  isQuickAction?: boolean;
  quickActionType?: "summarize" | "arguments";
  prompt?: string;
  useSearch?: boolean;
  systemInstruction?: string;
}

const names = {
  judge: "Hon. Ada Lovelace",
  plaintiff: "Pixel Pete",
  defendant: "Anya Petrova",
  witness: "Dr. Evelyn Reed",
};

export const demoScript: DemoAction[] = [
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 1500,
    role: Role.JUDGE,
    name: names.judge,
    text: "This court is now in session for case 2024-COPY-0815, Pixel Perfect versus Petrova. Are both parties ready?",
  },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 3000,
    role: Role.PLAINTIFF,
    name: names.plaintiff,
    text: "Yes, Your Honor. The plaintiff is ready.",
  },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 2000,
    role: Role.DEFENDANT,
    name: names.defendant,
    text: "Ready for the defendant, Your Honor.",
  },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 4000,
    role: Role.JUDGE,
    name: names.judge,
    text: "Very well. Mr. Pete, you may begin with your opening statement.",
  },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 7000,
    role: Role.PLAINTIFF,
    name: names.plaintiff,
    text: "Thank you, Your Honor. The case is simple: Ms. Petrova, a renowned digital artist, built her most famous work, 'Urban Twilight', directly on top of a copyrighted photograph taken by my studio, Pixel Perfect. She did so without permission, without credit, and without compensation. This is a clear case of copyright infringement.",
  },
  { type: DemoActionType.VOTE, delay: 1000, party: "plaintiff", voteCount: 25 },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 7000,
    role: Role.DEFENDANT,
    name: names.defendant,
    text: "Your Honor, what Mr. Pete calls infringement, I call art. I did use his photograph as a reference, yes, but I transformed it. I changed the lighting, the mood, the color, and added numerous original elements to create a new piece with a completely different message. This is protected as 'transformative use'.",
  },
  { type: DemoActionType.VOTE, delay: 1000, party: "defendant", voteCount: 30 },
  {
    type: DemoActionType.AI_ACTION,
    delay: 5000,
    isQuickAction: true,
    quickActionType: "summarize",
  },
  { type: DemoActionType.PAUSE, delay: 8000 },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 3000,
    role: Role.JUDGE,
    name: names.judge,
    text: "The AI summary is noted. Plaintiff, please call your first witness.",
  },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 2000,
    role: Role.PLAINTIFF,
    name: names.plaintiff,
    text: "I call Dr. Evelyn Reed to the stand.",
  },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 8000,
    role: Role.WITNESS,
    name: names.witness,
    text: "Upon forensic analysis of the digital files, it's clear that Ms. Petrova's artwork contains a direct, pixel-for-pixel copy of the core elements of Pixel Perfect's photograph. The underlying architecture of the image is identical. The changes, while aesthetically pleasing, are layered on top of the original copyrighted work.",
  },
  { type: DemoActionType.VOTE, delay: 1000, party: "plaintiff", voteCount: 60 },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 8000,
    role: Role.DEFENDANT,
    name: names.defendant,
    text: "Dr. Reed, is it not true that the market value and artistic interpretation of my work are vastly different from the original photograph? Isn't the purpose of art to reinterpret reality? My work is displayed in galleries; the original was a stock photo. Isn't that transformation?",
  },
  { type: DemoActionType.VOTE, delay: 1000, party: "defendant", voteCount: 50 },
  {
    type: DemoActionType.AI_ACTION,
    delay: 4000,
    useSearch: true,
    prompt:
      "What is the 'transformative use' standard for copyright in digital art according to US law?",
  },
  { type: DemoActionType.PAUSE, delay: 10000 },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 5000,
    role: Role.PLAINTIFF,
    name: names.plaintiff,
    text: "The evidence is clear. No amount of artistic jargon can hide the fact that a stolen foundation was used. We ask the court to find in our favor.",
  },
  { type: DemoActionType.VOTE, delay: 1000, party: "plaintiff", voteCount: 20 },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 5000,
    role: Role.DEFENDANT,
    name: names.defendant,
    text: "Art evolves. It builds on what came before. My work created new meaning and new value, the very definition of transformative. I ask the court to support artistic freedom.",
  },
  { type: DemoActionType.VOTE, delay: 1000, party: "defendant", voteCount: 25 },
  {
    type: DemoActionType.TRANSCRIPT,
    delay: 4000,
    role: Role.JUDGE,
    name: names.judge,
    text: "Thank you both. The court will now deliberate on the arguments and evidence presented. This session is adjourned.",
  },
];
