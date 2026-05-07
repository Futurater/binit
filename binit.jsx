const { useState, useRef, useEffect } = React;

// Key priority: config.js (local dev) ÔåÆ localStorage (Vercel/browser) ÔåÆ ""
const getKey = () => (window.BINIT_CONFIG && window.BINIT_CONFIG.apiKey) || localStorage.getItem('BINIT_KEY') || "";
const saveKey = (k) => localStorage.setItem('BINIT_KEY', k);

const callGemini = async (prompt, imageBase64) => {
  const parts = [{ text: prompt }];
  if (imageBase64) parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64.split(',')[1] } });
  const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
  let lastErr = null;
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${getKey()}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { response_mime_type: "application/json" } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `Error from ${model}`);
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (e) { console.warn(`${model} failed:`, e.message); lastErr = e; }
  }
  throw new Error(`All models failed. ${lastErr?.message}`);
};

const T = {
  en: { s1:"What are you throwing away?", s2:"Where are you throwing this?", scan:"Identify Waste", scanBin:"Audit Dustbin", impact:"Impact", loading:"Analysing...", safe:"Safe to dispose!", stop:"STOP!", or:"or describe it", ph:"e.g. Banana peel, Old battery...", change:"Tap to change", reset:"Scan New Item", capture:"Capture", takePhoto:"Take Photo", uploadGallery:"Upload from Gallery" },
  hi: { s1:"ÓñåÓñ¬ ÓñòÓÑìÓñ»Óñ¥ Óñ½ÓÑçÓñéÓñò Óñ░Óñ╣ÓÑç Óñ╣ÓÑêÓñé?", s2:"ÓñçÓñ©ÓÑç ÓñòÓñ╣Óñ¥Óñü Óñ½ÓÑçÓñéÓñò Óñ░Óñ╣ÓÑç Óñ╣ÓÑêÓñé?", scan:"Óñ¬Óñ╣ÓñÜÓñ¥Óñ¿ÓÑçÓñé", scanBin:"ÓñíÓñ©ÓÑìÓñƒÓñ¼Óñ┐Óñ¿ Óñ£Óñ¥ÓñüÓñÜÓÑçÓñé", impact:"Óñ¬ÓÑìÓñ░Óñ¡Óñ¥ÓñÁ", loading:"ÓñÁÓñ┐ÓñÂÓÑìÓñ▓ÓÑçÓñÀÓñú...", safe:"Óñ©ÓÑüÓñ░ÓñòÓÑìÓñÀÓñ┐Óññ Óñ╣ÓÑê!", stop:"Óñ░ÓÑüÓñòÓÑçÓñé!", or:"Óñ»Óñ¥ ÓñÁÓñ░ÓÑìÓñúÓñ¿ ÓñòÓñ░ÓÑçÓñé", ph:"ÓñëÓñªÓñ¥. ÓñòÓÑçÓñ▓ÓÑç ÓñòÓñ¥ ÓñøÓñ┐Óñ▓ÓñòÓñ¥...", change:"Óñ¼ÓñªÓñ▓ÓÑçÓñé", reset:"Óñ¿Óñê ÓñÁÓñ©ÓÑìÓññÓÑü", capture:"ÓñòÓÑêÓñ¬ÓÑìÓñÜÓñ░", takePhoto:"Óñ½ÓÑïÓñƒÓÑï Óñ▓ÓÑçÓñé", uploadGallery:"ÓñùÓÑêÓñ▓Óñ░ÓÑÇ Óñ©ÓÑç ÓñàÓñ¬Óñ▓ÓÑïÓñí" },
  kn: { s1:"Ó▓¿Ó│ÇÓ▓ÁÓ│ü Ó▓ÅÓ▓¿Ó▓¿Ó│ìÓ▓¿Ó│ü Ó▓¼Ó▓┐Ó▓©Ó▓¥Ó▓íÓ│üÓ▓ñÓ│ìÓ▓ñÓ▓┐Ó▓ªÓ│ìÓ▓ªÓ│ÇÓ▓░Ó▓┐?", s2:"Ó▓çÓ▓ªÓ▓¿Ó│ìÓ▓¿Ó│ü Ó▓ÄÓ▓▓Ó│ìÓ▓▓Ó▓┐ Ó▓¼Ó▓┐Ó▓©Ó▓¥Ó▓íÓ│üÓ▓ñÓ│ìÓ▓ñÓ▓┐Ó▓ªÓ│ìÓ▓ªÓ│ÇÓ▓░Ó▓┐?", scan:"Ó▓ùÓ│üÓ▓░Ó│üÓ▓ñÓ▓┐Ó▓©Ó▓┐", scanBin:"Ó▓íÓ▓©Ó│ìÓ▓ƒÓ│ìÔÇîÓ▓¼Ó▓┐Ó▓¿Ó│ì Ó▓¬Ó▓░Ó▓┐Ó▓ÂÓ│ÇÓ▓▓Ó▓┐Ó▓©Ó▓┐", impact:"Ó▓¬Ó▓░Ó▓┐Ó▓úÓ▓¥Ó▓«", loading:"Ó▓ÁÓ▓┐Ó▓ÂÓ│ìÓ▓▓Ó│çÓ▓ÀÓ▓┐Ó▓©Ó▓▓Ó▓¥Ó▓ùÓ│üÓ▓ñÓ│ìÓ▓ñÓ▓┐Ó▓ªÓ│å...", safe:"Ó▓©Ó│üÓ▓░Ó▓òÓ│ìÓ▓ÀÓ▓┐Ó▓ñ!", stop:"Ó▓¿Ó▓┐Ó▓▓Ó│ìÓ▓▓Ó▓┐Ó▓©Ó▓┐!", or:"Ó▓àÓ▓ÑÓ▓ÁÓ▓¥ Ó▓ÁÓ▓┐Ó▓ÁÓ▓░Ó▓┐Ó▓©Ó▓┐", ph:"Ó▓ëÓ▓ªÓ▓¥. Ó▓¼Ó▓¥Ó▓│Ó│åÓ▓╣Ó▓úÓ│ìÓ▓úÓ▓┐Ó▓¿ Ó▓©Ó▓┐Ó▓¬Ó│ìÓ▓¬Ó│å...", change:"Ó▓¼Ó▓ªÓ▓▓Ó▓¥Ó▓»Ó▓┐Ó▓©Ó▓┐", reset:"Ó▓╣Ó│èÓ▓© Ó▓ÁÓ▓©Ó│ìÓ▓ñÓ│ü", capture:"Ó▓òÓ│ìÓ▓»Ó▓¥Ó▓¬Ó│ìÓ▓ÜÓ▓░Ó│ì", takePhoto:"Ó▓½Ó│ïÓ▓ƒÓ│ï Ó▓ñÓ│åÓ▓ùÓ│åÓ▓»Ó▓┐Ó▓░Ó▓┐", uploadGallery:"Ó▓ùÓ│ìÓ▓»Ó▓¥Ó▓▓Ó▓░Ó▓┐" }
};

const BIN = {
  wet:      { c:"#5a8c4e", bg:"linear-gradient(135deg,#2d4a1e,#3a6028)", ic:"­ƒƒó", l:"Wet" },
  dry:      { c:"#c17f4a", bg:"linear-gradient(135deg,#6b3d1a,#8b5626)", ic:"­ƒƒñ", l:"Dry" },
  hazardous:{ c:"#c45c3a", bg:"linear-gradient(135deg,#7a2414,#9a3020)", ic:"­ƒö┤", l:"Hazard" },
  ewaste:   { c:"#8b6a9e", bg:"linear-gradient(135deg,#3d2458,#52346e)", ic:"ÔÜ½", l:"E-Waste" }
};
const impactCol = s => s <= 3 ? "#5a8c4e" : s <= 7 ? "#c4963a" : "#c45c3a";

// Palette
const P = {
  pageBg: 'linear-gradient(160deg,#faf6f0 0%,#f0e6d3 60%,#e8d9c4 100%)',
  text: '#3d2415',
  muted: '#9a7a5a',
  accent: '#c17f4a',
  accentDark: '#a0622e',
  card: {
    background: 'rgba(255,249,241,0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: '1px solid rgba(180,140,100,0.2)',
    padding: '24px 20px',
    boxShadow: '0 4px 24px rgba(120,80,40,0.08)'
  }
};

// --- Camera Zone Component ---
function CameraZone({ onCapture, fileRef, captured, onFileChange, t }) {
  const [camActive, setCamActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCamActive(true);
    } catch (e) {
      console.warn('Camera unavailable:', e);
      fileRef.current && fileRef.current.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCamActive(false);
  };

  const capturePhoto = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    const img = c.toDataURL('image/jpeg', 0.85);
    onCapture(img);
    stopCamera();
  };

  useEffect(() => () => stopCamera(), []);

  const miniBtn = (bg, border, color) => ({
    flex: 1, padding: '12px 8px', borderRadius: 14, background: bg,
    color: color || '#faf6f0', border: border || 'none',
    fontSize: 13, fontWeight: 700, cursor: 'pointer'
  });

  if (captured) {
    return (
      <div style={{ position:'relative', width:'100%', height:200, borderRadius:18, overflow:'hidden', marginBottom:16, cursor:'pointer' }}
        onClick={() => { onCapture(null); }}>
        <img src={captured} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px', textAlign:'center',
          background:'linear-gradient(transparent,rgba(50,25,5,0.8))', fontSize:12, color:'#e8d5b7' }}>
          {t.change}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <canvas ref={canvasRef} style={{ display:'none' }} />
      <input type="file" ref={fileRef} onChange={onFileChange} accept="image/*" style={{ display:'none' }} />

      {camActive ? (
        <div style={{ position:'relative', width:'100%', borderRadius:18, overflow:'hidden', background:'#1a0d05', marginBottom:10 }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width:'100%', display:'block', borderRadius:18, maxHeight:280, objectFit:'cover' }} />
          <div style={{ position:'absolute', bottom:14, left:0, right:0, display:'flex', justifyContent:'center', gap:12, padding:'0 20px' }}>
            <button onClick={stopCamera}
              style={{ padding:'11px 22px', borderRadius:50, background:'rgba(60,30,10,0.75)', color:'#e8d5b7',
                border:'1px solid rgba(200,160,100,0.3)', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              Ô£ò Cancel
            </button>
            <button onClick={capturePhoto}
              style={{ padding:'11px 28px', borderRadius:50,
                background:'linear-gradient(135deg,#c17f4a,#a0622e)', color:'#fff',
                border:'none', fontSize:15, fontWeight:800, cursor:'pointer',
                boxShadow:'0 4px 16px rgba(193,127,74,0.4)' }}>
              ­ƒô© {t.capture}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ width:'100%', height:160, borderRadius:18,
          border:'2px dashed rgba(160,120,80,0.25)', display:'flex',
          alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6,
          background:'rgba(180,140,100,0.05)', marginBottom:10 }}>
          <div style={{ fontSize:40 }}>­ƒôÀ</div>
          <span style={{ color:'#9a7a5a', fontSize:13, fontWeight:600 }}>Add a photo of the waste</span>
        </div>
      )}

      {!camActive && (
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={startCamera}
            style={miniBtn('linear-gradient(135deg,#c17f4a,#a0622e)')}>
            ­ƒôÀ {t.takePhoto}
          </button>
          <button onClick={() => fileRef.current && fileRef.current.click()}
            style={miniBtn('rgba(180,140,100,0.12)', '1px solid rgba(160,120,80,0.25)', '#9a7a5a')}>
            ­ƒû╝ {t.uploadGallery}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main App ---
function App() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState("en");
  const [wasteImg, setWasteImg] = useState(null);
  const [txt, setTxt] = useState("");
  const [binImg, setBinImg] = useState(null);
  const [res1, setRes1] = useState(null);
  const [res2, setRes2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [apiKey, setApiKey] = useState(getKey());
  const [keyInput, setKeyInput] = useState("");
  const f1 = useRef(null), f2 = useRef(null);
  const t = T[lang];

  // Show setup screen if no key available (Vercel deployment)
  if (!apiKey) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#faf6f0 0%,#f0e6d3 60%,#e8d9c4 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ width:'100%', maxWidth:400, background:'rgba(255,249,241,0.95)', borderRadius:24, border:'1px solid rgba(180,140,100,0.2)', padding:'32px 24px', boxShadow:'0 4px 24px rgba(120,80,40,0.08)' }}>
          <h1 style={{ margin:'0 0 4px', fontSize:26, fontWeight:900, color:'#3d2415' }}>­ƒùæ´©Å BinIt</h1>
          <p style={{ margin:'0 0 24px', fontSize:12, color:'#9a7a5a', letterSpacing:2, textTransform:'uppercase' }}>Know Your Bin</p>
          <p style={{ fontSize:14, color:'#6b4f2a', lineHeight:1.6, margin:'0 0 20px' }}>Paste your <strong>Google AI Studio</strong> API key to get started. It's stored only in your browser.</p>
          <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            style={{ width:'100%', padding:'14px 16px', borderRadius:14, border:'1px solid rgba(160,120,80,0.3)', background:'rgba(255,245,232,0.8)', color:'#3d2415', fontSize:15, marginBottom:16, outline:'none' }} />
          <button
            onClick={() => { if(keyInput.trim()) { saveKey(keyInput.trim()); setApiKey(keyInput.trim()); } }}
            style={{ width:'100%', padding:'15px', borderRadius:14, background:'linear-gradient(135deg,#c17f4a,#a0622e)', color:'#fff', border:'none', fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px rgba(193,127,74,0.3)' }}>
            Get Started ÔåÆ
          </button>
          <p style={{ textAlign:'center', marginTop:16, fontSize:12, color:'#b0906a' }}>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color:'#c17f4a' }}>Get a free key from Google AI Studio</a>
          </p>
        </div>
      </div>
    );
  }

  const readFile = (e, set) => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onloadend = () => set(r.result); r.readAsDataURL(f); }
  };

  const identify = async () => {
    if (!wasteImg && !txt.trim()) { setErr("Please provide an image or description."); return; }
    setErr(""); setLoading(true);
    const lName = lang==='hi'?'Hindi':lang==='kn'?'Kannada':'English';
    try {
      const r = await callGemini(
        `You are a waste classification expert for India (BBMP Bengaluru guidelines). The user has ${wasteImg ? "shared a photo of waste" : `described: "${txt}"`}.
Respond ONLY in valid JSON with these exact fields:
{"item":"name","bin":"wet|dry|hazardous|ewaste","binLabel":"Wet Waste|Dry Waste|Hazardous Waste|E-Waste","why":"one sentence","ifWrong":"consequence","didYouKnow":"one fact","impactScore":5,"actionLabel":"NGO label or empty","actionUrl":"URL or empty","ecoAction":{"icon":"emoji","title":"e.g. Compost It!","tagline":"motivating one-liner","steps":["step1","step2","step3"]}}
For ecoAction be VERY specific to the exact item. Examples: banana peel -> pit composting; newspaper -> papier-mache craft or Goonj donation; old phone -> factory reset then iGive/Goonj donation; bleach bottle -> rinse 3x, air-dry, dry waste; syringe -> sharps container then BBMP hazardous; laptop battery -> Attero e-waste pickup; tea bag -> compost or balcony garden; cardboard box -> upcycle into organizer; printer ink cartridge -> HP/Canon take-back. Steps must be practical and India-specific (max 3 steps, concise). Translate why, ifWrong, didYouKnow, ecoAction.tagline, ecoAction.steps into ${lName}. Keep all other fields in English.`,
        wasteImg
      );
      setRes1(r); setStep(2);
    } catch(e) { setErr("Failed: " + e.message); }
    setLoading(false);
  };

  const audit = async () => {
    if (!binImg) { setErr("Please upload a dustbin photo."); return; }
    setErr(""); setLoading(true);
    const lName = lang==='hi'?'Hindi':lang==='kn'?'Kannada':'English';
    try {
      const r = await callGemini(
        `You are an environmental safety auditor. User wants to dispose "${res1.item}" (${res1.binLabel}, Impact: ${res1.impactScore}/10). They shared a photo of their dustbin. Is it safe? Toxic/E-Waste should NEVER go into generic unsegregated bins.\nRespond ONLY in valid JSON:\n{"isSafe":true|false,"feedback":"explanation in ${lName}"}`,
        binImg
      );
      setRes2(r);
    } catch(e) { setErr("Failed: " + e.message); }
    setLoading(false);
  };

  const reset = () => { setStep(1); setWasteImg(null); setTxt(""); setBinImg(null); setRes1(null); setRes2(null); setErr(""); };

  const b = res1 ? BIN[res1.bin] || BIN.dry : null;
  const accentBtn = (bg, shadow) => ({ width:'100%', padding:'16px', borderRadius:16, background:bg, color:'#faf6f0', border:'none', fontSize:16, fontWeight:700, letterSpacing:0.3, boxShadow:shadow||'none', minHeight:52 });

  return (
    <div style={{ minHeight:'100vh', background:P.pageBg, color:P.text, fontFamily:"'Segoe UI',system-ui,sans-serif", display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 16px 40px' }}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px var(--gc)}50%{box-shadow:0 0 40px var(--gc)}}
        .anim{animation:fadeUp .4s ease-out both}
        .spinner{width:20px;height:20px;border:2.5px solid rgba(193,127,74,.25);border-top-color:#c17f4a;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
        button{cursor:pointer;transition:transform .15s,opacity .15s}
        button:active{transform:scale(.97)}
        button:disabled{opacity:.4;cursor:not-allowed;transform:none}
        input{outline:none}
        input:focus{border-color:rgba(193,127,74,.5)!important;box-shadow:0 0 0 3px rgba(193,127,74,.1)!important}
      `}</style>

      {/* Header */}
      <div style={{ width:'100%', maxWidth:420, marginBottom:24 }}>
        <div style={{ marginBottom:16 }}>
          <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:P.text, letterSpacing:-0.5 }}>­ƒùæ´©Å BinIt</h1>
          <p style={{ margin:'2px 0 0', fontSize:11, color:P.muted, letterSpacing:2, textTransform:'uppercase' }}>Know Your Bin</p>
        </div>

        {/* Step bar */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <div style={{ flex:1, height:4, borderRadius:4, background: step>=1?'linear-gradient(90deg,#c17f4a,#d49a5a)':'rgba(160,120,80,0.15)', transition:'background .3s' }}/>
          <div style={{ flex:1, height:4, borderRadius:4, background: step>=2?'linear-gradient(90deg,#8b6a45,#a08055)':'rgba(160,120,80,0.15)', transition:'background .3s' }}/>
        </div>

        {/* Language */}
        <div style={{ display:'flex', gap:6 }}>
          {[['en','EN'],['hi','Óñ╣Óñ┐Óñé'],['kn','Ó▓ò']].map(([k,v]) => (
            <button key={k} onClick={() => { setLang(k); reset(); }}
              style={{ flex:1, padding:'10px 0', borderRadius:10,
                background: lang===k ? 'rgba(193,127,74,0.12)' : 'rgba(160,120,80,0.06)',
                border: lang===k ? '1px solid rgba(193,127,74,0.4)' : '1px solid rgba(160,120,80,0.12)',
                color: lang===k ? P.accent : P.muted, fontSize:13, fontWeight:lang===k?700:500 }}>{v}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="anim" style={{ width:'100%', maxWidth:420, background:'rgba(196,92,58,0.08)', border:'1px solid rgba(196,92,58,0.25)', color:'#c45c3a', padding:'14px 16px', borderRadius:14, marginBottom:16, fontSize:14, lineHeight:1.5 }}>
          ÔÜá´©Å {err}
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="anim" style={{ ...P.card, width:'100%', maxWidth:420 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#c17f4a,#a0622e)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:800, flexShrink:0 }}>1</div>
            <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:P.text }}>{t.s1}</h2>
          </div>

          <CameraZone
            onCapture={setWasteImg}
            fileRef={f1}
            captured={wasteImg}
            onFileChange={e => readFile(e, setWasteImg)}
            t={t}
          />

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:'rgba(160,120,80,0.15)' }}/>
            <span style={{ fontSize:12, color:P.muted }}>{t.or}</span>
            <div style={{ flex:1, height:1, background:'rgba(160,120,80,0.15)' }}/>
          </div>

          <input type="text" value={txt} onChange={e => setTxt(e.target.value)} placeholder={t.ph}
            style={{ width:'100%', padding:'14px 16px', borderRadius:14, border:'1px solid rgba(160,120,80,0.25)', background:'rgba(255,245,232,0.7)', color:P.text, fontSize:15, marginBottom:20 }} />

          <button onClick={identify} disabled={loading} style={accentBtn('linear-gradient(135deg,#c17f4a,#a0622e)', '0 4px 20px rgba(193,127,74,0.3)')}>
            {loading ? <React.Fragment><span className="spinner"/>&nbsp; {t.loading}</React.Fragment> : t.scan}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && res1 && (
        <div className="anim" style={{ width:'100%', maxWidth:420 }}>
          {/* Result card */}
          <div style={{ ...P.card, background:b.bg, border:`1px solid ${b.c}30`, marginBottom:16, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:`${b.c}08`, pointerEvents:'none' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, color:b.c, marginBottom:4, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:b.c }}/> {res1.binLabel}
                </div>
                <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff' }}>{res1.item}</h2>
              </div>
              <div style={{ background:'rgba(0,0,0,0.3)', padding:'8px 14px', borderRadius:14, textAlign:'center', minWidth:64 }}>
                <div style={{ fontSize:10, color:'#c8b4a0', marginBottom:2 }}>{t.impact}</div>
                <div style={{ fontSize:20, fontWeight:800, color:impactCol(res1.impactScore) }}>
                  {res1.impactScore}<span style={{ fontSize:12, fontWeight:500, color:'#a09080' }}>/10</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize:14, lineHeight:1.6, margin:'0 0 14px', color:'rgba(255,255,255,0.85)' }}>{res1.why}</p>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', padding:'12px 14px', background:'rgba(0,0,0,0.2)', borderRadius:12, lineHeight:1.5 }}>
              ­ƒÆí {res1.didYouKnow}
            </div>
            {res1.ifWrong && (
              <div style={{ fontSize:12, color:'#f4c0a8', padding:'10px 14px', background:'rgba(196,92,58,0.15)', borderRadius:10, marginTop:12, lineHeight:1.5, border:'1px solid rgba(196,92,58,0.2)' }}>
                ÔÜá´©Å {res1.ifWrong}
              </div>
            )}
            {res1.actionUrl && res1.actionLabel && (
              <a href={res1.actionUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'14px', borderRadius:14, background:'rgba(160,120,80,0.2)', border:'1px solid rgba(180,140,100,0.3)', color:'#e8c89a', textDecoration:'none', fontWeight:700, fontSize:14, marginTop:14 }}>
                ­ƒöù {res1.actionLabel}
              </a>
            )}
          </div>

          {/* Eco Action Card */}
          {res1.ecoAction && (
            <div className="anim" style={{ ...P.card, marginBottom:16, borderLeft:'4px solid #c17f4a', background:'rgba(255,249,241,0.95)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:50, height:50, borderRadius:14, background:'linear-gradient(135deg,#f5e6d0,#e8d0a8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {res1.ecoAction.icon}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, color:P.muted, marginBottom:3 }}>Instead of just tossing it</div>
                  <div style={{ fontSize:17, fontWeight:800, color:P.accent }}>{res1.ecoAction.title}</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:P.muted, margin:'0 0 16px', fontStyle:'italic', lineHeight:1.5, borderLeft:'2px solid rgba(193,127,74,0.3)', paddingLeft:10 }}>
                {res1.ecoAction.tagline}
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {(res1.ecoAction.steps || []).map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:'linear-gradient(135deg,#c17f4a,#a0622e)', color:'#fff', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i + 1}</div>
                    <p style={{ margin:0, fontSize:13, color:P.text, lineHeight:1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit section */}
          {res2 ? (
            <div className="anim" style={{ ...P.card, background: res2.isSafe ? 'linear-gradient(135deg,#2d4a1e,#3a6028)' : 'linear-gradient(135deg,#7a2414,#9a3020)', border:`1px solid ${res2.isSafe ? '#5a8c4e40' : '#c45c3a40'}`, textAlign:'center', '--gc': res2.isSafe ? 'rgba(90,140,78,0.2)' : 'rgba(196,92,58,0.2)', animation:'fadeUp .4s ease-out, glow 2s ease infinite' }}>
              <div style={{ fontSize:56, marginBottom:8 }}>{res2.isSafe ? 'Ô£à' : '­ƒøæ'}</div>
              <h2 style={{ margin:'0 0 12px', fontSize:22, fontWeight:800, color: res2.isSafe ? '#a8d498' : '#f4c0a8' }}>{res2.isSafe ? t.safe : t.stop}</h2>
              <p style={{ fontSize:15, lineHeight:1.6, margin:'0 0 24px', color:'rgba(255,255,255,0.85)' }}>{res2.feedback}</p>
              <button onClick={reset} style={{ ...accentBtn('rgba(255,255,255,0.12)'), borderRadius:14, fontWeight:600 }}>{t.reset}</button>
            </div>
          ) : (
            <div className="anim" style={P.card}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#8b6a45,#6b4f2a)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:800, flexShrink:0 }}>2</div>
                <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:P.text }}>{t.s2}</h2>
              </div>

              <CameraZone
                onCapture={setBinImg}
                fileRef={f2}
                captured={binImg}
                onFileChange={e => readFile(e, setBinImg)}
                t={t}
              />

              <button onClick={audit} disabled={loading || !binImg} style={accentBtn('linear-gradient(135deg,#8b6a45,#6b4f2a)', '0 4px 20px rgba(139,106,69,0.3)')}>
                {loading ? <React.Fragment><span className="spinner"/>&nbsp; {t.loading}</React.Fragment> : t.scanBin}
              </button>
            </div>
          )}

          {!res2 && (
            <button onClick={reset} style={{ width:'100%', maxWidth:420, padding:'14px', marginTop:12, borderRadius:14, background:'transparent', border:'1px solid rgba(160,120,80,0.2)', color:P.muted, fontSize:14, fontWeight:600 }}>
              ÔåÉ {t.reset}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
