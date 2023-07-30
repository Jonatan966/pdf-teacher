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
import { FileArchive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chat() {
  const formRef = useRef<HTMLFormElement>(null);

  const [pdfHash, setPdfHash] = useState("");
  const {
    input,
    messages,
    isLoading,
    setInput,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat();

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pdfHash) {
      const response = await fetch("/api/pdf", {
        method: "POST",
        body: new FormData(event.target as HTMLFormElement),
      });

      const data = await response.json();

      setPdfHash(data.hash);
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
      <Card className="sticky top-4 mb-4">
        <CardHeader className="flex-row items-start min-w-[350px]">
          <div className="flex-1">
            <CardTitle className="flex gap-2">
              <FileArchive /> PDF Teacher
            </CardTitle>
            <CardDescription>Converse com seu PDF!</CardDescription>
          </div>
          <Button
            style={{ margin: 0 }}
            size="icon"
            variant="destructive"
            onClick={onClearChat}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>

      <div className="flex-1 flex flex-col w-[350px] py-4 text-sm gap-2 mb-48">
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

      <Card className="max-w-[350px] fixed bottom-4">
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
            />

            <div className="flex w-full gap-2">
              <Input
                placeholder="O que quer perguntar?"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button disabled={isLoading}>Enviar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
