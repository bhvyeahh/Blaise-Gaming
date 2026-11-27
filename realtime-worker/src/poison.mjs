// Private two-player trap state. Picks are indexed by the player making them.
export const BOARD_SIZE=9;
export const isCell=x=>Number.isInteger(x)&&x>=0&&x<BOARD_SIZE;
export function makePoison(round){return {stage:'setup',traps:[null,null],picks:[[],[]],turn:null,first:(round-1)%2,move:0,winner:null,last:null,rematch:[false,false]};}
export function lockTrap(m,seat,cell){
 if(m.stage!=='setup'||m.traps[seat]!==null||!isCell(cell))throw Error('Trap already locked or invalid.');
 m.traps[seat]=cell;
 if(m.traps.every(x=>x!==null)){m.stage='playing';m.turn=m.first;}
}
export function pickPoison(m,seat,cell,move){
 if(m.stage!=='playing'||m.turn!==seat||m.move!==move||!isCell(cell)||m.picks[seat].includes(cell))throw Error('Not your turn, stale move or cupcake already picked.');
 const hit=cell===m.traps[1-seat];
 m.picks[seat].push(cell);m.move++;m.last={seat,cell,hit};
 if(hit){m.stage='finished';m.turn=null;m.winner=1-seat;}else m.turn=1-seat;
}
export function poisonView(m,seat){return {stage:m.stage,ownTrap:m.traps[seat],opponentTrap:m.stage==='finished'?m.traps[1-seat]:null,locked:m.traps.map(t=>t!==null),picks:m.picks.map(p=>[...p]),turn:m.turn,move:m.move,winner:m.winner,last:m.last?{...m.last}:null,rematch:[...m.rematch]};}
