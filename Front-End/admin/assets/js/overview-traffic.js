(function () {
  'use strict';
  const KEY = 'hfc-analytics-events';
  const $ = id => document.getElementById(id);
  const read = () => { try { const data = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(data) ? data : []; } catch (_) { return []; } };
  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, {month:'short',day:'numeric',year:'numeric'}); };
  function render() {
    const events = read().filter(item => item.type === 'view');
    const unique = new Set(events.map(item => item.visitorId || item.id));
    const posts = events.filter(item => item.contentType === 'Blog post' || item.page === 'blog-details.html');
    $('ov-total-views').textContent = events.length.toLocaleString();
    $('ov-unique-visitors').textContent = unique.size.toLocaleString();
    $('ov-post-views').textContent = posts.length.toLocaleString();
    $('ov-returning-views').textContent = Math.max(0, events.length - unique.size).toLocaleString();

    const postMap = new Map();
    posts.forEach(item => {
      const id = item.postId || item.contentId || item.title || 'unknown-post';
      if (!postMap.has(id)) postMap.set(id, {id, title:item.title || 'Blog article', views:0, last:item.timestamp});
      const row = postMap.get(id); row.views++;
      if (new Date(item.timestamp) > new Date(row.last)) row.last = item.timestamp;
      if (item.title && (!row.title || row.title === 'Blog article')) row.title = item.title;
    });
    const topPosts = [...postMap.values()].sort((a,b) => b.views-a.views).slice(0,7);
    $('overview-post-views').innerHTML = topPosts.length ? topPosts.map((post,index) => `<a class="overview-post-row" href="../blog-details.html?post=${encodeURIComponent(post.id)}" target="_blank" rel="noopener"><span class="overview-post-rank">${String(index+1).padStart(2,'0')}</span><span class="overview-post-info"><strong>${esc(post.title)}</strong><small>Last viewed ${esc(fmt(post.last))}</small></span><b>${post.views.toLocaleString()} <small>views</small></b></a>`).join('') : '<div class="overview-traffic-empty">No blog article views yet. Open a blog post on the public website to start tracking.</div>';

    const sections = new Map();
    events.forEach(item => { const label = (item.section || item.page || 'Other').replace(/\b\w/g, c => c.toUpperCase()); sections.set(label, (sections.get(label)||0)+1); });
    const sorted = [...sections.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);
    const max = Math.max(1,...sorted.map(x=>x[1]));
    $('overview-section-views').innerHTML = sorted.length ? sorted.map(([name,value]) => `<div class="overview-section-row"><span>${esc(name)}</span><i><b style="width:${Math.max(3,value/max*100)}%"></b></i><strong>${value.toLocaleString()}</strong></div>`).join('') : '<div class="overview-traffic-empty">Section activity will appear after the public website is visited.</div>';
  }
  window.addEventListener('storage', event => { if (!event.key || event.key === KEY) render(); });
  render();
  // Keep the overview fresh when returning to this tab.
  window.addEventListener('focus', render);
})();
