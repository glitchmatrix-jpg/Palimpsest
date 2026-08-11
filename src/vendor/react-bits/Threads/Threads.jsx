// Adapted from React Bits component source supplied by the user.
// Original project: React Bits by David Haz (DavidHDev)
// https://github.com/DavidHDev/react-bits
// See REACT_BITS_ATTRIBUTION.md in repository root.

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import { detectGraphicsMode } from '../../../utils/graphics';
import './Threads.css';
const vertex=`attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision highp float;uniform float iTime;uniform vec3 iResolution,uColor;uniform float uAmplitude,uDistance;uniform vec2 uMouse;
#define PI 3.1415926538
const int u_line_count=40;const float u_line_width=7.;const float u_line_blur=10.;
float Perlin2D(vec2 P){vec2 Pi=floor(P);vec4 Pf=P.xyxy-vec4(Pi,Pi+1.);vec4 Pt=vec4(Pi.xy,Pi.xy+1.);Pt=Pt-floor(Pt*(1./71.))*71.;Pt+=vec2(26.,161.).xyxy;Pt*=Pt;Pt=Pt.xzxz*Pt.yyww;vec4 hx=fract(Pt*(1./951.135664));vec4 hy=fract(Pt*(1./642.949883));vec4 gx=hx-.49999,gy=hy-.49999;vec4 gr=inversesqrt(gx*gx+gy*gy)*(gx*Pf.xzxz+gy*Pf.yyww);gr*=1.41421356237;vec2 b=Pf.xy*Pf.xy*Pf.xy*(Pf.xy*(Pf.xy*6.-15.)+10.);vec4 b2=vec4(b,vec2(1.-b));return dot(gr,b2.zxzx*b2.wwyy);}
float pixel(float c,vec2 r){return(1./max(r.x,r.y))*c;}
float lineFn(vec2 st,float width,float perc,vec2 mouse,float time,float amplitude,float distance){float split=.1+perc*.4;float an=smoothstep(split,.7,st.x);float fa=an*.5*amplitude*(1.+(mouse.y-.5)*.2);float ts=time/10.+(mouse.x-.5);float blur=smoothstep(split,split+.05,st.x)*perc;float xn=mix(Perlin2D(vec2(ts,st.x+perc)*2.5),Perlin2D(vec2(ts,st.x+ts)*3.5)/1.5,st.x*.3);float y=.5+(perc-.5)*distance+xn/2.*fa;float a=smoothstep(y+width/2.+u_line_blur*pixel(1.,iResolution.xy)*blur,y,st.y);float e=smoothstep(y,y-width/2.-u_line_blur*pixel(1.,iResolution.xy)*blur,st.y);return clamp((a-e)*(1.-smoothstep(0.,1.,pow(perc,.3))),0.,1.);}
void main(){vec2 uv=gl_FragCoord.xy/iResolution.xy;float strength=1.;for(int i=0;i<u_line_count;i++){float p=float(i)/float(u_line_count);strength*=1.-lineFn(uv,u_line_width*pixel(1.,iResolution.xy)*(1.-p),p,uMouse,iTime,uAmplitude,uDistance);}float v=1.-strength;gl_FragColor=vec4(uColor*v,v);}`;
export default function Threads({color=[.84,.7,.36],amplitude=.65,distance=.15,enableMouseInteraction=true,className=''}) {
 const mode=detectGraphicsMode(),ref=useRef(null),rafRef=useRef(0);
 useEffect(()=>{const c=ref.current;if(!c||mode!=='full'||!c.getClientRects().length)return;let renderer;try{renderer=new Renderer({alpha:true});}catch{return;}const gl=renderer.gl;gl.clearColor(0,0,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);c.appendChild(gl.canvas);
 const geometry=new Triangle(gl);const program=new Program(gl,{vertex,fragment,uniforms:{iTime:{value:0},iResolution:{value:new Color(gl.canvas.width,gl.canvas.height,1)},uColor:{value:new Color(...color)},uAmplitude:{value:amplitude},uDistance:{value:distance},uMouse:{value:new Float32Array([.5,.5])}}});const mesh=new Mesh(gl,{geometry,program});
 const resize=()=>{const {clientWidth:w,clientHeight:h}=c;const dpr=Math.min(window.devicePixelRatio||1,1.5);renderer.dpr=dpr;renderer.setSize(w,h);program.uniforms.iResolution.value.r=gl.canvas.width;program.uniforms.iResolution.value.g=gl.canvas.height;program.uniforms.iResolution.value.b=gl.canvas.width/gl.canvas.height;};const ro=new ResizeObserver(resize);ro.observe(c);resize();
 let target=[.5,.5],current=[.5,.5],visible=true;const mm=e=>{const r=c.getBoundingClientRect();target=[(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height]};const ml=()=>target=[.5,.5];c.addEventListener('mousemove',mm);c.addEventListener('mouseleave',ml);
 const io=new IntersectionObserver(([e])=>visible=e.isIntersecting);io.observe(c);
 const update=t=>{rafRef.current=requestAnimationFrame(update);if(!visible||document.hidden)return;program.uniforms.uColor.value.set(...color);program.uniforms.uAmplitude.value=amplitude;program.uniforms.uDistance.value=distance;if(enableMouseInteraction){current[0]+=.05*(target[0]-current[0]);current[1]+=.05*(target[1]-current[1]);program.uniforms.uMouse.value[0]=current[0];program.uniforms.uMouse.value[1]=current[1];}program.uniforms.iTime.value=t*.001;renderer.render({scene:mesh});};rafRef.current=requestAnimationFrame(update);
 return()=>{cancelAnimationFrame(rafRef.current);ro.disconnect();io.disconnect();c.removeEventListener('mousemove',mm);c.removeEventListener('mouseleave',ml);if(c.contains(gl.canvas))c.removeChild(gl.canvas);gl.getExtension('WEBGL_lose_context')?.loseContext();};},[color,amplitude,distance,enableMouseInteraction,mode]);
 if(mode!=='full')return null;
 return <div ref={ref} className={`threads-container ${className}`.trim()}/>;
}
