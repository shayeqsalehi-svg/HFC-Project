/* BentoFlow executive overview: all figures are read from the existing browser storage. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const fallbackFor = key => { const map = {'hfc-team': window.Admin?.defaults?.team || [], 'hfc-services': window.Admin?.defaults?.services || [], 'hfc-blog': window.Admin?.defaults?.blog || [], 'hfc-work': window.Admin?.defaults?.work || [], 'hfc-clients': window.Admin?.defaults?.clients || []}; return map[key] || []; };
  const read = (key, fallback) => { try { const raw = localStorage.getItem(key); if (raw === null) return fallback || fallbackFor(key); const v = JSON.parse(raw); return Array.isArray(v) ? v : (fallback || fallbackFor(key)); } catch (_) { return fallback || fallbackFor(key); } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => Number(n || 0).toLocaleString();
  const events = () => read('hfc-analytics-events').filter(e => e.type === 'view');
  const sections = [
    ['team','Our Team','hfc-team','team.html','＋','Add team member'],
    ['services','Services','hfc-services','services.html','◇','Add service'],
    ['blog','Blog posts','hfc-blog','blog.html','▤','Write article'],
    ['work','Our Work','hfc-work','our-work.html','▣','Add project'],
    ['clients','Clients','hfc-clients','clients.html','♧','Add client']
  ];
  const dateLabel = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? 'Recently' : d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}); };
  function sparkline(values, color) {
    const max = Math.max(1, ...values), min = Math.min(0, ...values), span = Math.max(1, max-min);
    const pts = values.map((v,i) => `${8 + i * 18},${36 - ((v-min)/span)*28}`).join(' ');
    return `<svg class="bf-spark" viewBox="0 0 140 42" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function trafficChart(list) {
    const now = new Date(); const days = [];
    for (let i=6;i>=0;i--) { const d=new Date(now); d.setDate(now.getDate()-i); d.setHours(0,0,0,0); const next=new Date(d); next.setDate(d.getDate()+1); days.push({date:d,count:list.filter(e=>{const t=new Date(e.timestamp||e.date||0);return t>=d&&t<next;}).length}); }
    const max=Math.max(1,...days.map(d=>d.count));
    const points=days.map((d,i)=>`${28+i*105},${160-(d.count/max)*125}`).join(' ');
    const area=`M ${points} L 658,174 L 28,174 Z`;
    const lines=[35,75,115,155].map(y=>`<line x1="25" y1="${y}" x2="660" y2="${y}" class="bf-gridline"/>`).join('');
    const labels=days.map((d,i)=>`<text x="${28+i*105}" y="196" text-anchor="middle" class="bf-axis-label">${d.date.toLocaleDateString(undefined,{weekday:'short'})}</text>`).join('');
    return `<svg class="bf-traffic-svg" viewBox="0 0 680 210" role="img" aria-label="Page views over the last seven days">${lines}<path d="${area}" class="bf-area"/><polyline points="${points}" class="bf-line"/>${days.map((d,i)=>`<circle cx="${28+i*105}" cy="${160-(d.count/max)*125}" r="4" class="bf-point"><title>${d.count} views</title></circle>`).join('')}${labels}</svg>`;
  }
  function render() {
    const team=read('hfc-team'), services=read('hfc-services'), blog=read('hfc-blog'), work=read('hfc-work'), clients=read('hfc-clients'), views=events(), comments=read('hfc-blog-comments');
    const visitors=new Set(views.map(e=>e.visitorId).filter(Boolean)).size;
    const posts=views.filter(e=>e.contentType==='Blog post'||e.page==='blog-details.html');
    const metrics=[
      {label:'Total page views',value:views.length,sub:'All recorded website visits',tone:'violet',icon:'◉',spark:views.slice(-7).map((_,i)=>i+1)},
      {label:'Unique visitors',value:visitors,sub:'Distinct browser IDs recorded',tone:'blue',icon:'♙',spark:[1,2,1,3,2,4,visitors]},
      {label:'Blog post views',value:posts.length,sub:'Visits to article detail pages',tone:'amber',icon:'▤',spark:posts.slice(-7).map((_,i)=>i+1)},
      {label:'Total comments',value:comments.length,sub:'Visitor comments saved locally',tone:'rose',icon:'✎',spark:[0,1,1,2,1,comments.length,comments.length]}
    ];
    $('bf-kpis').innerHTML=metrics.map(m=>`<article class="bf-kpi bf-${m.tone}"><div class="bf-kpi-top"><span>${m.label}</span><i>${m.icon}</i></div><strong>${fmt(m.value)}</strong><small>${m.sub}</small>${sparkline(m.spark.length?m.spark:[0,0,0,0,0,0,0], 'var(--bf-accent)')}</article>`).join('');
    $('bf-traffic-total').textContent=fmt(views.length);
    $('bf-traffic-chart').innerHTML=trafficChart(views);
    $('bf-traffic-caption').textContent=`${views.length.toLocaleString()} total tracked page views · last 7 days shown`;

    const activities=[];
    comments.forEach(c=>activities.push({date:c.createdAt||c.date,title:'New blog comment',detail:`${c.name||'Visitor'} commented on ${c.postTitle||'a blog post'}`,icon:'✎',href:'blog.html'}));
    read('hfc-contact-messages').forEach(m=>activities.push({date:m.createdAt,title:'New contact inquiry',detail:`${m.name||'Visitor'} · ${m.subject||'Contact message'}`,icon:'✉',href:'messages.html'}));
    sections.forEach(([,label,key,href])=>read(key).forEach(item=>activities.push({date:item.createdAt||item.updatedAt||item.date||item.publishedAt,title:`${label} updated`,detail:item.name||item.title||item.fullName||'Content item',icon:'✦',href})));
    views.slice(-20).forEach(v=>activities.push({date:v.timestamp||v.date,title:'Website page viewed',detail:v.title||v.page||'Page visit',icon:'◉',href:'analytics.html'}));
    activities.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    $('bf-activity').innerHTML=activities.length?activities.slice(0,6).map(a=>`<a class="bf-activity-row" href="${esc(a.href)}"><span class="bf-activity-icon">${esc(a.icon)}</span><span class="bf-activity-copy"><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></span><time>${esc(dateLabel(a.date))}</time></a>`).join(''):'<div class="bf-empty">Activity will appear here as content is added and visitors browse the website.</div>';

    const projectViews=new Map();
    views.filter(v=>/work|project/i.test((v.contentType||'')+' '+(v.section||''))).forEach(v=>{const id=v.contentId||v.postId||v.title||'project';projectViews.set(id,(projectViews.get(id)||0)+1);});
    $('bf-projects').innerHTML=work.length?work.slice(0,4).map((p,i)=>{const title=p.name||p.title||'Untitled project';const count=projectViews.get(p.id)||projectViews.get(title)||0;const pct=Math.min(100,Math.max(8,count?count*10:18));return `<a class="bf-project-row" href="our-work.html"><span class="bf-project-thumb">${esc((title.trim()[0]||'P').toUpperCase())}</span><span class="bf-project-copy"><strong>${esc(title)}</strong><small>${esc(p.category||'Project')}</small><i><b style="width:${pct}%"></b></i></span><em>${fmt(count)} views</em></a>`;}).join(''):'<div class="bf-empty">No projects yet. Add your first project from Our Work.</div>';

    $('bf-team').innerHTML=team.length?team.slice(0,4).map(p=>{const name=p.name||p.fullName||'Team member';const image=p.image?`<img src="${esc(p.image)}" alt="" onerror="this.hidden=true">`:'';return `<div class="bf-team-row"><span class="bf-team-avatar">${image||esc(name.trim()[0].toUpperCase())}</span><span><strong>${esc(name)}</strong><small>${esc(p.role||p.position||'Team member')}</small></span><i>Active</i></div>`;}).join(''):'<div class="bf-empty">No team members added yet.</div>';

    const shortcuts = [...sections.map(s=>({href:s[3],icon:s[4],title:s[5],sub:`Manage ${s[1].toLowerCase()}`})),{href:'analytics.html',icon:'⌁',title:'View analytics',sub:'Website performance'},{href:'profile.html',icon:'♙',title:'Edit profile',sub:'Administrator profile'},{href:'settings.html',icon:'⚙',title:'Account settings',sub:'Account preferences'},{href:'comments.html',icon:'✎',title:'Moderate comments',sub:'Review visitor discussions'},{href:'messages.html',icon:'✉',title:'Contact inbox',sub:'Review client inquiries'},{href:'media.html',icon:'▧',title:'Media library',sub:'Manage reusable images'},{href:'backup.html',icon:'↥',title:'Backup data',sub:'Export or restore content'}];
    $('bf-quick-actions').innerHTML=shortcuts.map(s=>`<a href="${s.href}" class="bf-action"><span>${s.icon}</span><strong>${s.title}</strong><small>${s.sub}</small></a>`).join('');
    $('bf-content-counts').innerHTML=sections.map(s=>`<a href="${s[3]}" class="bf-count-row"><span>${s[1]}</span><strong>${fmt(read(s[2]).length)}</strong><i>Manage ↗</i></a>`).join('');
  }
  render();
  window.addEventListener('storage',render); window.addEventListener('focus',render);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
})();
