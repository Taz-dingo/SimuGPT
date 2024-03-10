"use client";

import { useAppContext } from "@/components/AppContext";
import Menubar from "./Menubar";
import Toolbar from "./Toolbar";
import ChatList from "./ChatList";

export default function Navigation() {
  const {
    state: { displayNavigation },
  } = useAppContext();
  return (
    <nav
      className={` ${
        displayNavigation ? "" : "hidden"
      } flex flex-col dark w-[260px] bg-gray-900 text-gray-300 h-full p-2 relative`}
    >
      <Menubar></Menubar>
      <ChatList></ChatList>
      <Toolbar></Toolbar>
    </nav>
  );
}
