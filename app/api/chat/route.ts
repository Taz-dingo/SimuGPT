import { MessageRequestBody } from "@/types/chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { messages } = (await request.json() as MessageRequestBody);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const messageText = messages[messages.length - 1].content;
            for (let i = 0; i < messageText.length; i++) {
                controller.enqueue(encoder.encode(messageText[i]));
            }
        }
    });

    return new Response(stream)
}