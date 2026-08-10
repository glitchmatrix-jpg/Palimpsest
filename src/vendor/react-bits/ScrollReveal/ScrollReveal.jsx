// Adapted from React Bits component source supplied by the user.
// Original project: React Bits by David Haz (DavidHDev)
// https://github.com/DavidHDev/react-bits
// See REACT_BITS_ATTRIBUTION.md in repository root.

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';
gsap.registerPlugin(ScrollTrigger);
export default function ScrollReveal({children,enableBlur=true,baseOpacity=.25,baseRotation=1,blurStrength=2,className=''}) {
 const ref=useRef(null);
 const split=useMemo(()=>String(children||'').split(/(\s+)/).map((w,i)=>/^\\s+$/.test(w)?w:<span className="word" key={i}>{w}</span>),[children]);
 useEffect(()=>{const el=ref.current;if(!el)return;const words=el.querySelectorAll('.word');
 const a=gsap.fromTo(el,{transformOrigin:'0% 50%',rotate:baseRotation},{ease:'none',rotate:0,scrollTrigger:{trigger:el,start:'top bottom',end:'bottom bottom',scrub:true}});
 const b=gsap.fromTo(words,{opacity:baseOpacity},{ease:'none',opacity:1,stagger:.05,scrollTrigger:{trigger:el,start:'top bottom-=20%',end:'bottom bottom',scrub:true}});
 let c;if(enableBlur)c=gsap.fromTo(words,{filter:`blur(${blurStrength}px)`},{ease:'none',filter:'blur(0px)',stagger:.05,scrollTrigger:{trigger:el,start:'top bottom-=20%',end:'bottom bottom',scrub:true}});
 return()=>{a.kill();b.kill();c?.kill();ScrollTrigger.getAll().forEach(t=>{if(t.trigger===el)t.kill()})};},[enableBlur,baseOpacity,baseRotation,blurStrength]);
 return <div ref={ref} className={`scroll-reveal ${className}`}>{split}</div>;
}
