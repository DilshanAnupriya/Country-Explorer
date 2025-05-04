import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Compass, ArrowRight, ChevronDown, Navigation } from 'lucide-react';

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  
  // Text for typing animation
  const heroTexts = [
    "Discover cultures",
    "Explore hidden gems",
    "Uncover histories",
  ];
  
  // Auto-advance the text every 3 seconds
  useEffect(() => {
    setIsInView(true);
    
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Floating pins data
  const locationPins = [
    { top: "20%", left: "25%", delay: 0 },
    { top: "35%", left: "70%", delay: 0.5 },
    { top: "60%", left: "30%", delay: 1 },
    { top: "70%", left: "65%", delay: 1.5 },
    { top: "25%", left: "45%", delay: 2 },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-blue-700 pt-6 pb-8 rounded-xl mt-[-10px]  mb-16">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
        
        {/* Particles effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={index}
              className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-6  relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side: Text content */}
          <div className="flex-1 space-y-8">
            {/* Badge */}
            <div 
              className={`inline-flex items-center px-3 py-1 mt-1 rounded-full bg-blue-200 border border-blue-300 text-blue-900 text-sm font-medium transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              World Explorer
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="block">Your passport to</span>
              <div className="h-16 md:h-auto relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-100">
                  {heroTexts[activeIndex]}
                </span>
              </div>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-blue-100 max-w-lg">
              Access comprehensive information about countries worldwide, including demographics, 
              cultural insights, and statistical data in one elegantly designed platform.
            </p>
            
            {/* Feature points */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "Detailed Country Profiles" },
                { icon: Compass, text: "Regions & Languages" },
                { icon: Navigation, text: "Interactive Data Exploration" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center text-blue-100 transition-all duration-300 hover:translate-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-3">
                    <feature.icon size={16} className="text-blue-200" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-400 transition shadow-lg shadow-blue-500/20 flex items-center justify-center group">
                Start Exploring
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="px-8 py-3 rounded-lg border-2 border-blue-400 text-blue-100 font-medium hover:bg-blue-800 hover:bg-opacity-30 transition flex items-center justify-center">
                Learn More
              </button>
            </div>
            
            {/* Scroll indicator */}
            <div className="hidden lg:flex items-center text-sm ml-100 text-blue-200 mt-8">
              <ChevronDown size={18} className="mr-2 animate-bounce" />
              Scroll to discover more
            </div>
          </div>
          
          {/* Right side: Globe visualization */}
          <div className="flex-1 flex justify-center items-center">
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Globe container with pulse effect */}
              <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
                {/* Pulse rings */}
                {[1, 2, 3].map((ring) => (
                  <div 
                    key={ring}
                    className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0"
                    style={{
                      animation: `pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${ring * 0.5}s`
                    }}
                  />
                ))}
                
                {/* Rotating outer ring */}
                <div 
                  className="absolute inset-2 rounded-full border-2 border-dashed border-blue-300 opacity-30"
                  style={{
                    animation: "spin 30s linear infinite"
                  }}
                />
                
                {/* Location pins */}
                {locationPins.map((pin, index) => (
                  <div 
                    key={index}
                    className="absolute w-3 h-3"
                    style={{ 
                      top: pin.top, 
                      left: pin.left,
                      animation: `float 3s ease-in-out infinite ${pin.delay}s`
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full bg-blue-400 ${isHovered ? 'scale-125' : ''} transition-transform`}>
                      <div className="absolute -inset-1 rounded-full bg-blue-400 animate-ping opacity-75" />
                    </div>
                  </div>
                ))}
                
                {/* Main globe */}
                <div 
                  className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-2xl transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}
                  style={{
                    animation: "float 6s ease-in-out infinite"
                  }}
                >
                  {/* Globe pattern */}
                  <div className="absolute inset-4 rounded-full border border-blue-300 opacity-20" />
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div 
                          key={index}
                          className="absolute inset-0 border-t border-blue-200"
                          style={{ transform: `rotate(${index * 22.5}deg)` }}
                        />
                      ))}
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div 
                          key={index}
                          className="absolute h-full w-0.5 bg-blue-200 left-1/2"
                          style={{ transform: `translateX(-50%) rotate(${index * 30}deg)` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Centered icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe 
                      size={isHovered ? 48 : 40} 
                      className="text-white transition-all duration-500"
                      style={{
                        animation: isHovered ? "spin 20s linear infinite" : ""
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats below globe */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { value: "190+", label: "Countries" },
                  { value: "24/7", label: "Updates" },
                  { value: "100%", label: "Accuracy" }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS keyframes for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;