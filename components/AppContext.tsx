"use client";

import { Action, State, initState, reducer } from "@/reducers/AppReducer";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

// app上下文参数类型
type AppContextProps = {
  state: State;
  dispatch: Dispatch<Action>;
};

/* --------------------------------------------- */

// 1. 创建Context对象
const AppContext = createContext<AppContextProps | null>(null); // 初始化为null
// useContext函数封装
export function useAppContext() {
  const context = useContext(AppContext);
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
  const [state, dispatch] = useReducer(reducer, initState);
  // 用useMemo减少不必要计算(缓存计算值函数,计算用到的值的数组)
  // 如果值没有发生变化,就返回缓存值;否则调用缓存计算值函数。
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // 2.在父组件中使用<Context.Provider>包裹组件，并传递value属性来提供数据
  return (
    // contextValue通过value赋值给AppContext
    // contextValue的值更新了AppContext
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
