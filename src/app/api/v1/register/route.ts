// app/api/example/route.ts
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";


type RequestProps = {
    email: string
    password: string
    accountType: 'NORMAL' | 'ADVANCE'
}
export async function POST(request: NextRequest) {
    try {

        const { email, password, accountType } = await request.json() as RequestProps;

        if (!password || !email || !accountType) {
            return NextResponse.json(
                { error: "Fields are required" },
                { status: 400 }
            );
        }

        const encryptedPassword = await hash(password, 10)
        await db.account.create({
            data: {
                email: email,
                password: encryptedPassword,
                accountType: accountType
            }
        })

        return NextResponse.json({ message: 'Data saved successfully' }, { status: 202 });
    } catch (error) {

        if (error instanceof TRPCError) {
            console.error(error.message)
            return NextResponse.json({ message: error.message }, { status: 400 })
        }
        else if (error instanceof TRPCClientError) {
            console.error(error.message)
            return NextResponse.json({ message: error.message }, { status: 400 })
        }
        else if (error instanceof SyntaxError) {
            console.error(error.message)
            return NextResponse.json({ message: error.message }, { status: 400 })
        }
        console.error(error)
        return NextResponse.json({ message: 'Something went wrong' }, { status: 400 })
    }
}
