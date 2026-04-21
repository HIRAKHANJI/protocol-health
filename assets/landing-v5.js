/* Protocol Health · Landing v5 scripts
   · Install modal
   · Pure-SVG wireframe globe, powered by real Natural Earth land polygons
     - dense wire mesh continent fill + crisp outlines
     - dynamic flight routes that change over time, always city → city on land
     - realistic airplane silhouette that follows arc heading
     - hub cities: multiple planes meeting at shared endpoints
     - emoji "messages from friends" that pop only from continent surfaces
*/

/* ─── INSTALL MODAL ─── */
function openInstall(){
  const m = document.getElementById('installModal');
  if(m){ m.classList.add('open'); document.body.style.overflow='hidden'; }
}
function closeInstall(){
  const m = document.getElementById('installModal');
  if(m){ m.classList.remove('open'); document.body.style.overflow=''; }
}
function switchTab(name){
  document.querySelectorAll('.install-tab').forEach(t=>{
    t.classList.toggle('active', t.dataset.tab===name);
  });
  document.querySelectorAll('.install-panel').forEach(p=>{
    p.classList.toggle('active', p.dataset.panel===name);
  });
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeInstall(); });
window.openInstall = openInstall;
window.closeInstall = closeInstall;
window.switchTab = switchTab;


/* ──────────────────────────────────────────────────────────────
   WIREFRAME GLOBE
   ────────────────────────────────────────────────────────────── */
(function(){
  const mount = document.getElementById('globe-stage');
  if(!mount) return;

  const SVG_NS  = 'http://www.w3.org/2000/svg';
  const R       = 100;
  const VIEW    = 150;
  const GREEN   = '#3ddc84';

  // ───── Build SVG scaffolding ─────
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `-${VIEW} -${VIEW} ${VIEW*2} ${VIEW*2}`);
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:2;overflow:visible;';
  mount.appendChild(svg);

  const defs = document.createElementNS(SVG_NS,'defs');
  defs.innerHTML = `
    <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0.9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="gBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <radialGradient id="gSphere" cx="35%" cy="30%" r="80%">
      <stop offset="0%"  stop-color="#0f241b" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#040a07" stop-opacity="1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="gSpec" cx="30%" cy="22%" r="42%">
      <stop offset="0%"  stop-color="rgba(255,255,255,0.32)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0.02)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <!-- diagonal hatch used to fill continents as mesh -->
    <pattern id="meshHatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="${GREEN}" stroke-width="0.35" opacity="0.9"/>
    </pattern>
    <!-- clip: everything in gFill must stay inside the visible disc -->
    <clipPath id="sphereClip"><circle cx="0" cy="0" r="${R}"/></clipPath>
  `;
  svg.appendChild(defs);

  const gBack    = document.createElementNS(SVG_NS,'g'); svg.appendChild(gBack);
  const gSphere  = document.createElementNS(SVG_NS,'g'); svg.appendChild(gSphere);
  const gFront   = document.createElementNS(SVG_NS,'g'); svg.appendChild(gFront);
  const gFill    = document.createElementNS(SVG_NS,'g'); svg.appendChild(gFill);    // continent mesh-fill (clipped)
  gFill.setAttribute('clip-path','url(#sphereClip)');
  const gArcs    = document.createElementNS(SVG_NS,'g'); svg.appendChild(gArcs);
  const gShipArcs= document.createElementNS(SVG_NS,'g'); svg.appendChild(gShipArcs);
  const gHubs    = document.createElementNS(SVG_NS,'g'); svg.appendChild(gHubs);
  const gShips   = document.createElementNS(SVG_NS,'g'); svg.appendChild(gShips);
  const gPlanes  = document.createElementNS(SVG_NS,'g'); svg.appendChild(gPlanes);
  const gGloss   = document.createElementNS(SVG_NS,'g'); svg.appendChild(gGloss);

  // Sphere body
  const atmo = document.createElementNS(SVG_NS,'circle');
  atmo.setAttribute('cx',0); atmo.setAttribute('cy',0); atmo.setAttribute('r',R+8);
  atmo.setAttribute('fill','none');
  atmo.setAttribute('stroke','rgba(61,220,132,0.25)');
  atmo.setAttribute('stroke-width','6');
  atmo.setAttribute('filter','url(#gBlur)');
  gSphere.appendChild(atmo);

  const sphereFill = document.createElementNS(SVG_NS,'circle');
  sphereFill.setAttribute('cx',0); sphereFill.setAttribute('cy',0); sphereFill.setAttribute('r',R);
  sphereFill.setAttribute('fill','url(#gSphere)');
  gSphere.appendChild(sphereFill);

  const rim = document.createElementNS(SVG_NS,'circle');
  rim.setAttribute('cx',0); rim.setAttribute('cy',0); rim.setAttribute('r',R);
  rim.setAttribute('fill','none');
  rim.setAttribute('stroke',GREEN);
  rim.setAttribute('stroke-width','1.1');
  rim.setAttribute('opacity','0.9');
  rim.setAttribute('filter','url(#gGlow)');
  gFront.appendChild(rim);

  const gloss = document.createElementNS(SVG_NS,'circle');
  gloss.setAttribute('cx',0); gloss.setAttribute('cy',0); gloss.setAttribute('r',R);
  gloss.setAttribute('fill','url(#gSpec)');
  gloss.setAttribute('pointer-events','none');
  gGloss.appendChild(gloss);

  /* ─── Math ─── */
  const DEG = Math.PI/180;
  function project(lat, lon, rY, rX){
    const phi = lat*DEG, lam = lon*DEG + rY;
    let x = Math.cos(phi)*Math.sin(lam);
    let y = Math.sin(phi);
    let z = Math.cos(phi)*Math.cos(lam);
    const cx = Math.cos(rX), sx = Math.sin(rX);
    const y2 = y*cx - z*sx;
    const z2 = y*sx + z*cx;
    return { x: x*R, y: -y2*R, z: z2 };
  }

  /* ─── Graticule ─── */
  const LATS=[]; for(let lat=-75; lat<=75; lat+=15){
    const pts=[]; for(let lon=-180; lon<=180; lon+=4) pts.push([lat,lon]); LATS.push({pts,lat});
  }
  const LONS=[]; for(let lon=-180; lon<180; lon+=15){
    const pts=[]; for(let lat=-90; lat<=90; lat+=4) pts.push([lat,lon]); LONS.push({pts,lon});
  }
  function mkLine(front){
    const p = document.createElementNS(SVG_NS,'path');
    p.setAttribute('fill','none');
    p.setAttribute('stroke',GREEN);
    p.setAttribute('stroke-width', front?0.45:0.3);
    p.setAttribute('stroke-linecap','round');
    p.setAttribute('opacity', front?0.28:0.08);
    (front?gFront:gBack).appendChild(p);
    return p;
  }
  LATS.forEach(L=>{ L.pf=mkLine(true); L.pb=mkLine(false); if(L.lat===0){ L.pf.setAttribute('opacity','0.55'); L.pf.setAttribute('stroke-width','0.7'); } });
  LONS.forEach(L=>{ L.pf=mkLine(true); L.pb=mkLine(false); if(L.lon===0){ L.pf.setAttribute('opacity','0.55'); L.pf.setAttribute('stroke-width','0.7'); } });

  function splitPath(samples){
    let f='', b=''; let prevFront=null;
    for(const p of samples){
      const front = p.z>=0;
      const cmd = (prevFront===front)?'L':'M';
      const seg = `${cmd}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      if(front) f+=seg; else b+=seg;
      prevFront = front;
    }
    return { f:f.trim(), b:b.trim() };
  }

  /* ─── Continent polygons from Natural Earth 110m ───
     We fetched assets/land-110m.json (TopoJSON, 55KB, public domain).
     Decode arcs here and store each polygon as array of [lat,lon] points.
  */
  const continents = []; // each: { rings: [ [ [lat,lon], … ], … ], sampleLand: [[lat,lon], …] }

  fetch('assets/land-110m.json').then(r=>r.json()).then(topo=>{
    const [sx, sy] = topo.transform.scale;
    const [tx, ty] = topo.transform.translate;
    // Decode arcs (delta-encoded)
    const rawArcs = topo.arcs.map(arc=>{
      let x=0,y=0; const pts=[];
      for(const [dx,dy] of arc){
        x+=dx; y+=dy;
        pts.push([ y*sy+ty, x*sx+tx ]); // [lat, lon]
      }
      return pts;
    });
    // Densify — add extra points along long edges so wireframe doesn't skip
    function dense(arc){
      const out=[arc[0]];
      for(let i=1;i<arc.length;i++){
        const [la0,lo0]=arc[i-1], [la1,lo1]=arc[i];
        let dlo = lo1-lo0;
        if(dlo>180) dlo-=360; if(dlo<-180) dlo+=360;
        const dist = Math.hypot(la1-la0, dlo);
        const steps = Math.max(1, Math.min(8, Math.ceil(dist/2.5)));
        for(let s=1;s<=steps;s++){
          const t=s/steps;
          out.push([la0+(la1-la0)*t, lo0+dlo*t]);
        }
      }
      return out;
    }
    const arcs = rawArcs.map(dense);
    function resolve(arcIdx){
      return arcIdx<0 ? arcs[~arcIdx].slice().reverse() : arcs[arcIdx].slice();
    }
    const land = topo.objects.land;
    // Each polygon is a list of rings; first = outer, rest = holes (we ignore holes for mesh)
    function emitPoly(polygon){
      const rings = polygon.map(ring=>{
        let pts=[];
        ring.forEach((arcIdx,i)=>{
          const seg = resolve(arcIdx);
          if(i===0) pts = pts.concat(seg);
          else pts = pts.concat(seg.slice(1));
        });
        return pts;
      });
      // Gather interior sample points (every Nth vertex, restricted to outer ring)
      const landPts = [];
      const outer = rings[0];
      for(let i=0;i<outer.length;i+=3) landPts.push(outer[i]);
      // Coastal port candidates — every ~8th vertex of outer ring (north of -55° to skip Antarctica)
      const ports = [];
      for(let i=0;i<outer.length;i+=8){
        if(outer[i][0] > -55) ports.push(outer[i]);
      }
      continents.push({ rings, landPts, ports, id: continents.length });
    }
    if(land.type==='Polygon') emitPoly(land.arcs);
    else if(land.type==='MultiPolygon') land.arcs.forEach(emitPoly);
    else if(land.type==='GeometryCollection'){
      land.geometries.forEach(g=>{
        if(g.type==='Polygon') emitPoly(g.arcs);
        else if(g.type==='MultiPolygon') g.arcs.forEach(emitPoly);
      });
    }

    // Flatten all polygon samples into global land list (for message anchoring)
    LAND_SURFACE_PTS.length = 0;
    continents.forEach(c=>{
      c.landPts.forEach(p=>{
        if(p[0] > -58) LAND_SURFACE_PTS.push(p); // drop most of Antarctica
      });
    });

    buildContinentPaths();
    refreshRoutes();
    refreshShipRoutes();
  });

  // land sample points for emoji poppers (populated after fetch)
  const LAND_SURFACE_PTS = [];

  // DOM elements per continent ring
  const contEls = [];
  function buildContinentPaths(){
    continents.forEach(c=>{
      c.rings.forEach(ring=>{
        const pF = document.createElementNS(SVG_NS,'path');
        pF.setAttribute('fill','none');
        pF.setAttribute('stroke',GREEN);
        pF.setAttribute('stroke-width','1.0');
        pF.setAttribute('stroke-linecap','round');
        pF.setAttribute('stroke-linejoin','round');
        pF.setAttribute('opacity','0.95');
        pF.setAttribute('filter','url(#gGlow)');
        gFront.appendChild(pF);

        const pFill = document.createElementNS(SVG_NS,'path');
        pFill.setAttribute('fill','url(#meshHatch)');
        pFill.setAttribute('stroke','none');
        pFill.setAttribute('opacity','0.45');
        pFill.setAttribute('fill-rule','evenodd');
        gFill.appendChild(pFill);

        const pB = document.createElementNS(SVG_NS,'path');
        pB.setAttribute('fill','none');
        pB.setAttribute('stroke',GREEN);
        pB.setAttribute('stroke-width','0.55');
        pB.setAttribute('stroke-linecap','round');
        pB.setAttribute('stroke-linejoin','round');
        pB.setAttribute('opacity','0.11');
        gBack.appendChild(pB);

        contEls.push({ pts: ring, pF, pB, pFill });
      });
    });
  }

  /* ─── Hubs & routes ─── */
  // Hub cities — all are land coordinates (major airports)
  const CITIES = {
    NYC:[40.71,-74.00],LON:[51.51,-0.13],PAR:[48.86,2.35],BER:[52.52,13.40],
    IST:[41.01,28.98],DUB:[25.20,55.27],DEL:[28.61,77.21],BOM:[19.08,72.88],
    BKK:[13.75,100.50],SIN:[1.35,103.82],HKG:[22.30,114.17],TYO:[35.68,139.69],
    SYD:[-33.87,151.21],SFO:[37.77,-122.42],LA:[34.05,-118.24],MIA:[25.76,-80.19],
    MEX:[19.43,-99.13],BUE:[-34.60,-58.38],RIO:[-22.90,-43.20],JNB:[-26.20,28.04],
    CAI:[30.04,31.24],LAG:[6.52,3.38],NRB:[-1.29,36.82],MOS:[55.75,37.62],
    YYZ:[43.65,-79.38],BCN:[41.39,2.17],LIM:[-12.05,-77.04],
    SEA:[47.61,-122.33],MAD:[40.42,-3.70],FCO:[41.90,12.50],JFK:[40.64,-73.78],
  };
  const CITY_KEYS = Object.keys(CITIES);

  // Hub list — these cities are more likely to be endpoints (multiple planes visit)
  const HUBS = ['LON','DUB','HKG','SIN','NYC','LA','TYO','IST'];

  // Active routes — redrawn every few seconds
  const MAX_ROUTES = 10;
  const routes = [];
  for(let i=0;i<MAX_ROUTES;i++){
    const path = document.createElementNS(SVG_NS,'path');
    path.setAttribute('fill','none');
    path.setAttribute('stroke','rgba(200,245,66,0.8)');
    path.setAttribute('stroke-width','0.85');
    path.setAttribute('stroke-dasharray','2 3');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('filter','url(#gGlow)');
    gArcs.appendChild(path);

    const plane = document.createElementNS(SVG_NS,'g');
    // Realistic plane silhouette (top-down view, nose UP = -Y). Scale ~0.45.
    plane.innerHTML = `
      <g transform="scale(0.42)" filter="url(#gGlow)">
        <!-- fuselage -->
        <path d="M0 -10 C 1.6 -8, 1.6 4, 1.2 8 L 0.6 10.5 L -0.6 10.5 L -1.2 8 C -1.6 4, -1.6 -8, 0 -10 Z" fill="#ffffff"/>
        <!-- main wings -->
        <path d="M -9 1 L -2 -2 L -2 3 L -9 4.5 Z
                 M  9 1 L  2 -2 L  2 3 L  9 4.5 Z" fill="#e8fff3"/>
        <!-- tail -->
        <path d="M -3 8 L 0 6.5 L 3 8 L 2 10.5 L -2 10.5 Z" fill="#e8fff3"/>
        <!-- nose tip / window -->
        <circle cx="0" cy="-7" r="0.7" fill="rgba(61,220,132,0.8)"/>
      </g>
    `;
    gPlanes.appendChild(plane);

    routes.push({ a:null, b:null, samples:[], path, plane, phase:0, speed:0.004+Math.random()*0.003, dir:1, idleUntil:0 });
  }

  // Hub endpoint dots (populated each frame)
  function mkHubDot(){
    const c = document.createElementNS(SVG_NS,'circle');
    c.setAttribute('r','1.8'); c.setAttribute('fill','#c8f542');
    c.setAttribute('filter','url(#gGlow)');
    c.setAttribute('opacity','0');
    gHubs.appendChild(c);
    // ping ring
    const ring = document.createElementNS(SVG_NS,'circle');
    ring.setAttribute('r','1.8'); ring.setAttribute('fill','none');
    ring.setAttribute('stroke','rgba(200,245,66,0.6)'); ring.setAttribute('stroke-width','0.6');
    ring.setAttribute('opacity','0');
    gHubs.appendChild(ring);
    return { c, ring };
  }
  const hubDots = Object.fromEntries(CITY_KEYS.map(k=>[k, mkHubDot()]));

  /* ─── Ships ─── */
  // Point-in-polygon (ray cast) for a ring of [lat,lon] points.
  function pointInRing(lat, lon, ring){
    let inside=false;
    for(let i=0,j=ring.length-1; i<ring.length; j=i++){
      const [yi,xi]=ring[i], [yj,xj]=ring[j];
      const intersect = ((yi>lat)!==(yj>lat)) &&
        (lon < (xj-xi)*(lat-yi)/(yj-yi+1e-12) + xi);
      if(intersect) inside=!inside;
    }
    return inside;
  }
  function isOnLand(lat, lon){
    for(const c of continents){
      if(pointInRing(lat, lon, c.rings[0])) return true;
    }
    return false;
  }
  // Pick two ports on different continents whose great-circle stays over water.
  function pickShipPair(){
    if(continents.length<2) return null;
    for(let tries=0; tries<30; tries++){
      const i = Math.floor(Math.random()*continents.length);
      let j = Math.floor(Math.random()*continents.length);
      if(j===i) j=(j+1)%continents.length;
      const ci = continents[i], cj = continents[j];
      if(!ci.ports.length || !cj.ports.length) continue;
      const pA = ci.ports[Math.floor(Math.random()*ci.ports.length)];
      const pB = cj.ports[Math.floor(Math.random()*cj.ports.length)];
      // Validate: sample 10 points along great-circle, skip endpoints (they sit on coast)
      const va=latLonToVec(...pA), vb=latLonToVec(...pB);
      let waterOk=true;
      for(let k=2; k<=8; k++){
        const [la,lo] = vecToLatLon(slerp(va,vb,k/10));
        if(isOnLand(la,lo)){ waterOk=false; break; }
      }
      if(waterOk) return { pA, pB };
    }
    return null;
  }
  function buildShipRoute(pA, pB){
    const va=latLonToVec(...pA), vb=latLonToVec(...pB);
    const N=48; const samples=[];
    for(let i=0;i<=N;i++) samples.push(vecToLatLon(slerp(va,vb,i/N)));
    return samples;
  }
  const MAX_SHIPS = 6;
  const ships = [];
  for(let i=0;i<MAX_SHIPS;i++){
    const path = document.createElementNS(SVG_NS,'path');
    path.setAttribute('fill','none');
    path.setAttribute('stroke','rgba(120,200,255,0.45)');
    path.setAttribute('stroke-width','0.6');
    path.setAttribute('stroke-dasharray','1.2 2.4');
    path.setAttribute('stroke-linecap','round');
    gShipArcs.appendChild(path);

    const ship = document.createElementNS(SVG_NS,'g');
    // Ship silhouette: top-down cargo vessel. Bow points UP (-Y). Scale ~0.5.
    ship.innerHTML = `
      <g transform="scale(0.55)" filter="url(#gGlow)">
        <!-- wake trail -->
        <path d="M -1.8 6 Q 0 12, 1.8 6 L 1 6 Q 0 10, -1 6 Z" fill="rgba(200,240,255,0.35)"/>
        <!-- hull -->
        <path d="M -2.2 -5 Q 0 -8, 2.2 -5 L 2 5 L -2 5 Z" fill="#d6ecff" stroke="#8ab4d8" stroke-width="0.25"/>
        <!-- deckhouse -->
        <rect x="-1.2" y="-1" width="2.4" height="3" fill="#9fbfdc"/>
        <!-- mast / bridge light -->
        <circle cx="0" cy="-3.5" r="0.5" fill="rgba(255,210,100,0.9)"/>
      </g>
    `;
    gShips.appendChild(ship);

    ships.push({
      pA:null, pB:null, samples:[], path, ship,
      phase:0, speed:0.0012+Math.random()*0.0008, dir:1,
      dockUntil:0,
    });
  }
  function refreshShipRoutes(){
    ships.forEach(s=>{
      const pair = pickShipPair();
      if(!pair){ s.samples=[]; return; }
      s.pA=pair.pA; s.pB=pair.pB;
      s.samples = buildShipRoute(pair.pA, pair.pB);
      s.phase = Math.random();
      s.dir = Math.random()<0.5?1:-1;
      s.dockUntil = 0;
    });
  }
  // Swap a random ship every 6s to vary traffic
  setInterval(()=>{
    if(!continents.length) return;
    const idx = Math.floor(Math.random()*ships.length);
    const s = ships[idx];
    const pair = pickShipPair();
    if(!pair) return;
    s.pA=pair.pA; s.pB=pair.pB;
    s.samples = buildShipRoute(pair.pA, pair.pB);
    s.phase=0; s.dir=1; s.dockUntil=0;
  }, 6000);

  // Great-circle
  function latLonToVec(lat,lon){ const p=lat*DEG, l=lon*DEG; return [Math.cos(p)*Math.sin(l), Math.sin(p), Math.cos(p)*Math.cos(l)]; }
  function vecToLatLon(v){ return [Math.asin(v[1])/DEG, Math.atan2(v[0],v[2])/DEG]; }
  function slerp(a,b,t){
    let d = Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2]));
    const w = Math.acos(d); if(w<1e-6) return a.slice();
    const s = Math.sin(w);
    const ka = Math.sin((1-t)*w)/s, kb = Math.sin(t*w)/s;
    return [a[0]*ka+b[0]*kb, a[1]*ka+b[1]*kb, a[2]*ka+b[2]*kb];
  }
  function buildRoute(aKey,bKey){
    const a=CITIES[aKey], b=CITIES[bKey];
    const va=latLonToVec(...a), vb=latLonToVec(...b);
    const N=56; const samples=[];
    for(let i=0;i<=N;i++){ samples.push(vecToLatLon(slerp(va,vb,i/N))); }
    return samples;
  }
  function pickPair(){
    // 60% chance starts at a hub
    const aIsHub = Math.random()<0.6;
    const aKey = aIsHub ? HUBS[Math.floor(Math.random()*HUBS.length)] : CITY_KEYS[Math.floor(Math.random()*CITY_KEYS.length)];
    let bKey;
    do { bKey = Math.random()<0.6 ? HUBS[Math.floor(Math.random()*HUBS.length)] : CITY_KEYS[Math.floor(Math.random()*CITY_KEYS.length)]; }
    while(bKey===aKey);
    return [aKey,bKey];
  }
  function refreshRoutes(){
    // Initial assignment — stagger phases
    routes.forEach((r,i)=>{
      const [a,b] = pickPair();
      r.a=a; r.b=b; r.samples = buildRoute(a,b);
      r.phase = Math.random();
      r.dir = Math.random()<0.5?1:-1;
      r.idleUntil = 0;
    });
  }
  // Swap out one random route every 3s so flights "change over time"
  setInterval(()=>{
    if(!continents.length) return;
    const idx = Math.floor(Math.random()*routes.length);
    const r = routes[idx];
    const [a,b] = pickPair();
    r.a=a; r.b=b; r.samples = buildRoute(a,b);
    r.phase = 0;
    r.dir = 1;
  }, 2600);

  /* ─── Emoji messages ─── */
  const EMOJIS = [
    '🥗','🥚','🍗','🥦','🍎','🥑','🍠','🥛','🐟','🍳',
    '💪','🏃','🧘','🤸','🥋','🥊','🏋️','⚡','🔥','💧',
    '✈️','🗺️','🧭','🏔️','🏕️',
    '🙌','👊','🫡','😤','❤️','📈'
  ];
  const popHost = document.getElementById('poppers');
  function mkPop(){
    const d = document.createElement('span');
    d.className = 'pop anchored';
    d.style.cssText = 'position:absolute;opacity:0;transform:translate(-50%,-50%) scale(0.6);pointer-events:none;will-change:transform,opacity,left,top;';
    popHost.appendChild(d);
    return d;
  }
  const POP_COUNT = 8;
  const pops = Array.from({length:POP_COUNT}, ()=>({
    node: mkPop(), lat:0, lon:0, emoji:'', born:-Infinity, life:0,
  }));
  function respawn(p, now){
    if(!LAND_SURFACE_PTS.length) return;
    const [lat,lon] = LAND_SURFACE_PTS[Math.floor(Math.random()*LAND_SURFACE_PTS.length)];
    p.lat=lat; p.lon=lon;
    p.emoji = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    p.node.textContent = p.emoji;
    p.born = now;
    p.life = 3600 + Math.random()*2400;
  }

  /* ─── Render loop ─── */
  let t0 = performance.now();
  let lastSpawn = 0;

  // ─── User drag / inertia / auto-spin state ───
  let userRotY = 0;
  let userRotX = 0.30;
  let velY = 0, velX = 0;         // for inertia after release
  let isDragging = false;
  let lastIdleTime = 0;            // ms timestamp when user last interacted
  let lastT = 0;                   // previous frame time for dt

  (function bindDrag(){
    const surface = mount;         // whole stage is draggable
    surface.style.touchAction = 'none';
    surface.style.cursor = 'grab';
    surface.style.userSelect = 'none';
    let px = 0, py = 0, pid = null;

    const onDown = (e) => {
      if(e.button && e.button !== 0) return;
      isDragging = true;
      pid = e.pointerId;
      px = e.clientX; py = e.clientY;
      velY = velX = 0;
      surface.setPointerCapture?.(pid);
      surface.style.cursor = 'grabbing';
      e.preventDefault();
    };
    const onMove = (e) => {
      if(!isDragging) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      // Calibrate: drag one globe-width horizontally ≈ full rotation
      const bb = surface.getBoundingClientRect();
      const kx = (Math.PI * 2) / Math.max(bb.width, 1);
      const ky = (Math.PI)     / Math.max(bb.height, 1);
      userRotY += dx * kx;
      userRotX = Math.max(-Math.PI/2+0.05, Math.min(Math.PI/2-0.05, userRotX + dy * ky));
      velY = dx * kx;
      velX = dy * ky;
      lastIdleTime = performance.now();
    };
    const onUp = (e) => {
      if(!isDragging) return;
      isDragging = false;
      surface.releasePointerCapture?.(pid);
      surface.style.cursor = 'grab';
      lastIdleTime = performance.now();
    };
    surface.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  })();

  function render(now){
    const t = (now - t0)/1000;
    const dt = lastT ? Math.min(0.05, (now - lastT)/1000) : 0.016;
    lastT = now;

    // Inertia decay
    if(!isDragging){
      userRotY += velY * dt * 60;   // velY was per-frame delta; scale by 60fps baseline
      userRotX = Math.max(-Math.PI/2+0.05, Math.min(Math.PI/2-0.05, userRotX + velX * dt * 60));
      velY *= Math.pow(0.94, dt*60);
      velX *= Math.pow(0.94, dt*60);
      if(Math.abs(velY)<0.0002) velY = 0;
      if(Math.abs(velX)<0.0002) velX = 0;
    }

    // Auto-spin if user hasn't interacted recently
    const sinceIdle = (now - lastIdleTime) / 1000;
    const autoActive = !isDragging && Math.abs(velY) < 0.001 && Math.abs(velX) < 0.001 && (lastIdleTime === 0 || sinceIdle > 2);
    if(autoActive) userRotY += 0.12 * dt;

    const rotY = userRotY;
    const rotX = userRotX;

    // Graticule
    LATS.forEach(L=>{ const proj=L.pts.map(p=>project(p[0],p[1],rotY,rotX)); const sp=splitPath(proj); L.pf.setAttribute('d',sp.f||'M0 0'); L.pb.setAttribute('d',sp.b||'M0 0'); });
    LONS.forEach(L=>{ const proj=L.pts.map(p=>project(p[0],p[1],rotY,rotX)); const sp=splitPath(proj); L.pf.setAttribute('d',sp.f||'M0 0'); L.pb.setAttribute('d',sp.b||'M0 0'); });

    // Continents
    contEls.forEach((c, _ci)=>{
      try {
      const proj = c.pts.map(p=>project(p[0],p[1],rotY,rotX));
      const sp = splitPath(proj);
      c.pF.setAttribute('d', sp.f||'M0 0');
      c.pB.setAttribute('d', sp.b||'M0 0');
      // Mesh fill — build a list of FRONT-ONLY contours.  Whenever the
      // polygon crosses the horizon (z sign flip) we insert the precise
      // z=0 intersection point, then emit each contour as its OWN closed
      // subpath. Gaps between contours are sealed along the sphere limb
      // via an elliptical-arc command so the fill hugs the disc edge
      // instead of cutting straight across ocean.
      function horizonPoint(A,B){
        const t = A.z/(A.z-B.z);
        return { x: A.x+(B.x-A.x)*t, y: A.y+(B.y-A.y)*t, z: 0 };
      }
      const contours = []; let cur=null;
      const n = proj.length;
      for(let i=0;i<n;i++){
        const a = proj[i], b = proj[(i+1)%n];
        const aFront = a.z>=0, bFront = b.z>=0;
        if(aFront){
          if(!cur){ cur=[]; contours.push(cur); }
          cur.push(a);
          if(!bFront){ cur.push(horizonPoint(a,b)); cur=null; }
        } else if(bFront){
          if(!cur){ cur=[]; contours.push(cur); }
          cur.push(horizonPoint(a,b));
        }
      }
      let fillD='';
      // Render each front-only fragment as its own closed subpath.
      // Adjacent fragments are NOT joined; any cross-ocean bleed from a single
      // horizon-spanning polygon is thereby eliminated.  The short straight
      // segment that closes each fragment hugs the limb closely since both
      // endpoints sit on the sphere boundary (z=0).
      contours.forEach(pts=>{
        if(pts.length<3) return;
        fillD += 'M'+pts[0].x.toFixed(1)+' '+pts[0].y.toFixed(1);
        for(let i=1;i<pts.length;i++) fillD += ' L'+pts[i].x.toFixed(1)+' '+pts[i].y.toFixed(1);
        fillD += ' Z ';
      });
      c.pFill.setAttribute('d', fillD || 'M0 0');
      } catch(err) { /* guard against pathological polygons; skip frame */ }
    });

    // Active hubs set — any city used as endpoint by any current route
    const activeHubs = new Set();
    routes.forEach(r=>{ if(r.a) activeHubs.add(r.a); if(r.b) activeHubs.add(r.b); });

    // Endpoint dots
    CITY_KEYS.forEach(k=>{
      const h = hubDots[k];
      if(!activeHubs.has(k)){ h.c.setAttribute('opacity','0'); h.ring.setAttribute('opacity','0'); return; }
      const [la,lo] = CITIES[k];
      const p = project(la,lo,rotY,rotX);
      if(p.z>=0){
        h.c.setAttribute('cx',p.x.toFixed(1)); h.c.setAttribute('cy',p.y.toFixed(1));
        h.c.setAttribute('opacity','1');
        // pulsing ring
        const pulse = (t*1.3 + CITY_KEYS.indexOf(k)*0.3) % 1;
        h.ring.setAttribute('cx',p.x.toFixed(1)); h.ring.setAttribute('cy',p.y.toFixed(1));
        h.ring.setAttribute('r', (1.8 + pulse*6).toFixed(1));
        h.ring.setAttribute('opacity', (0.55*(1-pulse)).toFixed(2));
      } else {
        h.c.setAttribute('opacity','0'); h.ring.setAttribute('opacity','0');
      }
    });

    // Routes
    routes.forEach(r=>{
      if(!r.samples.length){ r.path.setAttribute('d','M0 0'); r.plane.setAttribute('opacity','0'); return; }
      // Path (front half only)
      const proj = r.samples.map(p=>project(p[0],p[1],rotY,rotX));
      let d=''; let penDown=false;
      for(const p of proj){
        if(p.z>=0){ d += (penDown?'L':'M') + p.x.toFixed(1)+' '+p.y.toFixed(1)+' '; penDown=true; }
        else penDown=false;
      }
      r.path.setAttribute('d', d||'M0 0');

      // Advance phase
      r.phase += r.speed * r.dir;
      if(r.phase>=1){ r.phase=1; r.dir=-1; }
      if(r.phase<=0){ r.phase=0; r.dir= 1; }

      // Plane position
      const f = r.phase*(r.samples.length-1);
      const i0 = Math.floor(f), i1 = Math.min(r.samples.length-1, i0+1);
      const ft = f-i0;
      const [la0,lo0]=r.samples[i0], [la1,lo1]=r.samples[i1];
      const lat = la0+(la1-la0)*ft;
      let dlo = lo1-lo0; if(dlo>180)dlo-=360; if(dlo<-180)dlo+=360;
      const lon = lo0+dlo*ft;
      const P = project(lat,lon,rotY,rotX);

      if(P.z>=-0.05){
        // heading from small step along sample array
        const i2 = Math.min(r.samples.length-1, Math.floor(f+1.5*r.dir));
        const [la2,lo2]=r.samples[Math.max(0,Math.min(r.samples.length-1, i2))];
        const P2 = project(la2,lo2,rotY,rotX);
        const heading = Math.atan2(P2.y-P.y, P2.x-P.x)*180/Math.PI + 90; // plane nose -Y → +90
        const scale = 1.0 + P.z*0.25;
        r.plane.setAttribute('transform',
          `translate(${P.x.toFixed(1)} ${P.y.toFixed(1)}) rotate(${heading.toFixed(1)}) scale(${scale.toFixed(2)})`);
        r.plane.setAttribute('opacity', P.z>=0 ? '1' : '0.25');
      } else {
        r.plane.setAttribute('opacity','0');
      }
    });

    // Ships — slower, docking at endpoints (continent edges)
    ships.forEach(s=>{
      if(!s.samples.length){ s.path.setAttribute('d','M0 0'); s.ship.setAttribute('opacity','0'); return; }
      const proj = s.samples.map(p=>project(p[0],p[1],rotY,rotX));
      // route line
      let d=''; let penDown=false;
      for(const p of proj){
        if(p.z>=0){ d += (penDown?'L':'M') + p.x.toFixed(1)+' '+p.y.toFixed(1)+' '; penDown=true; }
        else penDown=false;
      }
      s.path.setAttribute('d', d||'M0 0');

      // Dock behaviour: if at endpoint, hold still briefly, then reverse.
      if(now < s.dockUntil){
        // stay put
      } else {
        s.phase += s.speed * s.dir;
        if(s.phase>=1){ s.phase=1; s.dir=-1; s.dockUntil = now + 1600 + Math.random()*1800; }
        if(s.phase<=0){ s.phase=0; s.dir= 1; s.dockUntil = now + 1600 + Math.random()*1800; }
      }

      const f = s.phase*(s.samples.length-1);
      const i0 = Math.floor(f), i1 = Math.min(s.samples.length-1, i0+1);
      const ft = f-i0;
      const [la0,lo0]=s.samples[i0], [la1,lo1]=s.samples[i1];
      const lat = la0+(la1-la0)*ft;
      let dlo = lo1-lo0; if(dlo>180)dlo-=360; if(dlo<-180)dlo+=360;
      const lon = lo0+dlo*ft;
      const P = project(lat,lon,rotY,rotX);

      if(P.z>=-0.05){
        const step = s.dir>0 ? 1.5 : -1.5;
        const i2 = Math.max(0,Math.min(s.samples.length-1, Math.floor(f+step)));
        const [la2,lo2]=s.samples[i2];
        const P2 = project(la2,lo2,rotY,rotX);
        const heading = Math.atan2(P2.y-P.y, P2.x-P.x)*180/Math.PI + 90;
        const scale = 0.9 + P.z*0.2;
        // If docked, hide wake by subtle pulse; otherwise normal
        const docked = now<s.dockUntil;
        const alpha = (P.z>=0 ? 1 : 0.2) * (docked ? 0.85+0.15*Math.sin(now/250) : 1);
        s.ship.setAttribute('transform',
          `translate(${P.x.toFixed(1)} ${P.y.toFixed(1)}) rotate(${heading.toFixed(1)}) scale(${scale.toFixed(2)})`);
        s.ship.setAttribute('opacity', alpha.toFixed(2));
      } else {
        s.ship.setAttribute('opacity','0');
      }
    });

    // Poppers
    if(LAND_SURFACE_PTS.length){
      if(!lastSpawn || now-lastSpawn>900){
        lastSpawn = now;
        const dead = pops.find(p=>now-p.born>p.life);
        if(dead) respawn(dead, now);
      }
      const rect = mount.getBoundingClientRect();
      const cx = rect.width/2, cy = rect.height/2;
      const scale = rect.width/(VIEW*2);
      pops.forEach(p=>{
        if(!p.emoji){ p.node.style.opacity='0'; return; }
        const age = now-p.born;
        if(age<0 || age>p.life){ p.node.style.opacity='0'; return; }
        const P = project(p.lat,p.lon,rotY,rotX);
        if(P.z<-0.05){ p.node.style.opacity='0'; return; }
        const x = cx + P.x*scale;
        const y = cy + P.y*scale;
        const lift = -16 - (P.z*6);
        let op=1; const inT=450, outT=700;
        if(age<inT) op=age/inT;
        else if(age>p.life-outT) op=(p.life-age)/outT;
        op = Math.max(0,Math.min(1,op)) * Math.max(0.3, P.z);
        const s = 0.6 + Math.min(1, age/500)*0.5;
        p.node.style.opacity = op.toFixed(2);
        p.node.style.transform = `translate(-50%, calc(-50% + ${lift.toFixed(1)}px)) scale(${s.toFixed(2)})`;
        p.node.style.left = x.toFixed(1)+'px';
        p.node.style.top  = y.toFixed(1)+'px';
      });
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();

/* ──────────────────────────────────────────────────────────────
   PLANS CAROUSEL — one-at-a-time fade/slide
   ────────────────────────────────────────────────────────────── */
(function(){
  const carousel = document.getElementById('plansCarousel');
  if(!carousel) return;
  const cards = [...carousel.querySelectorAll('.plan-card')];
  const n = cards.length;
  if(!n) return;

  const dotsEl = document.getElementById('plansDots');
  const prevBtn = document.getElementById('plansPrev');
  const nextBtn = document.getElementById('plansNext');

  let current = 0;
  let prevIdx = -1;

  function render(){
    cards.forEach((card, i) => {
      card.setAttribute('data-active', i === current ? 'true' : 'false');
      card.setAttribute('data-leaving', i === prevIdx ? 'true' : 'false');
    });
    if(dotsEl){
      [...dotsEl.children].forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );
    }
  }

  function go(to){
    const next = ((to % n) + n) % n;
    if(next === current) return;
    prevIdx = current;
    current = next;
    render();
  }
  function next(){ go(current + 1); }
  function prev(){ go(current - 1); }

  // Build dots
  if(dotsEl){
    dotsEl.innerHTML = '';
    cards.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'pcc-dot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', 'Plan ' + (i + 1));
      b.addEventListener('click', () => go(i));
      dotsEl.appendChild(b);
    });
  }

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  // Swipe
  let touchX = 0;
  const stage = carousel.parentElement;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive:true });
  stage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
  });

  // Auto-advance
  let autoTimer = null;
  let paused = false;
  function startAuto(){
    if(paused) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 3800);
  }
  function stopAuto(){ clearInterval(autoTimer); autoTimer = null; }

  stage.addEventListener('mouseenter', () => { paused = true; stopAuto(); });
  stage.addEventListener('mouseleave', () => { paused = false; startAuto(); });

  const section = document.getElementById('plans');
  if(section && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if(en.isIntersecting){ paused = false; startAuto(); }
        else { paused = true; stopAuto(); }
      });
    }, { threshold: 0.25 });
    io.observe(section);
  } else {
    startAuto();
  }

  render();
})();
