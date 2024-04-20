import { groupByDate } from "@/common/utils";
import { Chat } from "@/types/chat";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import { PiChatBold, PiTrashBold } from "react-icons/pi";
import ChatItem from "./ChatItem";
import { useEventBusContext } from "@/components/EventBusContext";

export default function ChatList() {
  const [chatList, setChatList] = useState<Chat[]>([
    {
      id: "1",
      title: "React入门实战教程",
      updateTime: Date.now(),
    },
    {
      id: "2",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "3",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "4",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "5",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "6",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "7",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "8",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "9",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "10",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "11",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "12",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "13",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "14",
      title: "如何使用Next.js创建React项目",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "15",
      title: "知行小课",
      updateTime: Date.now() + 2,
    },
  ]);
  const [selectedChat, setSelectedChat] = useState<Chat>();
  // 用useMemo缓存，只有列表变化时才重新计算分组
  const groupList = useMemo(() => {
    return groupByDate(chatList); // 按时间分组
  }, [chatList]);
  const { subscribe, unsubscribe } = useEventBusContext();

  useEffect(() => {
    const callback: EventListener = () => {
      console.log("fetchChatList");
    };
    subscribe("fetchChatList", callback);
    return () => unsubscribe("fetchChatList", callback);
  }, []);

  return (
    <div className="flex-1 mb-[48px] mt-2 flex flex-col overflow-y-auto">
      {groupList.map(([date, list]) => {
        return (
          <div key={date}>
            <div className="sticky top-0 z-10 p-3 text-sm bg-gray-900  text-gray-500">
              {date}
            </div>
            <ul>
              {list.map((item) => {
                const selected = selectedChat?.id === item.id;
                return (
                  <ChatItem
                    key={item.id}
                    item={item}
                    selected={selected}
                    onSelected={(item) => {
                      setSelectedChat(item); // 回调函数，点击之后把内部组件传递出来
                    }}
                  ></ChatItem>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
