import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-display">
      <ThemeToggle />
      Aceprep
    </div>
  );
}
