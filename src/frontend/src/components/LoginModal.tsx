// LoginModal is deprecated — login flow now uses WelcomePage -> UserAuthPage.
// This file is kept as a stub to avoid orphaned imports during transition.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChefHat } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" data-ocid="auth.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            omawasthi rasoiee
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Please use the Sign In / Sign Up page from the home screen.
        </p>
      </DialogContent>
    </Dialog>
  );
}
