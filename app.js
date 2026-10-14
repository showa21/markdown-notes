(function () {
  const KEY = 'markdown-notes:v1';
  const $ = (id) => document.getElementById(id);
  const el = { list: $('list'), title: $('title'), editor: $('editor'), preview: $('preview'),
               filter: $('filter'), status: $('status') };
  let notes = JSON.parse(localStorage.getItem(KEY) || '[]');
  let currentId = null;

  const save = () => { localStorage.setItem(KEY, JSON.stringify(notes)); el.status.textContent = 'Saved'; };
  const current = () => notes.find((n) => n.id === currentId);

  function renderList() {
    const q = el.filter.value.toLowerCase();
    el.list.innerHTML = '';
    notes
      .filter((n) => (n.title + n.body).toLowerCase().includes(q))
      .sort((a, b) => b.updated - a.updated)
      .forEach((n) => {
        const li = document.createElement('li');
        li.className = n.id === currentId ? 'active' : '';
        const t = document.createElement('strong');
        t.textContent = n.title || 'Untitled';
        const d = document.createElement('small');
        d.textContent = new Date(n.updated).toLocaleString();
        li.append(t, d);
        li.onclick = () => select(n.id);
        el.list.appendChild(li);
      });
  }

  function select(id) {
    currentId = id;
    const n = current();
    el.title.value = n ? n.title : '';
    el.editor.value = n ? n.body : '';
    el.preview.innerHTML = n ? MiniMarkdown.render(n.body) : '';
    renderList();
  }

  function create() {
    const n = { id: String(Date.now()), title: '', body: '', updated: Date.now() };
    notes.push(n);
    save();
    select(n.id);
    el.title.focus();
  }

  function update() {
    const n = current();
    if (!n) return;
    n.title = el.title.value;
    n.body = el.editor.value;
    n.updated = Date.now();
    el.preview.innerHTML = MiniMarkdown.render(n.body);
    save();
    renderList();
  }

  $('new').onclick = create;
  $('delete').onclick = () => {
    if (!current() || !confirm('Delete this note?')) return;
    notes = notes.filter((n) => n.id !== currentId);
    save();
    select(notes[0] ? notes[0].id : null);
  };
  el.title.oninput = el.editor.oninput = update;
  el.filter.oninput = renderList;

  if (notes.length) select(notes[0].id); else create();
})();
