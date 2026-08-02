import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { ExtensionStatus } from "../components/landing/ExtensionStatus";
import { TechStack } from "../components/landing/TechStack";
import { Features } from "../components/landing/Features";
import { DemoVideo } from "../components/landing/DemoVideo";
import { Stats } from "../components/landing/Stats";
import { HowToUse } from "../components/landing/HowToUse";
import { PlatformLayer } from "../components/landing/PlatformLayer";
import { ContactUs } from "../components/landing/ContactUs";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <div className="bg-[#0b0f19] min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ExtensionStatus />
      <TechStack />
      <Features />
      <DemoVideo />
      <Stats />
      <HowToUse />
      <PlatformLayer />
      <ContactUs />
      <FinalCTA />
      <Footer />
    </div>
  );
}
