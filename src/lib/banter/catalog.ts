import type {GameId} from './contracts';
export const GAME_CATALOG = [
 {id:'number-rush',name:'Number Rush',symbol:'#',color:'#d5ff63',description:'Seven guesses. One secret number.',duration:'1–3 min',href:'/play/solo'},
 {id:'brain-sync',name:'Brain Sync',symbol:'✳',color:'#d8c3ff',description:'Five prompts. Can you think alike?',duration:'2 min',href:'/play/brain-sync'},
 {id:'poison-picks',name:'Poison Picks',symbol:'✿',color:'#ffb09c',description:'Hide a trap. Pick a treat. Trust your luck.',duration:'2–4 min',href:'/play/poison-picks'},
] as const satisfies readonly {id:GameId;name:string;symbol:string;color:string;description:string;duration:string;href:string}[];
