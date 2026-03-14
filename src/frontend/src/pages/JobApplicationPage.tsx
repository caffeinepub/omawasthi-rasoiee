import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitJobApplication } from "../hooks/useQueries";

const JOB_POSTS = ["Chef", "Waiter", "Manager", "Delivery", "Cashier"];

interface JobApplicationPageProps {
  onBack: () => void;
}

export default function JobApplicationPage({
  onBack,
}: JobApplicationPageProps) {
  const { mutateAsync: submitApplication, isPending } =
    useSubmitJobApplication();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [post, setPost] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !post) {
      setError("All fields are required.");
      return;
    }
    setError("");
    try {
      await submitApplication({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        post,
      });
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.97 0.012 75) 0%, oklch(0.94 0.025 290) 100%)",
      }}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="job.back.button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-sm"
            data-ocid="job.success_state"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Application Submitted!
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Thank you, <strong>{name}</strong>! Your application for{" "}
              <strong>{post}</strong> has been received. Om Awasthi will review
              it and get back to you.
            </p>
            <Button
              onClick={onBack}
              className="gap-2"
              data-ocid="job.back.button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                style={{ background: "oklch(0.5 0.18 290)" }}
              >
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Apply for a Job
              </h1>
              <p className="text-muted-foreground mt-1">
                Join the omawasthi rasoiee team
              </p>
            </div>

            {/* Form */}
            <div className="bg-card rounded-3xl border border-border shadow-card p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="job-name">Full Name</Label>
                  <Input
                    id="job-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    data-ocid="job.name.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-email">Email</Label>
                  <Input
                    id="job-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    data-ocid="job.email.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-phone">Phone Number</Label>
                  <Input
                    id="job-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    data-ocid="job.phone.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-post">Applying for Post</Label>
                  <Select value={post} onValueChange={setPost}>
                    <SelectTrigger id="job-post" data-ocid="job.post.select">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_POSTS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <p
                    className="text-sm text-destructive font-medium"
                    data-ocid="job.error_state"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isPending}
                  data-ocid="job.submit_button"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                  {isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
