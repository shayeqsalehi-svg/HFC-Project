/* HFC local analytics tracker. All records stay in this browser. */
(function () {
  'use strict';
  if (location.pathname.indexOf('/admin/') !== -1 || location.pathname.endsWith('/admin.html')) return;
  const EVENT_KEY = 'hfc-analytics-events';
  const VISITOR_KEY = 'hfc-analytics-visitor-id';
  const page = location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(location.search);
  const postId = params.get('post') || '';
  const title = (document.querySelector('h1')?.textContent || document.title || page).trim();
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = 'visitor-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
    try { localStorage.setItem(VISITOR_KEY, visitorId); } catch (_) {}
  }
  let events = [];
  try { events = JSON.parse(localStorage.getItem(EVENT_KEY) || '[]'); if (!Array.isArray(events)) events = []; } catch (_) { events = []; }
  const now = new Date();
  events.push({
    id: 'v-' + now.getTime() + '-' + Math.random().toString(36).slice(2, 7),
    type: 'view', page,
    section: page.replace('.html', '').replace(/[-_]/g, ' '),
    title, contentId: postId, postId,
    contentType: page === 'blog-details.html' ? 'Blog post' : 'Page',
    visitorId, timestamp: now.toISOString(),
    referrer: document.referrer || 'Direct',
    device: /mobile|android|iphone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
  });
  if (events.length > 10000) events = events.slice(-10000);
  try { localStorage.setItem(EVENT_KEY, JSON.stringify(events)); }
  catch (error) { console.warn('HFC analytics storage is full', error); }
})();
