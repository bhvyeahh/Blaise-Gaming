import type {OnlineState} from './online';
export type Cue='tap'|'start'|'match'|'miss'|'win'|'loss'|'draw'|'reaction'|'join';
export type ResultCard={game:string;title:string;detail:string;accent:string};
// All data comes from the already redacted, authoritative server view.
export function resultCard(state:OnlineState|null):ResultCard|null{
 if(!state||state.phase!=='finished'||!state.match)return null;
 if(state.game==='brain-sync')return {game:'Brain Sync',title:`${state.match.score}/${state.match.total} in sync!`,detail:'Two minds. One little adventure.',accent:'#d8c3ff'};
 const won=state.match.winner===state.you,draw=state.match.winner===null;
 return {game:state.game==='number-rush'?'Number Rush':'Poison Picks',title:draw?'A perfect tie!':won?'Little legend!':'The comeback arc.',detail:draw?'Two rivals. One draw.':won?'Victory in the Playclub.':'One more round?',accent:draw?'#d8c3ff':won?'#d5ff63':'#ffb09c'};
}
export function gameCue(previous:OnlineState|null,next:OnlineState|null):Cue|null{
 if(!previous||!next||previous.id!==next.id)return null;
 if(previous.phase!=='finished'&&next.phase==='finished'&&next.match){
  if(next.game==='brain-sync')return next.match.score>=4?'win':'draw';
  return next.match.winner===null?'draw':next.match.winner===next.you?'win':'loss';
 }
 if(previous.phase==='lobby'&&next.phase==='playing')return 'start';
 if(!previous.players[1]&&next.players[1])return 'join';
 if(previous.round!==next.round||previous.game!==next.game)return null;
 if(next.game==='brain-sync'&&previous.game==='brain-sync'&&next.match?.stage==='reveal'&&(previous.match?.stage!=='reveal'||previous.match.index!==next.match.index))return next.match.history.at(-1)?.matched?'match':'miss';
 if(next.game==='poison-picks'&&previous.game==='poison-picks'&&next.match&&previous.match&&next.match.move>previous.match.move)return 'tap';
 if(next.game==='number-rush'&&previous.game==='number-rush'&&next.match&&previous.match&&(next.match.guesses.length>previous.match.guesses.length||next.match.opponentCount>previous.match.opponentCount))return 'tap';
 return null;
}
