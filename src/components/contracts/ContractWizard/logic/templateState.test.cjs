const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(require('node:path').join(__dirname, 'state.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleBox = { exports: {} };
vm.runInNewContext(compiled, { module: moduleBox, exports: moduleBox.exports, Date, Object });
const { createInitialWizardState, sanitizeStateForTemplate, serializeWizardState, contractStateFromTemplate } = moduleBox.exports;

function loadLogic(file) {
  const text = fs.readFileSync(require('node:path').join(__dirname, file), 'utf8');
  const javascript = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const box = { exports: {} };
  vm.runInNewContext(javascript, { module: box, exports: box.exports });
  return box.exports;
}

test('a template retains coverage requirements but never a customer or real asset', () => {
  const original = createInitialWizardState();
  original.buyerId = 'customer-1';
  original.buyerName = 'Example customer';
  original.equipmentDetails = [{ id: 'asset-1' }];
  original.coverageTypes = [{ id: 'coverage-1', resource_id: 'hvac', resource_name: 'HVAC', sub_category: '', unit_count: 3 }];
  original.selectedBlocks = [{ id: 'service-1', name: 'Maintenance' }];
  const template = sanitizeStateForTemplate(original);
  assert.equal(template.buyerId, null);
  assert.equal(template.equipmentDetails.length, 0);
  assert.equal(template.coverageTypes[0].unit_count, 3);
  assert.equal(template.selectedBlocks[0].name, 'Maintenance');
});

test('using a template creates a new editable draft with no customer-specific details', () => {
  const original = createInitialWizardState();
  original.contractName = 'HVAC care';
  original.buyerId = 'customer-1';
  original.coverageTypes = [{ id: 'coverage-1', resource_id: 'hvac', resource_name: 'HVAC', sub_category: '', unit_count: 3 }];
  const saved = serializeWizardState(sanitizeStateForTemplate(original));
  const draft = contractStateFromTemplate(saved, 'template-1');
  assert.equal(draft.path, 'template');
  assert.equal(draft.templateId, 'template-1');
  assert.equal(draft.buyerId, null);
  assert.equal(draft.status, 'draft');
  assert.equal(Number.isNaN(draft.startDate.getTime()), true);
  assert.equal(draft.coverageTypes[0].unit_count, 3);
  draft.coverageTypes[0].unit_count = 8;
  assert.equal(saved.coverageTypes[0].unit_count, 3);
});

test('template authoring includes coverage for equipment and skips it for service-only work', () => {
  const { TEMPLATE_STEPS } = loadLogic('stepConfig.ts');
  const { shouldSkipAssetStepFor } = loadLogic('gating.ts');
  assert.equal(TEMPLATE_STEPS.some(step => step.id === 'assetSelection'), true);
  assert.equal(shouldSkipAssetStepFor({ nomenclatureGroup: 'equipment_maintenance' }, { isRfqMode: false, isTemplateMode: true }), false);
  assert.equal(shouldSkipAssetStepFor({ nomenclatureGroup: 'service_delivery' }, { isRfqMode: false, isTemplateMode: true }), true);
});
