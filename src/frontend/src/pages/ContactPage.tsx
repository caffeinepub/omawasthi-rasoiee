import { Instagram, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "8081024044",
    href: "tel:8081024044",
    ocid: "contact.phone.link",
  },
  {
    icon: Mail,
    label: "Email",
    value: "omawasthi379@gmail.com",
    href: "mailto:omawasthi379@gmail.com",
    ocid: "contact.email.link",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@om_awasthi11",
    href: "https://instagram.com/om_awasthi11",
    ocid: "contact.instagram.link",
  },
];

export default function ContactPage() {
  return (
    <div data-ocid="contact.page" className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 px-4">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "oklch(0.62 0.17 46 / 0.35)",
            filter: "blur(80px)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-15"
          style={{
            background: "oklch(0.55 0.12 140 / 0.4)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Photo slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <div className="relative">
              {/* Decorative glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl scale-105"
                style={{
                  background: "oklch(0.62 0.17 46 / 0.18)",
                  filter: "blur(12px)",
                }}
              />
              <img
                src="/assets/uploads/IMG-20251202-WA0007-1.jpg"
                alt="Om Awasthi"
                className="relative w-56 h-72 md:w-64 md:h-80 object-cover rounded-3xl shadow-2xl border-4 border-card"
                style={{ objectPosition: "top center" }}
              />
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
                className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                App Owner
              </motion.div>
            </div>
          </motion.div>

          {/* Text block slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm font-semibold tracking-widest uppercase text-primary mb-2"
            >
              Owner of omawasthi rasoiee
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
            >
              Om Awasthi
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-sm"
            >
              I am Om Awasthi, the owner of this app. If you have any problem,
              please contact me — I am always happy to help!
            </motion.p>

            {/* Contact cards */}
            <motion.div
              className="flex flex-col gap-3 w-full max-w-sm"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.6 },
                },
                hidden: {},
              }}
            >
              {contacts.map(({ icon: Icon, label, value, href, ocid }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  data-ocid={ocid}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 shadow-sm transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {value}
                    </p>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
