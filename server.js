/* eslint-disable prettier/prettier */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

/* =========================================================
   Environment Variables
========================================================= */

const PORT = process.env.PORT || 5000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;

if (!RESEND_API_KEY) {
  console.error("ERROR: RESEND_API_KEY is missing from .env");
  process.exit(1);
}

if (!TO_EMAIL) {
  console.error("ERROR: TO_EMAIL is missing from .env");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

console.log("RESEND API KEY LOADED: YES");
console.log("EMAIL DESTINATION:", TO_EMAIL);

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
  "https://snapitt.in",
  "https://www.snapitt.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin
      // e.g. Postman, curl
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked by CORS:", origin);

      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* =========================================================
   Health Check
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Snapitt email backend is running.",
  });
});

/* =========================================================
   Contact Form
========================================================= */

app.post("/send-email", async (req, res) => {
  console.log("Incoming contact request");

  const {
    name,
    email,
    phone,
    message,
  } = req.body;

  /* =======================================================
     Validation
  ======================================================= */

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email and message are required.",
    });
  }

  try {
    console.log("Sending email through Resend...");

    const { data, error } = await resend.emails.send({
      /*
        IMPORTANT:

        For testing:
        from: "Snapitt Website <onboarding@resend.dev>"

        For production, use an address from your
        verified Snapitt domain, e.g.:

        from: "Snapitt Website <info@snapitt.in>"
      */

      from: "Snapitt Website <onboarding@resend.dev>",

      /*
        This is the email where YOU receive enquiries.
      */
      to: [TO_EMAIL],

      /*
        When you press Reply in Gmail,
        it will reply to the visitor.
      */
      replyTo: email,

      subject: `New Snapitt Enquiry from ${name}`,

      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">

            <h2>New Contact Form Submission</h2>

            <p>
              <strong>Name:</strong>
              ${escapeHtml(name)}
            </p>

            <p>
              <strong>Email:</strong>
              ${escapeHtml(email)}
            </p>

            <p>
              <strong>Phone:</strong>
              ${escapeHtml(phone || "-")}
            </p>

            <hr />

            <p>
              <strong>Message:</strong>
            </p>

            <p>
              ${escapeHtml(message).replace(/\n/g, "<br />")}
            </p>

          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Resend failed to send email.",
      });
    }

    console.log("Email sent successfully:", data?.id);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send email.",
    });
  }
});

/* =========================================================
   Simple HTML escaping
========================================================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   Start Server
========================================================= */

app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log(`Snapitt backend running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("----------------------------------------");
});