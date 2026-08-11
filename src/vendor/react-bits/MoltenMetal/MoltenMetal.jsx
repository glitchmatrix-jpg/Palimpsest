// Adapted from React Bits component source supplied by the user.
// Original project: React Bits by David Haz (DavidHDev)
// https://github.com/DavidHDev/react-bits
// See REACT_BITS_ATTRIBUTION.md in repository root.

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { detectGraphicsMode } from '../../../utils/graphics';
import './MoltenMetal.css';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1,1,1];
  return [parseInt(result[1],16)/255, parseInt(result[2],16)/255, parseInt(result[3],16)/255];
};
const vertex=`#version 300 es
in vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment=`#version 300 es
precision highp float;
uniform vec2 iResolution; uniform float iTime,uSpeed,uScale,uDetail,uGlow,uCoreSize,uSwirl,uFold,uBlackPoint,uBrightness,uGrain,uGrainIntensity,uOpacity,uMouseStrength;
uniform vec2 uMouse; uniform bool uEnableMouse; uniform vec3 uColor1,uColor2,uColor3; out vec4 fragColor;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
 float time=iTime*uSpeed;
 vec2 p=uScale*((gl_FragCoord.xy-.5*iResolution.xy)/iResolution.y)-.5;
 if(uEnableMouse)p+=(uMouse-.5)*uMouseStrength*2.;
 vec2 i=p; float c=0.; float r=length(p+vec2(sin(time),sin(time*.3+5.))*0.5); float d=length(p); float rot=d+time+p.x*uSwirl;
 float cr=cos(rot); mat2 warp=mat2(cos(rot-sin(time/5.)),sin(rot),-sin(cr-time),cr)*uFold;
 float glowCore=uGlow*uCoreSize;
 for(float n=0.;n<8.;n++){if(n>=uDetail)break; p*=warp; float t=r-time/(n+3.); i-=p+vec2(cos(t-i.x-r)+sin(t+i.y),sin(t-i.y)+cos(t+i.x)+r); c+=glowCore/length(vec2(sin(i.x+t),cos(i.y+t)));}
 c/=6.; float intensity=max(c-uBlackPoint,0.)*uBrightness; float g=clamp(intensity,0.,1.);
 vec3 col=mix(uColor1,uColor2,smoothstep(0.,.5,g)); col=mix(col,uColor3,smoothstep(.5,1.,g));
 float a=g; if(uGrain>.5){float gr=hash(gl_FragCoord.xy+iTime);a+=(gr-.5)*uGrainIntensity;} a=clamp(a,0.,1.)*uOpacity;
 fragColor=vec4(col*a,a);
}`;
const ctxMap=new WeakMap();

export default function MoltenMetal({
 color1='#24133F',color2='#7952B3',color3='#D6B45C',speed=.18,scale=4.5,detail=3,glow=1.25,coreSize=.08,swirl=.8,fold=-.18,
 blackPoint=.08,brightness=1.1,grain=true,grainIntensity=.035,mouseInteraction=true,mouseStrength=.18,opacity=.75,className=''
}){
 const mode=detectGraphicsMode();
 const ref=useRef(null);
 useEffect(()=>{
  const container=ref.current;if(!container||mode!=='full'||!container.getClientRects().length)return;
  let renderer;
  try{renderer=new Renderer({webgl:2,alpha:true,premultipliedAlpha:true,antialias:false,dpr:Math.min(window.devicePixelRatio||1,1.5)});}catch{return;}
  const gl=renderer.gl;gl.clearColor(0,0,0,0);const canvas=gl.canvas;Object.assign(canvas.style,{width:'100%',height:'100%',display:'block'});container.appendChild(canvas);
  const geometry=new Triangle(gl);
  const program=new Program(gl,{vertex,fragment,uniforms:{
   iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:speed},uScale:{value:scale},uDetail:{value:detail},uGlow:{value:glow},
   uCoreSize:{value:coreSize},uSwirl:{value:swirl},uFold:{value:fold},uBlackPoint:{value:blackPoint},uBrightness:{value:brightness},uGrain:{value:grain?1:0},
   uGrainIntensity:{value:grainIntensity},uOpacity:{value:opacity},uMouse:{value:new Float32Array([.5,.5])},uMouseStrength:{value:mouseStrength},uEnableMouse:{value:mouseInteraction},
   uColor1:{value:new Float32Array(hexToRgb(color1))},uColor2:{value:new Float32Array(hexToRgb(color2))},uColor3:{value:new Float32Array(hexToRgb(color3))}
  }});
  const mesh=new Mesh(gl,{geometry,program});ctxMap.set(container,{renderer,program,mesh});
  const setSize=()=>{const r=container.getBoundingClientRect();renderer.setSize(Math.max(1,Math.floor(r.width)),Math.max(1,Math.floor(r.height)));program.uniforms.iResolution.value[0]=gl.drawingBufferWidth;program.uniforms.iResolution.value[1]=gl.drawingBufferHeight;};
  const ro=new ResizeObserver(setSize);ro.observe(container);setSize();
  let target=[.5,.5],current=[.5,.5],raf=0,visible=true,pageVisible=!document.hidden,t0=performance.now();
  const mm=e=>{const r=canvas.getBoundingClientRect();target=[(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height];};
  const ml=()=>target=[.5,.5];canvas.addEventListener('mousemove',mm);canvas.addEventListener('mouseleave',ml);
  const loop=t=>{program.uniforms.iTime.value=(t-t0)*.001;current[0]+=.05*(target[0]-current[0]);current[1]+=.05*(target[1]-current[1]);program.uniforms.uMouse.value[0]=current[0];program.uniforms.uMouse.value[1]=current[1];renderer.render({scene:mesh});raf=requestAnimationFrame(loop);};
  const start=()=>{if(visible&&pageVisible&&!raf)raf=requestAnimationFrame(loop)};const stop=()=>{if(raf){cancelAnimationFrame(raf);raf=0}};
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;visible?start():stop()});io.observe(container);
  const vis=()=>{pageVisible=!document.hidden;pageVisible?start():stop()};document.addEventListener('visibilitychange',vis);start();
  return()=>{stop();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',vis);canvas.removeEventListener('mousemove',mm);canvas.removeEventListener('mouseleave',ml);if(container.contains(canvas))container.removeChild(canvas);gl.getExtension('WEBGL_lose_context')?.loseContext();};
 },[mode]);
 if(mode!=='full')return null;
 return <div ref={ref} className={`molten-metal-container ${className}`.trim()}/>;
}
