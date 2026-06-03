import { toast } from "sonner";
import { sealUrl, shareDescription } from "@/lib/share";

type Props = {
  intention: string;
  planet: string;
  tarot: string;
  sephira: string;
  className?: string;
  label?: string;
};

// Shares the public /seal link for a sigil. Uses the native share sheet on supporting
// devices (mobile), and falls back to copying the link to the clipboard everywhere else.
export function ShareButton({
  intention,
  planet,
  tarot,
  sephira,
  className,
  label = "Share this seal",
}: Props) {
  const onShare = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = sealUrl(intention, origin);
    const title = `A sigil for “${intention}”`;
    const text = shareDescription({ planet, tarot, sephira });

    const copy = async () => {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to your clipboard");
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, text, url });
        return;
      }
      await copy();
    } catch (e) {
      // The user dismissing the native share sheet throws AbortError — not an error.
      if (e instanceof DOMException && e.name === "AbortError") return;
      try {
        await copy();
      } catch {
        toast.error("Could not share — copy the link from your address bar");
      }
    }
  };

  return (
    <button
      onClick={onShare}
      className={
        className ??
        "rounded-sm border border-gold/40 bg-gold/5 px-4 py-2 text-xs tracking-widest uppercase text-gold hover:bg-gold/15"
      }
    >
      {label}
    </button>
  );
}
