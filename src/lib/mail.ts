import nodemailer from "nodemailer";

export async function notify(
  subject: string,
  fields: Record<string, string | null | undefined>
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const to = process.env.NOTIFY_TO;
  if (!host || !to) return;

  const body = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: body,
    });
  } catch (err) {
    console.warn("[mail] gönderilemedi:", err);
  }
}
