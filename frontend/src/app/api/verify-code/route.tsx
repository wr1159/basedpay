import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
    const { phoneNumber, code } = await request.json();

    try {
        const verificationCheck = await client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({ to: phoneNumber, code });

        if (verificationCheck.status === "approved") {
            return NextResponse.json({
                success: true,
                message: "Verification successful",
            });
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid code" },
                { status: 400 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
