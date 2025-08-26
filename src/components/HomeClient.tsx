'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useActiveSection } from '@/hooks/useScrollAnimation';
import { ScrollAnimateWrapper } from '@/components/ScrollAnimateWrapper';
import { Studio } from '@/types';
import StudioCard from '@/components/StudioCard';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';

interface HomeClientProps {
  studios: Studio[];
}

export default function HomeClient({ studios }: HomeClientProps) {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeSection = useActiveSection();

  const handleReserve = (studio: Studio) => {
    setSelectedStudio(studio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudio(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold text-white font-sf">Misk Studios</h1>
            </div>
            
            {/* Right side - Navigation and Controls */}
            <div className="flex items-center space-x-8">
              {/* Main Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a 
                  href="#studios" 
                  className={`nav-item text-white hover:text-misk-yellow transition-colors ${activeSection === 'studios' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('studios')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Nos Studios
                </a>
                <a 
                  href="#about" 
                  className={`nav-item text-white hover:text-misk-yellow transition-colors ${activeSection === 'about' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  À propos
                </a>
                <a 
                  href="#services" 
                  className={`nav-item text-white hover:text-misk-yellow transition-colors ${activeSection === 'services' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Services
                </a>
                <a 
                  href="#contact" 
                  className={`nav-item text-white hover:text-misk-yellow transition-colors ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact
                </a>
              </nav>
              
              {/* Social Media Icons */}
              <div className="hidden md:flex items-center space-x-3">
                <a href="https://www.facebook.com/miskstudios" className="text-white hover:text-misk-yellow transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/miskstudios" className="text-white hover:text-misk-yellow transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324C5.802 8.246 6.953 7.756 8.25 7.756s2.448.49 3.324 1.297c.876.807 1.366 1.958 1.366 3.255s-.49 2.448-1.366 3.255c-.876.807-2.027 1.297-3.324 1.297z"/>
                  </svg>
                </a>
                <a href="https://soundcloud.com/miskstudios" className="text-white hover:text-misk-yellow transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 16.176c-.22 0-.44-.071-.624-.208l-4.944-3.68-4.944 3.68c-.184.137-.404.208-.624.208-.275 0-.544-.107-.752-.312-.416-.41-.416-1.072 0-1.482L10.624 12 5.68 9.618c-.416-.41-.416-1.072 0-1.482.208-.205.477-.312.752-.312.22 0 .44.071.624.208l4.944 3.68 4.944-3.68c.184-.137.404-.208.624-.208.275 0 .544.107.752.312.416.41.416 1.072 0 1.482L13.376 12l4.944 2.382c.416.41.416 1.072 0 1.482-.208.205-.477.312-.752.312z"/>
                  </svg>
                </a>
              </div>
              
              {/* Mobile Menu Button */}
              <button className="md:hidden text-white hover:text-misk-yellow transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white animate-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-load animate-fade-in-left">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-sf animate-on-load animate-fade-in-up">
                Studios Professionnels
                <span className="block animate-on-load animate-fade-in-up animation-delay-200" style={{color: '#fada00'}}>à Tunis</span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed font-sf animate-on-load animate-fade-in-up animation-delay-300">
                Louez des espaces créatifs équipés avec du matériel de pointe pour vos projets de 
                podcast, enregistrement, streaming et production. Qualité professionnelle garantie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-on-load animate-fade-in-up animation-delay-400">
                <a 
                  href="#studios" 
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center text-black font-semibold font-montserrat hover-scale animate-glow-pulse"
                  style={{backgroundColor: '#fada00'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8c400'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fada00'}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('studios')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Découvrir nos studios
                </a>
                <a 
                  href="#contact" 
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300 text-center font-montserrat hover-lift"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Nous contacter
                </a>
              </div>
            </div>
            <div className="relative animate-on-load animate-fade-in-right animation-delay-200">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl hover-lift">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                >
                  <source src="/videos/misk-studios-bg-video.mp4" type="video/mp4" />
                  {/* Fallback image if video fails to load */}
                  <Image
                    src="https://picsum.photos/seed/hero-studio/800/600"
                    alt="Studio professionnel Misk Studios"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </video>
                {/* Enhanced gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
                
                {/* Video controls overlay (optional) */}
                <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    onClick={(e) => {
                      const video = e.currentTarget.parentElement?.parentElement?.querySelector('video');
                      if (video) {
                        if (video.paused) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              {/* Floating cards with animations */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg animate-float hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 font-medium">Disponible 24/7</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg animate-float hover-lift" style={{animationDelay: '1s'}}>
                <div className="text-gray-800">
                  <div className="text-2xl font-bold transition-all duration-300 hover:scale-110" style={{color: '#fada00'}}>{studios.length}</div>
                  <div className="text-sm">Studios</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-100/30 blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-yellow-200/40 blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimateWrapper className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-sf">
              Pourquoi choisir Misk Studios ?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des installations modernes et un service professionnel pour donner vie à vos projets créatifs
            </p>
          </ScrollAnimateWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimateWrapper delay={100} className="text-center feature-card p-6 rounded-xl bg-white shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 feature-icon">
                <svg className="w-8 h-8" style={{color: '#fada00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-sf">Équipement Professionnel</h4>
              <p className="text-gray-600 leading-relaxed">
                Matériel audio et vidéo de dernière génération pour une qualité irréprochable
              </p>
            </ScrollAnimateWrapper>
            
            <ScrollAnimateWrapper delay={200} className="text-center feature-card p-6 rounded-xl bg-white shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 feature-icon">
                <svg className="w-8 h-8" style={{color: '#fada00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-sf">Espaces Acoustiques</h4>
              <p className="text-gray-600 leading-relaxed">
                Studios traités acoustiquement pour un enregistrement optimal sans parasites
              </p>
            </ScrollAnimateWrapper>
            
            <ScrollAnimateWrapper delay={300} className="text-center feature-card p-6 rounded-xl bg-white shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 feature-icon">
                <svg className="w-8 h-8" style={{color: '#fada00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-sf">Support Technique</h4>
              <p className="text-gray-600 leading-relaxed">
                Assistance technique disponible pour vous accompagner dans vos productions
              </p>
            </ScrollAnimateWrapper>
          </div>
        </div>
      </section>

      {/* Studios Section */}
      <section id="studios" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimateWrapper className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-sf">
              Nos Studios Disponibles
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez l&apos;espace qui correspond le mieux à votre projet créatif
            </p>
          </ScrollAnimateWrapper>
          
          {/* Studios Grid */}
          {studios.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 text-lg">Aucun studio disponible pour le moment</p>
            </div>
          )}

          {studios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {studios.map((studio, index) => (
                <ScrollAnimateWrapper key={studio.id} delay={index * 100}>
                  <StudioCard
                    studio={studio}
                    onReserve={handleReserve}
                  />
                </ScrollAnimateWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section id="services" className="py-16" style={{backgroundColor: '#fada00'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimateWrapper>
            <h3 className="text-3xl font-bold text-black mb-4 font-sf">
              Prêt à concrétiser votre projet ?
            </h3>
            <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins et réserver le studio parfait pour votre création.
            </p>
            <a
              href="#contact"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors font-montserrat"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contactez-nous
            </a>
          </ScrollAnimateWrapper>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-sf">
              Contactez-nous
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre équipe est là pour vous aider à trouver la solution parfaite pour votre projet
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" style={{color: '#fada00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Adresse</h4>
              <p className="text-gray-600">
                Tunis, Tunisie<br />
                (Localisation exacte communiquée lors de la réservation)
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" style={{color: '#fada00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Téléphone</h4>
              <p className="text-gray-600">
                +216 XX XXX XXX<br />
                Disponible 7j/7
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" style={{color: '#fada00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">
                contact@misk-studios.com<br />
                Réponse sous 24h
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        studio={selectedStudio}
      />
    </div>
  );
}
