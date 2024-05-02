import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { id, ...data } = body
    if (!data.chatId) {
        const chat = await prisma.chat.create({
            data: {
                title: "新对话"
            }
        })
        data.chatId = chat.id
    } else {
        await prisma.chat.update({
            data: {
                updateTime: new Date()
            },
            where: {
                id: data.chatId
            }
        })
    }

    // 创建或更新消息
    let message = await prisma.message.upsert({
        create: data,
        update: data,
        where: {
            id: id
        }
    })

    return NextResponse.json({ code: 0, data: { message } })
}