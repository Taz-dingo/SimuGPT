import { PiChatBold, PiTrashBold } from "react-icons/pi";

import React, { useEffect, useState } from "react";
import { Chat } from "@/types/chat";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";

type ChatItemProps = {
  item: Chat;
  selected: boolean;
  onSelected: (chat: Chat) => void; // 回调传递选中参数
};

export default function ChatItem({
  item,
  selected,
  onSelected,
}: ChatItemProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    setEditing(false);
  }, [selected]);

  return (
    <li
      onClick={() => {
        onSelected(item);
      }} // 如果被点击，触发onSelected把当前元素传递出去
      key={item.id}
      className={`group relative flex m-2 items-center p-3 space-x-3 cursor-pointer rounded-md hover:bg-gray-800 
                    ${selected ? "bg-gray-800 pr-[3.5em]" : ""}`}
      //   选中的对话背景变色
    >
      <div>{deleting ? <PiTrashBold /> : <PiChatBold />}</div>
      {selected && editing ? (
        <input
          autoFocus={true}
          defaultValue={item.title}
          className="bg-transparent outline-none overflow-hidden"
        ></input>
      ) : (
        <div className="flex-1 whitespace-nowrap overflow-hidden relative">
          {item.title}
          <span
            className={`group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 bg-gradient-to-l
                        ${selected ? "from-gray-800" : "from-gray-900"}`}
          ></span>
        </div>
      )}

      {selected && (
        <div className="absolute right-1">
          {editing || deleting ? (
            <>
              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  if (deleting) {
                    console.log("deleted");
                  } else {
                    console.log("editing");
                  }
                  setEditing(false);
                  setDeleting(false);
                  e.stopPropagation();
                }}
              >
                <MdCheck />
              </button>

              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  setEditing(false);
                  setDeleting(false);
                  e.stopPropagation();
                }}
              >
                <MdClose />
              </button>
            </>
          ) : (
            <>
              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  setEditing(true);
                  e.stopPropagation();
                }}
              >
                <AiOutlineEdit />
              </button>

              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  setDeleting(true);
                  e.stopPropagation();
                }}
              >
                <MdDeleteOutline />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
