import Button from "@/components/common/Button";
import React, { useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { PiLightningFill, PiStopBold } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuidv4 } from "uuid";
import { Message, MessageRequestBody } from "@/types/chat";
import { useAppContext } from "@/components/AppContext";
import { ActionType } from "@/reducers/AppReducer";

export default function ChatInput() {
  const [messageText, setMessageText] = useState("");
  const stopRef = useRef(false);
  const {
    state: { messageList, currentModel, streamingId },
    dispatch,
  } = useAppContext();

  async function createOrUpdateMessage(message: Message) {
    const response = await fetch("/api/message/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    // 检查响应状态
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { data } = await response.json();
    return data.message;
  }

  async function send() {
    const message = await createOrUpdateMessage({
      id: "",
      role: "user",
      content: messageText,
      chatId: "",
    });
    dispatch({ type: ActionType.ADD_MESSAGE, message });
    // 当前消息和历史消息
    const messages = messageList.concat([message]);
    doSend(messages);
  }

  async function resend() {
    const messages = [...messageList];
    if (
      messages.length !== 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      dispatch({
        type: ActionType.REMOVE_MESSAGE,
        message: messages[messages.length - 1],
      });
      // 临时的消息列表也需要去除最后一条消息
      messages.splice(messages.length - 1, 1);
    }
    doSend(messages);
  }

  // 发送请求
  async function doSend(messages: Message[]) {
    // 请求体，把 text JSON序列化
    const body: MessageRequestBody = { messages, model: currentModel };
    setMessageText("");
    const controller = new AbortController();
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    // 检查响应状态
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    // 检查响应内容
    if (!response.body) {
      console.log("No response body");
      return;
    }
    // 请求成功后添加assistant消息
    const responseMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: "",
      chatId: "",
    };
    dispatch({ type: ActionType.ADD_MESSAGE, message: responseMessage });
    // 获取响应内容时候，添加steamingId
    dispatch({
      type: ActionType.UPDATE,
      field: "steamingId",
      value: responseMessage.id,
    });
    // 读取响应内容
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let content = "";
    while (!done) {
      if (stopRef.current) {
        stopRef.current = false;
        controller.abort();
        break;
      }
      const result = await reader.read();
      done = result.done;
      // 追加内容
      const chunk = decoder.decode(result.value);
      content += chunk;
      // 更新消息内容
      dispatch({
        type: ActionType.UPDATE_MESSAGE,
        message: { ...responseMessage, content },
      });
    }
    // 获取结束后，清除steamingId
    dispatch({
      type: ActionType.UPDATE,
      field: "steamingId",
      value: "",
    });

    setMessageText("");
  }

  return (
    <div className="absolute bottom-0 inset-x-0  bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4">
        {/* 默认不显示，消息列表有内容时显示 */}
        {messageList.length !== 0 &&
          // 正在响应时显示停止生成，否则显示重新生成
          (streamingId !== "" ? (
            <Button
              icon={PiStopBold}
              variant="primary"
              className="font-medium"
              onClick={() => (stopRef.current = true)}
            >
              停止生成
            </Button>
          ) : (
            <Button
              icon={MdRefresh}
              variant="primary"
              className="font-medium"
              onClick={() => resend()}
            >
              重新生成
            </Button>
          ))}
        <div className="flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4">
          <div className="mx-3 mb-2.5">
            <PiLightningFill />
          </div>
          <TextareaAutosize
            className="outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0"
            placeholder="输入一条消息..."
            rows={1}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <Button
            className="mx-3 !rounded-lg"
            icon={FiSend}
            // 消息为空、正在响应中禁用发送按钮
            disabled={messageText.trim() === "" || streamingId !== ""}
            variant="primary"
            onClick={() => send()}
          />
        </div>
        <footer className=" text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6">
          ©{new Date().getFullYear()}&nbsp;SimuGPT&nbsp;-&nbsp;
          <a
            className="font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 drak:border-gray-200 dark:hover:border-gray-200/0 animated-underline"
            href="https://github.com/Taz-dingo"
            target="_blank"
          >
            Tazdingo
          </a>
        </footer>
      </div>
    </div>
  );
}
