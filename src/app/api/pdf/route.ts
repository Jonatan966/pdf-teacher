import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TokenTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { NextResponse } from "next/server";
import { supabaseClient } from "@/services/supabase";
import { openAiEmbeddings } from "@/services/open-ai";
import { blobToMD5 } from "@/utils/blob-to-md5";

export async function POST(req: Request) {
  const data = await req.formData();
  const pdf = data.get("pdf") as Blob;

  const hash = await blobToMD5(pdf);

  const res = new NextResponse(
    JSON.stringify({
      hash,
    })
  );

  res.cookies.set("pdf-teacher:hash", hash, { path: "/" });

  const loader = new PDFLoader(pdf);

  const docs = await loader.load();

  const queryResult = await supabaseClient
    .from("documents")
    .select("*")
    .eq("metadata->>hash", hash)
    .limit(1);

  if ((queryResult.data?.length || 0) > 0) {
    return res;
  }

  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 600,
    chunkOverlap: 0,
  });

  const splittedDocuments = (await splitter.splitDocuments(docs)).map(
    (doc) => ({
      ...doc,
      metadata: { ...doc.metadata, hash },
      pageContent: doc.pageContent.replaceAll("\n", ""),
    })
  );

  await SupabaseVectorStore.fromDocuments(splittedDocuments, openAiEmbeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });

  return res;
}
