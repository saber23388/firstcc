const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

const tables = [
  { id: 'tblCBTPo3h1dwNfL', name: '物品清单' },
  { id: 'tblOwjNjhoJ8SrFi', name: '采购入库' },
  { id: 'tbls2QL0odvDuQv0', name: '领用出库' },
  { id: 'tbl6BW6KDRw5PRLw', name: '库存汇总' }
];

for (const t of tables) {
  console.log(`\n========== ${t.name} ==========`);
  
  // Get record count
  const countCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${t.id} --as user --limit 1 --format json`;
  try {
    const result = execSync(countCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    const total = data.data?.total || 0;
    console.log(`总记录数: ${total}`);
  } catch (e) {
    console.log(`统计错误: ${e.message}`);
  }
  
  // Get first 3 records (raw values)
  const listCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${t.id} --as user --limit 3 --format json`;
  try {
    const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok && data.data && data.data.records && data.data.records.length > 0) {
      console.log('前3条记录:');
      data.data.records.forEach((rec, idx) => {
        console.log(`  ${idx+1}. ${JSON.stringify(rec, null, 2).slice(0, 500)}`);
      });
    } else {
      console.log('  (暂无记录)');
    }
  } catch (e) {
    console.log(`读取错误: ${e.message}`);
  }
}

// Also list all fields with their types for each table
console.log('\n\n========== 字段结构详情 ==========');
for (const t of tables) {
  console.log(`\n--- ${t.name} ---`);
  const cmd = `lark-cli base +field-list --base-token ${baseToken} --table-id ${t.id} --as user --format json`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok && data.data && data.data.fields) {
      data.data.fields.forEach(f => {
        let extra = '';
        if (f.type === 'link') extra = ` → ${f.link_table}`;
        if (f.type === 'lookup') extra = ` from ${f.from} sum(${f.select})`;
        if (f.type === 'formula') extra = ` = ${(f.expression || '').slice(0, 60)}`;
        if (f.type === 'attachment') extra = ' (附件)';
        console.log(`  [${f.type}] ${f.name}${extra}`);
      });
    }
  } catch (e) {
    console.log(`错误: ${e.message}`);
  }
}
