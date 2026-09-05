/* eslint-disable prettier/prettier */
const clients = [
  "Tata", "Reliance", "Mahindra", "Godrej", "Asian Paints", "Raymond",
  "Bombay Times", "Star Plus", "Sony", "Zee", "Kotak", "HDFC",
];

export function Clients() {
  return (
    <section className="relative py-20 border-y border-border bg-background overflow-hidden">
      <p className="text-center text-xs tracking-[0.4em] uppercase text-muted-foreground mb-10">
        Trusted by brands across India
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-16 animate-marquee whitespace-nowrap w-max">
          {[...clients, ...clients].map((c, i) => (
            <span
              key={i}
              className="text-3xl lg:text-4xl font-bold text-muted-foreground/40 hover:text-primary transition-colors"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}