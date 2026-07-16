import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();

    const queueName = "send-otp";

    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Mail Service consumer started, listening for otp emails");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString());

         const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

          await transporter.sendMail({
            from: "Chat App",
            to,
            subject,
            text: body,
          });

          console.log(`OTP mail sent to ${to}`);
          channel.ack(msg);
        } catch (error) {
          console.error("Failed to send OTP:", error);
        }
      }
    });
  } catch (error) {
    console.error("Failed to start RabbitMQ consumer:", error);
  }
};