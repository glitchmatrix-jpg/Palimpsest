// Adapted from React Bits component source supplied by the user.
// Original project: React Bits by David Haz (DavidHDev)
// https://github.com/DavidHDev/react-bits
// See REACT_BITS_ATTRIBUTION.md in repository root.

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';
const springValues={damping:30,stiffness:100,mass:2};
export default function TiltedCard({imageSrc,altText='Tarot card',containerWidth='100%',imageWidth='100%',rotateAmplitude=4,scaleOnHover=1.025,className=''}) {
 const ref=useRef(null);const rx=useSpring(useMotionValue(0),springValues);const ry=useSpring(useMotionValue(0),springValues);const scale=useSpring(1,springValues);
 const move=e=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();const ox=e.clientX-r.left-r.width/2,oy=e.clientY-r.top-r.height/2;rx.set((oy/(r.height/2))*-rotateAmplitude);ry.set((ox/(r.width/2))*rotateAmplitude);};
 const enter=()=>scale.set(scaleOnHover);const leave=()=>{scale.set(1);rx.set(0);ry.set(0)};
 return <figure ref={ref} className={`tilted-card-figure ${className}`} style={{width:containerWidth}} onMouseMove={move} onMouseEnter={enter} onMouseLeave={leave}>
   <motion.div className="tilted-card-inner" style={{width:imageWidth,rotateX:rx,rotateY:ry,scale}}>
     <img src={imageSrc} alt={altText} className="tilted-card-img"/>
   </motion.div>
 </figure>;
}
