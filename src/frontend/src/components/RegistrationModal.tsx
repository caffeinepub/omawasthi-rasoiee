import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterUser } from "@/hooks/useQueries";
import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RegistrationModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function RegistrationModal({
  open,
  onComplete,
}: RegistrationModalProps) {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const registerUser = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naam.trim() || !email.trim() || !mobile.trim()) return;
    try {
      await registerUser.mutateAsync({
        naam: naam.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      });
      toast.success("Registration complete!");
      onComplete();
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        data-ocid="registration.modal"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
          </div>
          <DialogTitle className="font-display text-2xl">
            Apna Parichay Den
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ek baar apna naam, email aur mobile number bharen. Yeh app ko
            personalize karne mein madad karega.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="reg-naam">Naam</Label>
            <Input
              id="reg-naam"
              placeholder="Aapka naam"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              autoFocus
              data-ocid="registration.naam.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-ocid="registration.email.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-mobile">Mobile Number</Label>
            <Input
              id="reg-mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              data-ocid="registration.mobile.input"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !naam.trim() ||
              !email.trim() ||
              !mobile.trim() ||
              registerUser.isPending
            }
            data-ocid="registration.submit.button"
          >
            {registerUser.isPending ? "Saving..." : "Register"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
