import React, { useEffect, useState, useRef } from 'react'
if(!res.ok) throw new Error('fetch hl failed')
const json = await res.json()
if(cancelled) return
// Expecting { funding: number } where funding is decimal per hour (e.g. -0.000352)
setHlFunding(json.funding == null ? null : Number(json.funding))
}catch(e){
console.warn('HL fetch', e)
setHlFunding(null)
}
}
fetchHl()
const id = setInterval(fetchHl, 5000)
return ()=>{
cancelled = true
clearInterval(id)
}
}, [pair])


// Determine which is better to LONG / SHORT
const decision = (()=>{
if(asterFunding == null || hlFunding == null) return '—'
// lower (more negative) funding = you receive funding when you're LONG (depends on platform sign conventions)
// We assume: funding negative means longs receive payment. So the *more negative* funding is better to LONG.
if(asterFunding < hlFunding) return `LONG on Asterdex (aster ${ (asterFunding*100).toFixed(4)}%), SHORT on Hyperliquid (${(hlFunding*100).toFixed(4)}%)`
if(hlFunding < asterFunding) return `LONG on Hyperliquid (hl ${(hlFunding*100).toFixed(4)}%), SHORT on Asterdex (${(asterFunding*100).toFixed(4)}%)`
return 'fundings equal'
})()


return (
<div style={{fontFamily:'Inter, system-ui, sans-serif',padding:24,maxWidth:900,margin:'0 auto'}}>
<h1>Funding Arbitrage comparer — Asterdex ↔ Hyperliquid</h1>
<p>Choisis la paire, attends que les fundings se mettent à jour en direct (Aster via WebSocket, Hyperliquid via proxy).</p>


<div style={{margin:'16px 0'}}>
<label>Pair: </label>
<select value={pair.aster} onChange={e=>{
const p = PAIRS.find(x=>x.aster===e.target.value)
if(p) setPair(p)
}}>
{PAIRS.map(p=> <option key={p.aster} value={p.aster}>{p.label}</option>)}
</select>
</div>


<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
<div style={{padding:12,borderRadius:8,boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
<h3>Asterdex</h3>
<div>Pair: <strong>{pair.aster}</strong></div>
<div>Funding (raw): <strong>{asterFunding == null ? '—' : (asterFunding*100).toFixed(6) + '%'}</strong></div>
<div>Next funding (ms): <strong>{asterNextTime ?? '—'}</strong></div>
</div>


<div style={{padding:12,borderRadius:8,boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
<h3>Hyperliquid</h3>
<div>Coin: <strong>{pair.hyper}</strong></div>
<div>Funding (raw): <strong>{hlFunding == null ? '—' : (hlFunding*100).toFixed(6) + '%'}</strong></div>
<div>Source: <small>/api/hyperliquid</small></div>
</div>
</div>


<div style={{marginTop:20,padding:12,background:'#f7f7fb',borderRadius:8}}>
<strong>Décision (pour arbitrage funding) :</strong>
<div style={{marginTop:8}}>{decision}</div>
</div>


<footer style={{marginTop:24,fontSize:13,color:'#666'}}>
<div>Notes:</div>
<ul>
<li>Le calcul suppose que le signe négatif signifie que <em>les longs reçoivent</em> (convention commune). Vérifie les conventions sur chaque plateforme avant d’exécuter.</li>
<li>Pense aux frais, slippage, liquidations et limites de connexion.</li>
</ul>
</footer>
</div>
)
}
