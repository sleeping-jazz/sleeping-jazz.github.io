// script.js
// Makes the tabs, the explorer and the links on the page switch between "files".
// Everything else (look, layout) lives in style.css.

// One entry per file. `path` feeds the breadcrumb, `lang` feeds the status bar.
const files = {
    readme:       { path: ['portfolio', 'README.md'],                  lang: 'Markdown' },
    skills:       { path: ['portfolio', 'skills.json'],                lang: 'JSON' },
    sos:          { path: ['portfolio', 'projects', 'sos_app.dart'],   lang: 'Dart' },
    gmail:        { path: ['portfolio', 'projects', 'gmail_assistant.py'], lang: 'Python' },
    music:        { path: ['portfolio', 'projects', 'music_player.cpp'],   lang: 'C++' },
    experience:   { path: ['portfolio', 'experience.md'],              lang: 'Markdown' },
    leadership:   { path: ['portfolio', 'leadership.md'],              lang: 'Markdown' },
    achievements: { path: ['portfolio', 'achievements.md'],            lang: 'Markdown' },
    contact:      { path: ['portfolio', 'contact.md'],                 lang: 'Markdown' },
};

const panels    = document.querySelectorAll('.section-part');
const tabs      = document.querySelectorAll('.tab');
const treeFiles = document.querySelectorAll('.tree-file');
const crumb     = document.getElementById('crumb');
const langLabel = document.getElementById('sb-lang');
const editor    = document.querySelector('.editor');

// Show one file and update everything that depends on which file is open.
function openFile(id, updateHistory = true) {
    if (!files[id]) id = 'readme';

    panels.forEach(panel => {
        panel.hidden = panel.id !== 'file-' + id;
    });

    tabs.forEach(tab => {
        const isOpen = tab.dataset.open === id;
        tab.setAttribute('aria-selected', String(isOpen));
        tab.tabIndex = isOpen ? 0 : -1;
        if (isOpen) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });

    treeFiles.forEach(button => {
        button.classList.toggle('is-active', button.dataset.open === id);
    });

    crumb.textContent = files[id].path.join('  ›  ');
    langLabel.textContent = files[id].lang;
    editor.scrollTop = 0;

    // Put the file in the URL (#sos) so a link can point straight at a project.
    if (updateHistory && location.hash !== '#' + id) {
        history.pushState(null, '', '#' + id);
    }
}

// One click handler for everything with a data-open attribute:
// tabs, explorer files, the project rows and the inline links.
document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open]');
    if (trigger) openFile(trigger.dataset.open);

    const folder = event.target.closest('.tree-folder');
    if (folder) {
        const isOpen = folder.getAttribute('aria-expanded') === 'true';
        folder.setAttribute('aria-expanded', String(!isOpen));
    }
});

// Left and right arrow keys move between tabs.
document.querySelector('.tabs').addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const list = [...tabs];
    const current = list.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = list[(current + step + list.length) % list.length];
    openFile(next.dataset.open);
    next.focus();
});

// The browser's back and forward buttons move between files too.
window.addEventListener('popstate', () => openFile(location.hash.slice(1), false));

// On load, open the file named in the URL, or README.md.
openFile(location.hash.slice(1) || 'readme', false);
