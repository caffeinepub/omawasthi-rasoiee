// ProfileSetupModal — kept as stub. Internet Identity profile setup is no longer
// the primary auth flow; standard email login is used instead.
interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({
  open: _open,
  onComplete: _onComplete,
}: ProfileSetupModalProps) {
  return null;
}
