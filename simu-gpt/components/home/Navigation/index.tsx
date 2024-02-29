"use client";

import { useAppContext } from "@/components/AppContext";
import Menubar from "./Menubar";

export default function Navigation() {
  const {
    state: { displayNavigation },
  } = useAppContext();
  return (
    <nav
      className={` ${
        displayNavigation ? "" : "hidden"
      } w-[260px] bg-gray-900 text-gray-300 h-full p-2`}
    >
      <Menubar></Menubar>
    </nav>
  );
}
