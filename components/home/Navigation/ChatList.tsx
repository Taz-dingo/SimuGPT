import { groupByDate } from "@/common/utils";
import { Chat } from "@/types/chat";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import { PiChatBold, PiTrashBold } from "react-icons/pi";
import ChatItem from "./ChatItem";
import { useEventBusContext } from "@/components/EventBusContext";
import { useAppContext } from "@/components/AppContext";
import { ActionType } from "@/reducers/AppReducer";

export default function ChatList() {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const pageRef = useRef(1); // 用useMemo缓存，只有列表变化时才重新计算分组
  const groupList = useMemo(() => {
    return groupByDate(chatList); // 按时间分组
  }, [chatList]);
  const { subscribe, unsubscribe } = useEventBusContext();
  const {
    state: { selectedChat },
    dispatch,
  } = useAppContext();
  const loadMoreRef = useRef(null); // 加载ref
  const hasMoreRef = useRef(false); // 是否有更多数据
  const loadingRef = useRef(false); // 是否正在加载

  async function getData() {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;  // 开始请求
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response.statusText);
      loadingRef.current = false; // 请求完成后重置状态
      return;
    }
    pageRef.current++; // 发起请求后，页码+1
    const { data } = await response.json();
    hasMoreRef.current = data.hasMore;
    if (pageRef.current === 1) {
      setChatList(data.list); // 第一次请求，直接设置列表
    } else {
      setChatList((list) => list.concat(data.list)); // 非第一次请求，合并列表
    }
    loadingRef.current = false; // 请求完成后重置状态
  }

  useEffect(() => {
    let observer: IntersectionObserver;
    let div = loadMoreRef.current;
    if (div) {
      // 检测元素与视窗相交情况
      observer = new IntersectionObserver((entries) => {
        // 相交且有更多数据
        if (entries[0].isIntersecting && hasMoreRef.current) {
          getData();
        }
      });
      observer.observe(div);
    }

    return () => {
      if (observer && div) {
        observer.unobserve(div);
      }
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const callback: EventListener = () => {
      // 刷新列表
      // 且请求第一页数据（顶部）
      pageRef.current = 1;
      getData();
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
                    onSelected={(chat) => {
                      // 更新选中的chat
                      dispatch({
                        type: ActionType.UPDATE,
                        field: "selectedChat",
                        value: chat,
                      });
                    }}
                  ></ChatItem>
                );
              })}
            </ul>
          </div>
        );
      })}
      <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  );
}
