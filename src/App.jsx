import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Timeline from './components/Timeline'
import Projects from './components/Projects'
import SkillsDashboard from './components/SkillsDashboard'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ResumeModal from './components/ResumeModal'
import ContactModal from './components/ContactModal'

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleOpenResumeModal = () => setIsResumeModalOpen(true)
  const handleCloseResumeModal = () => setIsResumeModalOpen(false)

  const handleOpenContactModal = () => setIsContactModalOpen(true)
  const handleCloseContactModal = () => setIsContactModalOpen(false)

  return (
    <div className="min-h-screen bg-snow text-graphite selection:bg-coral selection:text-white relative">
      {/* Floating Signature Navbar */}
      <Navbar 
        onOpenResumeModal={handleOpenResumeModal} 
        onOpenContactModal={handleOpenContactModal}
      />

      {/* Hero Section */}
      <Hero 
        onOpenResumeModal={handleOpenResumeModal} 
        onOpenContactModal={handleOpenContactModal}
      />

      {/* Manifesto / About Section */}
      <About />

      {/* Living Experience Timeline */}
      <Timeline />

      {/* Showcase Featured Projects */}
      <Projects />

      {/* Interactive Competency Skills Dashboard */}
      <SkillsDashboard />

      {/* Education Foundations */}
      <Education />

      {/* Contact & Bridge Section */}
      <Contact 
        onOpenResumeModal={handleOpenResumeModal} 
        onOpenContactModal={handleOpenContactModal}
      />

      {/* Footer */}
      <Footer />

      {/* Interactive Printable PDF Resume Modal */}
      <ResumeModal 
        isOpen={isResumeModalOpen} 
        onClose={handleCloseResumeModal} 
      />

      {/* Modern Contact Form Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseContactModal} 
      />
    </div>
  )
}
