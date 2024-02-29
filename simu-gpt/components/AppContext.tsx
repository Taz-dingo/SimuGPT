"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

// 状态类型
type State = {
  displayNavigation: boolean;
};

// app上下文参数类型
type AppContextProps = {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
};

// 创建上下文对象
const AppContext = createContext<AppContextProps | null>(null);

// 获取context封装
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
// 在父组件中提供上下文数据
export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState({ displayNavigation: true });
  // 用useMemo减少不必要计算
  const contextValue = useMemo(() => {
    return { state, setState };
  }, [state, setState]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
