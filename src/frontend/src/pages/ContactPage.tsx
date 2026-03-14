import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle2,
  Instagram,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitFeedback } from "../hooks/useQueries";

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "8081024044",
    href: "tel:8081024044",
    ocid: "contact.phone.link",
    btnStyle: "bg-green-600 hover:bg-green-700",
    btnLabel: "Call Now",
    btnOcid: "contact.call.button",
  },
  {
    icon: Mail,
    label: "Email",
    value: "omawasthi379@gmail.com",
    href: "mailto:omawasthi379@gmail.com",
    ocid: "contact.email.link",
    btnStyle: "bg-blue-600 hover:bg-blue-700",
    btnLabel: "Send Email",
    btnOcid: "contact.email.button",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@om_awasthi11",
    href: "https://instagram.com/om_awasthi11",
    ocid: "contact.instagram.link",
    btnStyle: "bg-pink-600 hover:bg-pink-700",
    btnLabel: "Instagram",
    btnOcid: "contact.instagram.button",
  },
];

interface ContactPageProps {
  onBack?: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const { mutateAsync: submitFeedback, isPending } = useSubmitFeedback();
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbPhone, setFbPhone] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbError, setFbError] = useState("");

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbEmail.trim() || !fbMessage.trim()) {
      setFbError("Name, email and message are required.");
      return;
    }
    setFbError("");
    try {
      await submitFeedback({
        name: fbName.trim(),
        email: fbEmail.trim(),
        phone: fbPhone.trim(),
        message: fbMessage.trim(),
      });
      setFeedbackDone(true);
      toast.success("Feedback sent! Thank you 🙏");
    } catch {
      toast.error("Failed to send feedback. Please try again.");
    }
  };

  return (
    <div data-ocid="contact.page" className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 px-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="contact.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

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
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl scale-105"
                style={{
                  background: "oklch(0.62 0.17 46 / 0.18)",
                  filter: "blur(12px)",
                }}
              />
              <img
                src="/assets/uploads/IMG-20251202-WA0007-1-1.jpg"
                alt="Om Awasthi"
                className="relative w-56 h-72 md:w-64 md:h-80 object-cover rounded-3xl shadow-2xl border-4 border-card"
                style={{ objectPosition: "top center" }}
              />
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

          {/* Text block */}
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
              I am Om Awasthi, the owner of omawasthi rasoiee. If you have any
              problem, please contact me — I am always happy to help!
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
              {contacts.map(
                ({
                  icon: Icon,
                  label,
                  value,
                  href,
                  ocid,
                  btnStyle,
                  btnLabel,
                  btnOcid,
                }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
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
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg text-white ${btnStyle} transition-colors`}
                      data-ocid={btnOcid}
                    >
                      {btnLabel}
                    </span>
                  </motion.a>
                ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Send Feedback
              </h2>
              <p className="text-sm text-muted-foreground">
                Let us know how you feel about the app
              </p>
            </div>
          </div>

          {feedbackDone ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-3xl border border-border shadow-card"
              data-ocid="feedback.success_state"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-muted-foreground">
                Om Awasthi will read your message soon.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-3xl border border-border shadow-card p-8">
              <form
                onSubmit={handleFeedback}
                className="space-y-5"
                data-ocid="feedback.panel"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fb-name">Your Name *</Label>
                    <Input
                      id="fb-name"
                      type="text"
                      placeholder="Full name"
                      value={fbName}
                      onChange={(e) => setFbName(e.target.value)}
                      data-ocid="feedback.name.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fb-email">Email *</Label>
                    <Input
                      id="fb-email"
                      type="email"
                      placeholder="your@email.com"
                      value={fbEmail}
                      onChange={(e) => setFbEmail(e.target.value)}
                      data-ocid="feedback.email.input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-phone">Phone (optional)</Label>
                  <Input
                    id="fb-phone"
                    type="tel"
                    placeholder="Mobile number"
                    value={fbPhone}
                    onChange={(e) => setFbPhone(e.target.value)}
                    data-ocid="feedback.phone.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-message">Message *</Label>
                  <Textarea
                    id="fb-message"
                    placeholder="Write your feedback here..."
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    rows={4}
                    data-ocid="feedback.message.textarea"
                  />
                </div>
                {fbError && (
                  <p
                    className="text-sm text-destructive font-medium"
                    data-ocid="feedback.error_state"
                  >
                    {fbError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isPending}
                  data-ocid="feedback.submit_button"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isPending ? "Sending..." : "Send Feedback"}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
