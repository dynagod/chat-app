import React, { useState, useEffect } from 'react';
import {Zap, Palette, Globe, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Customizable Themes",
      description: "Personalize your chat experience with beautiful themes and color schemes",
      highlight: "15+ Themes"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-Time Messaging",
      description: "Lightning-fast messaging with instant delivery and read receipts",
      highlight: "< 50ms latency"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Browser-Based Access",
      description: "No downloads needed—chat directly from any modern browser",
      highlight: "Zero Install"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "15+", label: "Themes" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className={`py-12 md:py-16 text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                New themes available
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-base-content leading-tight">
              Chat <span className="text-primary">Beautifully</span><br />
              Connect <span className="text-secondary">Instantly</span>
            </h1>
            <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Experience seamless communication with our modern web chat platform. 
              Customize your interface, connect with anyone, anywhere.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to='/chat' className="btn btn-primary btn-lg px-8 group">
              Start Chatting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-base-content/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main App Screenshot */}
        <div className={`py-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
            <div className="relative p-6 bg-base-200/50 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden border border-base-300">
                  {/* Mock browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-base-200 border-b border-base-300">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-base-100 rounded px-3 py-1 text-xs text-base-content/70 inline-block">
                        chat.example.com
                      </div>
                    </div>
                  </div>
                  
                  {/* Image placeholder for main chat interface */}
                  <div className="bg-gradient-to-br from-base-300 to-base-200 flex items-center justify-center relative overflow-hidden">
                    
                    <div className="text-center relative z-10">
                      <img src="Chatty-Chat.png" alt="Chat Preview" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`py-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Built with modern technology and designed for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  activeFeature === index ? 'ring-2 ring-primary ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-base-content">{feature.title}</h3>
                      <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-base-content/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings/Themes Preview Section */}
        <div className={`py-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Customize Your Experience
            </h2>
            <p className="text-lg text-base-content/70">
              Choose from beautiful themes to make the chat truly yours
            </p>
          </div>

          <div className="relative rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-2xl">
            <div className="p-6 bg-base-200/50">
              <div className="max-w-4xl mx-auto">
                <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
                  {/* Image placeholder for settings/themes interface */}
                  <div className="bg-gradient-to-br from-base-300 to-base-200 flex items-center justify-center relative overflow-hidden">
                    <img src="Chatty-Settings.png" alt="Settings Image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`py-16 text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 border border-base-300">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-warning text-warning" />
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                Ready to Start Chatting?
              </h2>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Join thousands of users who trust our platform for their daily communication needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to='/chat' className="btn btn-primary btn-lg px-8 group">
                  Open Chat App
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn btn-outline btn-lg px-8">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;