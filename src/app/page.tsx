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
  Infinity
} from "lucide-react";
import BackgroundMesh from "@/components/BackgroundMesh";

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
  
  // Failsafe Preloader State
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    // Failsafe timer: forces the preloader off the screen after 2.5s no matter what
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
      {/* BanterBox Custom Preloader */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a]"
          >
            <div className="flex items-center text-3xl md:text-4xl font-semibold text-white tracking-tight">
              <span>Banter</span>
              <div className="relative flex items-center justify-center ml-1 w-[55px] h-[35px]">
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 2.2, times: [0, 0.2, 0.4, 1] }}
                  className="absolute"
                >
                  Box
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, width: "55px", height: "35px", borderRadius: "8px" }}
                  animate={{
                    opacity: [0, 0, 1, 1, 1, 0],
                    width: ["55px", "55px", "35px", "35px", "35px", "35px"],
                    borderRadius: ["8px", "8px", "8px", "50%", "50%", "50%"],
                    scale: [1, 1, 1, 1, 1.2, 0]
                  }}
                  transition={{ 
                    duration: 2.2, 
                    times: [0, 0.3, 0.5, 0.7, 0.85, 1], 
                    ease: "easeInOut" 
                  }}
                  className="absolute bg-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content - CRITICAL: Removed overflow-hidden so mobile triggers work */}
      <main className="relative min-h-screen w-full flex flex-col items-center pb-24 font-sans tracking-tight">
        <BackgroundMesh />

        {/* Sleek Branding Navbar */}
        <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 bg-[#0a0a0a]/50 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-1.5 font-semibold text-white tracking-tight text-lg">
            Banter<div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <button 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Pricing
          </button>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-3xl mx-auto text-center pt-16">
          <motion.div 
            initial="hidden" 
            animate={!isPreloading ? "visible" : "hidden"} 
            variants={fadeUp} 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>The viral couple games, digitized.</span>
          </motion.div>

          <motion.h1 
            initial="hidden" 
            animate={!isPreloading ? "visible" : "hidden"} 
            variants={fadeUp} 
            className="text-4xl md:text-6xl font-semibold text-white mb-5 leading-tight"
          >
            Stop texting. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
              Start playing.
            </span>
          </motion.h1>

          <motion.p 
            initial="hidden" 
            animate={!isPreloading ? "visible" : "hidden"}  
            variants={fadeUp} 
            className="text-base md:text-lg text-zinc-400 mb-10 max-w-xl font-medium"
          >
            The ultimate online playground for couples. Hop on a call, share a room code, and play the games that actually cure long-distance boredom.
          </motion.p>

          <motion.form 
            initial="hidden" 
            animate={!isPreloading ? "visible" : "hidden"}  
            variants={fadeUp} 
            onSubmit={handleSubmit} 
            className="w-full max-w-md relative flex items-center p-1 rounded-full bg-zinc-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "success" || status === "loading"}
              placeholder="Partner's or your email..."
              className="w-full px-5 py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "success" || status === "loading"}
              className="absolute right-1 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? "Secured" : "Get Access"}
            </button>
          </motion.form>
          {status === "success" && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-xs font-medium text-emerald-400 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> You're on the VIP list. Check your inbox.
            </motion.p>
          )}
        </section>

        {/* The Games Showcase */}
        {/* CRITICAL: viewport={{ once: true, amount: 0.1 }} guarantees it fires on mobile */}
        <section className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }} 
            variants={fadeUp} 
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">Curated for connection.</h2>
            <p className="text-zinc-500 text-sm md:text-base">Real-time multiplayer mini-games built specifically for two.</p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }} 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              { 
                icon: <Gamepad2 strokeWidth={1.5} className="w-5 h-5 text-zinc-300" />, 
                title: "Guess the Number", 
                desc: "1 to 100? Or 1 to 1,000? You both secretly lock in a number. Match, and someone owes dinner."
              },
              { 
                icon: <MessageCircle strokeWidth={1.5} className="w-5 h-5 text-zinc-300" />, 
                title: "Word Chain", 
                desc: "Say a word. They type the first thing that comes to mind. Don't break the chain. Gets weird fast."
              },
              { 
                icon: <Cat strokeWidth={1.5} className="w-5 h-5 text-zinc-300" />, 
                title: "Guess the Animal", 
                desc: "20 questions, animal edition. Ask yes/no questions to narrow it down before you run out of guesses."
              },
              { 
                icon: <Shuffle strokeWidth={1.5} className="w-5 h-5 text-zinc-300" />, 
                title: "Unscramble", 
                desc: "Race against the clock to connect letters and decode hidden words. Brains vs. Brains."
              }
            ].map((game, i) => (
              <motion.div 
                key={i} 
                variants={cardVariant} 
                className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-md hover:bg-zinc-800/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  {game.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{game.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{game.desc}</p>
              </motion.div>
            ))}
            
            <motion.div 
              variants={cardVariant} 
              className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-zinc-900/50 to-zinc-900/30 border border-white/5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                  <Infinity strokeWidth={1.5} className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">An expanding library.</h3>
                <p className="text-zinc-400 text-sm">New games, prompts, and challenges added monthly. The fun doesn't cap at 4 games.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }} 
            variants={fadeUp} 
            className="flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl"
          >
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-white mb-2">Lifetime Pass</h2>
              <p className="text-zinc-400 text-sm max-w-xs">Pay once. Unlock all current and future games forever for both of you.</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-4xl font-bold text-white">$5</span>
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">One-Time</span>
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                Get Early Access <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}