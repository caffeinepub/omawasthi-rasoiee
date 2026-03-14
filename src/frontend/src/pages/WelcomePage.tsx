import {
  Briefcase,
  ChefHat,
  MessageCircle,
  Shield,
  UserCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const FULL_TEXT = "Hi! I'm Om Awasthi — welcome to my omawasthi rasoiee 🍳";

type WelcomeScreen =
  | "welcome"
  | "userAuth"
  | "adminLogin"
  | "jobApply"
  | "contactPublic";

interface WelcomePageProps {
  onNavigate: (screen: WelcomeScreen) => void;
}

export default function WelcomePage({ onNavigate }: WelcomePageProps) {
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);

  // Typing effect
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTyped(FULL_TEXT.slice(0, idx));
      if (idx >= FULL_TEXT.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const buttons = [
    {
      id: "userAuth" as WelcomeScreen,
      icon: UserCircle,
      label: "User Login / Sign Up",
      sub: "Browse recipes & save favorites",
      gradient: "from-amber-500 to-orange-600",
      shadowColor: "shadow-amber-500/30",
      ocid: "welcome.user_login.button",
    },
    {
      id: "adminLogin" as WelcomeScreen,
      icon: Shield,
      label: "Admin Login",
      sub: "Manage recipes & view data",
      gradient: "from-emerald-600 to-teal-700",
      shadowColor: "shadow-emerald-500/30",
      ocid: "welcome.admin_login.button",
    },
    {
      id: "jobApply" as WelcomeScreen,
      icon: Briefcase,
      label: "Apply for Job",
      sub: "Chef, Waiter, Manager & more",
      gradient: "from-purple-600 to-indigo-700",
      shadowColor: "shadow-purple-500/30",
      ocid: "welcome.job_apply.button",
    },
    {
      id: "contactPublic" as WelcomeScreen,
      icon: MessageCircle,
      label: "Contact Me",
      sub: "Get in touch with Om Awasthi",
      gradient: "from-rose-500 to-pink-700",
      shadowColor: "shadow-rose-500/30",
      ocid: "welcome.contact.button",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.06 46) 0%, oklch(0.22 0.05 30) 40%, oklch(0.15 0.04 60) 100%)",
      }}
    >
      {/* Decorative background circles */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.19 46), transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.15 140), transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "oklch(0.72 0.19 46)" }}
          >
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span
            className="font-display text-2xl font-bold tracking-tight"
            style={{ color: "oklch(0.96 0.02 75)" }}
          >
            omawasthi rasoiee
          </span>
        </motion.div>

        {/* Typing text card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-3xl p-8 mb-10 text-center"
          style={{
            background: "oklch(0.24 0.04 46 / 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(0.72 0.19 46 / 0.25)",
            boxShadow: "0 24px 80px oklch(0 0 0 / 0.4)",
          }}
        >
          <p
            className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
            style={{ color: "oklch(0.97 0.015 75)" }}
          >
            {typed}
            <span
              className="inline-block w-0.5 h-8 ml-1 align-middle"
              style={{
                background: "oklch(0.72 0.19 46)",
                opacity: cursorVisible ? 1 : 0,
                transition: "opacity 0.1s",
              }}
            />
          </p>
          {typingDone && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-3 text-base"
              style={{ color: "oklch(0.7 0.04 75)" }}
            >
              Your one-stop destination for authentic recipes
            </motion.p>
          )}
        </motion.div>

        {/* 4 Buttons grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.5 },
            },
          }}
        >
          {buttons.map((btn) => {
            const Icon = btn.icon;
            return (
              <motion.button
                key={btn.id}
                type="button"
                onClick={() => onNavigate(btn.id)}
                data-ocid={btn.ocid}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-4 p-5 rounded-2xl text-left overflow-hidden group ${btn.shadowColor} shadow-xl`}
                style={{
                  background: "oklch(0.26 0.04 46 / 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid oklch(0.72 0.19 46 / 0.2)",
                }}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${btn.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-2xl`}
                />
                <div
                  className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${btn.gradient} flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="relative flex-1 min-w-0">
                  <p
                    className="font-display font-bold text-lg leading-tight"
                    style={{ color: "oklch(0.97 0.015 75)" }}
                  >
                    {btn.label}
                  </p>
                  <p
                    className="text-sm mt-0.5 truncate"
                    style={{ color: "oklch(0.65 0.04 75)" }}
                  >
                    {btn.sub}
                  </p>
                </div>
                <svg
                  className="relative w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform"
                  style={{ color: "oklch(0.65 0.04 75)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-10 text-sm text-center"
          style={{ color: "oklch(0.5 0.03 75)" }}
        >
          Built by Om Awasthi — The App Developer
        </motion.p>
      </div>
    </div>
  );
}
