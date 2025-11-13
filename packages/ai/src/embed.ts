import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embed(text: string): Promise<number[]> {
  if (!client.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  const vector = response.data[0]?.embedding;
  if (!vector) {
    throw new Error("Embedding response missing data");
  }

  return vector as number[];
}
