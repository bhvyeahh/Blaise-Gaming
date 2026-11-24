export const BOARD_SIZE=9;
export type PoisonGame={phase:'setup'|'playing'|'won'|'lost';playerTrap:number|null;botTrap:number;playerPicks:number[];botPicks:number[]};
export function isCell(value:unknown):value is number{return typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<BOARD_SIZE;}
export function newPoisonGame(botTrap:number):PoisonGame{
 if(!isCell(botTrap))throw new Error('Invalid trap');return {phase:'setup',playerTrap:null,botTrap,playerPicks:[],botPicks:[]};
}
export function placeTrap(game:PoisonGame,cell:unknown):PoisonGame{
 if(game.phase!=='setup'||!isCell(cell))return game;return {...game,phase:'playing',playerTrap:cell};
}
export function availableCells(picks:readonly number[]):number[]{return Array.from({length:BOARD_SIZE},(_,i)=>i).filter(i=>!picks.includes(i));}
// One turn contains the human pick and, if safe, the computer's reply.
// Randomness is provided outside the reducer so the same inputs are deterministic.
export function pickCupcake(game:PoisonGame,cell:unknown,botPick:unknown):PoisonGame{
 if(game.phase!=='playing'||game.playerTrap===null||!isCell(cell)||game.playerPicks.includes(cell))return game;
 const playerPicks=[...game.playerPicks,cell];
 if(cell===game.botTrap)return {...game,playerPicks,phase:'lost'};
 if(!isCell(botPick)||game.botPicks.includes(botPick))return game;
 const botPicks=[...game.botPicks,botPick];
 return {...game,playerPicks,botPicks,phase:botPick===game.playerTrap?'won':'playing'};
}
export function computerTurn(game:PoisonGame,cell:unknown):PoisonGame{
 if(game.phase!=='playing')return game;const available=availableCells(game.botPicks);
 return pickCupcake(game,cell,available[Math.floor(Math.random()*available.length)]);
}
