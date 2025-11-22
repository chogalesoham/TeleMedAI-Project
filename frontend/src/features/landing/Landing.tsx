import { HeroSection } from "./components/HeroSection";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ForUsersSection } from "./components/ForUsersSection";
import { CTASection } from "./components/CTASection";
import { FooterSection } from "./components/FooterSection";

export const Landing = () => {
  return (
    <main className="min-h-screen">
      <div id="home">
        <HeroSection />
      </div>
      <ProblemSection />
      <SolutionSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="for-patients">
        <ForUsersSection />
      </div>
      <div id="for-doctors">
        <ForUsersSection />
      </div>
      <div id="contact">
        <CTASection />
      </div>
      <FooterSection />
    </main>
  );
};

export default Landing;
