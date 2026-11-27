'use client';
import {useState} from 'react';
import {GameResult} from './GameResult';
import {Cupcake} from './Cupcake';
import {BOARD_SIZE} from '@/lib/banter/poison';
import type {OnlineState,OnlineAction,PoisonMatch} from '@/lib/banter/online';
export function OnlinePoison({state,match:m,online,both,send}:{state:OnlineState;match:PoisonMatch;online:boolean;both:boolean;send:(a:OnlineAction)=>boolean}){
 const you=state.you,partner=you===0?1:0,name=state.players[partner]?.nickname??'Partner';
 const [choice,setChoice]=useState<number|null>(null);
 const setup=m.stage==='setup',finished=m.stage==='finished',yourTurn=m.stage==='playing'&&m.turn===you,canAct=online&&both;
 const won=finished&&m.winner===you;
 function board(own:boolean){
  const picks=m.picks[own?partner:you],trap=own?(m.ownTrap??(setup?choice:null)):m.opponentTrap;
  const selectable=own&&setup&&!m.locked[you]&&canAct;
  return <div className="bp-board" role="group" aria-label={own?'Your cupcake board':`${name}'s cupcake board`}>{Array.from({length:BOARD_SIZE},(_,i)=>{
   const picked=picks.includes(i),trapped=trap===i,enabled=selectable||(!own&&yourTurn&&canAct&&!picked);
   return <button type="button" key={i} disabled={!enabled} className={`bp-cell ${picked?'picked':''} ${trapped?'trapped':''}`} aria-label={`${own?'Your':name+"'s"} cupcake ${i+1}${trapped?', trap':''}${picked?', picked':''}`} aria-pressed={own&&setup?trapped:undefined} onClick={()=>{if(selectable)setChoice(i);else if(enabled&&!own)send({type:'POISON_PICK',round:state.round,move:m.move,cell:i});}}><span className="bp-cell-num">{i+1}</span>{picked&&!trapped?<span className="bp-safe" aria-hidden="true">✓</span>:<Cupcake trap={trapped}/>}</button>;
  })}</div>;
 }
 return <div className="bp-panel bp-live-game bp-poison-live"><div className="bp-game-meta"><span>✿ POISON PICKS</span><span>{setup?'SECRET SETUP':finished?'ROUND COMPLETE':`MOVE ${m.move+1}`}</span></div>
 {!canAct&&!finished&&<p className="bp-outcome" role="status">Connection interrupted. Play resumes when both players reconnect.</p>}
 {setup?<><h2>Hide your little trap.</h2><p>Choose one of your nine cupcakes. Your partner cannot see it.</p><div className="bp-brain-status"><span>{m.locked[you]?'🔒 Your trap is hidden':'Choose your trap'}</span><span>{m.locked[partner]?`🔒 ${name} is ready`:`${name} is choosing…`}</span></div>{board(true)}<button className="bp-button" disabled={!canAct||m.locked[you]||choice===null} onClick={()=>{if(choice!==null)send({type:'POISON_TRAP',round:state.round,cell:choice});}}>{m.locked[you]?'TRAP LOCKED · WAITING…':'HIDE MY TRAP ↗'}</button></>:<>
 <div className={`bp-outcome ${finished?(won?'hit':'miss'):''}`} role="status">{finished?(won?'SWEET VICTORY! Your partner hit your trap.':'OH CRUMBS! You hit the hidden trap.'):yourTurn?'YOUR TURN — pick a cupcake.':`${name.toUpperCase()}’S TURN — hands off!`}</div>
 {m.last&&<p className="bp-small" aria-live="polite">{m.last.seat===you?'You':name} picked cupcake {m.last.cell+1} · {m.last.hit?'TRAPPED!':'Safe!'}</p>}
 <div className="bp-poison-boards"><div><h3>{name}’s board</h3><p>{finished?'Their trap is revealed.':yourTurn?'Pick your next cupcake.':'Wait for your turn.'}</p>{board(false)}</div><div><h3>Your board</h3><p>Your trap is marked.</p>{board(true)}</div></div><div className="bp-game-meta"><span>YOUR PICKS {m.picks[you].length}/9</span><span>PARTNER PICKS {m.picks[partner].length}/9</span></div>
 {finished&&<GameResult outcome={won?'win':'loss'} title={won?'Sweet victory!':'Oh crumbs!'} detail={won?'Your partner found your trap.':'You found your partner’s hidden trap.'}><button className="bp-button" disabled={!online||m.rematch[you]} onClick={()=>send({type:'REMATCH',round:state.round})}>{m.rematch[you]?'WAITING FOR PARTNER…':'REMATCH / RETURN TO LOBBY ↗'}</button><p className="bp-small">Both players agree to return to the lobby. No new invitation needed.</p></GameResult>}
 </>}
 </div>;
}
