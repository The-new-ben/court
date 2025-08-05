export enum Role {
  JUDGE = "Judge",
  PLAINTIFF = "Plaintiff",
  DEFENDANT = "Defendant",
  WITNESS = "Witness",
  AUDIENCE = "Audience",
  AI = "AI Legal Assistant",
}

export interface TranscriptEntry {
  id: number;
  role: Role;
  name: string;
  text: string;
  timestamp: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface AIResponse {
  text: string;
  sources?: GroundingChunk[];
}

export interface AIHistoryEntry {
  prompt: string;
  response: AIResponse;
}
