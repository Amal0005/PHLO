import React from "react";
import Navbar from "@/components/reusable/userNavbar";
import { Sparkles, Globe, Shield, Zap } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="pt-32 pb-24 px-4 max-w-7xl mx-auto space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">The PHLO Vision</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
            Beyond the <br/>
            <span className="text-gray-500 italic">Lens</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zinc-400 font-medium leading-relaxed">
            PHLO is a premium ecosystem dedicated to bridging the gap between world-class visual creators and those who seek the extraordinary.
          </p>
        </section>

        {/* Brand Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-x-0 -bottom-10 h-72 bg-gradient-to-t from-zinc-900 to-transparent -z-10 opacity-50" />
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1542038783-0219c81962b4?q=80&w=2070" 
                alt="Photography" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Absolute Badges */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full flex items-center justify-center p-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <p className="text-black text-center font-black uppercase tracking-tight text-xs">
                Since 2024
                <br/>
                Digital 1st
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600">The Origins</h3>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                Born to <br/>
                Connect <br/>
                Creativity.
              </h2>
            </div>
            <p className="text-zinc-500 text-lg leading-relaxed">
              We started with a simple observation: the world is saturated with imagery, but authentic connection between creators and clients is increasingly rare. PHLO was built to be more than a marketplace — it's an aesthetic hub where professional standards meet intuitive digital experiences.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <p className="text-4xl font-black italic">500+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Verified Creators</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black italic">10K+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Visual Assets</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="space-y-20">
          <div className="text-center space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Our Core Pillars</h3>
            <h2 className="text-5xl font-black tracking-tighter uppercase">Fundamental Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Aesthetic Integrity", 
                desc: "Every creator on PHLO goes through a rigorous curation process to ensure the highest professional standards." 
              },
              { 
                icon: Zap, 
                title: "Seamless Booking", 
                desc: "We've removed the friction from high-end photography bookings with a focus on intuitive user journeys." 
              },
              { 
                icon: Globe, 
                title: "Creator Economy", 
                desc: "Empowering artists to monetize their excess talent through premium digital wallpaper distributions." 
              }
            ].map((pillar, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all">
                  <pillar.icon size={28} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-4">{pillar.title}</h4>
                <p className="text-zinc-500 leading-relaxed font-semibold text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative rounded-[4rem] overflow-hidden bg-zinc-900 border border-white/5 p-16 md:p-24 text-center space-y-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-rose-500/10 opacity-50" />
          <div className="relative space-y-8">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Join the <br/>
              Movement.
            </h2>
            <p className="max-w-xl mx-auto text-zinc-400 text-lg">
              Whether you're a visionary behind the lens or a dreamer seeking to capture a moment, PHLO is your home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all w-full sm:w-auto">
                Explore Creators
              </button>
              <button className="px-10 py-5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all w-full sm:w-auto">
                Join as Creator
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Aesthetic Footer Decor */}
      <footer className="py-20 border-t border-white/5 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">© 2024 PHLO DIGITAL ARCHIVE</p>
          <div className="flex gap-12">
            {["Instagram", "Twitter", "Dribbble"].map((link) => (
              <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
