const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

const tables = [
  { id: 'tblCBTPo3h1dwNfL', name: '物品清单' },
  { id: 'tblOwjNjhoJ8SrFi', name: '采购入库' },
  { id: 'tbls2QL0odvDuQv0', name: '领用出库' }
];

for (const t of tables) {
  console.log(`\n--- ${t.name} (${t.id}) ---`);
  const cmd = `lark-cli base +form-list --base-token ${baseToken} --table-id ${t.id} --as user --format json`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok && data.data && data.data.forms) {
      data.data.forms.forEach(f => {
        console.log(`  表单: ${f.name}`);
        console.log(`  form_id: ${f.form_id}`);
        console.log(`  share_token: ${f.share_token}`);
        console.log(`  URL: https://sansanfami.feishu.cn/share/base/form/${f.share_token}`);
      });
      if (data.data.forms.length === 0) {
        console.log('  (无表单)');
      }
    } else {
      console.log('  返回:', JSON.stringify(data).slice(0, 200));
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }
}
