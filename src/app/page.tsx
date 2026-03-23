"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Gamepad2, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Cat, 
  Shuffle, 
  Sparkles,
  Infinity,
  Search,
  Zap,
  Tag,
  Gift
} from "lucide-react";
import BackgroundMesh from "@/components/BackgroundMesh";

// Variants for subtle, premium animations
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  }
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isPreloading, setIsPreloading] = useState(true);

  // Simplified Preloader Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      {/* BanterBox Custom Preloader - Now Light & Playful */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          >
            <div className="flex items-center text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
              <span>Banter</span>
              <div className="relative flex items-center justify-center ml-1 w-[55px] h-[45px] md:h-[55px]">
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 2.2, times: [0, 0.2, 0.4, 1] }}
                  className="absolute"
                >
                  Box
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, width: "55px", height: "45px", borderRadius: "12px" }}
                  animate={{
                    opacity: [0, 0, 1, 1, 1, 0],
                    width: ["55px", "55px", "45px", "45px", "45px", "45px"],
                    borderRadius: ["12px", "12px", "12px", "50%", "50%", "50%"],
                    scale: [1, 1, 1, 1, 1.2, 0]
                  }}
                  transition={{ 
                    duration: 2.2, 
                    times: [0, 0.3, 0.5, 0.7, 0.85, 1], 
                    ease: "easeInOut" 
                  }}
                  className="absolute bg-orange-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content - Light Theme */}
      <main className="relative min-h-screen w-full flex flex-col items-center pb-24 font-sans tracking-tight">
        <BackgroundMesh />

        {/* Sleek Branding Navbar - Crisp White */}
        <header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-zinc-200">
          <div className="flex items-center gap-1.5 font-extrabold text-zinc-900 tracking-tight text-xl">
            Banter<div className="w-3 h-3 bg-blue-600 rounded-sm" />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="text-sm font-bold text-white px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-md"
              >
                Pricing
              </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-7xl mx-auto text-left pt-24 md:pt-16">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">
            
            {/* Left Content */}
            <div className="w-full md:w-1/2">
              <motion.div 
                initial="hidden" 
                animate={!isPreloading ? "visible" : "hidden"} 
                variants={fadeUp} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs md:text-sm font-bold mb-6"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>The viral couple games, digitized.</span>
              </motion.div>

              <motion.h1 
                initial="hidden" 
                animate={!isPreloading ? "visible" : "hidden"} 
                variants={fadeUp} 
                className="text-5xl md:text-7xl font-extrabold text-zinc-900 mb-6 leading-[1.1]"
              >
                YO! LET'S<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  START THE GAME <br className="hidden md:block" /> TOGETHER.
                </span>
              </motion.h1>

              <motion.div 
                initial="hidden" 
                animate={!isPreloading ? "visible" : "hidden"}  
                variants={fadeUp} 
                className="flex items-center gap-4 mb-10 bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm inline-flex"
              >
                  <div className="flex items-center -space-x-3">
                    {[Zap, Cat, Shuffle].map((Icon, i) => (
                      <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'}`}>
                        <Icon strokeWidth={2} className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                <p className="text-sm text-zinc-600 font-bold">Early Access</p>
              </motion.div>

              {/* High-Contrast Joinlist Form */}
              <motion.form 
                initial="hidden" 
                animate={!isPreloading ? "visible" : "hidden"}  
                variants={fadeUp} 
                onSubmit={handleSubmit} 
                className="w-full max-w-lg relative flex items-center p-2 rounded-full bg-white border-2 border-zinc-200 shadow-xl mb-10"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "success" || status === "loading"}
                  placeholder="Partner's or your email..."
                  className="w-full px-6 py-4 bg-transparent text-zinc-900 font-medium placeholder-zinc-400 focus:outline-none text-base transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "success" || status === "loading"}
                  className="absolute right-2 px-8 py-4 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? "Secured" : "Are You Ready?"}
                </button>
              </motion.form>
              {status === "success" && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm font-bold text-emerald-600 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> You're on the VIP list. Check your inbox.
                </motion.p>
              )}
            </div>
            
            {/* Hero Graphic - Vibrant CSS Playful Controller */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative mt-10 md:mt-0">
                 <div className="absolute inset-0 bg-blue-100 rounded-[3rem] rotate-3 scale-105" />
                 <div className="relative w-full h-[350px] md:h-[450px] bg-white border-4 border-zinc-900 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center overflow-hidden">
                    {/* The "Controller" */}
                    <div className="w-[260px] h-[160px] bg-zinc-900 rounded-[4rem] relative flex items-center justify-between px-8 shadow-2xl">
                        {/* D-Pad */}
                        <div className="w-12 h-12 relative">
                           <div className="absolute top-4 left-0 w-12 h-4 bg-zinc-700 rounded-sm" />
                           <div className="absolute top-0 left-4 w-4 h-12 bg-zinc-700 rounded-sm" />
                        </div>
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 rotate-45">
                           <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-inner" />
                           <div className="w-6 h-6 rounded-full bg-blue-500 shadow-inner" />
                           <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-inner" />
                           <div className="w-6 h-6 rounded-full bg-red-500 shadow-inner" />
                        </div>
                        {/* Center lights */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
                           <div className="w-2 h-1 bg-zinc-700 rounded-full" />
                           <div className="w-2 h-1 bg-zinc-700 rounded-full" />
                           <div className="w-2 h-1 bg-zinc-700 rounded-full" />
                        </div>
                    </div>
                    {/* Decorative elements inside the card */}
                    <Sparkles className="absolute top-8 right-8 text-orange-400 w-8 h-8" />
                    <div className="absolute bottom-8 left-8 w-16 h-16 bg-blue-50 rounded-full -z-10" />
                 </div>
            </div>
          </div>
        </section>

        {/* The Stats Section - Clean, Light Data Blocks */}
        

        {/* The Games Showcase - Bright Cards */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-10%" }} 
            variants={fadeUp} 
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-zinc-900">Curated for Connection.</h2>
            <p className="text-zinc-500 text-base md:text-lg font-medium">Real-time multiplayer mini-games built specifically for two.</p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-10%" }} 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { icon: <Zap />, color: "text-orange-600", bg: "bg-orange-100", title: "Guess the Number", desc: "Secretly lock in a number. Match, and someone owes dinner." },
              { icon: <Cat />, color: "text-emerald-600", bg: "bg-emerald-100", title: "Guess the Animal", desc: "20 questions, animal edition. Narrow it down together." },
              { icon: <Shuffle />, color: "text-blue-600", bg: "bg-blue-100", title: "Word Chain", desc: "Don't break the chain. Gets weird fast." },
              { icon: <Search />, color: "text-purple-600", bg: "bg-purple-100", title: "Unscramble", desc: "Race to decode hidden words. Brains vs. Brains." },
              { icon: <MessageCircle />, color: "text-pink-600", bg: "bg-pink-100", title: "Trivia Match", desc: "Test your knowledge on hundreds of topics." },
              { icon: <Gift />, color: "text-yellow-600", bg: "bg-yellow-100", title: "Daily Rewards", desc: "Log in together to unlock special perks and avatars." }
            ].map((game, i) => (
              <motion.div 
                key={i} 
                variants={cardVariant} 
                className="flex items-start gap-5 p-6 rounded-2xl bg-white border-2 border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${game.bg} ${game.color} flex items-center justify-center shrink-0`}>
                    {game.icon}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">{game.title}</h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">{game.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Pricing Section - Vibrant Game Pass Style */}
        <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-zinc-900">Choose Your Level.</h2>
                 <p className="text-zinc-500 text-base max-w-md mx-auto font-medium">Ditch the subscriptions. Pay once, play forever with your partner.</p>
            </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-10%" }} 
            variants={fadeUp} 
            className="w-full p-8 md:p-10 rounded-[2.5rem] bg-white border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] flex flex-col items-start gap-8 relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider">
                <Tag className="w-4 h-4" />
                <span>One-Time Offer</span>
              </div>
              
              <div className="flex items-center gap-5">
                 <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-blue-200">
                    <Infinity strokeWidth={2.5} size={40} />
                 </div>
                 <div className="flex flex-col">
                   <h2 className="text-3xl font-extrabold text-zinc-900 mb-1">Lifetime Pass</h2>
                   <p className="text-zinc-500 font-medium">Unlock all current and future games forever.</p>
                 </div>
              </div>

              <div className="flex items-end gap-2 my-2">
                <span className="text-6xl font-black text-zinc-900 leading-none">$5</span>
                <span className="text-zinc-400 font-bold uppercase tracking-widest pb-1">One-Time</span>
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="w-full px-8 py-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-lg font-extrabold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Secure VIP Access <ArrowRight className="w-6 h-6" />
              </button>
          </motion.div>
        </section>
      </main>
    </>
  );
}