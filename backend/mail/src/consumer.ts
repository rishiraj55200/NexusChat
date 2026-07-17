import amqp from "amqplib";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    const queueName = "send-otp";

    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Mail Service consumer started, listening for OTP emails");

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
       const { to, subject, body } = JSON.parse(msg.content.toString());

console.log("📧 Sending OTP to:", to);

const { data, error } = await resend.emails.send({
  from: "onboarding@resend.dev",
  to,
  subject,
  text: body,
});

if (error) {
  console.error("❌ Resend Error:", error);
  return;
}

console.log("✅ Email Sent:", data);
channel.ack(msg);

        if (error) {
          console.error("❌ Resend Error:", error);
          return;
        }

        console.log("✅ Email Sent:", data);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to send OTP:", err);
      }
    });
  } catch (err) {
    console.error("❌ Failed to start RabbitMQ consumer:", err);
  }
};