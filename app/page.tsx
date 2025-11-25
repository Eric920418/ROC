import { Section1 } from "@/components/Section1";
import { Section2 } from "@/components/Section2";
import { Section3 } from "@/components/Section3";
import { Section4 } from "@/components/Section4";
import { Section5 } from "@/components/Section5";
import { Section6 } from "@/components/Section6";
import { Section7 } from "@/components/Section7";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Section1 />
      <Marquee />
      <Section7 />
      <Section2 />
      <Section3 />
      <Section4 />
      {/* <Section5 /> */}
      <Section6 />
    </main>
  );
}
