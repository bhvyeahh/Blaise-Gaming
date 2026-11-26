import type {Guest} from './contracts';
export type Seat=0|1;
export type RoomSession={roomId:string;token:string;seat:Seat;invite?:string};
export type OnlineGame='number-rush'|'brain-sync';
export type NumberMatch={guesses:{value:number;hint:'higher'|'lower'|'correct'}[];opponentCount:number;winner:Seat|null;secret:number|null;rematch:[boolean,boolean]};
export type BrainMatch={stage:'countdown'|'choosing'|'reveal'|'finished';index:number;total:number;deadline:number|null;serverNow:number;score:number;prompt:{question:string;options:string[]}|null;locked:[boolean,boolean];ownChoice:number|null;revealed:[number|null,number|null]|null;history:{matched:boolean}[];rematch:[boolean,boolean]};
type RoomBase={id:string;phase:'lobby'|'playing'|'finished';round:number;revision:number;expiresAt:number;you:Seat;players:[(Guest&{ready:boolean;online:boolean})|null,(Guest&{ready:boolean;online:boolean})|null]};
export type OnlineState=RoomBase&({game:'number-rush';match:NumberMatch|null}|{game:'brain-sync';match:BrainMatch|null});
export type OnlineAction={type:'READY';ready:boolean}|{type:'START'}|{type:'CLOSE_ROOM'}|{type:'GUESS';round:number;value:number}|{type:'REMATCH';round:number}|{type:'SELECT_GAME';game:OnlineGame}|{type:'BRAIN_ANSWER';round:number;index:number;choice:number};
const KEY='banterbox.online.v1';
const idPattern=/^[a-f0-9]{32}$/;const tokenPattern=/^[a-f0-9]{64}$/;
export function parseInvitation(value:string){const m=/^#?([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(value.trim());return m?{roomId:m[1],invite:m[2]}:null;}
export function validSession(x:unknown):x is RoomSession{if(!x||typeof x!=='object')return false;const s=x as RoomSession;return typeof s.roomId==='string'&&idPattern.test(s.roomId)&&typeof s.token==='string'&&tokenPattern.test(s.token)&&(s.seat===0||s.seat===1)&&(s.seat===0?typeof s.invite==='string'&&tokenPattern.test(s.invite):s.invite===undefined);}
export function restoreSession():RoomSession|null{try{const s=JSON.parse(sessionStorage.getItem(KEY)??'null');return validSession(s)?s:null;}catch{return null;}}
export function storeSession(s:RoomSession|null){try{if(s)sessionStorage.setItem(KEY,JSON.stringify(s));else sessionStorage.removeItem(KEY);}catch{/* Current in-memory session still works. */}}
export function backendOrigin(){const configured=process.env.NEXT_PUBLIC_REALTIME_URL; if(!configured)throw Error('Online service not configured. Set NEXT_PUBLIC_REALTIME_URL in .env.local.');const u=new URL(configured);if(u.username||u.password||u.pathname!=='/'||u.search||u.hash||!(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname))))throw Error('Invalid realtime service URL.');return u.origin;}
export async function enterRoom(guest:Guest,invite:ReturnType<typeof parseInvitation>,game:OnlineGame='number-rush'):Promise<RoomSession>{const base=backendOrigin();const res=await fetch(invite?`${base}/rooms/${invite.roomId}/join`:`${base}/rooms`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(invite?{guest,invite:invite.invite}:{guest,game}),cache:'no-store',signal:AbortSignal.timeout(12000)});const data=await res.json();if(!res.ok)throw Error(typeof data.error==='string'?data.error:'Could not enter room.');if(!validSession(data))throw Error('Invalid room response.');return data;}
export function roomSocket(s:RoomSession){const u=new URL(`/rooms/${s.roomId}/socket`,backendOrigin());u.protocol=u.protocol==='https:'?'wss:':'ws:';return new WebSocket(u,['banterbox.v1',s.token]);}
