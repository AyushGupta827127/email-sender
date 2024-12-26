import nodemailer from "nodemailer";

export async function POST(req) {

  try {
    const { to, subject, text, filename, fileurl } = await req.json();

    // Validate input
    if (!to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Required fields: to, subject, text" }),
        { status: 400, headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allow all origins (or specify your domain)
        }, }
      );
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Prepare email options
    const mailOptions = {
      from: process.env.SMTP_USER, // Sender email address
      to,
      subject,
      html: `
        <h1 style="color: #172554;">
          Welcome to Finance <span style="color: #f97316;">India</span>
        </h1>
        <br />
        <p style="font-weight: 400; font-size: 21px;">${text}</p>
      `,
    };

    if (filename && fileurl) {
      mailOptions.attachments = [
        {
          filename,
          path: fileurl,
        },
      ];
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins (or specify your domain)
      }, }
    );
  } catch (error) {
    console.error("Error sending email:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json","Access-Control-Allow-Origin": "*", } }
    );
  }
}
