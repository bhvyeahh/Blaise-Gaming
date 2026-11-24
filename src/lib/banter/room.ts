import { parseGuest, GAME_IDS, type Guest, type GameId } from './contracts.ts';
export type Seat = 'host' | 'guest';
export type Member = Guest & { ready: boolean };
export type Room = { phase: 'waiting' | 'ready'; game: GameId; host: Member; guest: Member | null };
export function createPreviewRoom(profile: unknown): Room | null {
 const host = parseGuest(profile); return host ? {phase:'waiting',game:'number-rush',host:{...host,ready:false},guest:null}:null;
}
function reconcile(room: Room): Room {return {...room,phase:room.host.ready && room.guest?.ready ? 'ready':'waiting'};}
// Pure preview reducer. Actor identity must be supplied by authenticated transport in production.
export function joinPreview(room: Room, profile: unknown): Room { const guest=parseGuest(profile); return !guest || room.guest ? room : reconcile({...room,guest:{...guest,ready:false}}); }
export function setReady(room: Room, seat: Seat, ready: boolean): Room {
 if(typeof ready!=='boolean' || (seat!=='host' && seat!=='guest')) return room;
 if(seat==='host') return reconcile({...room,host:{...room.host,ready}});
 return room.guest ? reconcile({...room,guest:{...room.guest,ready}}):room;
}
export function selectGame(room:Room, seat:Seat, game:unknown):Room {
 if(seat!=='host' || !GAME_IDS.some(id=>id===game) || room.game===game) return room;
 return reconcile({...room,game:game as GameId,host:{...room.host,ready:false},guest:room.guest?{...room.guest,ready:false}:null});
}
export function leavePreview(room:Room):Room {return reconcile({...room,guest:null,host:{...room.host,ready:false}});}
