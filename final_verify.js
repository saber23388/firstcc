const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const itemTableId = 'tblCBTPo3h1dwNfL';

console.log('========================================');
console.log(' 易耗品进销存系统 - 最终结构验证');
console.log('========================================');

// 1. List all tables
console.log('\n--- 1. 所有表 ---');
const listCmd = `lark-cli base +table-list --base-token ${baseToken} --as user`;
try {
  const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  data.data.tables.forEach(t => console.log(`  ${t.name} (${t.id})`));
} catch (e) {
  console.log('Error:', e.message);
}

// 2. Item table fields
console.log('\n--- 2. 物品清单字段 ---');
const fieldCmd = `lark-cli base +field-list --base-token ${baseToken} --table-id ${itemTableId} --as user --format json`;
try {
  const result = execSync(fieldCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  data.data.fields.forEach(f => {
    let extra = '';
    if (f.type === 'lookup') extra = ` [from:${f.from}, select:${f.select}, agg:${f.aggregate}]`;
    if (f.type === 'formula') extra = ` [=${(f.expression || '').slice(0, 60)}...]`;
    if (f.type === 'link') extra = ` → ${f.link_table}`;
    console.log(`  [${f.type}] ${f.name}${extra}`);
  });
} catch (e) {
  console.log('Error:', e.message);
}

// 3. Record counts
console.log('\n--- 3. 各表记录数 ---');
const tables = [
  { id: 'tblCBTPo3h1dwNfL', name: '物品清单' },
  { id: 'tblOwjNjhoJ8SrFi', name: '采购入库' },
  { id: 'tbls2QL0odvDuQv0', name: '领用出库' },
  { id: 'tbl6BW6KDRw5PRLw', name: '库存汇总' }
];

for (const t of tables) {
  const cmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${t.id} --as user --limit 1 --format json`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    const count = data.data?.total || 0;
    console.log(`  ${t.name}: ${count} 条`);
  } catch (e) {
    console.log(`  ${t.name}: 错误`);
  }
}

// 4. Show a few records with computed values
console.log('\n--- 4. 物品清单示例记录（含计算字段）---');
const recCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${itemTableId} --as user --limit 5`;
try {
  const result = execSync(recCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// 5. Show purchase records
console.log('\n--- 5. 采购入库示例 ---');
const purCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id tblOwjNjhoJ8SrFi --as user --limit 3`;
try {
  const result = execSync(purCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// 6. Show outbound records
console.log('\n--- 6. 领用出库示例 ---');
const outCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id tbls2QL0odvDuQv0 --as user --limit 3`;
try {
  const result = execSync(outCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

console.log('\n========================================');
console.log(' 验证完成！');
console.log('========================================');
