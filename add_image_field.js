const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL'; // 物品清单表

const cmd = `lark-cli base +field-create --base-token ${baseToken} --table-id ${tableId} --json @field_image.json --as user`;

try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 附件字段已添加:', data.data.field.name, '(id:', data.data.field.id + ')');
  } else {
    console.log('返回:', JSON.stringify(data).slice(0, 500));
  }
} catch (e) {
  const msg = e.stdout ? e.stdout.toString() : e.message;
  console.log('Error:', msg.slice(0, 500));
}
