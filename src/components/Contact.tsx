/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./SectionHeading";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(160, "Email is too long"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20, "Phone number is too long"),
  message: z.string().trim().min(10, "Tell us a bit more about your project").max(1000, "Message is too long"),
});

const info = [
  { icon: Mail, label: "Email", value: "snapitt04@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 78209 71568" },
  { icon: MapPin, label: "Studio", value: "Pune" },
];

const API_URL = import.meta.env.VITE_MAIL_API_URL || "http://localhost:5000";

type ContactForm = { name: string; email: string; phone: string; message: string };

export function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof ContactForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || "Please check the form.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      let data: { success?: boolean; message?: string; error?: string } = {};
      try { data = await response.json(); } catch { data = {}; }

      if (!response.ok) throw new Error(data.error || data.message || "Unable to send your message.");

      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Unable to connect to the email server. Please try again.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send your message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 sm:gap-16">
        {/* Left side */}
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's create"
            highlight="something iconic."
            description="Tell us about your brand, your event, or the campaign you're dreaming up. We reply within 24 hours."
          />

          <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-6">
            {info.map((contact) => {
              const Icon = contact.icon;
              return (
                <div
                  key={contact.label}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-gold text-primary-foreground flex items-center justify-center shadow-gold shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">{contact.label}</div>
                    <div className="text-base sm:text-lg font-medium mt-1">{contact.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-card-luxe"
        >
          <div className="absolute -inset-1 bg-gradient-gold opacity-20 blur-2xl rounded-3xl -z-10" />
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="contact-name" className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-2 h-11 sm:h-12 bg-background border-border rounded-xl text-sm sm:text-base"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="contact-email" className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2 h-11 sm:h-12 bg-background border-border rounded-xl text-sm sm:text-base"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@brand.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="mt-2 h-11 sm:h-12 bg-background border-border rounded-xl text-sm sm:text-base"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">Project</label>
              <Textarea
                id="contact-message"
                name="message"
                rows={4}
                className="mt-2 bg-background border-border rounded-xl text-sm sm:text-base"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Tell us what you have in mind…"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-14 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Sending…
                </>
              ) : (
                <>Send Message <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
