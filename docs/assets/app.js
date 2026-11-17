(function(){
"use strict";
const q=id=>document.getElementById(id);
const state={regions:[],atlas:null,selected:null,indices:[90,106,92],query:"",source:"all",side:"all",sort:"id",resolution:1,page:0,pageSize:16,atlasMeta:null};
const labels={juelich:"Jülich",harvard_oxford_cortical:"Harvard–Oxford cortical",harvard_oxford_subcortical:"Harvard–Oxford subcortical"};
const format=n=>new Intl.NumberFormat("en-US").format(n);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const side=r=>/\bLEFT\b/i.test(r.name)||/\sL$/i.test(r.name)?"L":/\bRIGHT\b/i.test(r.name)||/\sR$/i.test(r.name)?"R":"N";
const volume=r=>state.resolution===1?r.voxels1:r.voxels2*8;
const voxels=r=>state.resolution===1?r.voxels1:r.voxels2;
const familyLabel=r=>labels[r.family]||r.source;
function filtered(){const query=state.query.trim().toLowerCase();let result=state.regions.filter(r=>((state.source==="all"||r.family===state.source)&&(state.side==="all"||side(r)===state.side)&&(!query||String(r.id)===query||r.name.toLowerCase().includes(query))));if(state.sort==="volume")result.sort((a,b)=>volume(b)-volume(a));else if(state.sort==="name")result.sort((a,b)=>a.name.localeCompare(b.name));else result.sort((a,b)=>a.id-b.id);return result;}
function renderTable(){
const items=filtered(),pages=Math.max(1,Math.ceil(items.length/state.pageSize));state.page=Math.max(0,Math.min(state.page,pages-1));
const rows=items.slice(state.page*state.pageSize,(state.page+1)*state.pageSize);
q("result-count").textContent=`${items.length} result${items.length===1?"":"s"}`;
q("volume-column").textContent=`Volume · ${state.resolution} mm (mm³)`;
q("regions-body").innerHTML=rows.map(r=>`<tr data-id="${r.id}" tabindex="0" aria-label="Select ROI ${r.id}: ${esc(r.name)}" class="${state.selected===r.id?"selected":""}"><td>${r.id.toString().padStart(3,"0")}</td><td>${esc(r.name)}</td><td>${esc(familyLabel(r))}</td><td class="num-col">${format(volume(r))}</td><td class="num-col">${format(voxels(r))}</td></tr>`).join("")||`<tr><td colspan="5">No matching anatomical labels. Try a different search.</td></tr>`;
q("page-number").textContent=`${state.page+1} / ${pages}`;
q("prev-page").disabled=state.page===0;q("next-page").disabled=state.page===pages-1;
q("table-foot-text").textContent=items.length?`Showing ${state.page*state.pageSize+1}–${Math.min((state.page+1)*state.pageSize,items.length)} of ${items.length} regions`:`No regions match the active filters`;
q("regions-body").querySelectorAll("tr[data-id]").forEach(row=>{const click=()=>choose(Number(row.dataset.id),true);row.addEventListener("click",click);row.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();click();}});});
}
function renderChart(){const top=[...state.regions].sort((a,b)=>volume(b)-volume(a)).slice(0,7);const maximum=top.length?volume(top[0]):1;q("chart-caption").textContent=`BY VOLUME · ${state.resolution} MM`;
q("top-regions").innerHTML=top.map(r=>`<div class="chart-item" title="${esc(r.name)}"><span>#${r.id} ${esc(r.name)}</span><div class="chart-track"><div class="chart-bar" style="width:${Math.max(2,volume(r)/maximum*100).toFixed(2)}%"></div></div><output>${format(volume(r))} mm³</output></div>`).join("");}
function choose(id,bringIntoView=false,recenter=true){if(!Number.isInteger(id)||id<1||id>161)return;state.selected=id;const region=state.regions[id-1];q("selected-region").innerHTML=`<div class="region-ident">CRAIIM ROI ${String(id).padStart(3,"0")} · ${side(region)==="L"?"LEFT":side(region)==="R"?"RIGHT":"UNSPECIFIED"}</div><div class="region-name">${esc(region.name)}</div><div class="region-source">${esc(familyLabel(region))} · source label ${region.sourceId}</div><div class="region-details"><div class="detail-box"><strong>${format(region.voxels1)}</strong><span>VOXELS · 1 MM</span></div><div class="detail-box"><strong>${format(region.voxels2)}</strong><span>VOXELS · 2 MM</span></div><div class="detail-box"><strong>${format(region.voxels1)}</strong><span>VOLUME · 1 MM³ GRID</span></div><div class="detail-box"><strong>${format(region.voxels2*8)}</strong><span>VOLUME · 2 MM³ GRID</span></div></div><p class="region-tip">Measured voxel counts from the original atlas files. These are grid-dependent volumes, not individual participant measurements.</p>`;
if(recenter&&state.atlas&&state.atlas.centroids[id]){state.indices=state.atlas.centroids[id].map((n,a)=>Math.max(0,Math.min(state.atlas.dims[a]-1,Math.round(n))));drawSlices();}
renderTable();if(bringIntoView){q("viewer").scrollIntoView({behavior:"smooth",block:"start"});}
}
function makePalette(){const colors=[[6,27,43]];for(let id=1;id<=161;id++){const hue=((id*.61803398875)%1)*360;colors.push(hslToRgb(hue,.52,.60));}return colors;}
function hslToRgb(h,s,l){h/=360;const hue2rgb=(p,q,t)=>{if(t<0)t++;if(t>1)t--;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p};const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;return[hue2rgb(p,q,h+1/3),hue2rgb(p,q,h),hue2rgb(p,q,h-1/3)].map(x=>Math.round(x*255));}
const palette=makePalette();
function indexValue(i,j,k){const a=state.atlas;return a.data[i+a.dims[0]*(j+a.dims[1]*k)];}
function world(axis){const a=state.atlas;return Math.round(a.affine[axis][axis]*state.indices[axis]+a.affine[axis][3]);}
function viewSettings(name){if(name==="sagittal")return{axes:[1,2],fixed:0};if(name==="coronal")return{axes:[0,2],fixed:1};return{axes:[0,1],fixed:2};}
function drawSlice(name){
const atlas=state.atlas;if(!atlas)return;const canvas=q("slice-"+name),ctx=canvas.getContext("2d"),settings=viewSettings(name),[horizontal,vertical]=settings.axes;const w=atlas.dims[horizontal],h=atlas.dims[vertical];
const off=document.createElement("canvas");off.width=w;off.height=h;const ofctx=off.getContext("2d");const pixels=ofctx.createImageData(w,h);
for(let py=0;py<h;py++)for(let px=0;px<w;px++){
const pos=[...state.indices];pos[horizontal]=px;pos[vertical]=h-1-py;const v=indexValue(...pos),color=state.selected===v&&v>0?[250,200,90]:palette[v]||palette[0],t=(py*w+px)*4;pixels.data[t]=color[0];pixels.data[t+1]=color[1];pixels.data[t+2]=color[2];pixels.data[t+3]=255;
}
ofctx.putImageData(pixels,0,0);ctx.fillStyle="#071d2c";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;
const ratio=Math.min((canvas.width-12)/w,(canvas.height-12)/h),dw=w*ratio,dh=h*ratio,dx=(canvas.width-dw)/2,dy=(canvas.height-dh)/2;
ctx.drawImage(off,dx,dy,dw,dh);
const crossx=dx+(state.indices[horizontal]+.5)*ratio,crossy=dy+(h-state.indices[vertical]-.5)*ratio;
ctx.strokeStyle="rgba(255,255,255,.85)";ctx.lineWidth=1.4;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(crossx,dy);ctx.lineTo(crossx,dy+dh);ctx.moveTo(dx,crossy);ctx.lineTo(dx+dw,crossy);ctx.stroke();ctx.setLineDash([]);
canvas._hit={dx,dy,dw,dh,w,h,horizontal,vertical};
}
function drawSlices(){if(!state.atlas)return;["sagittal","coronal","axial"].forEach(drawSlice);["sag","cor","ax"].forEach((tag,i)=>q(tag+"-value").textContent=world(i)+" mm");["x","y","z"].forEach((axis,i)=>{const slider=q("slider-"+axis),val=world(i);slider.value=val;q("coord-"+axis).textContent=val;});}
function updateCrosshairFromMouse(ev,name){const canvas=q("slice-"+name),rect=canvas.getBoundingClientRect(),hit=canvas._hit;if(!hit)return;const px=(ev.clientX-rect.left)*canvas.width/rect.width,py=(ev.clientY-rect.top)*canvas.height/rect.height;if(px<hit.dx||px>hit.dx+hit.dw||py<hit.dy||py>hit.dy+hit.dh)return;
state.indices[hit.horizontal]=Math.min(hit.w-1,Math.max(0,Math.floor((px-hit.dx)/hit.dw*hit.w)));
state.indices[hit.vertical]=Math.min(hit.h-1,Math.max(0,hit.h-1-Math.floor((py-hit.dy)/hit.dh*hit.h)));
const id=indexValue(...state.indices);if(id>0)choose(id,false,false);else drawSlices();}
async function loadFile(file){if(!file)return;const message=q("upload-message");message.classList.remove("error");message.textContent="Reading and validating local NIfTI data…";try{
const atlas=await window.CraiimNifti.readLocal(file);const dims=atlas.dims.join("×");let resolution=null;
for(const [key,data] of Object.entries(state.atlasMeta)){if(data.dims.join("×")===dims&&atlas.voxelSize.every(n=>Math.abs(n-Number(key))<1e-5))resolution=Number(key);}
if(!resolution)throw Error("This is not one of the CRAIIM 1 mm or 2 mm grid geometries.");
if(atlas.counts.slice(1).some(n=>n===0))throw Error("The original CRAIIM atlas requires all 161 labels to be present.");
const original=state.atlasMeta[resolution];const verified=atlas.sha256===original.sha256;
state.atlas=atlas;state.indices=[0,-20,20].map((mm,axis)=>Math.min(atlas.dims[axis]-1,Math.max(0,Math.round((mm-atlas.affine[axis][3])/atlas.affine[axis][axis]))));
["x","y","z"].forEach((name,i)=>{const slider=q("slider-"+name),first=atlas.affine[i][3],last=atlas.affine[i][3]+(atlas.dims[i]-1)*atlas.affine[i][i];slider.min=Math.min(first,last);slider.max=Math.max(first,last);slider.step=Math.abs(atlas.affine[i][i]);});
q("preview-mode").hidden=true;q("viewer-mode").hidden=false;q("viewer-state").textContent="Interactive NIfTI";q("viewer-status").classList.add("active");q("viewer-resolution").textContent=resolution+" MM ORIGINAL GRID";
q("file-verification").textContent=verified?"SHA-256 original verified":"Unverified file checksum";
message.textContent=verified?`Original ${resolution} mm file verified. Exploring locally, with no data upload.`:`${resolution} mm grid loaded, but compressed-file checksum differs from the archive. Verify the provenance before scientific use.`;
if(state.selected&&atlas.centroids[state.selected])state.indices=atlas.centroids[state.selected].map(v=>Math.round(v));drawSlices();
}catch(error){message.classList.add("error");message.textContent=error.message||"Unable to load this NIfTI file.";}}
function connect(){
q("region-search").addEventListener("input",e=>{state.query=e.target.value;state.page=0;renderTable();});
q("source-filter").addEventListener("change",e=>{state.source=e.target.value;state.page=0;renderTable();});
q("side-filter").addEventListener("change",e=>{state.side=e.target.value;state.page=0;renderTable();});
q("sort-filter").addEventListener("change",e=>{state.sort=e.target.value;state.page=0;renderTable();});
q("resolution-select").addEventListener("change",e=>{state.resolution=Number(e.target.value);state.page=0;renderTable();renderChart();});
q("prev-page").addEventListener("click",()=>{state.page--;renderTable();});q("next-page").addEventListener("click",()=>{state.page++;renderTable();});
q("nifti-upload").addEventListener("change",e=>loadFile(e.target.files[0]));
for(const name of ["sagittal","coronal","axial"]){const canvas=q("slice-"+name);let dragging=false;canvas.addEventListener("pointerdown",ev=>{dragging=true;canvas.setPointerCapture(ev.pointerId);updateCrosshairFromMouse(ev,name);});canvas.addEventListener("pointermove",ev=>{if(dragging)updateCrosshairFromMouse(ev,name);});canvas.addEventListener("pointerup",()=>dragging=false);canvas.addEventListener("pointercancel",()=>dragging=false);}
["x","y","z"].forEach((name,i)=>q("slider-"+name).addEventListener("input",ev=>{if(!state.atlas)return;const atlas=state.atlas;state.indices[i]=Math.min(atlas.dims[i]-1,Math.max(0,Math.round((Number(ev.target.value)-atlas.affine[i][3])/atlas.affine[i][i])));const label=indexValue(...state.indices);if(label>0)choose(label,false,false);else drawSlices();}));
q("copy-bib").addEventListener("click",async()=>{const output=q("copy-status");try{const text=await (await fetch("data/references.bib")).text();await navigator.clipboard.writeText(text);output.textContent="BibTeX entries copied to clipboard.";}catch(e){output.textContent="Clipboard access unavailable. Open the references.bib file on GitHub to copy the entries.";}});
}
async function boot(){connect();try{const r=await fetch("data/regions.json");if(!r.ok)throw Error("HTTP "+r.status);const payload=await r.json();if(payload.regions.length!==161||payload.regions.some((x,i)=>x.id!==i+1))throw Error("Region index validation failed.");state.regions=payload.regions;state.atlasMeta=payload.atlas;renderTable();renderChart();}catch(err){q("regions-body").innerHTML=`<tr><td colspan="5">Region metadata could not be loaded (${esc(err.message)}).</td></tr>`;q("result-count").textContent="Unavailable";}}
boot();
})();
