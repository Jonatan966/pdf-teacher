import { openAiEmbeddings } from "@/services/open-ai";
import { supabaseClient } from "@/services/supabase";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

export const supabaseVectorStore = new SupabaseVectorStore(openAiEmbeddings, {
  client: supabaseClient,
  tableName: "documents",
  queryName: "match_documents",
});
