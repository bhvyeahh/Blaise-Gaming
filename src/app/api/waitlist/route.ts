import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "BanterBox <hello@layoutory.in>", 
      to: email,
      subject: "You're on the list 🚗💨",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f4f5; padding: 60px 20px;">
            <tr>
              <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin: 0 auto; text-align: left; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  
                  <tr>
                    <td style="padding: 40px 40px 20px;">
                      <span style="font-size: 22px; font-weight: 800; color: #18181b; letter-spacing: -0.5px;">
                        Banter<span style="color: #2563eb;">Box</span>
                      </span>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 20px; color: #18181b; font-weight: 700;">Welcome to BanterBox!</h2>
                      
                      <p style="margin: 0 0 16px; font-size: 16px; color: #52525b; line-height: 1.6;">Hey there,</p>
                      
                      <p style="margin: 0 0 16px; font-size: 16px; color: #52525b; line-height: 1.6;">You are officially on the waitlist. We are dropping the ultimate trending couples game web app in just a few days.</p>
                      
                      <p style="margin: 0 0 32px; font-size: 16px; color: #52525b; line-height: 1.6;">Keep an eye on your inbox. We'll send you an exclusive early-access link the second we go live.</p>
                      
                      <p style="margin: 0 0 4px; font-size: 16px; color: #52525b; line-height: 1.6;">Cheers,</p>
                      <p style="margin: 0; font-size: 16px; color: #18181b; font-weight: 600;">The BanterBox Team</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}