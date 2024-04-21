import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id")
    if (!id) {
        return NextResponse.json({ code: -1 })
    }
    // 删除对话前先删除关联的消息
    const deleteMessages = prisma.message.deleteMany({
        where: {
            chatId: id
        }
    })
    const deleteChat = prisma.chat.delete({
        where: {
            id
        }
    })
    // prisma事务  要么同时成功要么同时失败
    await prisma.$transaction([deleteMessages, deleteChat])

    return NextResponse.json({ code: 0 })
}