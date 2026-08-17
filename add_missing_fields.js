const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL'; // 物品清单表

const fields = [
  { file: 'field_buyer.json', label: '购买人' },
  { file: 'field_buy_time.json', label: '购买时间' }
];

for (const f of fields) {
  console.log(`\n--- 添加字段: ${f.label} ---`);
  const cmd = `lark-cli base +field-create --base-token ${baseToken} --table-id ${tableId} --json @${f.file} --as user`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok) {
      console.log(`✓ 成功: ${data.data.field.name} (id: ${data.data.field.id})`);
    } else {
      console.log('返回:', JSON.stringify(data).slice(0, 500));
    }
  } catch (e) {
    const msg = e.stdout ? e.stdout.toString() : e.message;
    console.log('Error:', msg.slice(0, 500));
  }
}
