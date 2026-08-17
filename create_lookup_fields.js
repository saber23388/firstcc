const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

const fields = [
  { file: 'field_lookup_inbound.json', label: '入库总量' },
  { file: 'field_lookup_outbound.json', label: '出库总量' },
  { file: 'field_formula_stock.json', label: '当前库存(公式)' }
];

for (const f of fields) {
  console.log(`\n--- 添加字段: ${f.label} ---`);
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
