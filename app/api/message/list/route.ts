import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const chatId = request.nextUrl.searchParams.get("chatId")
    if (!chatId) {
        return NextResponse.json({ code: -1 })
    }
    const list = await prisma.message.findMany({
        where: {
            chatId
        },
        // 按创建时间升序排列
        orderBy: {
            createTime: "asc"
        }
    })
    return NextResponse.json({ code: 0, data: { list } })
} 