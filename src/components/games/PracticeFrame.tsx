import type {ReactNode} from 'react';
import Link from 'next/link';
import {Mascot} from '@/components/characters/Mascot';
import {reactionLine} from '@/lib/banter/dialogue';
import type {Guest} from '@/lib/banter/contracts';
import type {Reaction} from '@/lib/banter/dialogue';
export function PracticeFrame({name,title,guest,reaction='welcome',children}:{name:string;title:ReactNode;guest:Guest|null;reaction?:Reaction;children:ReactNode}){
 const mood=reaction==='won'?'happy':reaction==='lost'?'sad':'idle';
 return <section className="bp-practice"><Link className="bp-textlink" href="/play">← Game shelf</Link><div className="bp-panel bp-practice-panel"><span className="bp-kicker">{name.toUpperCase()} / COMPUTER PRACTICE</span><h1>{title}</h1><div className="bp-duel bp-practice-duel"><div><Mascot id={guest?.mascot??'pip'} mood={mood}/><strong>{guest?.nickname??'You'}</strong></div><span className="bp-tag">VS</span><div><Mascot id="zuzu" mood={reaction==='lost'?'happy':'idle'}/><strong>Computer</strong></div></div><p className="bp-speech" aria-live="polite">{reactionLine(guest?.mascot??'pip',reaction)}</p>{children}<p className="bp-small">Local practice · Computer opponent · No online scores or prizes.</p></div></section>;
}
