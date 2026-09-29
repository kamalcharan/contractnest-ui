const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');

const entry = path.join(__dirname, '../experience/eventsModel.ts');
const output = esbuild.buildSync({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  alias: { '@': path.join(__dirname, '../../../../') },
}).outputFiles[0].text;
const box = { exports: {} };
vm.runInNewContext(output, { module: box, exports: box.exports, require, Date, Map, Set, Math, Number, Object, Array, JSON });
const { eventPreview } = box.exports;

test('a fixed one-year template produces its service and payment schedule without money re-entry', () => {
  const scope = 'coverage-hvac';
  const selectedBlocks = [
    { id: 'terms', name: 'Terms & Conditions', categoryId: 'text', description: 'Agreed terms', quantity: 1, price: 0, totalPrice: 0, currency: 'INR', cycle: 'prepaid', config: { autoIncluded: true, content: 'Agreed terms' } },
    { id: `ahu__${scope}`, name: 'Air Handling Unit Servicing', categoryId: 'service', coverageTypeId: scope, coverageTypeName: 'HVAC System', quantity: 20, serviceCycleDays: 10, price: 1000, totalPrice: 20000, currency: 'INR', cycle: 'prepaid', config: {} },
    { id: `filter__${scope}`, name: 'Air Filter Inspection & Replacement', categoryId: 'service', coverageTypeId: scope, coverageTypeName: 'HVAC System', quantity: 1, serviceCycleDays: 30, customCycleDays: 30, price: 600, totalPrice: 600, currency: 'INR', cycle: 'custom', config: {} },
    { id: `blower__${scope}`, name: 'Blower & Fan Maintenance', categoryId: 'service', coverageTypeId: scope, coverageTypeName: 'HVAC System', quantity: 1, price: 0, totalPrice: 0, currency: 'INR', cycle: 'prepaid', config: { complimentary: true } },
  ];
  const state = {
    startDate: new Date(2026, 8, 29), durationValue: 1, durationUnit: 'years', currency: 'INR',
    selectedBlocks, coverageTypes: [{ id: scope, resource_name: 'HVAC System', unit_count: 1 }],
    billingCycleType: 'mixed', paymentMode: 'defined',
    perBlockPaymentType: { [`filter__${scope}`]: 'prepaid' },
    discountType: null, discountValue: 0, discountTotal: 0,
    baseSubtotal: 20600, taxTotal: 0, grandTotal: 20600, eventOverrides: {},
  };
  const preview = eventPreview(state);
  assert.deepEqual(Array.from(preview.errors), []);
  assert.equal(preview.events.filter(event => event.event_type === 'service').length, 22);
  assert.equal(preview.events.filter(event => event.event_type === 'billing').reduce((sum, event) => sum + event.amount, 0), 20600);
});
