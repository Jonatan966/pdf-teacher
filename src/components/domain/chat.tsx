"use client";

import { useChat } from "ai/react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileArchive, Loader, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "../ui/theme-switcher";

export function Chat() {
  const formRef = useRef<HTMLFormElement>(null);

  const [pdfHash, setPdfHash] = useState("");
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const {
    input,
    messages,
    isLoading,
    setInput,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat();

  const isWaiting = isLoading || isProcessingPDF;

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pdfHash) {
      setIsProcessingPDF(true);

      const response = await fetch("/api/pdf", {
        method: "POST",
        body: new FormData(event.target as HTMLFormElement),
      });

      const data = await response.json();

      setPdfHash(data.hash);

      setIsProcessingPDF(false);
    }

    handleSubmit(event);
  }

  function onClearChat() {
    formRef.current?.reset();
    setMessages([]);
    setPdfHash("");
    setInput("");
  }

  return (
    <>
      <Card className="sticky sm:top-4 top-2 mb-4 max-w-[450px] w-full">
        <CardHeader className="flex-row items-start">
          <div className="flex-1">
            <CardTitle className="flex gap-2">
              <FileArchive /> PDF Teacher
            </CardTitle>
            <CardDescription>Converse com seu PDF!</CardDescription>
          </div>
          <div className="flex gap-2" style={{ margin: 0 }}>
            <ThemeSwitcher />
            <Button
              size="icon"
              variant="destructive"
              onClick={onClearChat}
              disabled={!messages.length}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 flex flex-col max-w-[450px] py-4 text-sm gap-2  w-full">
        {messages.map((message) => (
          <p
            key={message.id}
            className={cn(
              "  rounded-md p-2 max-w-[90%]",
              message.role === "user"
                ? "self-end text-white bg-zinc-700"
                : "self-start text-zinc-900 bg-zinc-300"
            )}
          >
            {message.content}
          </p>
        ))}
      </div>

      <Card className="max-w-[450px] w-full sticky sm:bottom-4 bottom-2 mt-4">
        {isWaiting && (
          <div className="absolute w-full h-full bg-black bg-opacity-30 z-0 flex items-center justify-center rounded-lg">
            <Loader
              className="animate-spin z-10 text-black dark:text-white"
              size={32}
            />
          </div>
        )}

        <CardContent>
          <form
            className="mt-6 flex flex-col gap-2"
            onSubmit={handleSendMessage}
            ref={formRef}
          >
            <Input
              type="file"
              name="pdf"
              accept="application/pdf"
              disabled={!!messages.length}
              required
            />

            <div className="flex w-full gap-2">
              <Input
                placeholder="O que quer perguntar?"
                value={input}
                onChange={handleInputChange}
                disabled={isWaiting}
                required
              />
              <Button disabled={isWaiting}>Enviar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
