const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

// Update 当前库存 formula - use IFBLANK for all fields
const formulaStockPayload = {
  "type": "formula",
  "name": "当前库存",
  "expression": "IFBLANK([初始库存], 0) + IFBLANK([入库总量], 0) - IFBLANK([出库总量], 0)"
};

console.log('--- 更新 当前库存 公式 ---');
try {
  const fs = require('fs');
  fs.writeFileSync('update_formula_stock.json', JSON.stringify(formulaStockPayload), 'utf8');
  
  const cmd = `lark-cli base +field-update --base-token ${baseToken} --table-id ${tableId} --field-id fld4ofWezP --json @update_formula_stock.json --i-have-read-guide --yes --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 成功:', data.data.field.name);
    console.log('  expression:', data.data.field.expression);
  } else {
    console.log('✗ 返回:', JSON.stringify(data).slice(0, 500));
  }
} catch (e) {
  console.log('Error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout.toString().slice(0, 500));
}

// Update 库存金额 formula - reference current 当前库存 field
const formulaValuePayload = {
  "type": "formula",
  "name": "库存金额",
  "expression": "[当前库存] * [单价]"
};

console.log('\n--- 更新 库存金额 公式 ---');
try {
  const fs = require('fs');
  fs.writeFileSync('update_formula_value.json', JSON.stringify(formulaValuePayload), 'utf8');
  
  const cmd = `lark-cli base +field-update --base-token ${baseToken} --table-id ${tableId} --field-id fld8f3lcWt --json @update_formula_value.json --i-have-read-guide --yes --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 成功:', data.data.field.name);
    console.log('  expression:', data.data.field.expression);
  } else {
    console.log('✗ 返回:', JSON.stringify(data).slice(0, 500));
  }
} catch (e) {
  console.log('Error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout.toString().slice(0, 500));
}
