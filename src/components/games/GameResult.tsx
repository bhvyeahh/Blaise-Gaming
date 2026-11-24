import type {ReactNode} from 'react';
const colors=['#d5ff63','#a482f4','#ff9679','#70c5dc','#ffcd70'];
export function GameResult({outcome,title,detail,children}:{outcome:'win'|'loss'|'draw';title:string;detail:string;children?:ReactNode}){
 return <div className={`bp-finale bp-finale-${outcome}`}><div className="bp-finale-glow" aria-hidden="true"/>{outcome==='win'&&<div className="bp-confetti" aria-hidden="true">{Array.from({length:20},(_,i)=><i key={i} style={{left:`${5+i*4.6}%`,background:colors[i%colors.length],animationDelay:`${i%6*.075}s`,rotate:`${i*31}deg`}}/>)}</div>}<div className="bp-result-mark" aria-hidden="true">{outcome==='win'?'✳':outcome==='loss'?'↺':'＝'}</div><span className="bp-kicker">{outcome==='win'?'LITTLE LEGEND':outcome==='loss'?'THE COMEBACK ARC':'EVEN STEVENS'}</span><div role="status" aria-live="polite"><h2>{title}</h2><p>{detail}</p></div>{children&&<div className="bp-result-actions">{children}</div>}</div>;
}
