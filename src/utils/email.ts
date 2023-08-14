import nodemailer from "nodemailer";


interface EmailInterface {
    from : string
    to : string
    subject:string
    text: string
}


const sendEmail = async (options: Record<string, string>) => {
  const transporter = nodemailer.createTransport({
    port: Number(process.env.EMAIL_PORT),
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //EMAL OPTIONS
  const emailOptions :EmailInterface = {
    from : "alaa@m.com",
    to : options.to,
    subject: options.subject,
    text: options.text
  }

  await transporter.sendMail(emailOptions)
};
export default sendEmail