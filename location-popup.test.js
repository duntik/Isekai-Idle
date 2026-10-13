'use strict';
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const E = require('./engine.js');

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
    Date,
    Blob,
    URL,
    setTimeout: () => 0,
    clearTimeout() {},
    setInterval: () => 0,
    confirm: () => true
  });

  for (const path of [
    'npc-memory.js',
    'causal-events.js',
    'event-generator.js',
    'i18n.js',
    'i18n-story.js',
    'i18n-ui.js',
    'chapter-one-locale.js',
    'game.js'
  ]) {
    vm.runInContext(fs.readFileSync(path, 'utf8'), context);
  }

  return { context, element, handlers, storage };
}

// 1. Setup a state where Forest has rich information:
// - Visited
// - Encounter completed & Herbalist Lin met
// - Herbs gathered
// - Surveyed twice (trail discovered)
const s = E.fresh();
s.storyStep = 1;
s.world.visits.forest = 1;
s.world.location = 'forest';
s.world.encounter = { location: 'forest', index: 0, id: 'forest:0' };
E.world.memory.recordMeeting(s, E.world.current(s));
E.action(s, 'choice', 'gather');
s.atlas.surveys.forest = 2; // shortcut trail unlocked

// Boot app in Russian
const app = boot(s, 'visual', 'ru');
app.handlers.click({ target: { closest: () => ({ dataset: { tab: 'world' }, disabled: false }) } });

const contentHTML = app.element('content').innerHTML;

// Verify location card has "Подробнее" button and teaser
assert(contentHTML.includes('data-place="forest"'));
assert(contentHTML.includes('location-details-btn'));
assert(contentHTML.includes('Подробнее'));

// Verify card does not cram full NPC text into card teaser
assert(contentHTML.includes('Лес Шепчущих Корней'));

// 2. Click "Подробнее" for forest
const detailsBtn = {
  classList: { contains: cls => cls === 'location-details-btn' },
  dataset: { place: 'forest' },
  disabled: false
};
app.handlers.click({ target: { closest: () => detailsBtn } });

// Verify dialog is open
const dialog = app.element('location-dialog');
assert.equal(dialog.open, true);
assert.equal(app.element('location-dialog-title').textContent, 'Лес Шепчущих Корней');

const bodyHTML = app.element('location-dialog-body').innerHTML;

// Verify rich sections are present in modal:
assert(bodyHTML.includes('● Ты здесь'));
assert(bodyHTML.includes('Местность и впечатления'));
assert(bodyHTML.includes('Особенность места'));
assert(bodyHTML.includes('Безопасность и разведка'));
assert(bodyHTML.includes('Тропа найдена: переход −20%'));
assert(bodyHTML.includes('Жители и наставники'));
assert(bodyHTML.includes('Линь'));
assert(bodyHTML.includes('Найденные ресурсы'));
assert(bodyHTML.includes('Травы'));
assert(bodyHTML.includes('Записанные наблюдения'));
assert(bodyHTML.includes('close-location-dialog-btn'));

// 3. Test closing dialog via close button
const closeBtn = { id: 'close-location-dialog-btn', disabled: false };
app.handlers.click({ target: { closest: () => closeBtn } });
assert.equal(dialog.open, false);

// 4. Test closing dialog via backdrop click
dialog.showModal();
assert.equal(dialog.open, true);
dialog.click({ target: dialog });
assert.equal(dialog.open, false);

// 5. Test English mode parity
const enApp = boot(s, 'visual', 'en');
enApp.handlers.click({ target: { closest: () => ({ dataset: { tab: 'world' }, disabled: false }) } });

const enContent = enApp.element('content').innerHTML;
assert(enContent.includes('Details'));
assert(!/[А-Яа-яЁё]/.test(enContent));

// Open modal in English
enApp.handlers.click({ target: { closest: () => detailsBtn } });
const enDialog = enApp.element('location-dialog');
assert.equal(enDialog.open, true);
assert.equal(enApp.element('location-dialog-title').textContent, 'Whispering Roots Forest');

const enBodyHTML = enApp.element('location-dialog-body').innerHTML;
assert(enBodyHTML.includes('Atmosphere and surroundings'));
assert(enBodyHTML.includes('Local trait'));
assert(enBodyHTML.includes('Hazards and scouting'));
assert(enBodyHTML.includes('Shortcut trail found: travel −20%'));
assert(enBodyHTML.includes('Residents and mentors'));
assert(enBodyHTML.includes('Lin'));
assert(enBodyHTML.includes('Discovered resources'));
assert(enBodyHTML.includes('Herbs'));
assert(enBodyHTML.includes('Recorded observations'));
assert(!/[А-Яа-яЁё]/.test(enBodyHTML));

console.log('PASS: location popup modal, compact cards, rich sections, backdrop close and clean bilingual rendering');
