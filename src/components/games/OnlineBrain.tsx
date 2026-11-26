'use client';
import {useEffect,useState} from 'react';
import {GameResult} from './GameResult';
import type {BrainMatch,OnlineState,OnlineAction} from '@/lib/banter/online';
const titles=['Different planets','Different planets','Beautiful chaos','Same Wi-Fi, different brains','Almost telepathic','Certified soulmates'];
function Clock({deadline,serverNow,stage}:{deadline:number;serverNow:number;stage:string}){
 const duration=stage==='countdown'?3000:stage==='choosing'?30000:6000;
 const [left,setLeft]=useState(Math.max(0,deadline-serverNow));
 useEffect(()=>{const start=performance.now(),initial=Math.max(0,deadline-serverNow);function update(){setLeft(Math.max(0,initial-(performance.now()-start)));}update();const id=setInterval(update,100);return()=>clearInterval(id);},[deadline,serverNow]);
 return <div className="bp-brain-clock"><span>{Math.ceil(left/1000)}s</span><div className="bp-brain-track" aria-hidden="true"><i style={{width:`${Math.min(100,left/duration*100)}%`}}/></div></div>;
}
export function OnlineBrain({state,match:m,online,both,send}:{state:OnlineState;match:BrainMatch;online:boolean;both:boolean;send:(a:OnlineAction)=>boolean}){
 const you=state.you,partner=you===0?1:0;
 const [selection,setSelection]=useState<{index:number;choice:number}|null>(null);
 const choice=m.ownChoice??(selection?.index===m.index?selection.choice:null);
 const partnerName=state.players[partner]?.nickname??'Partner';
 const hit=m.history.at(-1)?.matched??false;
 const label=(i:number|null)=>i===null?'No answer':m.prompt?.options[i]??'Unknown';
 if(m.stage==='finished')return <GameResult outcome={m.score>=4?'win':'draw'} title={titles[m.score]??'Match complete'} detail={`${m.score} / ${m.total} matches · ${Math.round(m.score/m.total*100)}% in sync. Just for fun!`}><div className="bp-brain-final-score">{m.score}<span>/{m.total}</span></div><div className="bp-progress" aria-label="Round results">{m.history.map((h,i)=><span key={i} className={h.matched?'hit':'miss'}/>)}</div><button className="bp-button" disabled={!online||m.rematch[you]} onClick={()=>send({type:'REMATCH',round:state.round})}>{m.rematch[you]?'WAITING FOR PARTNER…':'PLAY AGAIN / RETURN TO LOBBY ↗'}</button><p className="bp-small">When both agree, you can start another match or change games in this same room.</p></GameResult>;
 return <div className="bp-panel bp-live-game bp-brain-live"><div className="bp-game-meta"><span>✳ BRAIN SYNC · {m.index+1}/{m.total}</span><span>{m.score} MATCH{m.score===1?'':'ES'}</span></div><div className="bp-progress" aria-label={`Question ${m.index+1} of ${m.total}`}>{Array.from({length:m.total},(_,i)=><span key={i} className={m.history[i]?(m.history[i].matched?'hit':'miss'):i===m.index?'current':''}/>)}</div>
 {m.deadline!==null&&<Clock key={`${m.index}:${m.stage}`} deadline={m.deadline} serverNow={m.serverNow} stage={m.stage}/>}
 {!both&&<p className="bp-outcome" role="status">Partner or connection offline. Reconnect to continue; the server timer keeps running.</p>}
 {m.stage==='countdown'?<div className="bp-brain-countdown"><div className="bp-number">✳</div><h2>Ready to read minds?</h2><p>The first question is coming up.</p></div>:m.prompt&&<div key={m.index} className="bp-brain-question"><span className="bp-kicker">THINK ALIKE / PICK ONE</span><h2>{m.prompt.question}</h2>
 {m.stage==='choosing'?<><div className="bp-brain-status"><span>{m.locked[you]?'🔒 You locked in':'You are thinking…'}</span><span>{m.locked[partner]?`🔒 ${partnerName} locked in`:`${partnerName} is thinking…`}</span></div><div className="bp-options">{m.prompt.options.map((option,i)=><button key={i} type="button" className={`bp-option ${choice===i?'selected':''}`} aria-pressed={choice===i} disabled={m.locked[you]||!online||!both} onClick={()=>setSelection({index:m.index,choice:i})}>{option}</button>)}</div><button className="bp-button" disabled={choice===null||m.locked[you]||!online||!both} onClick={()=>{if(choice!==null)send({type:'BRAIN_ANSWER',round:state.round,index:m.index,choice});}}>{m.locked[you]?'ANSWER LOCKED · WAITING…':'LOCK MY ANSWER ↗'}</button><p className="bp-small">Answers stay private until both lock in or time runs out.</p></>:<><div className="bp-reveal-pair"><div><span>YOU</span><strong>{label(m.revealed?.[you]??null)}</strong></div><div><span>{partnerName}</span><strong>{label(m.revealed?.[partner]??null)}</strong></div></div><div className={`bp-outcome ${hit?'hit':'miss'}`} role="status">{hit?'✳ SAME BRAIN! +1 match':m.revealed?.some(x=>x===null)?'Time ran out for a player. No match.':'Different minds, same chaos!'}</div><p className="bp-small">{m.index===m.total-1?'Final results':'Next question'} coming automatically…</p></>}
 </div>}
 </div>;
}
