import type { MascotId } from '@/lib/banter/contracts';
export const characters = {
 pip:{name:'Pip',tag:'The optimist',color:'#d8c3ff',body:'#a27bea'},
 mochi:{name:'Mochi',tag:'The menace',color:'#ffb09c',body:'#ee806a'},
 bloop:{name:'Bloop',tag:'The sleepy genius',color:'#d5ff63',body:'#a5cd54'},
 zuzu:{name:'Zuzu',tag:'The wild card',color:'#b8e1f4',body:'#71bed9'},
} as const;
export function Mascot({id,mood='idle'}:{id:MascotId;mood?:'idle'|'happy'|'sad'}) {
 const c=characters[id];
 return <svg className={`bp-mascot bp-mascot-${mood}`} viewBox="0 0 160 140" aria-hidden="true">
 <ellipse cx="80" cy="125" rx="42" ry="7" fill="#22211f" opacity=".13"/>
 <g className="bp-mascot-body" stroke="#22211f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M48 107l-9 13m73-13 9 13M38 77l-15 10m99-10 15 10" fill="none"/>
 {id==='mochi'?<path d="M35 43 31 14 60 31Q80 24 100 31L129 14 125 43Q137 66 124 98Q110 117 80 117Q50 117 36 98Q23 66 35 43Z" fill={c.body}/>:id==='bloop'?<path d="M27 78Q30 48 50 37Q59 13 80 31Q100 13 110 38Q133 53 134 79Q134 116 80 117Q26 116 27 78Z" fill={c.body}/>:<><rect x="31" y="29" width="98" height="88" rx={id==='pip'?33:27} fill={c.body}/>{id==='pip'?<path d="M48 32 56 13 73 30" fill={c.body}/>:<><path d="M80 29V12"/><circle cx="80" cy="9" r="6" fill="#ffd56c"/></>}</>}
 <g className="bp-eyes" fill="#22211f" stroke="none">{id==='bloop'&&mood==='idle'?<><path d="M52 67q7-9 14 0M94 67q7-9 14 0" stroke="#22211f" fill="none" strokeWidth="3.5"/></>:<><ellipse cx="59" cy="66" rx="5" ry="7"/><ellipse cx="101" cy="66" rx="5" ry="7"/></>}</g>
 {id==='mochi'&&mood==='idle'&&<path d="m50 51 15 5m45-5-15 5" fill="none"/>}
 <ellipse cx="46" cy="83" rx="8" ry="4" fill="#ffb6bd" stroke="none"/><ellipse cx="114" cy="83" rx="8" ry="4" fill="#ffb6bd" stroke="none"/>
 <path d={mood==='sad'?'M69 91Q80 79 91 91':mood==='happy'?'M65 83Q80 111 95 83Z':'M68 85Q80 99 92 85'} fill={mood==='happy'?'#fffaf0':'none'}/>
 </g></svg>;
}
