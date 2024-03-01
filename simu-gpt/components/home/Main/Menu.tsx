"use client";
import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { ActionType } from "@/reducers/AppReducer";
import React from "react";
import { LuPanelLeft } from "react-icons/lu";

export default function Menu() {
  const {
    state: { displayNavigation },
    dispatch,
  } = useAppContext(); // 获取状态更新函数
  return (
    <Button
      icon={LuPanelLeft}
      className={`${displayNavigation ? "hidden" : ""} fixed left-2 `}
      variant="outline"
      onClick={() => {
        dispatch({
          type: ActionType.UPDATE,
          field: "displayNavigation",
          value: true,
        });
      }}
    ></Button>
  );
}
