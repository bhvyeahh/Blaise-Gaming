"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronRight,
  CircleHelp, Gamepad2, Heart, LockKeyhole,
  Mail, Minus, Play, RotateCcw, Send, Sparkles,
  Star, Trophy, Zap
} from "lucide-react";

type Feedback = "higher" | "lower" | "correct" | "out" | null;
type HistoryItem = { number: number; hint: "Higher" | "Lower" | "Correct" };
const MAX_TRIES = 7;
const makeSecret = () => Math.floor(Math.random() * 100) + 1;

const games = [
  { id: "01", title: "Guess the Number", kind: "Logic / Luck", label: "PLAYABLE NOW", text: "A secret number. Seven guesses. How well can you read the clues?", color: "lime", icon: "#", available: true },
  { id: "02", title: "Mind Meld", kind: "Think Alike", label: "COMING SOON", text: "Different minds, same answer. Can you sync your thoughts?", color: "purple", icon: "✳", available: false },
  { id: "03", title: "Poison Cupcake", kind: "Bluff / Strategy", label: "COMING SOON", text: "Pick a cupcake. Don't pick the cursed one. Trust nobody.", color: "peach", icon: "✿", available: false },
  { id: "04", title: "Word Jinx", kind: "Word Battle", label: "COMING SOON", text: "Think of an answer your opponent would never think of.", color: "blue", icon: "Aa", available: false },
];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [secret, setSecret] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSecret(makeSecret());
  }, []);

  const resetGame = () => {
    setSecret(makeSecret());
    setGuess("");
    setHistory([]);
    setFeedback(null);
    setError("");
  };

  const submitGuess = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (secret === null || feedback === "correct" || feedback === "out") return;
    const number = Number(guess);
    if (!/^\d+$/.test(guess.trim()) || !Number.isInteger(number) || number < 1 || number > 100) {
      setError("Enter a whole number from 1 to 100.");
      return;
    }
    if (history.some((item) => item.number === number)) {
      setError("Already tried that number. Pick another!");
      return;
    }
    setError("");
    const hint = number === secret ? "Correct" : number < secret ? "Higher" : "Lower";
    const next = [...history, { number, hint } as HistoryItem];
    setHistory(next);
    setGuess("");
    setFeedback(number === secret ? "correct" : next.length >= MAX_TRIES ? "out" : hint.toLowerCase() as Feedback);
  };

  const signup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setStatusText("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Couldn't sign you up right now.");
      setStatus("success");
      setStatusText("You're on the list. We'll email you when the beta is ready!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setStatusText(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="bb-site" id="top">
      <div className="noise" aria-hidden="true" />
      <div className="announcement">
        <span className="announcement-dot" />
        YOUR NEW FAVORITE GAME NIGHT IS IN THE MAKING
        <span className="announcement-star">✳</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="BanterBox home" onClick={() => setMenuOpen(false)}>
            banter<span>box</span><span className="wordmark-mark">✳</span>
          </a>
          <nav className={menuOpen ? "main-nav nav-open" : "main-nav"} aria-label="Main navigation">
            <a href="#games" onClick={() => setMenuOpen(false)}>THE GAMES</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>HOW IT WORKS</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>THE VIBE</a>
          </nav>
          <button className="nav-cta" onClick={() => scrollTo("early-access")}>GET EARLY ACCESS <ArrowUpRight size={17} /></button>
          <button className="menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <Minus /> : <span>☰</span>}</button>
        </div>
      </header>

      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> THE INTERNET'S NEXT GAME NIGHT <Sparkles size={13} /></div>
          <h1 id="hero-title">TWO PLAYERS.<br /><span className="hero-line"><span className="hero-accent">ZERO</span> CHILL<span className="hero-period">.</span></span></h1>
          <p className="hero-description">Ridiculously fun mini-games for you and your favorite person. Same couch or different time zones. <strong>Just send a link and let the chaos begin.</strong></p>
          <div className="hero-actions">
            <Link href="/play" className="btn btn-outline">EXPLORE PLAYCLUB <ArrowUpRight size={18}/></Link>
            <button className="btn btn-dark" onClick={() => scrollTo("demo")}>TRY A GAME <Play size={16} fill="currentColor" /></button>
            <button className="btn btn-outline" onClick={() => scrollTo("early-access")}>JOIN THE WAITLIST <ArrowUpRight size={17} /></button>
          </div>
          <div className="hero-footnote"><span className="mini-avatars"><span>☺</span><span>✳</span><span>★</span></span><span>BUILT FOR TWO. MADE FOR LAUGHS.</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of two people playing a numbers game">
          <div className="art-circle circle-one" />
          <div className="art-circle circle-two" />
          <motion.div className="floating-label label-one" animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-8, -5, -8] }} transition={{ duration: 4, repeat: Infinity }}>GOOD LUCK! <Star size={14} fill="currentColor" /></motion.div>
          <motion.div className="art-card card-back" animate={reduceMotion ? undefined : { rotate: [-10, -8, -10] }} transition={{ duration: 5, repeat: Infinity }}>
            <span className="card-corner">PLAYER 02</span><div className="art-symbol">?</div><span className="card-bottom">TAKE A GUESS ↗</span>
          </motion.div>
          <motion.div className="art-card card-front" animate={reduceMotion ? undefined : { y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
            <div className="card-topline"><span>PLAYER 01</span><Heart size={20} fill="currentColor" /></div>
            <div className="card-number">42<span>?</span></div>
            <div className="card-card-footer"><span>IS THIS YOUR NUMBER?</span><span>↗</span></div>
          </motion.div>
          <motion.div className="floating-label label-two" animate={reduceMotion ? undefined : { y: [0, 7, 0], rotate: [7, 9, 7] }} transition={{ duration: 4.8, repeat: Infinity }}>NO WAY!! <Zap size={15} fill="currentColor" /></motion.div>
          <div className="art-doodle doodle-one">✳</div><div className="art-doodle doodle-two">✦</div>
        </div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDownRight size={15} /></span><span>01 / THE FUN STARTS HERE</span></div>
      </section>

      <section className="marquee-strip" aria-label="Brand message"><div className="marquee-track">{Array.from({length: 4}).map((_, i) => <span key={i}>LESS SCROLLING <span>✳</span> MORE PLAYING <span>✳</span> GOOD GAMES, BETTER COMPANY <span>✳</span> </span>)}</div></section>

      <section className="section demo-section" id="demo" aria-labelledby="demo-title">
        <div className="shell">
          <div className="section-heading centered"><span className="section-kicker">01 / PLAY BEFORE YOU BELIEVE</span><h2 id="demo-title">Don't just read about it.<br /><em>Play a round.</em></h2><p>Here's a little taste of BanterBox. Take on the computer and see if you can crack its secret number.</p></div>
          <div className="demo-layout">
            <div className="demo-intro"><div className="demo-side-icon">#</div><span className="pill-label">SOLO PREVIEW</span><h3>Guess the<br /><i>number.</i></h3><p>The computer has picked a secret number from 1–100. You've got seven guesses to figure it out. We'll tell you whether to go higher or lower.</p><div className="demo-mini-note"><CircleHelp size={18} /><span>This is a single-player demo. Two-player rooms are planned for the full game.</span></div><div className="demo-decoration">↗</div></div>
            <div className="game-shell">
              <div className="game-top"><div className="game-brand"><span className="live-dot" /> BANTERBOX ARCADE</div><span>SOLO MODE ✳</span></div>
              <div className="game-core"><div className="game-meta"><span>GAME 001 / GUESS THE NUMBER</span><span>VS. COMPUTER <span className="game-status-dot" /></span></div>
                <div className="computer-number"><span className="tiny-label">COMPUTER'S SECRET NUMBER</span><AnimatePresence mode="wait"><motion.div key={feedback === "correct" || feedback === "out" ? "reveal" : "hidden"} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="secret-display">{feedback === "correct" || feedback === "out" ? secret : "??"}</motion.div></AnimatePresence><span className="number-caption">{feedback === "correct" ? "YOU CRACKED IT!" : feedback === "out" ? "THE SECRET IS OUT!" : "SOMEWHERE BETWEEN 1 AND 100"}</span></div>
                <div className="guess-label-row"><span>YOUR GUESSES</span><span>{history.length} / {MAX_TRIES} USED</span></div>
                <div className="attempts" aria-label={`${MAX_TRIES - history.length} guesses remaining`}>{Array.from({length: MAX_TRIES}).map((_, i) => <div key={i} className={`attempt ${i < history.length ? history[i].hint === "Correct" ? "won" : "used" : ""}`}>{i < history.length ? history[i].number : "·"}</div>)}</div>
                <div className="game-feedback" role="status" aria-live="polite">{feedback === "higher" ? <><ArrowUpRight size={21} /> TOO LOW! GO HIGHER.</> : feedback === "lower" ? <><ArrowDownRight size={21} /> TOO HIGH! GO LOWER.</> : feedback === "correct" ? <><Trophy size={21} /> YOU WIN! IN {history.length} {history.length === 1 ? "TRY" : "TRIES"}.</> : feedback === "out" ? <>GAME OVER! THE NUMBER WAS {secret}.</> : <>THE COMPUTER IS WAITING FOR YOUR FIRST GUESS…</>}</div>
                {feedback === "correct" || feedback === "out" ? <button className="btn game-submit" onClick={resetGame}><RotateCcw size={18} /> PLAY ANOTHER ROUND</button> : <form className="guess-form" onSubmit={submitGuess}><label className="sr-only" htmlFor="guess-input">Your guess from 1 to 100</label><input id="guess-input" name="guess" type="number" inputMode="numeric" min={1} max={100} step={1} placeholder="YOUR GUESS (1–100)" value={guess} onChange={e => {setGuess(e.target.value); setError("");}} aria-invalid={!!error} /><button className="btn game-submit" type="submit">LOCK IT IN <ArrowRight size={19} /></button></form>}
                {error && <p className="game-error" role="alert">{error}</p>}
                <div className="guess-history"><span>PREVIOUS MOVES</span><div>{history.length ? history.slice().reverse().map((item, i) => <span key={`${item.number}-${i}`}>{item.number} <small>{item.hint === "Correct" ? "✓" : item.hint === "Higher" ? "↑" : "↓"}</small></span>) : <em>YOUR MOVES WILL APPEAR HERE</em>}</div></div>
              </div>
              <div className="game-bottom"><span><LockKeyhole size={14} /> NO SIGNUP NEEDED</span><span>JUST FOR FUN ✳</span></div>
            </div>
          </div>
          <div className="demo-cta">Imagine playing this with your favorite person, live. <button onClick={() => scrollTo("early-access")}>GET INVITED <ArrowUpRight size={17}/></button></div>
        </div>
      </section>

      <section className="section library-section" id="games" aria-labelledby="games-title"><div className="shell"><div className="library-heading"><div><span className="section-kicker">02 / THE GAME COLLECTION</span><h2 id="games-title">Pick your <span>chaos.</span></h2></div><p>Quick rounds. Questionable decisions. Great stories afterward. We're starting small and building the best ones first.</p></div><div className="games-grid">{games.map((game) => <div className={`library-card tone-${game.color}`} key={game.id}><div className="library-card-top"><span>{game.id} / {game.kind.toUpperCase()}</span><ArrowUpRight size={22}/></div><div className="library-icon">{game.icon}</div><div className="library-bottom"><span className="library-status">{game.label}</span><h3>{game.title}</h3><p>{game.text}</p>{game.available ? <button onClick={() => scrollTo("demo")}>TRY THE DEMO <ArrowRight size={17}/></button> : <span className="coming-label">IN THE WORKS <span>↗</span></span>}</div></div>)}</div><div className="library-foot"><Sparkles size={18}/> MORE GAMES WILL BE ANNOUNCED AS WE BUILD.</div></div></section>

      <section className="section how-section" id="how"><div className="shell"><div className="section-heading centered"><span className="section-kicker">03 / EASY AS 1, 2, PLAY</span><h2>Less setup.<br /><em>More laughing.</em></h2><p>Our goal for the full release: make it ridiculously easy for two people to get into a game together.</p></div><div className="steps-grid"><div className="step-card"><div className="step-visual"><span className="step-orb orb-lime"><Gamepad2 size={37}/></span><span className="step-spark">✳</span></div><span className="step-no">01 / PICK</span><h3>Pick a game.</h3><p>Something clever, silly or just a little competitive. You choose.</p></div><div className="step-card"><div className="step-visual"><span className="step-orb orb-purple"><Send size={34}/></span><span className="step-spark">↗</span></div><span className="step-no">02 / INVITE</span><h3>Send a link.</h3><p>Your person joins from their own device, wherever they happen to be.</p></div><div className="step-card"><div className="step-visual"><span className="step-orb orb-peach"><Heart size={36}/></span><span className="step-spark">★</span></div><span className="step-no">03 / PLAY</span><h3>Let chaos begin.</h3><p>Race, guess, bluff and laugh. Rematch strongly encouraged.</p></div></div><p className="planned-note">✳ The multiplayer experience shown here is planned for launch, not available in this demo.</p></div></section>

      <section className="vibe-section" id="about"><div className="shell vibe-inner"><div className="vibe-symbol">☺</div><div className="vibe-text"><span className="section-kicker">04 / WHY WE'RE MAKING THIS</span><h2>Because “wyd?”<br />is getting <em>old.</em></h2><p>Long-distance date? Same couch, different screens? Just bored together? BanterBox is for turning ordinary moments into ridiculously memorable ones.</p><span className="vibe-stamp"><Heart size={16} fill="currentColor" /> MADE FOR YOUR FAVORITE HUMAN</span></div></div></section>

      <section className="section access-section" id="early-access"><div className="shell"><div className="access-panel"><div className="access-decoration decoration-top">✳</div><div className="access-decoration decoration-bottom">★</div><div className="eyebrow access-eyebrow"><span className="eyebrow-dot" /> THE INVITE LIST IS OPEN</div><h2>Wanna be<br /><em>player one?</em></h2><p>We're building BanterBox one great game at a time. Join the waitlist to get beta updates and first dibs when multiplayer opens.</p><form className="access-form" onSubmit={signup}><label className="sr-only" htmlFor="waitlist-email">Email address</label><Mail size={20} aria-hidden="true" /><input id="waitlist-email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={event => {setEmail(event.target.value); if(status === "error") setStatus("idle");}} disabled={status === "loading"} /><button type="submit" disabled={status === "loading"}>{status === "loading" ? "JOINING…" : status === "success" ? "JOINED!" : "COUNT ME IN"} <ArrowRight size={19}/></button></form><div aria-live="polite" className={`form-message ${status}`}>{statusText || "No spam, no fake launch countdowns. Just the good stuff."}</div><div className="access-pills"><span><Check size={14}/> EARLY GAME UPDATES</span><span><Check size={14}/> BETA INVITES</span><span><Check size={14}/> BEHIND THE SCENES</span></div></div></div></section>

      <footer className="footer"><div className="shell"><div className="footer-main"><div><a className="wordmark footer-logo" href="#top">banter<span>box</span><span className="wordmark-mark">✳</span></a><p>Good games. Better company.<br/>Made for two, wherever you are.</p></div><div className="footer-links"><a href="#demo">PLAY DEMO <ChevronRight size={14}/></a><a href="#games">THE GAMES <ChevronRight size={14}/></a><a href="#early-access">EARLY ACCESS <ChevronRight size={14}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BANTERBOX. MADE WITH ♥ AND A LITTLE CHAOS.</span><a href="#top">BACK TO TOP ↑</a></div></div></footer>
    </main>
  );
}
