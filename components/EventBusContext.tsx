"use client";

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

// app上下文参数类型
type EventBusContextProps = {
  subscribe: (event: string, callback: EventListener) => void;
  unsubscribe: (event: string, callback: EventListener) => void;
  publish: (event: string, data?: any) => void;
};

/* --------------------------------------------- */

// 1. 创建Context对象
const EventBusContext = createContext<EventBusContextProps>(null!);
// useContext函数封装
export function useEventBusContext() {
  const context = useContext(EventBusContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
// 在父组件中提供上下文数据
export default function AppContextProvider({
  children, // 接收子组件
}: {
  children: ReactNode;
}) {
  const [listeners, setListeners] = useState<Record<string, EventListener[]>>(
    {}
  );

  const subscribe = useCallback(
    (event: string, callback: EventListener) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
      setListeners({ ...listeners });
    },
    [listeners]
  );

  const unsubscribe = useCallback(
    (event: string, callback: EventListener) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((cb) => cb !== callback);
      }
      setListeners({ ...listeners });
    },
    [listeners]
  );

  const publish = useCallback(
    (event: string, data?: any) => {
      if (listeners[event]) {
        listeners[event].forEach((callback) => callback(data));
      }
    },
    [listeners]
  );

  // 用useMemo减少不必要计算(缓存计算值函数,计算用到的值的数组)
  // 如果值没有发生变化,就返回缓存值;否则调用缓存计算值函数。

  // 函数定义不能直接使用useMemo,需要用useCallback包裹
  const contextValue = useMemo(() => {
    return { subscribe, unsubscribe, publish };
  }, [subscribe, unsubscribe, publish]);

  // 2.在父组件中使用<Context.Provider>包裹组件，并传递value属性来提供数据
  return (
    // contextValue通过value赋值给AppContext
    // contextValue的值更新了AppContext
    <EventBusContext.Provider value={contextValue}>
      {children}
    </EventBusContext.Provider>
  );
}
