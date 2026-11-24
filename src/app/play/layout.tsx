import Link from 'next/link';
import type { Metadata } from 'next';
import './play.css';
export const metadata:Metadata={title:'Playclub | BanterBox',description:'Pick your mascot, practice mini-games and create private online rooms.'};
export default function PlayLayout({children}:{children:React.ReactNode}) {return <div className="bp"><header className="bp-header"><Link className="wordmark" href="/">banter<span>box</span><span className="wordmark-mark">✳</span></Link><span className="bp-tag">PLAYCLUB / ALPHA</span><Link className="bp-back" href="/">← Website</Link></header><main className="bp-main">{children}</main><footer className="bp-footer">GOOD GAMES. BETTER COMPANY. <span>✳</span> PLAYCLUB / ONLINE BETA</footer></div>}
