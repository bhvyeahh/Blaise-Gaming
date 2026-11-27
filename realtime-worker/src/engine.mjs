// Server-authoritative room rules. Never serialize private state.
import {makeBrain,advanceBrain,answerBrain,brainView,brainDeadline} from "./brain.mjs";
import {makePoison,lockTrap,pickPoison,poisonView,isCell} from "./poison.mjs";
export const ROOM_TTL = 2 * 60 * 60 * 1000;
export const HEX = /^[a-f0-9]{32}$/;
export const TOKEN = /^[a-f0-9]{64}$/;
export const REACTIONS = ['heart','laugh','fire','wow','gg','oops'];
export const emptyStats=()=>({matches:0,wins:[0,0],draws:0,brainMatches:0,brainPoints:0,brainTotal:0});
function recordFinished(s){
 const stats=s.stats??(s.stats=emptyStats());
 stats.matches++;
 if(s.game==='brain-sync'){stats.brainMatches++;stats.brainPoints+=s.match.score;stats.brainTotal+=s.match.history.length;}
 else if(s.match.winner===null)stats.draws++;else stats.wins[s.match.winner]++;
}
export const GAMES = ['number-rush','brain-sync','poison-picks'];
export function parseGuest(x) {
  if (!x || typeof x !== 'object' || Array.isArray(x) || Object.keys(x).length !== 2 || typeof x.nickname !== 'string' || x.nickname.length > 80 || !['pip','mochi','bloop','zuzu'].includes(x.mascot)) return null;
  const nickname = x.nickname.normalize('NFC').trim().replace(/ +/g,' ');
  if ([...nickname].length < 2 || [...nickname].length > 20 || !/^[\p{L}\p{N}][\p{L}\p{M}\p{N} _'-]*$/u.test(nickname)) return null;
  return {nickname, mascot:x.mascot};
}
export function createRoom(id, inviteHash, guest, tokenHash, now, game='number-rush') {
  return {id,inviteHash,expiresAt:now+ROOM_TTL,phase:'lobby',game,round:0,revision:0,players:[{...guest,tokenHash,ready:false},null],match:null,stats:emptyStats()};
}
export function addGuest(s, guest, tokenHash) {
  if (s.phase !== 'lobby' || s.players[1]) throw Error('Room is full or unavailable.');
  s.players[1]={...guest,tokenHash,ready:false}; s.players[0].ready=false; s.revision++;
}
export function parseAction(x) {
  if(!x || typeof x!=='object' || Array.isArray(x)) return null;
  const keys=Object.keys(x).sort().join(',');
  if(x.type==='REACT' && keys==='reaction,type' && REACTIONS.includes(x.reaction)) return x;
  if(x.type==='READY' && keys==='ready,type' && typeof x.ready==='boolean') return x;
  if((x.type==='START'||x.type==='CLOSE_ROOM') && keys==='type') return x;
  if(x.type==='SELECT_GAME' && keys==='game,type' && GAMES.includes(x.game)) return x;
  if(x.type==='BRAIN_ANSWER' && keys==='choice,index,round,type' && Number.isSafeInteger(x.round) && Number.isInteger(x.index) && x.index>=0 && x.index<5 && Number.isInteger(x.choice) && x.choice>=0 && x.choice<4) return x;
  if(x.type==='POISON_TRAP' && keys==='cell,round,type' && Number.isSafeInteger(x.round) && isCell(x.cell)) return x;
  if(x.type==='POISON_PICK' && keys==='cell,move,round,type' && Number.isSafeInteger(x.round) && Number.isInteger(x.move) && x.move>=0 && x.move<17 && isCell(x.cell)) return x;
  if(x.type==='GUESS' && keys==='round,type,value' && Number.isSafeInteger(x.round) && Number.isInteger(x.value) && x.value>=1 && x.value<=100) return x;
  if(x.type==='REMATCH' && keys==='round,type' && Number.isSafeInteger(x.round)) return x;
  return null;
}
export function act(s, seat, a, connected, secret, now=Date.now()) {
  if(!s.players[seat] || !connected.includes(seat)) throw Error('Not a connected player.');
  const previousPhase=s.phase;
  if(a.type==='SELECT_GAME') {
    if(seat!==0||s.phase!=='lobby'||!GAMES.includes(a.game)) throw Error('Only the host can select a game in the lobby.');
    if(s.game!==a.game){s.game=a.game;s.players.forEach(p=>{if(p)p.ready=false;});}
  } else if(a.type==='READY') {
    if(s.phase!=='lobby') throw Error('Not in lobby.');
    s.players[seat].ready=a.ready;
  } else if(a.type==='START') {
    if(seat!==0 || s.phase!=='lobby' || !s.players.every(p=>p?.ready) || ![0,1].every(i=>connected.includes(i))) throw Error('Both players must be online and ready; only the host can start.');
    if(s.game==='number-rush'&&(!Number.isInteger(secret)||secret<1||secret>100)) throw Error('Invalid server secret.');
    const match=s.game==='brain-sync'?makeBrain(now):s.game==='poison-picks'?makePoison(s.round+1):{secret,guesses:[[],[]],winner:null,rematch:[false,false]};
    s.round++; s.phase='playing'; s.match=match;
  } else if(a.type==='BRAIN_ANSWER') {
    if(s.game!=='brain-sync'||s.phase!=='playing'||a.round!==s.round||!connected.includes(1-seat)) throw Error('Round unavailable or partner offline.');
    answerBrain(s.match,seat,a,now);
  } else if(a.type==='POISON_TRAP'||a.type==='POISON_PICK') {
    if(s.game!=='poison-picks'||s.phase!=='playing'||a.round!==s.round||!connected.includes(1-seat)) throw Error('Round unavailable or partner offline.');
    if(a.type==='POISON_TRAP')lockTrap(s.match,seat,a.cell);else pickPoison(s.match,seat,a.cell,a.move);
    if(s.match.stage==='finished')s.phase='finished';
  } else if(a.type==='GUESS') {
    if(s.game!=='number-rush'||s.phase!=='playing'||a.round!==s.round||![0,1].every(i=>connected.includes(i))) throw Error('Round unavailable or partner offline.');
    const list=s.match.guesses[seat];
    if(list.length>=7||list.some(g=>g.value===a.value)) throw Error('No guesses left or already tried.');
    const hint=a.value===s.match.secret?'correct':a.value<s.match.secret?'higher':'lower';
    list.push({value:a.value,hint});
    if(hint==='correct'){s.match.winner=seat;s.phase='finished';}
    else if(s.match.guesses.every(g=>g.length===7)){s.phase='finished';}
  } else if(a.type==='REMATCH') {
    if(s.phase!=='finished'||a.round!==s.round) throw Error('Round is not finished.');
    s.match.rematch[seat]=true;
    if(s.match.rematch.every(Boolean)){s.phase='lobby';s.match=null;s.players.forEach(p=>{if(p)p.ready=false;});}
  } else throw Error('Unsupported action.');
  if(previousPhase!=='finished'&&s.phase==='finished')recordFinished(s);
  s.revision++;
}
export function view(s, seat, connected) {
  const m=s.match;
  return {id:s.id,phase:s.phase,game:s.game,round:s.round,revision:s.revision,expiresAt:s.expiresAt,you:seat,
    stats:structuredClone(s.stats??emptyStats()),
    players:s.players.map((p,i)=>p?{nickname:p.nickname,mascot:p.mascot,ready:p.ready,online:connected.includes(i)}:null),
    match:m?(s.game==='brain-sync'?brainView(m,seat):s.game==='poison-picks'?poisonView(m,seat):{guesses:m.guesses[seat].map(g=>({...g})),opponentCount:m.guesses[1-seat].length,winner:s.phase==='finished'?m.winner:null,secret:s.phase==='finished'?m.secret:null,rematch:[...m.rematch]}):null};
}

// The Durable Object calls this on alarms and before processing messages.
export function tick(s,now){
 if(s.game!=='brain-sync'||s.phase!=='playing')return false;
 if(!advanceBrain(s.match,now))return false;
 if(s.match.stage==='finished'){s.phase='finished';recordFinished(s);}
 s.revision++;return true;
}
export function nextAlarm(s){return Math.min(s.expiresAt,s.game==='brain-sync'&&s.phase==='playing'?brainDeadline(s.match):Infinity);}
