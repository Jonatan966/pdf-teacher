import { Chat } from "@/components/domain/chat";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center px-2">
      <Chat />
    </div>
  );
}
