// Contact.tsx
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
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z.string().trim().min(7, "Please enter a valid phone").max(20),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

const info = [
  { icon: Mail, label: "Email", value: "snapitt04@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 78209 71568" },
  { icon: MapPin, label: "Studio", value: "Pune" },
];

// Point this at your deployed server in production
const API_URL = import.meta.env.VITE_MAIL_API_URL ?? "http://localhost:3001";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation first
    const res = schema.safeParse(form);
    if (!res.success) {
      toast.error(res.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res.data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error ?? "Something went wrong");
      }

      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's create"
            highlight="something iconic."
            description="Tell us about your brand, your event, or the campaign you're dreaming up. We reply within 24 hours."
          />
          <div className="mt-12 space-y-6">
            {info.map((c) => (
              <div key={c.label} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                <div className="h-12 w-12 rounded-xl bg-gradient-gold text-primary-foreground flex items-center justify-center shadow-gold shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="text-lg font-medium mt-1">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative p-8 lg:p-10 rounded-3xl bg-card border border-border shadow-card-luxe"
        >
          <div className="absolute -inset-1 bg-gradient-gold opacity-20 blur-2xl rounded-3xl -z-10" />
          <div className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <Input
                className="mt-2 h-12 bg-background border-border rounded-xl"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <Input
                  type="email"
                  className="mt-2 h-12 bg-background border-border rounded-xl"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@brand.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
                <Input
                  className="mt-2 h-12 bg-background border-border rounded-xl"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Project</label>
              <Textarea
                rows={5}
                className="mt-2 bg-background border-border rounded-xl"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you have in mind…"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Sending…" : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}