import { MAX_ATTEMPTS, MIN_NUMBER, MAX_NUMBER } from './contracts.ts';
export type Hint = 'higher'|'lower'|'correct';
export type NumberRound = { secret:number; guesses: {value:number; hint:Hint}[]; status:'playing'|'won'|'lost' };
export function newRound(secret:number):NumberRound {
  if (!Number.isInteger(secret)||secret<MIN_NUMBER||secret>MAX_NUMBER) throw new Error('Invalid secret');
  return {secret,guesses:[],status:'playing'};
}
export function guessNumber(round:NumberRound, value:number): {round:NumberRound; error?:string} {
  if(round.status!=='playing') return {round,error:'This round is over.'};
  if(!Number.isInteger(value)||value<MIN_NUMBER||value>MAX_NUMBER) return {round,error:'Enter a whole number from 1 to 100.'};
  if(round.guesses.some(g=>g.value===value)) return {round,error:'You already tried that number.'};
  const hint:Hint=value===round.secret?'correct':value<round.secret?'higher':'lower';
  const guesses=[...round.guesses,{value,hint}];
  return {round:{...round,guesses,status:hint==='correct'?'won':guesses.length>=MAX_ATTEMPTS?'lost':'playing'}};
}
