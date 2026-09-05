/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const team = [
  { name: "Arjun Mehta", role: "Founder & Lead Photographer", initials: "AM", insta: "#" },
  { name: "Priya Shah", role: "Creative Director", initials: "PS", insta: "#" },
  { name: "Rohan Kapoor", role: "Head of Videography", initials: "RK", insta: "#" },
  { name: "Sneha Iyer", role: "Digital Marketing Lead", initials: "SI", insta: "#" },
];

export function Team() {
  return (
    <section id="team" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="The People"
          title="Meet the"
          highlight="Snapit crew."
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all text-center"
            >
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-gold animate-spin-slow opacity-80"
                  style={{ animation: "spin 8s linear infinite" }} />
                <div className="absolute inset-1 rounded-full bg-card flex items-center justify-center text-3xl font-bold text-gradient-gold">
                  {m.initials}
                </div>
              </div>
              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
              <a
                href={m.insta}
                aria-label={`${m.name} on Instagram`}
                className="mt-5 inline-flex items-center justify-center h-10 w-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}