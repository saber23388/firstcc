const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

const tables = [
  { id: 'tblCBTPo3h1dwNfL', name: '物品清单' },
  { id: 'tblOwjNjhoJ8SrFi', name: '采购入库' },
  { id: 'tbls2QL0odvDuQv0', name: '领用出库' },
  { id: 'tbl6BW6KDRw5PRLw', name: '库存汇总' }
];

for (const t of tables) {
  console.log(`\n========== ${t.name} (${t.id}) ==========`);
  const cmd = `lark-cli base +field-list --base-token ${baseToken} --table-id ${t.id} --as user`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok && data.data && data.data.fields) {
      console.log('字段列表:');
      data.data.fields.forEach(f => {
        console.log(`  - ${f.name} (type: ${f.type}, id: ${f.id})`);
      });
      console.log(`总计: ${data.data.total} 个字段`);
    } else {
      console.log('返回:', JSON.stringify(data).slice(0, 500));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
