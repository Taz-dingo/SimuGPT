"use client";

import { useAppContext } from "@/components/AppContext";
import ChatInput from "./ChatInput";
import Menu from "./Menu";
import MessageList from "./MessageList";
import Welcome from "./Welcome";

export default function Main() {
  const {
    state: { selectedChat },
  } = useAppContext();

  return (
    <div className="relative flex-1">
      <main className="overflow-y-auto p-2 w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <Menu />
        {!selectedChat && <Welcome />}
        <MessageList />
        <ChatInput />
      </main>
    </div>
  );
}
