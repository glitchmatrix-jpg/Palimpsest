// Adapted from React Bits component source supplied by the user.
// Original project: React Bits by David Haz (DavidHDev)
// https://github.com/DavidHDev/react-bits
// See REACT_BITS_ATTRIBUTION.md in repository root.

import { useRef } from 'react';
import './SpotlightCard.css';
export default function SpotlightCard({children,className='',spotlightColor='rgba(214,180,92,.22)'}) {
 const ref=useRef(null);
 const move=e=>{const r=ref.current.getBoundingClientRect();ref.current.style.setProperty('--mouse-x',`${e.clientX-r.left}px`);ref.current.style.setProperty('--mouse-y',`${e.clientY-r.top}px`);ref.current.style.setProperty('--spotlight-color',spotlightColor);};
 return <div ref={ref} onMouseMove={move} className={`card-spotlight ${className}`}>{children}</div>;
}
