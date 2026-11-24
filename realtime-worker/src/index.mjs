import {DurableObject} from 'cloudflare:workers';
import {HEX,TOKEN,parseGuest,createRoom,addGuest,parseAction,act,view} from './engine.mjs';
const encoder=new TextEncoder();
const randomHex=(n)=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('');
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
const secretNumber=()=>{let n;do{n=crypto.getRandomValues(new Uint8Array(1))[0];}while(n>=200);return n%100+1;};
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const error=(message,status=400)=>json({error:message},status);
async function body(req){
  if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw Error('JSON required.');
  if(!req.body)throw Error('Body required.');
  const reader=req.body.getReader();let size=0;const chunks=[];
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();throw Error('Request too large.');}chunks.push(value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
function originAllowed(req,env){const origin=req.headers.get('Origin');return origin&&env.ALLOWED_ORIGINS.split(',').map(x=>x.trim()).includes(origin);}
function cors(res,origin){if(res.status===101)return res;const h=new Headers(res.headers);h.set('Access-Control-Allow-Origin',origin);h.set('Vary','Origin');return new Response(res.body,{status:res.status,headers:h});}
export default {async fetch(req,env){
  const u=new URL(req.url),origin=req.headers.get('Origin');
  if(!originAllowed(req,env))return error('Origin not allowed.',403);
  if(req.method==='OPTIONS')return cors(new Response(null,{status:204,headers:{'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}}),origin);
  try{
    const ip=req.headers.get('CF-Connecting-IP')||'local';
    const creating=u.pathname==='/rooms'&&req.method==='POST';
    const match=/^\/rooms\/([a-f0-9]{32})\/(join|socket)$/.exec(u.pathname);
    if(!creating&&(!match||!((match[2]==='join'&&req.method==='POST')||(match[2]==='socket'&&req.method==='GET'&&req.headers.get('Upgrade')?.toLowerCase()==='websocket'))))return cors(error('Not found.',404),origin);
    const limiter=creating?env.CREATE_LIMIT:env.ACCESS_LIMIT;
    if(!(await limiter.limit({key:ip})).success)return cors(error('Too many requests. Try again shortly.',429),origin);
    const id=creating?randomHex(16):match[1];
    const stub=env.ROOMS.get(env.ROOMS.idFromName(id));
    const target=new URL(`https://room.internal/${creating?'create':match[2]}`);target.searchParams.set('id',id);
    return cors(await stub.fetch(new Request(target,req)),origin);
  }catch(e){console.error('Room service failure',e?.name);return cors(error('Room service temporarily unavailable.',503),origin);}
}};
export class GameRoom extends DurableObject {
  constructor(ctx,env){super(ctx,env);this.ctx=ctx;this.env=env;this.queue=Promise.resolve();}
  serial(fn){const p=this.queue.then(fn);this.queue=p.catch(()=>{});return p;}
  connected(except){return [...new Set(this.ctx.getWebSockets().filter(w=>w!==except&&w.readyState===1).map(w=>w.deserializeAttachment()?.seat).filter(s=>s===0||s===1))];}
  async expire(code=4004,reason='Room expired'){await this.ctx.storage.deleteAll();await this.ctx.storage.deleteAlarm();for(const w of this.ctx.getWebSockets()){try{w.close(code,reason);}catch{}}}
  async current(){const s=await this.ctx.storage.get('room');if(s&&s.expiresAt<=Date.now()){await this.expire();return null;}return s;}
  send(w,payload){try{if(w.readyState===1)w.send(JSON.stringify(payload));}catch{}}
  broadcast(s,except){const online=this.connected(except);for(const w of this.ctx.getWebSockets()){if(w===except||w.readyState!==1)continue;const seat=w.deserializeAttachment()?.seat;if(seat===0||seat===1)this.send(w,{type:'STATE',state:view(s,seat,online)});}}
  fetch(req){return this.serial(async()=>{
    const u=new URL(req.url),id=u.searchParams.get('id');if(!id||!HEX.test(id)||!originAllowed(req,this.env))return error('Forbidden.',403);
    if(u.pathname==='/create'&&req.method==='POST'){
      if(await this.current())return error('Room exists.',409);
      let g;try{g=parseGuest(await body(req));}catch{return error('Invalid request.');}if(!g)return error('Invalid player profile.');
      const invite=randomHex(32),token=randomHex(32);const s=createRoom(id,await hash(invite),g,await hash(token),Date.now());
      await this.ctx.storage.setAlarm(s.expiresAt);await this.ctx.storage.put('room',s);return json({roomId:id,invite,token,seat:0},201);
    }
    const s=await this.current();if(!s)return error('Room unavailable or expired.',404);
    if(u.pathname==='/join'&&req.method==='POST'){
      let x;try{x=await body(req);}catch{return error('Invalid request.');}
      if(!x||typeof x!=='object'||Object.keys(x).sort().join(',')!=='guest,invite'||typeof x.invite!=='string'||!TOKEN.test(x.invite)||await hash(x.invite)!==s.inviteHash)return error('Invalid invitation.',403);
      const g=parseGuest(x.guest);if(!g)return error('Invalid player profile.');
      if(s.players[1]||s.phase!=='lobby')return error('Room is already full.',409);
      const token=randomHex(32);addGuest(s,g,await hash(token));await this.ctx.storage.put('room',s);this.broadcast(s);return json({roomId:id,token,seat:1},201);
    }
    if(u.pathname==='/socket'&&req.headers.get('Upgrade')?.toLowerCase()==='websocket'){
      const protocols=(req.headers.get('Sec-WebSocket-Protocol')||'').split(',').map(x=>x.trim());
      if(protocols.length!==2||protocols[0]!=='banterbox.v1'||!TOKEN.test(protocols[1]))return error('Unauthorized.',401);
      const digest=await hash(protocols[1]);const seat=s.players.findIndex(p=>p?.tokenHash===digest);if(seat<0)return error('Unauthorized.',401);
      for(const w of this.ctx.getWebSockets()){if(w.deserializeAttachment()?.seat===seat){try{w.close(4001,'Connection replaced');}catch{}}}
      const pair=new WebSocketPair();const [client,server]=Object.values(pair);this.ctx.acceptWebSocket(server);server.serializeAttachment({seat,window:Date.now(),count:0});this.broadcast(s);
      return new Response(null,{status:101,webSocket:client,headers:{'Sec-WebSocket-Protocol':'banterbox.v1'}});
    }
    return error('Not found.',404);
  });}
  webSocketMessage(w,message){return this.serial(async()=>{
    if(w.readyState!==1)return;
    const a=w.deserializeAttachment();if(!a||![0,1].includes(a.seat)){w.close(1008,'Unauthorized');return;}
    const now=Date.now();if(now-a.window>=10000){a.window=now;a.count=0;}a.count++;w.serializeAttachment(a);
    if(a.count>30){w.close(1008,'Too many messages');return;}
    if(typeof message!=='string'||encoder.encode(message).length>1024){w.close(1009,'Invalid message size');return;}
    let action;try{action=parseAction(JSON.parse(message));}catch{}if(!action){this.send(w,{type:'ERROR',message:'Invalid action.'});return;}
    const s=await this.current();if(!s){try{w.close(4004,'Room expired');}catch{}return;}
    if(action.type==='CLOSE_ROOM'){if(!s.players[a.seat])return;await this.expire(4005,'Room ended');return;}
    try{act(s,a.seat,action,this.connected(),action.type==='START'?secretNumber():undefined);}catch(e){this.send(w,{type:'ERROR',message:e.message});return;}
    try{await this.ctx.storage.put('room',s);}catch{this.send(w,{type:'ERROR',message:'Could not save move. Please retry.'});return;}
    this.broadcast(s);
  });}
  webSocketClose(w,code,reason){return this.serial(async()=>{try{w.close(code===1006?1000:code,reason);}catch{}const s=await this.current();if(s)this.broadcast(s,w);});}
  webSocketError(w){return this.serial(async()=>{try{w.close(1011,'Connection error');}catch{}const s=await this.current();if(s)this.broadcast(s,w);});}
  alarm(){return this.serial(()=>this.expire());}
}
