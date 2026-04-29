import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { EmergencyForm } from "@/components/emergency-form"
import { CampLocator } from "@/components/camp-locator"
import { AlertsSection } from "@/components/alerts-section"
import { AboutHapsSection } from "@/components/about-haps-section"
import { ChatBot } from "@/components/chat-bot"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <EmergencyForm />
        <CampLocator />
        <AlertsSection />
        <AboutHapsSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
