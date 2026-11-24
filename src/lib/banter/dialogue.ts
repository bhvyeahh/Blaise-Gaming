import type {MascotId} from './contracts.ts';
export type Reaction = 'welcome'|'waiting'|'thinking'|'wrong'|'won'|'lost'|'joined';
const lines:Record<MascotId,Record<Reaction,string>>={
 pip:{welcome:'Let’s do this!',waiting:'Where’s our buddy?',thinking:'You’ve got this!',wrong:'Almost there!',won:'WE DID IT!',lost:'Rematch, please!',joined:'Our buddy is here!'},
 mochi:{welcome:'Ready to cause chaos?',waiting:'Taking forever.',thinking:'Make it count.',wrong:'Seriously?!',won:'Too easy.',lost:'I demand revenge.',joined:'Finally. A worthy rival.'},
 bloop:{welcome:'Oh, we’re playing?',waiting:'Nap time?',thinking:'Processing… slowly.',wrong:'Interesting choice…',won:'Calculated.',lost:'I was distracted.',joined:'Oh hi, human.'},
 zuzu:{welcome:'Let’s get weird!',waiting:'Anyone out there?',thinking:'Plot twist incoming.',wrong:'Well, that happened.',won:'CHAOS COMPLETE!',lost:'Again. Immediately.',joined:'Double trouble!'}
};
export function reactionLine(id:MascotId,event:Reaction):string{return lines[id][event];}
