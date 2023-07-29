"use client";

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

export function Chat() {
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
          <Button style={{ margin: 0 }} size="icon" variant="destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>

      <div className="flex-1 flex flex-col max-w-[350px] py-4 text-sm gap-2 mb-48">
        <p className="self-end text-white bg-zinc-700 rounded-md p-2 max-w-[90%]">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio
          ratione illum vitae? Beatae quae tenetur eum suscipit quibusdam
          aperiam natus, aliquid cum iure temporibus at dolor harum mollitia
          soluta sequi.
        </p>
        <p className="self-start text-zinc-900 bg-zinc-300 rounded-md p-2 max-w-[90%]">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio
          ratione illum vitae? Beatae quae tenetur eum suscipit quibusdam
          aperiam natus, aliquid cum iure temporibus at dolor harum mollitia
          soluta sequi.
        </p>
      </div>

      <Card className="max-w-[350px] fixed bottom-4">
        <CardContent>
          <form className="mt-6 flex flex-col gap-2">
            <Input type="file" />
            <div className="flex w-full gap-2">
              <Input placeholder="O que quer perguntar?" />
              <Button>Enviar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
