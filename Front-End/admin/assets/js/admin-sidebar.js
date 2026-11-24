(() => {
  const init=()=>{
    const sidebar=document.querySelector('.admin-sidebar');
    const layout=document.querySelector('.admin-layout');
    if(!sidebar||!layout) return;
    // Capture admin content mutations as a lightweight local audit trail.
    if(!window.__hfcAuditHook){window.__hfcAuditHook=true;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){const result=original.call(this,key,value);const tracked=['hfc-team','hfc-services','hfc-blog','hfc-work','hfc-clients','hfc-blog-comments','hfc-contact-messages','hfc-admin-profile-v1'];if(tracked.includes(String(key))&&location.pathname.includes('/admin/')){try{const log=JSON.parse(localStorage.getItem('hfc-admin-activity')||'[]');const labels={'hfc-team':'Our Team','hfc-services':'Services','hfc-blog':'Blog Posts','hfc-work':'Our Work','hfc-clients':'Clients','hfc-blog-comments':'Blog comments','hfc-contact-messages':'Contact messages','hfc-admin-profile-v1':'Profile'};log.unshift({id:'act-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),key:String(key),label:labels[key]||key,action:'Updated',page:location.pathname.split('/').pop(),admin:localStorage.getItem('hfc-admin-name')||'Admin',at:new Date().toISOString()});original.call(localStorage,'hfc-admin-activity',JSON.stringify(log.slice(0,500)));}catch(_){}}return result;};}
    // Sync the admin name and photo across admin pages.
    const syncAdminIdentity=()=>{
      const avatar=document.getElementById('admin-user-avatar');
      const name=document.getElementById('admin-user-name');
      let profile={};
      try{profile=JSON.parse(localStorage.getItem('hfc-admin-profile-v1')||'{}')||{};}catch(_){profile={};}
      let session={};
      try{session=JSON.parse(localStorage.getItem('hfc-session')||'{}')||{};}catch(_){session={};}
      const displayName=profile.name||session.name||session.email||'Admin';
      if(name) name.textContent=displayName;
      if(avatar){
        const photo=profile.avatar||'';
        avatar.src=photo;
        avatar.alt=displayName+' profile photo';
        avatar.classList.toggle('has-photo',!!photo);
        avatar.textContent='';
        avatar.onerror=()=>{avatar.removeAttribute('src');avatar.classList.remove('has-photo');};
      }
    };
    syncAdminIdentity();
    window.addEventListener('storage',syncAdminIdentity);
    window.addEventListener('hfc-profile-updated',syncAdminIdentity);

    // Sidebar markup stays in HTML; this file only handles its behaviour.
    const toggle=sidebar.querySelector('.admin-sidebar-toggle');
    const State=window.HFCSidebarState;
    const syncToggle=()=>{
      if(!toggle||!State)return;
      const collapsed=State.isCollapsed();
      toggle.setAttribute('aria-label',collapsed?'Expand sidebar':'Collapse sidebar');
      toggle.title=collapsed?'Expand sidebar':'Collapse sidebar';
    };
    syncToggle();
    toggle?.addEventListener('click',event=>{
      event.preventDefault(); event.stopPropagation();
      State?.set(!State.isCollapsed()); syncToggle();
    });
    window.addEventListener('storage',syncToggle);
    window.addEventListener('pageshow',syncToggle);
    // Use an off-canvas sidebar on small screens.
    const topbarActions=document.querySelector('.admin-topbar-actions');
    let mobileToggle=document.querySelector('.admin-mobile-menu-toggle');
    let mobileOverlay=document.querySelector('.admin-mobile-sidebar-overlay');
    if(!mobileOverlay){
      mobileOverlay=document.createElement('button');
      mobileOverlay.type='button'; mobileOverlay.className='admin-mobile-sidebar-overlay';
      mobileOverlay.setAttribute('aria-label','Close navigation');
      mobileOverlay.hidden=true; document.body.appendChild(mobileOverlay);
    }
    if(topbarActions && !mobileToggle){
      mobileToggle=document.createElement('button'); mobileToggle.type='button';
      mobileToggle.className='admin-mobile-menu-toggle';
      mobileToggle.setAttribute('aria-label','Open navigation'); mobileToggle.setAttribute('aria-expanded','false');
      mobileToggle.innerHTML='<span></span><span></span><span></span>';
      topbarActions.insertBefore(mobileToggle,topbarActions.firstChild);
    }
    const setMobileOpen=open=>{
      layout.classList.toggle('mobile-sidebar-open',open);
      if(mobileToggle){mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');}
      mobileOverlay.hidden=!open;
      document.body.classList.toggle('admin-mobile-nav-open',open);
    };
    mobileToggle?.addEventListener('click',()=>setMobileOpen(!layout.classList.contains('mobile-sidebar-open')));
    mobileOverlay.addEventListener('click',()=>setMobileOpen(false));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setMobileOpen(false)});
    sidebar.querySelectorAll('.admin-nav-link').forEach(link=>link.addEventListener('click',()=>setMobileOpen(false)));
    window.addEventListener('resize',()=>{if(window.innerWidth>860)setMobileOpen(false)});

    // Inject a shared notifications center into every admin page's top bar.
    const actions = document.querySelector('.admin-topbar-actions');
    if (actions && !actions.querySelector('.admin-notification-wrap')) {
      const wrap = document.createElement('div'); wrap.className = 'admin-notification-wrap';
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'admin-notification-btn'; button.setAttribute('aria-label','Website notifications');
      button.setAttribute('aria-expanded','false'); button.title = 'Website notifications';
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg><span class="admin-notification-badge" hidden>0</span>';
      const panel = document.createElement('div'); panel.className = 'admin-notification-panel'; panel.hidden = true;
      panel.innerHTML = '<div class="admin-notification-head"><div class="admin-notification-heading"><strong>Website notifications</strong><span>Recent activity</span></div><button type="button" class="admin-notification-clear" aria-label="Clear all notifications" title="Clear all notifications">Clear</button></div><div class="admin-notification-list"></div><div class="admin-notification-footer"><a href="dashboard.html">View overview →</a></div>';
      wrap.append(button,panel); actions.insertBefore(wrap,actions.firstChild);
      const badge = button.querySelector('.admin-notification-badge');
      const list = panel.querySelector('.admin-notification-list');
      const safe = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const read = key => { try { const value=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(value)?value:[]; } catch (_) { return []; } };
      const when = value => { const d=new Date(value); return Number.isNaN(d.getTime())?'Recently':d.toLocaleString(); };
      const SEEN_KEY = 'hfc-admin-notifications-seen-v1';
      const DISMISSED_KEY = 'hfc-admin-notifications-dismissed-v1';
      const getDismissed = () => { try { return new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY)||'[]')); } catch (_) { return new Set(); } };
      const saveDismissed = ids => { try { localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids].slice(-5000))); } catch (_) {} };
      const getSeen = () => { try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY)||'[]')); } catch (_) { return new Set(); } };
      const saveSeen = seen => { try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-2000))); } catch (_) {} };
      let currentNotes = [];
      function collectNotifications(){
        const notes=[];
        read('hfc-blog-comments').forEach((item,index)=>{
          const date=item.createdAt||item.date||'';
          const detail=(item.name||'A visitor')+' commented on '+(item.postTitle||item.title||'a blog article');
          const post=String(item.post||item.postId||'');
          const commentId=String(item.id||date+'|'+detail+'|'+index);
          const target='../blog-details.html?post='+encodeURIComponent(post)+'#hfc-comment-'+encodeURIComponent(commentId);
          notes.push({id:'comment:'+commentId,date,title:'New blog comment',detail,icon:'✎',href:target});
        });
        read('hfc-contact-messages').forEach((item,index)=>{const date=item.createdAt||'';const id=String(item.id||date+'|'+item.email+'|'+index);notes.push({id:'message:'+id,date,title:'New contact inquiry',detail:(item.name||'Visitor')+' · '+(item.subject||'Contact message'),icon:'✉',href:'messages.html'});});
        const sections=[['hfc-team','Our Team','team.html'],['hfc-services','Services','services.html'],['hfc-blog','Blog Posts','blog.html'],['hfc-work','Our Work','our-work.html'],['hfc-clients','Clients','clients.html']];
        sections.forEach(([key,label,href])=>read(key).forEach((item,index)=>{
          const date=item.createdAt||item.updatedAt||item.date||item.publishedAt;
          if(date){const detail=item.name||item.title||item.fullName||'A new item was saved';notes.push({id:'content:'+key+':'+String(item.id||date+'|'+detail+'|'+index),date,title:label+' content updated',detail,icon:'✦',href});}
        }));
        read('hfc-analytics-events').filter(e=>e.type==='view').forEach((e,index)=>{
          const date=e.timestamp||e.date||'';const detail=(e.title||e.page||'A page')+' · '+(e.device||'Visitor');
          notes.push({id:'view:'+String(e.id||date+'|'+detail+'|'+index),date,title:'Website page viewed',detail,icon:'◉',href:'analytics.html'});
        });
        const dismissed=getDismissed();
        return notes.filter(note=>!dismissed.has(note.id)).sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
      }
      function renderNotifications(){
        currentNotes=collectNotifications();
        const seen=getSeen();
        const unread=currentNotes.filter(n=>!seen.has(n.id));
        badge.textContent=String(Math.min(unread.length,99));badge.hidden=!unread.length;
        list.innerHTML=currentNotes.length?currentNotes.map(n=>'<a class="admin-notification-item'+(seen.has(n.id)?' is-read':' is-unread')+'" href="'+safe(n.href)+'"><span class="admin-notification-icon">'+safe(n.icon)+'</span><span class="admin-notification-copy"><strong>'+safe(n.title)+'</strong><small>'+safe(n.detail)+' · '+safe(when(n.date))+'</small></span>'+(seen.has(n.id)?'':'<i class="admin-notification-unread-dot" aria-label="Unread"></i>')+'</a>').join(''):'<div class="admin-notification-empty">You are all caught up. New comments, content updates and website visits will appear here.</div>';
      }
      function markAllRead(){const seen=getSeen();currentNotes.forEach(n=>seen.add(n.id));saveSeen(seen);renderNotifications();}
      panel.querySelector('.admin-notification-clear').addEventListener('click',()=>{
        const dismissed=getDismissed();
        currentNotes.forEach(note=>dismissed.add(note.id));
        saveDismissed(dismissed);
        renderNotifications();
      });
      button.addEventListener('click',()=>{
        const open=panel.hidden;panel.hidden=!open;button.setAttribute('aria-expanded',String(open));
        if(open){renderNotifications();markAllRead();}
      });
      document.addEventListener('click',event=>{if(!wrap.contains(event.target)){panel.hidden=true;button.setAttribute('aria-expanded','false');}});
      window.addEventListener('storage',renderNotifications); renderNotifications();
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
