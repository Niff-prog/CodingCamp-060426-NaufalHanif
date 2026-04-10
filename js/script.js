/* ===================================================
   Todo Life Dashboard — js/script.js
   Vanilla JS, no framework, localStorage persistence
   =================================================== */

(function () {
  'use strict';

  // ── localStorage keys ──────────────────────────────
  const KEYS = {
    userName: 'tld_userName',
    theme:    'tld_theme',
    tasks:    'tld_tasks',
    links:    'tld_links',
  };

  // ── localStorage utilities ─────────────────────────
  function safeGetItem(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[TLD] Failed to read ' + key + ' from localStorage', e);
      return fallback;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[TLD] Failed to write ' + key + ' to localStorage', e);
    }
  }

  function genId() {
    return (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function showInputError(el) {
    el.classList.add('input-error');
    setTimeout(() => el.classList.remove('input-error'), 1200);
  }

  // ── ThemeManager ───────────────────────────────────
  const ThemeManager = {
    getTheme() {
      return safeGetItem(KEYS.theme, 'light');
    },
    setTheme(theme) {
      safeSetItem(KEYS.theme, theme);
      this.apply(theme);
    },
    toggle() {
      const next = this.getTheme() === 'light' ? 'dark' : 'light';
      this.setTheme(next);
      document.getElementById('themeIcon').textContent = next === 'dark' ? '☀️' : '🌙';
    },
    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const icon = document.getElementById('themeIcon');
      if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    },
    init() {
      this.apply(this.getTheme());
      document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
    },
  };


  // ── GreetingWidget ─────────────────────────────────
  const GreetingWidget = {
    formatTime(date) {
      const pad = n => String(n).padStart(2, '0');
      return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
    },
    getGreeting(hour) {
      if (hour >= 0 && hour <= 11) return 'Selamat Pagi';
      if (hour >= 12 && hour <= 17) return 'Selamat Siang';
      return 'Selamat Malam';
    },
    getUserName() {
      return safeGetItem(KEYS.userName, '');
    },
    setUserName(name) {
      safeSetItem(KEYS.userName, name);
    },
    tick() {
      const now = new Date();
      const clockEl = document.getElementById('clock');
      const greetEl = document.getElementById('greeting');
      if (clockEl) clockEl.textContent = this.formatTime(now);
      if (greetEl) {
        const name = this.getUserName();
        const base = this.getGreeting(now.getHours());
        greetEl.textContent = name ? base + ', ' + name + '!' : base + '!';
      }
    },
    init() {
      const nameInput = document.getElementById('nameInput');
      const saveBtn   = document.getElementById('saveNameBtn');
      const saved = this.getUserName();
      if (saved) nameInput.value = saved;

      const saveName = () => {
        const val = nameInput.value.trim();
        this.setUserName(val);
        this.tick();
      };

      saveBtn.addEventListener('click', saveName);
      nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });

      this.tick();
      setInterval(() => this.tick(), 1000);
    },
  };


  // ── TimerWidget ────────────────────────────────────
  const TimerWidget = {
    INITIAL_SECONDS: 25 * 60,
    state: { seconds: 25 * 60, running: false },
    _interval: null,

    formatDisplay(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    },
    _render() {
      document.getElementById('timerDisplay').textContent = this.formatDisplay(this.state.seconds);
    },
    start() {
      if (this.state.running) return;
      if (this.state.seconds === 0) return;
      this.state.running = true;
      this._interval = setInterval(() => this.tick(), 1000);
    },
    stop() {
      if (!this.state.running) return;
      this.state.running = false;
      clearInterval(this._interval);
      this._interval = null;
    },
    reset() {
      this.stop();
      this.state.seconds = this.INITIAL_SECONDS;
      this._render();
    },
    tick() {
      if (this.state.seconds <= 0) {
        this.stop();
        return;
      }
      this.state.seconds -= 1;
      this._render();
      if (this.state.seconds === 0) {
        this.stop();
        // visual flash notification
        const card = document.querySelector('.timer-card');
        if (card) {
          card.classList.add('timer-done');
          setTimeout(() => card.classList.remove('timer-done'), 1600);
        }
      }
    },
    init() {
      this._render();
      document.getElementById('timerStart').addEventListener('click', () => this.start());
      document.getElementById('timerStop').addEventListener('click',  () => this.stop());
      document.getElementById('timerReset').addEventListener('click', () => this.reset());
    },
  };


  // ── TaskManager ────────────────────────────────────
  const TaskManager = {
    tasks: [],

    loadTasks() {
      this.tasks = safeGetItem(KEYS.tasks, []);
      return this.tasks;
    },
    saveTasks() {
      safeSetItem(KEYS.tasks, this.tasks);
    },
    addTask(description) {
      if (!description || !description.trim()) return null;
      const task = {
        id: genId(),
        description: description.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      this.tasks.push(task);
      this.saveTasks();
      return task;
    },
    editTask(id, newDesc) {
      if (!newDesc || !newDesc.trim()) return false;
      const task = this.tasks.find(t => t.id === id);
      if (!task) return false;
      task.description = newDesc.trim();
      this.saveTasks();
      return true;
    },
    deleteTask(id) {
      const idx = this.tasks.findIndex(t => t.id === id);
      if (idx === -1) return false;
      this.tasks.splice(idx, 1);
      this.saveTasks();
      return true;
    },
    toggleTask(id) {
      const task = this.tasks.find(t => t.id === id);
      if (!task) return false;
      task.completed = !task.completed;
      this.saveTasks();
      return true;
    },
    renderTasks() {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      this.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'task-checkbox';
        cb.checked = task.completed;
        cb.setAttribute('aria-label', 'Tandai selesai');
        cb.addEventListener('change', () => {
          this.toggleTask(task.id);
          this.renderTasks();
        });

        const span = document.createElement('span');
        span.className = 'task-text' + (task.completed ? ' completed' : '');
        span.textContent = task.description;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-edit';
        editBtn.textContent = '✏️';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.addEventListener('click', () => this._startEdit(li, task));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-danger';
        delBtn.textContent = '🗑';
        delBtn.setAttribute('aria-label', 'Hapus task');
        delBtn.addEventListener('click', () => {
          this.deleteTask(task.id);
          this.renderTasks();
        });

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        li.appendChild(cb);
        li.appendChild(span);
        li.appendChild(actions);
        list.appendChild(li);
      });
    },
    _startEdit(li, task) {
      const span = li.querySelector('.task-text');
      const actions = li.querySelector('.task-actions');
      const originalText = task.description;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'task-edit-input';
      input.value = originalText;

      const saveBtn = document.createElement('button');
      saveBtn.className = 'btn btn-primary btn-sm';
      saveBtn.textContent = '✓';
      saveBtn.setAttribute('aria-label', 'Simpan edit');

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary btn-sm';
      cancelBtn.textContent = '✕';
      cancelBtn.setAttribute('aria-label', 'Batal edit');

      const save = () => {
        const val = input.value.trim();
        if (val) {
          this.editTask(task.id, val);
        }
        this.renderTasks();
      };
      const cancel = () => this.renderTasks();

      saveBtn.addEventListener('click', save);
      cancelBtn.addEventListener('click', cancel);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') cancel();
      });

      span.replaceWith(input);
      actions.innerHTML = '';
      actions.appendChild(saveBtn);
      actions.appendChild(cancelBtn);
      input.focus();
    },
    init() {
      this.loadTasks();
      this.renderTasks();

      const taskInput = document.getElementById('taskInput');
      const addBtn    = document.getElementById('addTaskBtn');

      const addTask = () => {
        const val = taskInput.value;
        if (!val.trim()) { showInputError(taskInput); return; }
        this.addTask(val);
        taskInput.value = '';
        this.renderTasks();
      };

      addBtn.addEventListener('click', addTask);
      taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    },
  };


  // ── LinksManager ───────────────────────────────────
  const LinksManager = {
    links: [],

    loadLinks() {
      this.links = safeGetItem(KEYS.links, []);
      return this.links;
    },
    saveLinks() {
      safeSetItem(KEYS.links, this.links);
    },
    addLink(name, url) {
      if (!url || !url.trim()) return null;
      let cleanUrl = url.trim();
      if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl;
      const link = {
        id: genId(),
        name: name.trim() || cleanUrl,
        url: cleanUrl,
        createdAt: Date.now(),
      };
      this.links.push(link);
      this.saveLinks();
      return link;
    },
    deleteLink(id) {
      const idx = this.links.findIndex(l => l.id === id);
      if (idx === -1) return false;
      this.links.splice(idx, 1);
      this.saveLinks();
      return true;
    },
    renderLinks() {
      const container = document.getElementById('linkList');
      container.innerHTML = '';
      this.links.forEach(link => {
        const item = document.createElement('div');
        item.className = 'link-item';

        const a = document.createElement('a');
        a.className = 'link-anchor';
        a.textContent = '🔗 ' + link.name;
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const delBtn = document.createElement('button');
        delBtn.className = 'link-delete';
        delBtn.textContent = '✕';
        delBtn.setAttribute('aria-label', 'Hapus link');
        delBtn.addEventListener('click', () => {
          this.deleteLink(link.id);
          this.renderLinks();
        });

        item.appendChild(a);
        item.appendChild(delBtn);
        container.appendChild(item);
      });
    },
    init() {
      this.loadLinks();
      this.renderLinks();

      const nameInput = document.getElementById('linkNameInput');
      const urlInput  = document.getElementById('linkUrlInput');
      const addBtn    = document.getElementById('addLinkBtn');

      const addLink = () => {
        if (!urlInput.value.trim()) { showInputError(urlInput); return; }
        this.addLink(nameInput.value, urlInput.value);
        nameInput.value = '';
        urlInput.value = '';
        this.renderLinks();
      };

      addBtn.addEventListener('click', addLink);
      urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });
    },
  };

  // ── App Init ───────────────────────────────────────
  function init() {
    ThemeManager.init();
    GreetingWidget.init();
    TimerWidget.init();
    TaskManager.init();
    LinksManager.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
