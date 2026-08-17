const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

// Get table list
console.log("=== Base 表结构 ===");
const listCmd = `lark-cli base +table-list --base-token ${baseToken} --as user`;
try {
  const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024 });
  const data = JSON.parse(result);
  console.log(JSON.stringify(data, null, 2));
} catch (e) {
  console.error('Error:', e.message);
}

// Get record count for each table
console.log("\n=== 各表记录数 ===");
const tables = [
  { id: 'tblCBTPo3h1dwNfL', name: '物品清单' },
  { id: 'tblOwjNjhoJ8SrFi', name: '采购入库' },
  { id: 'tbls2QL0odvDuQv0', name: '领用出库' },
  { id: 'tbl6BW6KDRw5PRLw', name: '库存汇总' }
];

for (const t of tables) {
  const cmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${t.id} --as user --limit 1 --format json`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024 });
    const data = JSON.parse(result);
    const count = data.data?.total || 0;
    console.log(`${t.name}: ${count} 条记录`);
  } catch (e) {
    console.log(`${t.name}: Error - ${e.message}`);
  }
}
