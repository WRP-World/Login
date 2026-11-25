'use strict';

const CFG =
{
    owner: 'WRP-World',
    repo: 'Repo',
    branch: 'main',
    content: 'content.json',
    users: 'users.json',
    api: 'https://api.github.com'
};

const STORE_KEY = 'wrp.session';
const $ = (sel, root = document) => root.querySelector(sel);

const ICONS =
{
    youtube: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z',
    telegram: 'M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.1 13 1.3 11.5c-1-.3-1-1 .2-1.5L20.5 2.7c.9-.3 1.6.2 1.4 1.6z',
    paypal: 'M7.1 21.5H3.6L6.8 2.5h7.4c3.6 0 5.6 1.8 5.1 5-.6 3.9-3.3 5.7-6.9 5.7h-2.6l-1.3 8.3zm3.4-11.1h1.9c1.7 0 2.9-.8 3.2-2.6.3-1.6-.7-2.4-2.3-2.4h-1.8l-1 5z',
    mail: 'M2 5h20v14H2V5zm2 2v.5l8 5 8-5V7H4zm0 2.8V17h16V9.8l-8 5-8-5z',
    github: 'M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z',
    web: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8 8 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8 8 0 0 1 0 4h-3.4z',
    facebook: 'M14 8V6c0-.9.6-1 1-1h2.5V1H14c-3.6 0-4.5 2.7-4.5 4.4V8H7v4h2.5v11H14V12h3.2l.4-4H14z',
    x: 'M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.3-7-6.1 7H1.4l7.9-9L1 2h7l4.8 6.4L18.2 2zm-1.2 18h1.9L7.1 4H5.1L17 20z',
    chat: 'M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 1-2z',
    download: 'M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4 3.6 3.6V3zM4 19h16v2H4v-2z',
    play: 'M8 5v14l11-7z',
    arrow: 'M12 4l-1.4 1.4 5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8z'
};

const state = { token: null, content: null, blobs: new Map(), pending: new Map(), observer: null, lightbox: { list: [], index: 0 } };

/* Hilfsfunktionen */

function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
        if (c === null || c === undefined || c === false) continue;
        el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
}

function svg(name) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', ICONS[name] || ICONS.web);
    s.append(p);
    return s;
}

function safeUrl(url) {
    return /^(https?:\/\/|mailto:)/i.test(String(url || '')) ? url : null;
}

function richText(text) {
    const out = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
        out.push(text.slice(last, m.index));
        const url = safeUrl(m[2]);
        out.push(url ? h('a', { href: url, target: '_blank', rel: 'noopener' }, m[1]) : m[1]);
        last = re.lastIndex;
    }
    out.push(text.slice(last));
    return out;
}

function toast(msg, isError = false, ms = 3500) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('is-error', isError);
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { t.hidden = true; }, ms);
}

const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

/* Anmeldung */

async function userId(name) {
    const data = new TextEncoder().encode('wrp-world:' + name.trim().toLowerCase());
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Benutzerpasswort -> Schlüssel des Tresors -> Token
async function decryptToken(db, entry, password) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const userKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(entry.salt), iterations: db.iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(entry.iv) }, userKey, b64(entry.data));
    const vaultKey = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(db.vault.iv) }, vaultKey, b64(db.vault.data));
    return new TextDecoder().decode(plain);
}

function saveSession(token, keep) {
    sessionStorage.removeItem(STORE_KEY);
    localStorage.removeItem(STORE_KEY);
    (keep ? localStorage : sessionStorage).setItem(STORE_KEY, token);
}

function loadSession() {
    return sessionStorage.getItem(STORE_KEY) || localStorage.getItem(STORE_KEY);
}

function loginMessage(text, info = false) {
    const m = $('#login-msg');
    m.textContent = text;
    m.classList.toggle('is-info', info);
}

async function onLogin(ev) {
    ev.preventDefault();
    const user = $('#login-user').value;
    const pass = $('#login-pass').value;
    const btn = $('#login-btn');
    if (!user.trim() || !pass) { loginMessage('Bitte Benutzername und Passwort eingeben.'); return; }

    btn.disabled = true;
    loginMessage('Anmeldung wird geprüft …', true);
    try {
        const res = await fetch(CFG.users, { cache: 'no-store' });
        if (!res.ok) throw new Error('users');
        const db = await res.json();
        const entry = db.users && db.users[await userId(user)];
        let token = null;
        if (entry) {
            try { token = await decryptToken(db, entry, pass); }
            catch { token = null; }
        }
        if (!token) {
            $('#login-form').classList.remove('shake');
            void $('#login-form').offsetWidth;
            $('#login-form').classList.add('shake');
            loginMessage('Benutzername oder Passwort falsch.');
            return;
        }
        state.token = token;
        await loadContent();
        saveSession(token, $('#login-keep').checked);
        $('#login-pass').value = '';
        loginMessage('');
        showApp();
    }
    catch (err) {
        state.token = null;
        loginMessage(err.message === 'auth' ? 'Zugang abgelaufen. Bitte beim Admin melden.'
            : err.message === 'users' ? 'Benutzerliste nicht erreichbar.'
                : 'Verbindung fehlgeschlagen. Bitte später erneut versuchen.');
    }
    finally { btn.disabled = false; }
}

function logout(msg) {
    sessionStorage.removeItem(STORE_KEY);
    localStorage.removeItem(STORE_KEY);
    state.token = null;
    state.content = null;
    for (const url of state.blobs.values()) URL.revokeObjectURL(url);
    state.blobs.clear();
    state.pending.clear();
    $('#page').replaceChildren();
    $('#app').hidden = true;
    $('#login').hidden = false;
    document.body.classList.add('is-locked');
    history.replaceState(null, '', location.pathname);
    loginMessage(msg || '', !msg);
    $('#login-user').focus();
}

/* GitHub (privates Repo) */

async function gh(path, ref = CFG.branch) {
    const enc = path.split('/').map(encodeURIComponent).join('/');
    const url = `${CFG.api}/repos/${CFG.owner}/${CFG.repo}/contents/${enc}?ref=${encodeURIComponent(ref)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${state.token}`, Accept: 'application/vnd.github.raw+json' } });
    if (res.status === 401) throw new Error('auth');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
    return res;
}

async function loadContent() {
    const res = await gh(CFG.content);
    state.content = JSON.parse((await res.text()).replace(/^﻿/, ''));
}

function blobUrl(path, ref = CFG.branch) {
    const key = `${ref}:${path}`;
    if (state.blobs.has(key)) return Promise.resolve(state.blobs.get(key));
    if (state.pending.has(key)) return state.pending.get(key);
    const job = gh(path, ref)
        .then(r => r.blob())
        .then(b => {
            const url = URL.createObjectURL(b);
            state.blobs.set(key, url);
            return url;
        })
        .finally(() => state.pending.delete(key));
    state.pending.set(key, job);
    return job;
}

function handleError(err) {
    if (err && err.message === 'auth') { logout('Sitzung abgelaufen. Bitte neu anmelden.'); return; }
    console.warn(err);
}

function privImg(path, alt = '', cls = '') {
    const img = h('img', { alt, class: (cls + ' img-ph').trim(), 'data-path': path, decoding: 'async' });
    state.observer.observe(img);
    return img;
}

function loadImage(img) {
    blobUrl(img.dataset.path)
        .then(url => { img.src = url; img.classList.remove('img-ph'); })
        .catch(handleError);
}

async function download(path, btn, ref) {
    const label = btn.querySelector('span');
    const old = label.textContent;
    btn.disabled = true;
    label.textContent = 'Lädt …';
    try {
        const url = await blobUrl(path, ref);
        const a = h('a', { href: url, download: path.split('/').pop() });
        document.body.append(a);
        a.click();
        a.remove();
    }
    catch (err) {
        if (err.message === 'auth') handleError(err);
        else toast('Download fehlgeschlagen. Datei nicht gefunden.', true);
    }
    finally {
        btn.disabled = false;
        label.textContent = old;
    }
}

/* Bausteine */

function linkRow(links = []) {
    return links.filter(l => safeUrl(l.url)).map(l => l.icon
        ? h('a', { class: 'ico', href: l.url, target: '_blank', rel: 'noopener', title: l.label, 'aria-label': l.label }, svg(l.icon))
        : h('a', { class: 'txt', href: l.url, target: '_blank', rel: 'noopener' }, l.label));
}

function heading(title, text, center = true) {
    return [
        title ? h('h2', { class: center ? 'center' : '' }, title) : null,
        title ? h('div', { class: 'rule' }) : null,
        text ? h('p', { class: center ? 'lead center' : 'lead' }, text) : null
    ];
}

const blocks =
{
    intro(b) {
        return h('section', { class: 'block' }, h('div', { class: 'wrap' }, heading(b.title), (b.text || []).map(t => h('p', { class: 'lead center' }, richText(t)))));
    },

    cards(b) {
        const isIcon = b.style === 'icon';
        const items = (b.items || []).map(it => isIcon
            ? h('article', { class: 'card card--icon' },
                h('div', { class: 'card__icon' }, privImg(it.image, '')),
                h('div', { class: 'card__body' }, h('h3', {}, it.title), h('p', {}, it.text)))
            : h('article', { class: 'card card--poster' },
                h('div', { class: 'card__media' }, privImg(it.image, it.title)),
                h('div', { class: 'card__body' },
                    it.kicker ? h('span', { class: 'card__kicker' }, it.kicker) : null,
                    h('h3', {}, it.title), h('p', {}, it.text),
                    h('div', { class: 'card__links' }, linkRow(it.links)))));
        return h('section', { class: 'block' }, h('div', { class: 'wrap' }, heading(b.title), h('div', { class: 'grid' }, items)));
    },

    steps(b, page) {
        const items = (b.items || []).map(it => {
            const inner = [privImg(it.image, ''), h('h3', {}, it.title), h('p', {}, it.text)];
            return it.target ? h('a', { class: 'step', href: `#/${page.id}/${it.target}` }, inner) : h('div', { class: 'step' }, inner);
        });
        return h('section', { class: 'block' }, h('div', { class: 'wrap' }, heading(b.title), h('div', { class: 'steps' }, items)));
    },

    feature(b) {
        const gallery = b.gallery && b.gallery.length
            ? h('div', { class: 'gallery' }, b.gallery.map((g, i) =>
                h('button', { class: 'thumb', type: 'button', onclick: () => openLightbox(b.gallery, i) },
                    privImg(g.image, g.caption || ''), g.caption ? h('span', {}, g.caption) : null)))
            : null;
        return h('section', { class: 'block', id: b.id },
            h('div', { class: 'wrap' },
                h('div', { class: 'feature__head' },
                    b.image ? privImg(b.image, '', 'feature__img') : h('div'),
                    h('div', {},
                        h('h2', {}, b.title), h('div', { class: 'rule' }),
                        b.subtitle ? h('p', { class: 'feature__sub' }, b.subtitle) : null,
                        h('div', { class: 'social', style: 'justify-content:flex-start' }, linkRow(b.links)))),
                b.text && b.text.length ? h('div', { class: 'feature__text' }, b.text.map(t => h('p', {}, richText(t)))) : null,
                gallery));
    },

    videos(b) {
        const items = (b.items || []).map(v => {
            const screen = h('div', { class: 'video__screen' }, privImg(v.poster, v.title));
            const play = h('button', { class: 'video__play', type: 'button', 'aria-label': `${v.title} abspielen` }, svg('play'));
            play.addEventListener('click', async () => {
                play.disabled = true;
                try {
                    const url = await blobUrl(v.video);
                    const video = h('video', { src: url, controls: true, autoplay: true, playsinline: true });
                    screen.replaceChildren(video);
                }
                catch (err) {
                    play.disabled = false;
                    if (err.message === 'auth') handleError(err);
                    else toast('Video konnte nicht geladen werden.', true);
                }
            });
            screen.append(play);
            const dl = h('button', { class: 'icon-btn', type: 'button' }, svg('download'), h('span', {}, 'MP4'));
            dl.addEventListener('click', () => download(v.video, dl));
            return h('article', { class: 'video' }, screen, h('h3', {}, v.title), h('div', { class: 'video__bar' }, h('small', {}, v.video.split('/').pop()), dl));
        });
        return h('section', { class: 'block' }, h('div', { class: 'wrap' }, heading(b.title), h('div', { class: 'videos' }, items)));
    },

    downloads(b) {
        const items = (b.items || []).map(it => {
            const d = it.download || {};
            let action = null;
            if (d.file) {
                action = h('button', { class: 'btn', type: 'button' }, svg('download'), h('span', {}, d.label || 'Download'));
                action.addEventListener('click', () => download(d.file, action, d.branch));
            }
            else if (d.page) {
                action = h('a', { class: 'btn btn--cyan', href: `#/${d.page}${d.target ? '/' + d.target : ''}` }, svg('arrow'), h('span', {}, d.label || 'Öffnen'));
            }
            else if (safeUrl(d.url)) {
                action = h('a', { class: 'btn btn--cyan', href: d.url, target: '_blank', rel: 'noopener' }, svg('download'), h('span', {}, d.label || 'Download'));
            }
            return h('article', { class: 'card dl' },
                h('div', { class: 'card__media' }, privImg(it.image, it.title)),
                h('div', { class: 'card__body' }, h('h3', {}, it.title), h('p', {}, it.text), h('div', { class: 'card__links' }, linkRow(it.links)), action));
        });
        return h('section', { class: 'block' }, h('div', { class: 'wrap' }, heading(b.title), h('div', { class: 'grid' }, items)));
    },

    cta(b) {
        return h('section', { class: 'block cta' }, h('div', { class: 'wrap' }, heading(b.title, b.text), h('div', { class: 'social' }, linkRow(b.links))));
    }
};

/* Seiten und Navigation */

function renderNav(current) {
    const nav = $('#nav');
    nav.replaceChildren(...state.content.pages.map(p =>
        h('a', { href: `#/${p.id}`, class: p.id === current ? 'is-active' : '', 'aria-current': p.id === current ? 'page' : null }, p.title)));
}

function renderFooter() {
    const s = state.content.site || {};
    $('#footer-social').replaceChildren(...linkRow(s.social));
    $('#footer-copy').textContent = s.copyright || '';
}

function route() {
    if (!state.content) return;
    const [, pid, target] = location.hash.split('/');
    const pages = state.content.pages;
    const page = pages.find(p => p.id === pid) || pages[0];
    const main = $('#page');

    if (main.dataset.page !== page.id) {
        state.observer.disconnect();
        const hero = page.hero
            ? h('section', { class: 'hero' }, h('div', {}, h('h1', {}, page.hero.title), page.hero.text ? h('p', {}, page.hero.text) : null))
            : null;
        main.replaceChildren(hero, ...(page.blocks || []).map(b => blocks[b.type] ? blocks[b.type](b, page) : null));
        main.dataset.page = page.id;
        document.title = `${page.title} · White Rabbit Lounge`;
        renderNav(page.id);
        if (!target) window.scrollTo(0, 0);
    }
    closeNav();
    if (target) {
        const el = document.getElementById(target);
        if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
    }
}

function showApp() {
    $('#login').hidden = true;
    $('#app').hidden = false;
    document.body.classList.remove('is-locked');
    renderFooter();
    $('#page').dataset.page = '';
    route();
}

function closeNav() {
    $('#nav').classList.remove('is-open');
    $('#nav-toggle').setAttribute('aria-expanded', 'false');
}

/* Lightbox */

function openLightbox(list, index) {
    state.lightbox = { list, index };
    showLightbox();
    $('#lightbox').hidden = false;
}

function showLightbox() {
    const { list, index } = state.lightbox;
    const item = list[index];
    const img = $('#lightbox img');
    img.removeAttribute('src');
    img.alt = item.caption || '';
    $('#lightbox figcaption').textContent = item.caption || '';
    blobUrl(item.image).then(url => { img.src = url; }).catch(handleError);
    const multi = list.length > 1;
    $('.lightbox__nav--prev').hidden = !multi;
    $('.lightbox__nav--next').hidden = !multi;
}

function stepLightbox(dir) {
    const lb = state.lightbox;
    lb.index = (lb.index + dir + lb.list.length) % lb.list.length;
    showLightbox();
}

/* Start */

function init() {
    state.observer = new IntersectionObserver(entries => {
        for (const e of entries) {
            if (!e.isIntersecting) continue;
            state.observer.unobserve(e.target);
            loadImage(e.target);
        }
    }, { rootMargin: '300px' });

    $('#login-form').addEventListener('submit', onLogin);
    $('#logout').addEventListener('click', () => logout());
    $('#nav-toggle').addEventListener('click', () => {
        const open = $('#nav').classList.toggle('is-open');
        $('#nav-toggle').setAttribute('aria-expanded', String(open));
    });
    window.addEventListener('hashchange', route);

    const lb = $('#lightbox');
    lb.addEventListener('click', e => { if (e.target === lb) lb.hidden = true; });
    $('.lightbox__close').addEventListener('click', () => { lb.hidden = true; });
    $('.lightbox__nav--prev').addEventListener('click', () => stepLightbox(-1));
    $('.lightbox__nav--next').addEventListener('click', () => stepLightbox(1));
    document.addEventListener('keydown', e => {
        if (lb.hidden) return;
        if (e.key === 'Escape') lb.hidden = true;
        else if (e.key === 'ArrowLeft') stepLightbox(-1);
        else if (e.key === 'ArrowRight') stepLightbox(1);
    });

    const token = loadSession();
    if (!token) { $('#login-user').focus(); return; }
    state.token = token;
    loginMessage('Sitzung wird geladen …', true);
    loadContent()
        .then(() => { loginMessage(''); showApp(); })
        .catch(err => logout(err.message === 'auth' ? 'Sitzung abgelaufen. Bitte neu anmelden.' : 'Verbindung fehlgeschlagen. Bitte erneut anmelden.'));
}

init();