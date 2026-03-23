import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Send the premium welcome email to the user
    await resend.emails.send({
      from: "BanterBox <hello@layoutory.in>", // Use your verified layoutory domain
      to: email,
      subject: "You're on the list 🚗💨",
      html: `
        <div style="font-family: sans-serif; color: #111; padding: 20px;">
          <h2 style="color: #6b21a8;">Welcome to BanterBox!</h2>
          <p>Hey there,</p>
          <p>You are officially on the waitlist. We are dropping the ultimate couples roadtrip app in just a few days.</p>
          <p>Keep an eye on your inbox. We'll send you an exclusive early-access link the second we go live.</p>
          <br/>
          <p>Cheers,</p>
          <p><strong>The BanterBox Team</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}