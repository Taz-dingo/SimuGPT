import React, { ComponentPropsWithoutRef } from "react";
import { IconType } from "react-icons";

// 引入icon和样式，重新定义Button类型
type ButtonProps = {
  icon?: IconType; //（可选）icon
  variant?: "default" | "outline" | "text" | "primary"; // （可选）样式属性
} & ComponentPropsWithoutRef<"button">; // 继承React.ComponentPropsWithoutRef<"button">类型

export default function Button({
  children,
  className = "", // 给一个默认的string
  icon: Icon,
  variant = "default", // 给一个默认值
  ...props
}: ButtonProps) {
  return (
    // 封装基础组件，属性都可以透传进来
    <button
      className={`inline-flex items-center min-w-[38px] min-h-[38px] rounded px-3 py-1.5  
      ${
        variant === "default"
          ? "text-black dark:text-gray-300 bg-gray-50 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-900"
          : variant === "outline"
          ? "border border-gray-300 dark:border-gray-600 text-black dark:text-gray-300 bg-gray-50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          : variant === 'primary' 
          ? "bg-primary-500 text-white hover:bg-primary-600 hover:text-white shadow-sm"
          : "text-black dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
      }
      ${className}`}
      {...props}
    >
      {Icon && <Icon className={`text-lg ${children ? "mr-1" : ""} `} />}
      {children}
    </button>
  );
}
