import React from "react";
import ModelSelected from "./ModelSelected";
import Example from "./Example";

export default function Welcome() {
  return (
    <div className="w-full mx-auto flex flex-col items-center px-4 py-20">
      <ModelSelected />
      <h1 className="mt-20 text-4xl font-bold">SimuGPT - ChatGPT免费使用</h1>
      <Example />
    </div>
  );
}
