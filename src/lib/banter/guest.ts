import { parseGuest, type Guest } from './contracts';
const KEY='banterbox.guest.v1';
export function readGuest():Guest|null { try {return parseGuest(JSON.parse(localStorage.getItem(KEY)??'null'));}catch{return null;} }
export function saveGuest(guest:Guest):boolean {try {localStorage.setItem(KEY,JSON.stringify(guest));return true;}catch{return false;}}
