import { useState } from "react";
import { X, Send } from "lucide-react";

interface InviteModalProps {
  projectName: string;
  onClose: () => void;
}

export function InviteModal({ projectName, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"engineer" | "viewer">("viewer");
  const [sent, setSent] = useState(false);

  const handleInvite = () => {
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-card border rounded-sm w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground">Invite to {projectName}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-label block mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@company.com"
              className="w-full px-3 py-2 bg-background border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 font-mono"
            />
          </div>

          <div>
            <label className="text-label block mb-1.5">Role</label>
            <div className="flex gap-2">
              {(["engineer", "viewer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-sm border transition-colors ${
                    role === r
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-surface-hover"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleInvite}
            disabled={!email}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            {sent ? "Invitation Sent" : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
