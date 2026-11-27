'use client';
import {useState} from 'react';
import {GameResult} from '@/components/games/GameResult';
import {PracticeFrame} from '@/components/games/PracticeFrame';
import {BOARD_SIZE,newPoisonGame,placeTrap,computerTurn,type PoisonGame} from '@/lib/banter/poison';
import {readGuest} from '@/lib/banter/guest';
import type {Guest} from '@/lib/banter/contracts';
import {Cupcake} from '@/components/games/Cupcake';
export default function PoisonPicks(){
 const [game,setGame]=useState<PoisonGame|null>(null);const [guest,setGuest]=useState<Guest|null>(null);const [trapChoice,setTrapChoice]=useState<number|null>(null);
 function start(){setGuest(readGuest());setGame(newPoisonGame(Math.floor(Math.random()*BOARD_SIZE)));setTrapChoice(null);}
 const over=game?.phase==='won'||game?.phase==='lost';
 function board(own:boolean){if(!game)return null;const setup=game.phase==='setup';const picks=own?game.botPicks:game.playerPicks;const trap=own?(setup?trapChoice:game.playerTrap):over?game.botTrap:null;
 return <div className="bp-board" role="group" aria-label={own?'Your cupcake board':'Computer cupcake board'}>{Array.from({length:BOARD_SIZE},(_,i)=>{const picked=picks.includes(i);const trapped=trap===i;const interactive=own?setup:game.phase==='playing'&&!picked;return <button key={i} type="button" className={`bp-cell ${picked?'picked':''} ${trapped?'trapped':''}`} disabled={!interactive} aria-label={`${own?'Your':'Computer'} cupcake ${i+1}${trapped?', trap':''}${picked?', picked':''}`} aria-pressed={own&&setup?trapped:undefined} onClick={()=>{if(own&&setup)setTrapChoice(i);else if(!own&&game.phase==='playing')setGame(computerTurn(game,i));}}><span className="bp-cell-num">{i+1}</span>{picked&&!trapped?<span className="bp-safe" aria-hidden="true">✓</span>:<Cupcake trap={trapped}/>}</button>})}</div>;
 }
 return <PracticeFrame name="Poison Picks" title={<>Sweet little <em>trap.</em></>} guest={guest} reaction={!game?'welcome':game.phase==='won'?'won':game.phase==='lost'?'lost':'thinking'}>
 {!game?<><p>Hide a trap in your nine cupcakes. Pick from the computer’s board, then it picks from yours. First to hit a trap loses.</p><button className="bp-button" onClick={start}>START THE CHAOS ↗</button></>:game.phase==='setup'?<><h2>Hide your trap.</h2><p>Pick one cupcake on your board. The computer won't use your choice to decide its moves.</p>{board(true)}<button className="bp-button" disabled={trapChoice===null} onClick={()=>{if(trapChoice!==null)setGame(g=>g?placeTrap(g,trapChoice):g);}}>HIDE THE TRAP ↗</button></>:<><p className={`bp-outcome ${game.phase==='won'?'hit':game.phase==='lost'?'miss':''}`} role="status">{game.phase==='won'?'YOU WIN! Computer hit your trap.':game.phase==='lost'?'TRAPPED! You picked the computer’s trap.':game.botPicks.length?`Computer chose cupcake ${game.botPicks.at(-1)!+1}. Both safe! Your turn.`:'Your turn — choose a cupcake.'}</p><div className="bp-poison-boards"><div><h3>Computer’s board</h3><p>Pick a cupcake here.</p>{board(false)}</div><div><h3>Your board</h3><p>Your trap is marked.</p>{board(true)}</div></div><div className="bp-game-meta"><span>YOUR PICKS {game.playerPicks.length}</span><span>BOT PICKS {game.botPicks.length}</span></div>{over&&<GameResult outcome={game.phase==='won'?'win':'loss'} title={game.phase==='won'?'Sweet victory!':'Oh crumbs!'} detail={game.phase==='won'?'The computer found your trap.':'You found the hidden trap. Revenge?'}><button className="bp-button" onClick={start}>REMATCH ↗</button></GameResult>}</>}
 </PracticeFrame>;
}
