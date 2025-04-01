import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, verifyCode: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Maker <noreply@darshtank.me>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Verify your email address</h1>
          <p style="color: #666; line-height: 1.6;">
            Thank you for signing up for Portfolio Maker! To complete your registration, please use the verification code below:
          </p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #000; margin: 0; font-size: 32px; letter-spacing: 5px;">${verifyCode}</h2>
          </div>
          <p style="color: #666; line-height: 1.6;">
            This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, verifyCode: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Maker <noreply@darshtank.me>",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Reset your password</h1>
          <p style="color: #666; line-height: 1.6;">
            You requested to reset your password. Use the verification code below to proceed:
          </p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #000; margin: 0; font-size: 32px; letter-spacing: 5px;">${verifyCode}</h2>
          </div>
          <p style="color: #666; line-height: 1.6;">
            This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
} 