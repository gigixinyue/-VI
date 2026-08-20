import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, Plus, Sparkles } from 'lucide-react';
import { diagnose, questions, Reflection, score } from './editor';

type Card = { id:number; raw:string; title:string; status:string; reflection:Reflection };
const empty:Reflection={event:'',detail:'',before:'',after:'',insight:'',audience:'',action:'',change:''};
const seed:Card[]=[
 {id:1,raw:'最近疯狂逛 MUJI，明明没有什么需要买，每次进去还是觉得特别爽。',title:'MUJI 为什么让我这么舒服？',status:'未整理',reflection:{...empty}},
 {id:2,raw:'市面上的儿童 AI 玩具怎么都有屏幕？我想给女儿做一个能聊天讲故事、但没有屏幕的。',title:'无屏幕的 AI 儿童玩具',status:'未整理',reflection:{...empty}},
 {id:3,raw:'最近买回来的衣服几乎全是软软烂烂、像睡衣一样的东西。',title:'最近买的衣服怎么全像睡衣？',status:'未整理',reflection:{...empty}},
];
const load=()=>{try{return JSON.parse(localStorage.getItem('idea-pool')||'null')||seed}catch{return seed}};
const makeTitle=(raw:string)=>raw.length>28?raw.slice(0,28)+'…':raw;

export default function App(){
 const [cards,setCards]=useState<Card[]>(load); const [raw,setRaw]=useState(''); const [active,setActive]=useState<Card|null>(null); const [step,setStep]=useState(0); const [mode,setMode]=useState<'reflect'|'result'>('reflect');
 const persist=(next:Card[])=>{setCards(next);localStorage.setItem('idea-pool',JSON.stringify(next))};
 const add=()=>{if(!raw.trim())return; const c={id:Date.now(),raw:raw.trim(),title:makeTitle(raw.trim()),status:'未整理',reflection:{...empty}};persist([c,...cards]);setRaw('')};
 const update=(patch:Partial<Reflection>)=>{if(!active)return; const next={...active,reflection:{...active.reflection,...patch},status:'思考中'};setActive(next);persist(cards.map(c=>c.id===next.id?next:c))};
 const result=useMemo(()=>active?diagnose(active.reflection):null,[active]); const points=useMemo(()=>active?score(active.reflection):null,[active]);
 if(active){ const q=questions[step]; return <main className="shell"><button className="back" onClick={()=>{setActive(null);setMode('reflect');setStep(0)}}><ArrowLeft size={18}/>观察池</button>{mode==='reflect'?<section className="focus"><div className="progress"><span>{step+1} / 7</span><i style={{width:`${(step+1)/7*100}%`}}/></div><p className="eyebrow">想一想</p><h1>{q.title}</h1><p className="hint">{q.hint}</p>{q.key==='contrast'?<div className="contrast"><label>我原来以为<textarea value={active.reflection.before} onChange={e=>update({before:e.target.value})}/></label><label>但后来发现<textarea value={active.reflection.after} onChange={e=>update({after:e.target.value})}/></label></div>:<textarea className="answer" autoFocus value={(active.reflection as any)[q.key]} onChange={e=>update({[q.key]:e.target.value} as any)} placeholder="写下真实的东西，不需要写得漂亮。"/>}<div className="nav">{step>0?<button className="secondary" onClick={()=>setStep(step-1)}><ArrowLeft size={17}/>上一步</button>:<span/>}<button onClick={()=>step<6?setStep(step+1):setMode('result')}>{step<6?'下一步':'让编辑看看'}<ArrowRight size={17}/></button></div></section>:<section className="result"><p className="eyebrow"><Sparkles size={15}/>个人内容编辑</p><h1>{result?.type}</h1><div className="score"><strong>{points?.total}</strong><span>/ 12 内容体检</span></div><div className="diagnosis"><article><b>最有价值的东西</b><p>{result?.strongest}</p></article><article><b>当前最大的问题</b><p>{result?.problem}</p></article><article><b>这一篇只抓什么</b><p className="focusline">{result?.focus}</p></article><article><b>下一步</b><p>{result?.next}</p></article></div><button onClick={()=>{if(active){const next={...active,status:result?.type==='继续观察'?'继续观察':'候选选题'};persist(cards.map(c=>c.id===next.id?next:c));setActive(null);setMode('reflect');setStep(0)}}}>保存到选题池</button></section>}</main> }
 return <main className="shell home"><header><p className="eyebrow">选题观察池</p><h1>刚刚发生了什么，<br/>让你有感觉？</h1><p>先记录生活，不要急着想“这个怎么发”。</p></header><section className="capture"><textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="好爽、好烦、好奇怪、居然可以这样、为什么会这样、我以前不是这样的……"/><button onClick={add}><Plus size={18}/>记下来</button></section><section className="list"><div className="listhead"><h2>最近的观察</h2><span>{cards.length} 条</span></div>{cards.map(c=><button className="card" key={c.id} onClick={()=>{setActive(c);setStep(0)}}><div><span className={`tag ${c.status}`}>{c.status}</span><h3>{c.title}</h3><p>{c.raw}</p></div><ArrowRight size={18}/></button>)}</section><footer><Lightbulb size={16}/><span>具体先于抽象 · 一篇只讲一个发现</span></footer></main>
}
