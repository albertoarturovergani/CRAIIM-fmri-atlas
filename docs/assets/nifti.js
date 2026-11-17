(function(scope){
"use strict";
function parse(arrayBuffer){
if(!(arrayBuffer instanceof ArrayBuffer)||arrayBuffer.byteLength<352)throw Error("The selected file is too small to be a NIfTI-1 image.");
const view=new DataView(arrayBuffer);
let le=true;
if(view.getInt32(0,true)!==348){if(view.getInt32(0,false)===348)le=false;else throw Error("Expected a NIfTI-1 single-file .nii image (348-byte header).");}
const getInt=(o)=>view.getInt16(o,le),getFloat=(o)=>view.getFloat32(o,le);
const ndim=getInt(40);
if(ndim!==3)throw Error("CRAIIM requires a 3D NIfTI image.");
const dims=[getInt(42),getInt(44),getInt(46)];
if(dims.some(x=>x<=0))throw Error("Invalid NIfTI image dimensions.");
const n=dims[0]*dims[1]*dims[2],datatype=getInt(70);
if(![2,4,8,16,64,512].includes(datatype))throw Error("Unsupported NIfTI datatype: "+datatype);
const bitpix=getInt(72),bytes=bitpix/8,offset=Math.round(getFloat(108));
if(![1,2,4,8].includes(bytes)||offset<352||offset+n*bytes>arrayBuffer.byteLength)throw Error("Inconsistent NIfTI payload size or voxel offset.");
const slope=getFloat(112),inter=getFloat(116);
if((slope!==0&&slope!==1)||inter!==0)throw Error("Scaled NIfTI data is not supported for integer CRAIIM labels.");
const sform=getInt(254);
if(sform===0)throw Error("An sform spatial transform is required; original CRAIIM files have MNI152 sform code 4.");
const affine=[0,1,2].map(i=>[0,1,2,3].map(j=>getFloat(280+16*i+4*j)));
affine.push([0,0,0,1]);
for(let i=0;i<3;i++)for(let j=0;j<3;j++)if((i!==j&&Math.abs(affine[i][j])>1e-5)||(i===j&&Math.abs(affine[i][j])<1e-5))throw Error("Only axis-aligned CRAIIM NIfTI grids are supported in this lightweight viewer.");
const data=new Uint16Array(n);
let readValue;
if(datatype===2)readValue=o=>view.getUint8(o);
if(datatype===4)readValue=o=>view.getInt16(o,le);
if(datatype===8)readValue=o=>view.getInt32(o,le);
if(datatype===16)readValue=o=>view.getFloat32(o,le);
if(datatype===64)readValue=o=>view.getFloat64(o,le);
if(datatype===512)readValue=o=>view.getUint16(o,le);
const counts=new Uint32Array(162),sums=Array.from({length:162},()=>[0,0,0]);
let idx=offset;
for(let k=0;k<dims[2];k++)for(let j=0;j<dims[1];j++)for(let i=0;i<dims[0];i++){
const label=readValue(idx);idx+=bytes;
if(!Number.isInteger(label)||label<0||label>161)throw Error("This file contains labels outside CRAIIM's 0–161 range.");
const x=i+dims[0]*(j+dims[1]*k);
data[x]=label;counts[label]++;
if(label>0){sums[label][0]+=i;sums[label][1]+=j;sums[label][2]+=k;}
}
const centroids=sums.map((s,id)=>counts[id]?[s[0]/counts[id],s[1]/counts[id],s[2]/counts[id]]:null);
return{dims,data,affine,counts,centroids,datatype,voxelSize:dims.map((_,a)=>Math.abs(affine[a][a])),voxelOffset:offset};
}
async function readLocal(file){
let arrayBuffer=await file.arrayBuffer();
const compressed=new Uint8Array(arrayBuffer,0,Math.min(2,arrayBuffer.byteLength));
const gzip=compressed.length===2&&compressed[0]===0x1f&&compressed[1]===0x8b;
let hash=null;
if(scope.crypto&&scope.crypto.subtle){const digest=await scope.crypto.subtle.digest("SHA-256",arrayBuffer);hash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,"0")).join("");}
if(gzip){
if(typeof DecompressionStream==="undefined")throw Error("This browser cannot decompress .nii.gz files. Use a modern browser or provide an uncompressed .nii file.");
arrayBuffer=await new Response(new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
}
return{...parse(arrayBuffer),sha256:hash,gzip};
}
const api={parse,readLocal};
scope.CraiimNifti=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
