export const PROMPTS = [
 {question:'Name a fruit.',options:['Mango','Apple','Banana','Strawberry']},
 {question:'Pick a dream holiday.',options:['Beach','Mountains','City','Countryside']},
 {question:'Choose a midnight snack.',options:['Pizza','Chips','Chocolate','Ice cream']},
 {question:'Pick a superpower.',options:['Flying','Invisibility','Teleportation','Mind reading']},
 {question:'Name a rainy-day activity.',options:['Reading','Gaming','Sleeping','Watching movies']},
 {question:'Pick a pet.',options:['Dog','Cat','Rabbit','Parrot']},
 {question:'Choose a movie genre.',options:['Comedy','Horror','Romance','Adventure']},
 {question:'Pick a breakfast.',options:['Pancakes','Toast','Eggs','Cereal']},
 {question:'Pick a color.',options:['Purple','Green','Blue','Pink']},
 {question:'Choose a game-night drink.',options:['Water','Lemonade','Tea','Hot chocolate']},
] as const;
export const BRAIN_ROUNDS=5;
export type BrainRound={promptId:number;botChoice:number;playerChoice:number|null};
export type BrainGame={rounds:BrainRound[];index:number;phase:'choosing'|'reveal'|'finished';score:number};
function validIndex(value:unknown,length:number):value is number{return typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<length;}
export function newBrainGame(promptIds:readonly number[],botChoices:readonly number[]):BrainGame{
 if(promptIds.length!==BRAIN_ROUNDS||botChoices.length!==BRAIN_ROUNDS||new Set(promptIds).size!==BRAIN_ROUNDS||!promptIds.every(id=>validIndex(id,PROMPTS.length))||!botChoices.every((choice,i)=>validIndex(choice,PROMPTS[promptIds[i]].options.length)))throw new Error('Invalid Brain Sync setup');
 return {rounds:promptIds.map((promptId,i)=>({promptId,botChoice:botChoices[i],playerChoice:null})),index:0,phase:'choosing',score:0};
}
export function randomBrainGame():BrainGame{
 const ids=PROMPTS.map((_,i)=>i);
 for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
 const chosen=ids.slice(0,BRAIN_ROUNDS);return newBrainGame(chosen,chosen.map(id=>Math.floor(Math.random()*PROMPTS[id].options.length)));
}
export function answerBrain(game:BrainGame,choice:unknown):BrainGame{
 if(game.phase!=='choosing')return game;const round=game.rounds[game.index];
 if(!validIndex(choice,PROMPTS[round.promptId].options.length))return game;
 const rounds=game.rounds.map((r,i)=>i===game.index?{...r,playerChoice:choice}:r);
 return {...game,rounds,phase:'reveal',score:game.score+Number(choice===round.botChoice)};
}
export function nextBrain(game:BrainGame):BrainGame{
 if(game.phase!=='reveal')return game;
 return game.index===game.rounds.length-1?{...game,phase:'finished'}:{...game,index:game.index+1,phase:'choosing'};
}
