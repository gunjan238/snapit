// /* eslint-disable prettier/prettier */
// // Contact.tsx
// /* eslint-disable prettier/prettier */
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { z } from "zod";
// import { toast } from "sonner";
// import { Mail, Phone, MapPin, Send } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { SectionHeading } from "./SectionHeading";

// const schema = z.object({
//   name: z.string().trim().min(2, "Please enter your name").max(80),
//   email: z.string().trim().email("Please enter a valid email").max(160),
//   phone: z.string().trim().min(7, "Please enter a valid phone").max(20),
//   message: z.string().trim().min(10, "Tell us a bit more").max(1000),
// });

// const info = [
//   { icon: Mail, label: "Email", value: "snapitt04@gmail.com" },
//   { icon: Phone, label: "Phone", value: "+91 78209 71568" },
//   { icon: MapPin, label: "Studio", value: "Pune" },
// ];

// // Point this at your deployed server in production
// const API_URL = import.meta.env.VITE_MAIL_API_URL ?? "http://localhost:3001";

// export function Contact() {
//   const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
//   const [loading, setLoading] = useState(false);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();

//     // Client-side validation first
//     const res = schema.safeParse(form);
//     if (!res.success) {
//       toast.error(res.error.issues[0]?.message ?? "Please check the form");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/contact`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(res.data),
//       });

//       const json = await response.json();

//       if (!response.ok) {
//         throw new Error(json.error ?? "Something went wrong");
//       }

//       toast.success("Message sent! We'll be in touch within 24 hours.");
//       setForm({ name: "", email: "", phone: "", message: "" });
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Failed to send. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section id="contact" className="relative py-32">
//       <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
//         <div>
//           <SectionHeading
//             eyebrow="Get in touch"
//             title="Let's create"
//             highlight="something iconic."
//             description="Tell us about your brand, your event, or the campaign you're dreaming up. We reply within 24 hours."
//           />
//           <div className="mt-12 space-y-6">
//             {info.map((c) => (
//               <div key={c.label} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
//                 <div className="h-12 w-12 rounded-xl bg-gradient-gold text-primary-foreground flex items-center justify-center shadow-gold shrink-0">
//                   <c.icon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
//                   <div className="text-lg font-medium mt-1">{c.value}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <motion.form
//           onSubmit={submit}
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.7 }}
//           className="relative p-8 lg:p-10 rounded-3xl bg-card border border-border shadow-card-luxe"
//         >
//           <div className="absolute -inset-1 bg-gradient-gold opacity-20 blur-2xl rounded-3xl -z-10" />
//           <div className="space-y-5">
//             <div>
//               <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
//               <Input
//                 className="mt-2 h-12 bg-background border-border rounded-xl"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 placeholder="Your full name"
//               />
//             </div>
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
//                 <Input
//                   type="email"
//                   className="mt-2 h-12 bg-background border-border rounded-xl"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   placeholder="you@brand.com"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
//                 <Input
//                   className="mt-2 h-12 bg-background border-border rounded-xl"
//                   value={form.phone}
//                   onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                   placeholder="+91"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-xs uppercase tracking-widest text-muted-foreground">Project</label>
//               <Textarea
//                 rows={5}
//                 className="mt-2 bg-background border-border rounded-xl"
//                 value={form.message}
//                 onChange={(e) => setForm({ ...form, message: e.target.value })}
//                 placeholder="Tell us what you have in mind…"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full h-14 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
//             >
//               {loading ? "Sending…" : (<>Send Message <Send className="h-4 w-4" /></>)}
//             </button>
//           </div>
//         </motion.form>
//       </div>
//     </section>
//   );
// }


/* eslint-disable prettier/prettier */

import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./SectionHeading";

/* =========================================================
   FORM VALIDATION
========================================================= */

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(160, "Email is too long"),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),

  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more about your project")
    .max(1000, "Message is too long"),
});

/* =========================================================
   CONTACT INFORMATION
========================================================= */

const info = [
  {
    icon: Mail,
    label: "Email",
    value: "snapitt04@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 78209 71568",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Pune",
  },
];

/* =========================================================
   BACKEND API URL
=========================================================

   Local development:
   http://localhost:5000

   Production:
   Create a VITE_MAIL_API_URL variable in your production
   environment, for example:

   VITE_MAIL_API_URL=https://api.snapitt.in

========================================================= */

const API_URL =
  import.meta.env.VITE_MAIL_API_URL || "http://localhost:5000";

/* =========================================================
   FORM TYPE
========================================================= */

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

/* =========================================================
   CONTACT COMPONENT
========================================================= */

export function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  function handleChange(
    field: keyof ContactForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /* =======================================================
     SUBMIT FORM
  ======================================================= */

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* -------------------------------------------------------
       Prevent duplicate submissions
    ------------------------------------------------------- */

    if (loading) {
      return;
    }

    /* -------------------------------------------------------
       Client-side validation
    ------------------------------------------------------- */

    const result = schema.safeParse(form);

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ||
        "Please check the form.";

      toast.error(firstError);

      return;
    }

    setLoading(true);

    try {
      console.log("Sending contact form...");
      console.log("API:", `${API_URL}/send-email`);

      /* -----------------------------------------------------
         Send request to Express backend
      ----------------------------------------------------- */

      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          message: result.data.message,
        }),
      });

      /* -----------------------------------------------------
         Read response safely
      ----------------------------------------------------- */

      let data: {
        success?: boolean;
        message?: string;
        error?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /* -----------------------------------------------------
         Handle backend error
      ----------------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to send your message."
        );
      }

      /* -----------------------------------------------------
         Success
      ----------------------------------------------------- */

      toast.success(
        "Message sent! We'll be in touch within 24 hours."
      );

      /* -----------------------------------------------------
         Clear form
      ----------------------------------------------------- */

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      /* -----------------------------------------------------
         Display useful error to user
      ----------------------------------------------------- */

      if (error instanceof TypeError) {
        toast.error(
          "Unable to connect to the email server. Please try again."
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Failed to send your message. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      id="contact"
      className="relative py-32"
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-10
          grid
          lg:grid-cols-2
          gap-16
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's create"
            highlight="something iconic."
            description="Tell us about your brand, your event, or the campaign you're dreaming up. We reply within 24 hours."
          />

          {/* ------------------------------------------------
              CONTACT INFORMATION
          ------------------------------------------------ */}

          <div className="mt-12 space-y-6">
            {info.map((contact) => {
              const Icon = contact.icon;

              return (
                <div
                  key={contact.label}
                  className="
                    flex
                    items-start
                    gap-4
                    p-5
                    rounded-2xl
                    bg-card
                    border
                    border-border
                  "
                >
                  {/* Icon */}

                  <div
                    className="
                      h-12
                      w-12
                      rounded-xl
                      bg-gradient-gold
                      text-primary-foreground
                      flex
                      items-center
                      justify-center
                      shadow-gold
                      shrink-0
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Text */}

                  <div>
                    <div
                      className="
                        text-xs
                        uppercase
                        tracking-widest
                        text-muted-foreground
                      "
                    >
                      {contact.label}
                    </div>

                    <div
                      className="
                        text-lg
                        font-medium
                        mt-1
                      "
                    >
                      {contact.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            CONTACT FORM
        ================================================= */}

        <motion.form
          onSubmit={submit}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            relative
            p-8
            lg:p-10
            rounded-3xl
            bg-card
            border
            border-border
            shadow-card-luxe
          "
        >
          {/* Golden glow */}

          <div
            className="
              absolute
              -inset-1
              bg-gradient-gold
              opacity-20
              blur-2xl
              rounded-3xl
              -z-10
            "
          />

          <div className="space-y-5">

            {/* =============================================
                NAME
            ============================================= */}

            <div>
              <label
                htmlFor="contact-name"
                className="
                  text-xs
                  uppercase
                  tracking-widest
                  text-muted-foreground
                "
              >
                Name
              </label>

              <Input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className="
                  mt-2
                  h-12
                  bg-background
                  border-border
                  rounded-xl
                "
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

            {/* =============================================
                EMAIL + PHONE
            ============================================= */}

            <div className="grid sm:grid-cols-2 gap-4">

              {/* Email */}

              <div>
                <label
                  htmlFor="contact-email"
                  className="
                    text-xs
                    uppercase
                    tracking-widest
                    text-muted-foreground
                  "
                >
                  Email
                </label>

                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="
                    mt-2
                    h-12
                    bg-background
                    border-border
                    rounded-xl
                  "
                  value={form.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                  placeholder="you@brand.com"
                  disabled={loading}
                />
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="contact-phone"
                  className="
                    text-xs
                    uppercase
                    tracking-widest
                    text-muted-foreground
                  "
                >
                  Phone
                </label>

                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="
                    mt-2
                    h-12
                    bg-background
                    border-border
                    rounded-xl
                  "
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="+91"
                  disabled={loading}
                />
              </div>
            </div>

            {/* =============================================
                MESSAGE
            ============================================= */}

            <div>
              <label
                htmlFor="contact-message"
                className="
                  text-xs
                  uppercase
                  tracking-widest
                  text-muted-foreground
                "
              >
                Project
              </label>

              <Textarea
                id="contact-message"
                name="message"
                rows={5}
                className="
                  mt-2
                  bg-background
                  border-border
                  rounded-xl
                "
                value={form.message}
                onChange={(e) =>
                  handleChange("message", e.target.value)
                }
                placeholder="Tell us what you have in mind…"
                disabled={loading}
              />
            </div>

            {/* =============================================
                SUBMIT BUTTON
            ============================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-full
                bg-gradient-gold
                text-primary-foreground
                font-semibold
                shadow-gold
                hover:scale-[1.02]
                transition-transform
                flex
                items-center
                justify-center
                gap-2
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      rounded-full
                      border-2
                      border-current
                      border-t-transparent
                      animate-spin
                    "
                  />

                  Sending…
                </>
              ) : (
                <>
                  Send Message

                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}