import HeroSection from "../../../components/dashboard/HeroSection";
import TrustedRibbon from "../../../components/dashboard/TrustedRibbon";
import StatsSection from "../../../components/dashboard/StatsSection";
import ThreatIntel from "../../../components/dashboard/ThreatIntel";
import FeaturesSection from "../../../components/dashboard/FeaturesSection";
import JourneySection from "../../../components/dashboard/JourneySection";
import DashboardPreview from "../../../components/dashboard/DashboardPreview";
import AIAssistantSection from "../../../components/dashboard/AIAssistantSection";
import LeaderboardPreview from "../../../components/dashboard/LeaderboardPreview";
import StandardsSection from "../../../components/dashboard/StandardsSection";
import TestimonialSection from "../../../components/dashboard/TestimonialSection";
import FAQSection from "../../../components/dashboard/FAQSection";
import CTASection from "../../../components/dashboard/CTASection";
import CyberTicker from "../../../components/dashboard/CyberTicker";
import AboutPlatform from "../../../components/dashboard/AboutPlatform";
import ThreatMapSection from "../../../components/dashboard/ThreatMapSection";
import TrainingPreviewSection from "../../../components/dashboard/TrainingPreviewSection";
import PhishingPreviewSection from "../../../components/dashboard/PhishingPreviewSection";
import QuizPreviewSection from "../../../components/dashboard/QuizPreviewSection";
import ThemePreviewSection from "../../../components/dashboard/ThemePreviewSection";
import SecurityPillarsSection from "../../../components/dashboard/SecurityPillarsSection";
import ContactSection from "../../../components/dashboard/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CyberTicker />
      <AboutPlatform />   
      <TrustedRibbon />
      <StatsSection />
      <ThreatIntel />
      <ThreatMapSection />
<TrainingPreviewSection />
<PhishingPreviewSection />
<QuizPreviewSection />
      <FeaturesSection />
      <JourneySection />
      <DashboardPreview />
      <AIAssistantSection />
      <LeaderboardPreview />
      <StandardsSection />
      <TestimonialSection />
      <SecurityPillarsSection />
<ThemePreviewSection />
<ContactSection />
      <FAQSection />
      <CTASection />
    </>
  );
}