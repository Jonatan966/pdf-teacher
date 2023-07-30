import { StreamingTextResponse, LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { cookies } from "next/headers";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

// export const runtime = "edge";

const supabaseVectorStore = new SupabaseVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    client: createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_PRIVATE_KEY as string,
      {
        auth: { persistSession: false },
      }
    ),
    tableName: "documents",
    queryName: "match_documents",
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

  const pdfHash = cookies().get("pdf-teacher:hash");

  const chain = RetrievalQAChain.fromLLM(
    openAiChat,
    supabaseVectorStore.asRetriever(3, {
      hash: pdfHash?.value,
    }),
    {
      prompt,
      verbose: true,
    }
  );

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
