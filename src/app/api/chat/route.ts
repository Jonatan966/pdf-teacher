import { StreamingTextResponse, LangChainStream } from "ai";
import { cookies } from "next/headers";

import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { supabaseVectorStore } from "@/lib/langchain";
import { openAiChat } from "@/services/open-ai";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const targetMessage = messages.at(-1);

  const { stream, handlers } = LangChainStream();

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
