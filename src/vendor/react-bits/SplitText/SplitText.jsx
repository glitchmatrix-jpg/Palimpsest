// Adapted from React Bits component source supplied by the user.
// Original project: React Bits by David Haz (DavidHDev)
// https://github.com/DavidHDev/react-bits
// See REACT_BITS_ATTRIBUTION.md in repository root.

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import './SplitText.css';

export default function SplitText({text,className='',delay=55,duration=1.1,from={opacity:0,y:24},to={opacity:1,y:0},tag='h1',onLetterAnimationComplete}) {
 const ref=useRef(null);
 const chars=useMemo(()=>Array.from(text||''),[text]);
 useEffect(()=>{const el=ref.current;if(!el)return;const targets=el.querySelectorAll('.split-char');const ctx=gsap.context(()=>{gsap.fromTo(targets,from,{...to,duration,ease:'power3.out',stagger:delay/1000,onComplete:onLetterAnimationComplete})},el);return()=>ctx.revert();},[text,delay,duration]);
 const Tag=tag;
 return <Tag ref={ref} className={`split-parent ${className}`}>{chars.map((c,i)=><span className="split-char" key={i}>{c===' '?'\\u00A0':c}</span>)}</Tag>;
}
