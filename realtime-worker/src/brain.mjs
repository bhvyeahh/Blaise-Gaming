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
];

export const COUNTDOWN_MS=3000, ANSWER_MS=30000, REVEAL_MS=6000, ROUNDS=5;
function uniform(n){const limit=256-256%n;let x;do{x=crypto.getRandomValues(new Uint8Array(1))[0];}while(x>=limit);return x%n;}
export function makeBrain(now){
 const ids=PROMPTS.map((_,i)=>i);for(let i=ids.length-1;i>0;i--){const j=uniform(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
 return {ids:ids.slice(0,ROUNDS),index:0,stage:'countdown',deadline:now+COUNTDOWN_MS,answers:[null,null],score:0,history:[],rematch:[false,false]};
}
function reveal(m,now){
 const matched=m.answers[0]!==null&&m.answers[0]===m.answers[1];
 m.score+=Number(matched);m.history.push({promptId:m.ids[m.index],answers:[...m.answers],matched});m.stage='reveal';m.deadline=now+REVEAL_MS;
}
export function answerBrain(m,seat,a,now){
 if(m.stage!=='choosing'||now>=m.deadline||a.index!==m.index)throw Error('This question is no longer accepting answers.');
 if(!Number.isInteger(a.choice)||a.choice<0||a.choice>=PROMPTS[m.ids[m.index]].options.length)throw Error('Invalid answer.');
 if(m.answers[seat]!==null)throw Error('Your answer is already locked.');
 m.answers[seat]=a.choice;if(m.answers.every(x=>x!==null))reveal(m,now);
}
export function advanceBrain(m,now){
 if(m.stage==='finished'||now<m.deadline)return false;
 // A delayed alarm gives the next stage its full duration, rather than skipping it.
 if(m.stage==='countdown'){m.stage='choosing';m.deadline=now+ANSWER_MS;}
 else if(m.stage==='choosing')reveal(m,now);
 else if(m.index===ROUNDS-1){m.stage='finished';m.deadline=null;}
 else{m.index++;m.answers=[null,null];m.stage='choosing';m.deadline=now+ANSWER_MS;}
 return true;
}
export function brainDeadline(m){return m.deadline??Infinity;}
export function brainView(m,seat){
 const showing=m.stage==='reveal'||m.stage==='finished';
 return {stage:m.stage,index:m.index,total:ROUNDS,deadline:m.deadline,serverNow:Date.now(),score:m.score,
  prompt:m.stage==='countdown'?null:PROMPTS[m.ids[m.index]],locked:m.answers.map(x=>x!==null),ownChoice:m.answers[seat],
  revealed:showing?[...m.answers]:null,history:m.history.map(h=>({matched:h.matched})),rematch:[...m.rematch]};
}
