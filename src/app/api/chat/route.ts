import { StreamingTextResponse, LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { createClient } from "redis";

// export const runtime = "edge";

const redis = createClient({
  url: "redis://127.0.0.1:6379",
});

const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    indexName: "pdfs-embeddings",
    redisClient: redis,
    keyPrefix: "pdfs:",
  }
);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const targetMessage = messages.at(-1);

  const { stream, handlers } = LangChainStream();

  const openAiChat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,
    streaming: true,
  });

  const prompt = new PromptTemplate({
    template: `
      Você responde perguntas sobre a área da tecnologia em geral.
      Use o conteúdo do PDF abaixo para responder a resposta do usuário.
      Se a resposta não for encontrada no PDF, responda que você não sabe, não tente inventar uma resposta.

      PDF:
      {context}

      Pergunta:
      {question}
    `.trim(),
    inputVariables: ["context", "question"],
  });

  const chain = RetrievalQAChain.fromLLM(
    openAiChat,
    redisVectorStore.asRetriever(3),
    {
      prompt,
    }
  );

  if (!redis.isOpen) {
    await redis.connect();
  }

  chain
    .call(
      {
        query: targetMessage.content,
      },
      [handlers]
    )
    .catch(console.log);

  return new StreamingTextResponse(stream);
}
