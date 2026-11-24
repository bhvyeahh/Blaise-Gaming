'use client';
import {useState} from 'react';
import {GameResult} from '@/components/games/GameResult';
import {PracticeFrame} from '@/components/games/PracticeFrame';
import {PROMPTS,BRAIN_ROUNDS,randomBrainGame,answerBrain,nextBrain,type BrainGame} from '@/lib/banter/brain';
import type {Guest} from '@/lib/banter/contracts';
import {readGuest} from '@/lib/banter/guest';
export default function BrainSync(){
 const [game,setGame]=useState<BrainGame|null>(null);const [guest,setGuest]=useState<Guest|null>(null);const [choice,setChoice]=useState<number|null>(null);
 function start(){setGuest(readGuest());setGame(randomBrainGame());setChoice(null);}
 const round=game?.rounds[game.index];const prompt=round?PROMPTS[round.promptId]:null;
 const matched=round?.playerChoice!==null&&round?.playerChoice===round?.botChoice;
 return <PracticeFrame name="Brain Sync" title={<>Same <em>brain?</em></>} guest={guest} reaction={!game?'welcome':game.phase==='finished'?(game.score>=3?'won':'lost'):game.phase==='reveal'?(matched?'won':'wrong'):'thinking'}>
 {!game?<><p>Pick your answer to five prompts. The computer locks a random choice before you answer. Every match earns one point!</p><button className="bp-button" onClick={start}>LET’S SYNC ↗</button></>:game.phase==='finished'?<GameResult outcome={game.score>=3?'win':'loss'} title={game.score===5?'Brain twins!':game.score>=3?'Pretty in sync!':'Different wavelengths.'} detail={`${game.score}/${BRAIN_ROUNDS} matches · Try again with fresh prompts.`}><button className="bp-button" onClick={start}>PLAY AGAIN ↗</button></GameResult>:round&&prompt&&<><div className="bp-game-meta"><span>ROUND {game.index+1} / {BRAIN_ROUNDS}</span><span>MATCHES {game.score}</span></div><div className="bp-progress" aria-label={`Round ${game.index+1} of ${BRAIN_ROUNDS}`}>{game.rounds.map((r,i)=><span key={r.promptId} className={i===game.index?'current':i<game.index?(r.playerChoice===r.botChoice?'hit':'miss'):''}/>)}</div><h2>{prompt.question}</h2>{game.phase==='choosing'?<><div className="bp-options" role="group" aria-label="Your answer">{prompt.options.map((option,i)=><button key={option} className={`bp-option ${choice===i?'selected':''}`} aria-pressed={choice===i} onClick={()=>setChoice(i)}>{option}</button>)}</div><button className="bp-button" disabled={choice===null} onClick={()=>{if(choice!==null)setGame(g=>g?answerBrain(g,choice):g);}}>LOCK &amp; REVEAL ↗</button></>:<><div className="bp-reveal-pair" aria-live="polite"><div><span>YOU</span><strong>{prompt.options[round.playerChoice!]}</strong></div><div><span>COMPUTER</span><strong>{prompt.options[round.botChoice]}</strong></div></div><p className={`bp-outcome ${matched?'hit':'miss'}`} role="status">{matched?'IT’S A MATCH! +1':'Not quite the same brain!'}</p><button className="bp-button" onClick={()=>{setGame(g=>g?nextBrain(g):g);setChoice(null);}}>{game.index===BRAIN_ROUNDS-1?'SEE RESULTS':'NEXT ROUND'} ↗</button></>}</>}
 </PracticeFrame>;
}
