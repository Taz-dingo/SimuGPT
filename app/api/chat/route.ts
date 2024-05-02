import { sleep } from "@/common/utils";
import client from "@/lib/openai";
import { MessageRequestBody } from "@/types/chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { messages, model } = (await request.json() as MessageRequestBody);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            // 过滤掉无用属性，只保留content和role，否则会报错 (OpenAI API)
            const newMessages = messages.map(message => ({ role: message.role, content: message.content }));
            const events = await client.streamChatCompletions(model,
                [{ role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown." },
                ...newMessages],
                { maxTokens: 1024 });
            for await (const event of events) {
                for (const choice of event.choices) {
                    const delta = choice.delta?.content;
                    if (delta) {
                        controller.enqueue(encoder.encode(delta))
                    }
                }
            }
            controller.close();
        }
    });

    return new Response(stream)
}