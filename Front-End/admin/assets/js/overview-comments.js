(function () {
  'use strict';
  const KEY = 'hfc-blog-comments';
  const count = document.getElementById('overview-comment-count');
  const list = document.getElementById('overview-comments-list');
  if (!count || !list) return;
  const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } };
  const escapeHTML = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const postHref = item => "../blog-details.html?post=" + encodeURIComponent(item.post || item.postId || "") + '#hfc-comment-' + encodeURIComponent(item.id || '');
  const dateText = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString(); };
  function render() {
    const comments = read().sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    count.textContent = comments.length.toLocaleString();
    if (!comments.length) {
      list.innerHTML = '<div class="overview-comments-empty"><span>✧</span><strong>No comments yet</strong><small>New visitor comments on your blog posts will appear here.</small></div>';
      return;
    }
    list.innerHTML = comments.slice(0, 12).map(item => {
      const replies = Array.isArray(item.replies) ? item.replies : [];
      return `<article class="overview-comment-item" data-comment-id="${escapeHTML(item.id)}"><div class="overview-avatar">${escapeHTML((item.name || 'V').trim().charAt(0).toUpperCase())}</div><div class="overview-comment-body"><div class="overview-comment-meta"><strong>${escapeHTML(item.name || 'Visitor')}</strong><time>${escapeHTML(dateText(item.createdAt))}</time></div><a class="overview-comment-post" href="${postHref(item)}" target="_blank" rel="noopener">↗ ${escapeHTML(item.postTitle || 'Blog article')}</a><p>${escapeHTML(item.message)}</p><div class="overview-admin-replies">${replies.map(reply => `<div class="overview-admin-reply"><strong>${escapeHTML(reply.author || 'Hewad Future Consultancy')}</strong><p>${escapeHTML(reply.message)}</p><time>${escapeHTML(dateText(reply.createdAt))}</time></div>`).join('')}</div><form class="overview-reply-form"><textarea name="reply" rows="2" maxlength="1200" required placeholder="Write a reply to this comment..."></textarea><button type="submit">↩ Reply</button></form></div><button type="button" class="overview-comment-delete" aria-label="Delete comment" title="Delete comment">×</button></article>`;
    }).join('') + (comments.length > 12 ? `<div class="overview-comments-more">Showing the 12 latest of ${comments.length} comments.</div>` : '');
  }
  list.addEventListener('submit', event => {
    const form = event.target.closest('.overview-reply-form');
    if (!form) return;
    event.preventDefault();
    const article = form.closest('[data-comment-id]');
    const message = String(new FormData(form).get('reply') || '').trim();
    if (!article || !message) return;
    const comments = read();
    const comment = comments.find(item => String(item.id) === article.dataset.commentId);
    if (!comment) return;
    if (!Array.isArray(comment.replies)) comment.replies = [];
    comment.replies.push({ id: 'r-' + Date.now(), author: localStorage.getItem('hfc-admin-name') || 'Hewad Future Consultancy', message, createdAt: new Date().toISOString(), isAdmin: true });
    localStorage.setItem(KEY, JSON.stringify(comments));
    render();
  });
  list.addEventListener('click', event => {
    const button = event.target.closest('.overview-comment-delete');
    if (!button) return;
    const item = button.closest('[data-comment-id]');
    if (!item || !confirm('Delete this comment and its replies from local browser storage?')) return;
    const id = item.dataset.commentId;
    localStorage.setItem(KEY, JSON.stringify(read().filter(comment => String(comment.id) !== id)));
    render();
  });
  window.addEventListener('storage', event => { if (!event.key || event.key === KEY) render(); });
  render();
})();
