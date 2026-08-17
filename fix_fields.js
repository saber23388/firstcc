const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

// Step 1: Delete old 当前库存 field (number type, id: fldM9Sbde7)
console.log('--- Step 1: 删除旧"当前库存"字段 ---');
const deleteCmd = `lark-cli base +field-delete --base-token ${baseToken} --table-id ${tableId} --field-id fldM9Sbde7 --as user --yes`;
try {
  const result = execSync(deleteCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 已删除旧字段');
  } else {
    console.log('✗ 返回:', JSON.stringify(data).slice(0, 300));
  }
} catch (e) {
  const msg = e.stdout ? e.stdout.toString() : e.message;
  console.log('✗ Error:', msg.slice(0, 300));
}

// Step 2: Create lookup fields
console.log('\n--- Step 2: 创建 lookup 字段 ---');
const lookupFields = [
  { file: 'field_lookup_inbound.json', label: '入库总量' },
  { file: 'field_lookup_outbound.json', label: '出库总量' }
];

for (const f of lookupFields) {
  console.log(`\n添加: ${f.label}`);
  const cmd = `lark-cli base +field-create --base-token ${baseToken} --table-id ${tableId} --json @${f.file} --i-have-read-guide --as user`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok) {
      console.log(`✓ 成功: ${data.data.field.name} (id: ${data.data.field.id})`);
    } else {
      console.log('✗ 返回:', JSON.stringify(data).slice(0, 500));
    }
  } catch (e) {
    const msg = e.stdout ? e.stdout.toString() : e.message;
    console.log('✗ Error:', msg.slice(0, 500));
  }
}

// Step 3: Create formula 当前库存
console.log('\n--- Step 3: 创建公式"当前库存" ---');
const formulaCmd = `lark-cli base +field-create --base-token ${baseToken} --table-id ${tableId} --json @field_formula_stock.json --i-have-read-guide --as user`;
try {
  const result = execSync(formulaCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log(`✓ 成功: ${data.data.field.name} (id: ${data.data.field.id})`);
  } else {
    console.log('✗ 返回:', JSON.stringify(data).slice(0, 500));
  }
} catch (e) {
  const msg = e.stdout ? e.stdout.toString() : e.message;
  console.log('✗ Error:', msg.slice(0, 500));
}
