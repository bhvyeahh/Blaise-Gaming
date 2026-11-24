// Pure server-authoritative Number Rush room rules. Never serialize the private state to clients.
export const ROOM_TTL = 2 * 60 * 60 * 1000;
export const HEX = /^[a-f0-9]{32}$/;
export const TOKEN = /^[a-f0-9]{64}$/;
export const GAMES = ['number-rush'];
export function parseGuest(x) {
  if (!x || typeof x !== 'object' || Array.isArray(x) || Object.keys(x).length !== 2 || typeof x.nickname !== 'string' || x.nickname.length > 80 || !['pip','mochi','bloop','zuzu'].includes(x.mascot)) return null;
  const nickname = x.nickname.normalize('NFC').trim().replace(/ +/g,' ');
  if ([...nickname].length < 2 || [...nickname].length > 20 || !/^[\p{L}\p{N}][\p{L}\p{M}\p{N} _'-]*$/u.test(nickname)) return null;
  return {nickname, mascot:x.mascot};
}
export function createRoom(id, inviteHash, guest, tokenHash, now) {
  return {id,inviteHash,expiresAt:now+ROOM_TTL,phase:'lobby',game:'number-rush',round:0,revision:0,players:[{...guest,tokenHash,ready:false},null],match:null};
}
export function addGuest(s, guest, tokenHash) {
  if (s.phase !== 'lobby' || s.players[1]) throw Error('Room is full or unavailable.');
  s.players[1]={...guest,tokenHash,ready:false}; s.players[0].ready=false; s.revision++;
}
export function parseAction(x) {
  if(!x || typeof x!=='object' || Array.isArray(x)) return null;
  const keys=Object.keys(x).sort().join(',');
  if(x.type==='READY' && keys==='ready,type' && typeof x.ready==='boolean') return x;
  if((x.type==='START'||x.type==='CLOSE_ROOM') && keys==='type') return x;
  if(x.type==='GUESS' && keys==='round,type,value' && Number.isSafeInteger(x.round) && Number.isInteger(x.value) && x.value>=1 && x.value<=100) return x;
  if(x.type==='REMATCH' && keys==='round,type' && Number.isSafeInteger(x.round)) return x;
  return null;
}
export function act(s, seat, a, connected, secret) {
  if(!s.players[seat] || !connected.includes(seat)) throw Error('Not a connected player.');
  if(a.type==='READY') {
    if(s.phase!=='lobby') throw Error('Not in lobby.');
    s.players[seat].ready=a.ready;
  } else if(a.type==='START') {
    if(seat!==0 || s.phase!=='lobby' || !s.players.every(p=>p?.ready) || ![0,1].every(i=>connected.includes(i))) throw Error('Both players must be online and ready; only the host can start.');
    if(!Number.isInteger(secret)||secret<1||secret>100) throw Error('Invalid server secret.');
    s.round++; s.phase='playing'; s.match={secret,guesses:[[],[]],winner:null,rematch:[false,false]};
  } else if(a.type==='GUESS') {
    if(s.phase!=='playing'||a.round!==s.round||![0,1].every(i=>connected.includes(i))) throw Error('Round unavailable or partner offline.');
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
  s.revision++;
}
export function view(s, seat, connected) {
  const m=s.match;
  return {id:s.id,phase:s.phase,game:s.game,round:s.round,revision:s.revision,expiresAt:s.expiresAt,you:seat,
    players:s.players.map((p,i)=>p?{nickname:p.nickname,mascot:p.mascot,ready:p.ready,online:connected.includes(i)}:null),
    match:m?{guesses:m.guesses[seat].map(g=>({...g})),opponentCount:m.guesses[1-seat].length,winner:s.phase==='finished'?m.winner:null,secret:s.phase==='finished'?m.secret:null,rematch:[...m.rematch]}:null};
}
