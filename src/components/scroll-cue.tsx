import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export function ScrollCue() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY < 8);
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-10 -translate-x-1/2 text-[#fffdf5] drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-opacity duration-300 sm:bottom-8 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <ChevronDownIcon className="size-7 animate-bounce motion-reduce:animate-none" />
    </div>
  );
}
