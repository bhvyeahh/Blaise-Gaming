export const MASCOTS = ['pip','mochi','bloop','zuzu'] as const;
export type MascotId = typeof MASCOTS[number];
export type Guest = { nickname: string; mascot: MascotId };
export const GAME_IDS = ['number-rush','brain-sync','poison-picks'] as const;
export type GameId = typeof GAME_IDS[number];
export const MAX_ATTEMPTS = 7;
export const MIN_NUMBER = 1;
export const MAX_NUMBER = 100;
export function isMascot(value: unknown): value is MascotId { return typeof value === 'string' && MASCOTS.some(id => id === value); }
export function parseGuest(value: unknown): Guest | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const { nickname, mascot } = value as Record<string, unknown>;
  if (typeof nickname !== 'string' || nickname.length > 80 || !isMascot(mascot)) return null;
  const name = nickname.normalize('NFC').trim().replace(/ +/g, ' ');
  if ([...name].length < 2 || [...name].length > 20 || !/^[\p{L}\p{N}][\p{L}\p{M}\p{N} _'-]*$/u.test(name)) return null;
  return { nickname: name, mascot };
}
export type ClientEvent = { type:'READY'; ready:boolean } | {type:'START'; gameId:GameId} | {type:'GUESS'; value:number} | {type:'REMATCH'};
// These are payload contracts, NOT authentication or authorization. The room server must enforce both.
export function parseClientEvent(value: unknown): ClientEvent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const v = value as Record<string,unknown>;
  switch(v.type) {
    case 'READY': return Object.keys(v).length===2 && typeof v.ready==='boolean' ? {type:'READY',ready:v.ready}:null;
    case 'START': return Object.keys(v).length===2 && GAME_IDS.some(id=>id===v.gameId) ? {type:'START',gameId:v.gameId as GameId}:null;
    case 'GUESS': return Object.keys(v).length===2 && typeof v.value==='number' && Number.isInteger(v.value) && v.value>=MIN_NUMBER && v.value<=MAX_NUMBER ? {type:'GUESS',value:v.value}:null;
    case 'REMATCH': return Object.keys(v).length===1 ? {type:'REMATCH'}:null;
    default: return null;
  }
}
