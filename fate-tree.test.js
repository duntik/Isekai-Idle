'use strict';
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const E = require('./engine.js');
const FateTree = require('./fate-tree.js');

// 1. Core Data Model & Branches Testing
const s = E.fresh();
const seedBefore = s.world.seed;

// Default initial state
const ruBranches = FateTree.getStoryBranches(s, 'ru');
const enBranches = FateTree.getStoryBranches(s, 'en');

assert.equal(ruBranches.length, 8, '8 story branch steps in Russian');
assert.equal(enBranches.length, 8, '8 story branch steps in English');
assert.equal(s.world.seed, seedBefore, 'Branches reader never touches RNG seed');

// Step 0 Prologue choices
assert.equal(ruBranches[0].options.length, 3, '3 prologue options');
assert.equal(ruBranches[0].options[0].id, 'shoulder');
assert.equal(ruBranches[0].options[1].id, 'stones');
assert.equal(ruBranches[0].options[2].id, 'scout');

// Causality tracking: Shoulder choice
s.prologueAction = 'shoulder';
const shoulderBranches = FateTree.getStoryBranches(s, 'ru');
assert.equal(shoulderBranches[0].options[0].chosen, true);
assert.equal(shoulderBranches[0].options[1].chosen, false);
assert(shoulderBranches[0].options[0].impact.includes('Мэй'));

// Causality tracking: Stones choice
s.prologueAction = 'stones';
const stonesBranches = FateTree.getStoryBranches(s, 'ru');
assert.equal(stonesBranches[0].options[0].chosen, false);
assert.equal(stonesBranches[0].options[1].chosen, true);
assert(stonesBranches[0].options[1].impact.includes('Линь'));

// Step 2 Foundation Tempering
s.chapterOneTraining = 'body';
const bodyBranches = FateTree.getStoryBranches(s, 'ru');
assert.equal(bodyBranches[2].options[0].chosen, true);
assert(bodyBranches[2].options[0].impact.includes('Жэнь'));

// Step 6 Bridge Roadblock
s.chapterOneRoute = 'combat';
const combatBranches = FateTree.getStoryBranches(s, 'ru');
assert.equal(combatBranches[6].options[0].chosen, true);
assert(combatBranches[6].options[0].impact.includes('Белого Клыка'));

// Step 7 Sect Choice
s.world.admissionRoutes = ['invitation'];
s.world.admission = 'invitation';
const sectBranches = FateTree.getStoryBranches(s, 'ru');
assert.equal(sectBranches[7].options[2].chosen, true);
assert(sectBranches[7].options[2].impact.includes('Сутрой Злого Бога'));

// 2. Bilingual Pureness (Zero Cyrillic in English Mode)
for (const branch of enBranches) {
  for (const text of [branch.chapter, branch.title, branch.summary]) {
    assert(!/[А-Яа-яЁё]/.test(text), `Cyrillic found in branch header: ${text}`);
  }
  for (const opt of branch.options) {
    for (const text of [opt.title, opt.desc, opt.impact, opt.reward, opt.unlocked]) {
      assert(!/[А-Яа-яЁё]/.test(text), `Cyrillic found in branch option: ${text}`);
    }
  }
}

// 3. NPC Bonds & Factions
s.world.people = {
  mei: { trust: 4, memories: [{ key: 'story:mei/meeting/success', kind: 'meiHelp', stage: 0 }] },
  ren: { trust: 3, memories: [{ key: 'village:0/lesson/success', kind: 'lesson', stage: 0 }] }
};

const ruBonds = FateTree.getNpcBonds(s, 'ru');
const enBonds = FateTree.getNpcBonds(s, 'en');
assert(ruBonds.length >= 2, 'Has NPC bonds');
assert(ruBonds.some(b => b.id === 'mei' && b.deeds.length > 0), 'Mei has recorded deeds');

for (const bond of enBonds) {
  for (const text of [bond.name, bond.role, bond.relationship, bond.summary, ...bond.deeds]) {
    assert(!/[А-Яа-яЁё]/.test(text), `Cyrillic in NPC bond: ${text}`);
  }
}

const ruFactions = FateTree.getFactions(s, 'ru');
const enFactions = FateTree.getFactions(s, 'en');
assert.equal(ruFactions.length, 4, '4 factions defined');

for (const faction of enFactions) {
  for (const text of [faction.name, faction.role, faction.status, faction.desc, ...faction.deeds]) {
    assert(!/[А-Яа-яЁё]/.test(text), `Cyrillic in Faction: ${text}`);
  }
}

// 4. HTML Rendering Verification
const storyHtml = FateTree.renderTreeHtml(s, 'story', 'en');
assert(storyHtml.includes('fate-step-card'), 'Rendered story branches');
assert(!/[А-Яа-яЁё]/.test(storyHtml.replace(/<[^>]+>/g, '')), 'Zero cyrillic in story HTML');

const npcHtml = FateTree.renderTreeHtml(s, 'npc', 'en');
assert(npcHtml.includes('fate-npc-card'), 'Rendered NPC bonds');
assert(!/[А-Яа-яЁё]/.test(npcHtml.replace(/<[^>]+>/g, '')), 'Zero cyrillic in NPC HTML');

const factionsHtml = FateTree.renderTreeHtml(s, 'factions', 'en');
assert(factionsHtml.includes('fate-faction-card'), 'Rendered factions');
assert(!/[А-Яа-яЁё]/.test(factionsHtml.replace(/<[^>]+>/g, '')), 'Zero cyrillic in factions HTML');

const compactHtml = FateTree.renderCompact(s, 'en');
assert(compactHtml.includes('legacy-fate-summary-card'), 'Rendered compact summary');
assert(!/[А-Яа-яЁё]/.test(compactHtml.replace(/<[^>]+>/g, '')), 'Zero cyrillic in compact HTML');

// 5. DOM & UI Integration Test
function boot(state, view = 'visual', language = 'ru') {
  const elements = new Map(), handlers = {};
  const element = id => {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        textContent: '',
        innerHTML: '',
        style: {},
        open: false,
        showModal() { this.open = true; },
        close() { this.open = false; },
        replaceChildren() {},
        append() {},
        querySelectorAll: () => [],
        closest: selector => selector === 'button' ? this : null,
        addEventListener(t, f) { this[t] = f; }
      });
    }
    return elements.get(id);
  };
  const storage = new Map([
    ['isekai-idle-v2', JSON.stringify(state)],
    ['isekai-idle-interface', view],
    ['isekai-idle-language', language]
  ]);
  const context = vm.createContext({
    Isekai: E,
    IsekaiNames: require('./names.js'),
    IsekaiDataView: require('./data-view.js'),
    IsekaiQuotes: require('./quotes.js'),
    document: {
      documentElement: { dataset: {} },
      querySelectorAll: () => [],
      getElementById: element,
      addEventListener: (t, f) => { handlers[t] = f; },
      createElement: () => ({ append() {}, click() {} }),
      createTextNode: t => t
    },
    localStorage: {
      getItem: k => storage.get(k) || null,
      setItem: (k, v) => storage.set(k, v)
    },
    window: { addEventListener() {} },
    Date, Blob, URL,
    setTimeout: () => 0, clearTimeout() {}, setInterval() {},
    confirm: () => true
  });

  for (const path of [
    'npc-memory.js', 'causal-events.js', 'names.js', 'event-generator.js',
    'combat.js', 'fate-tree.js', 'i18n.js', 'i18n-story.js', 'i18n-ui.js',
    'chapter-one-locale.js', 'data-view.js', 'quotes.js', 'game.js'
  ]) {
    vm.runInContext(fs.readFileSync(path, 'utf8'), context);
  }
  return { context, element, handlers };
}

const app = boot(s, 'visual', 'ru');
const openBtn = app.element('open-fate-tree');
assert(openBtn, 'Header open-fate-tree button exists');

// Click open-fate-tree
openBtn.click();
const dialog = app.element('fate-tree-dialog');
assert.equal(dialog.open, true, 'Dialog opens on button click');
assert(app.element('fate-tree-body').innerHTML.includes('fate-branches-list'), 'Body renders branches');

// Switch tab to NPC bonds
app.handlers.click({
  target: {
    closest: sel => sel === 'button' ? { dataset: { fateTab: 'npc' }, disabled: false } : null
  }
});
assert(app.element('fate-tree-body').innerHTML.includes('fate-npc-grid'), 'Switched to NPC bonds');

// Switch tab to Factions
app.handlers.click({
  target: {
    closest: sel => sel === 'button' ? { dataset: { fateTab: 'factions' }, disabled: false } : null
  }
});
assert(app.element('fate-tree-body').innerHTML.includes('fate-factions-grid'), 'Switched to Factions');

// Close dialog
const closeBtn = app.element('close-fate-tree');
closeBtn.click();
assert.equal(dialog.open, false, 'Dialog closes on close button');

console.log('PASS: Fate Tree branches, karmic bonds, factions, causality tracking, seed determinism and UI integration');
