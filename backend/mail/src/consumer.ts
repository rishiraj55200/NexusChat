import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to,
          subject,
          text: body,
        });

        console.log("✅ OTP Email Sent Successfully");
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to send OTP:", err);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("❌ Failed to start RabbitMQ consumer:", err);
  }
};