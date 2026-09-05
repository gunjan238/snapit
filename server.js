/* eslint-disable prettier/prettier */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

/* =========================================================
Resend Configuration
========================================================= */
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("RESEND KEY LOADED:", !!process.env.RESEND_API_KEY);
console.log("TO_EMAIL:", process.env.TO_EMAIL);

/* =========================================================
Health Check Route
========================================================= */
app.get("/", (req, res) => {
  res.status(200).send("Backend Running Successfully");
});

/* =========================================================
CORS Configuration
========================================================= */
const allowedOrigins = [
  "http://localhost:8080",
  "https://snapitt.in",
  "https://www.snapitt.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, mobile apps
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
    credentials: true,


  })
);

app.use(express.json());

/* =========================================================
Contact Form API
========================================================= */
app.post("/send-email", async (req, res) => {
  console.log("Incoming Request Body:", req.body);

  const {
    name,
    email,
    phone,
    company,
    subject,
    message,
  } = req.body;

  /* Validation */
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, Email and Message are required.",
    });
  }

  try {
    console.log("Attempting email send...");


    const { data, error } = await resend.emails.send({
      /*
        USE THIS IF DOMAIN IS VERIFIED
      */
      from: "Website Enquiry <info@mahadyuta.com>",

      /*
        IF DOMAIN IS NOT VERIFIED YET,
        COMMENT ABOVE LINE AND USE:
    
        from: "onboarding@resend.dev",
      */

      to: [process.env.TO_EMAIL],

      replyTo: email,

      subject: subject || "New Contact Enquiry",

      html: `
    <h2>New Contact Form Submission</h2>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "-"}</p>
    <p><strong>Company:</strong> ${company || "-"}</p>
    <p><strong>Subject:</strong> ${subject || "-"}</p>

    <hr />

    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
    });

    console.log("RESEND DATA:", data);
    console.log("RESEND ERROR:", error);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("Email Sent Successfully");

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });


  } catch (error) {
    console.error("SERVER ERROR:", error);


    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to send email.",
    });


  }
});

/* =========================================================
Server Start
========================================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
