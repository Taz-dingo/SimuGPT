import { PiChatBold, PiTrashBold } from "react-icons/pi";

import React, { useEffect, useState } from "react";
import { Chat } from "@/types/chat";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import { useEventBusContext } from "@/components/EventBusContext";
import { useAppContext } from "@/components/AppContext";
import { ActionType } from "@/reducers/AppReducer";

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
  const [title, setTitle] = useState(item.title);
  const { publish } = useEventBusContext();
  const { dispatch } = useAppContext();

  useEffect(() => {
    setEditing(false);
  }, [selected]);

  async function updateChat() {
    const response = await fetch("/api/chat/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({ id: item.id, title }),
    });
    // 检查响应状态
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      publish("fetchChatList");
    }
  }

  async function deleteChat() {
    const response = await fetch(`/api/chat/delete?id=${item.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // 检查响应状态
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      // 数据库更新
      publish("fetchChatList");
      // 本地更新
      // 清除当前(选中)对话
      dispatch({
        type: ActionType.UPDATE,
        field: "selectedChat",
        value: null,
      });
    }
  }

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
          value={title}
          className="bg-transparent outline-none overflow-hidden"
          onChange={(e) => setTitle(e.target.value)}
        />
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
                    deleteChat();
                  } else {
                    updateChat();
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
