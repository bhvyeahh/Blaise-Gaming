import Link from 'next/link';
import type { Metadata } from 'next';
import './play.css';
import './premium.css';
export const metadata:Metadata={title:'Playclub | BanterBox',description:'Pick your mascot, practice mini-games and create private online rooms.'};
export default function PlayLayout({children}:{children:React.ReactNode}) {
 return <div className="bp"><header className="bp-header"><Link className="wordmark" href="/" aria-label="BanterBox website">banter<span>box</span><span className="wordmark-mark">✳</span></Link><nav className="bp-nav" aria-label="Playclub navigation"><Link href="/play">Games</Link><Link href="/play/lobby">Room</Link><Link href="/play/setup">Profile</Link></nav><span className="bp-tag bp-header-status"><i/> PLAYCLUB BETA</span></header><main id="play-main" className="bp-main">{children}</main><footer className="bp-footer"><span>✳</span> GOOD GAMES. BETTER COMPANY. <Link href="/">Back to website ↗</Link></footer></div>
}
