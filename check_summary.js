const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const summaryTableId = 'tbl6BW6KDRw5PRLw';

console.log('=== 库存汇总表字段详情 ===');
const cmd = `lark-cli base +field-list --base-token ${baseToken} --table-id ${summaryTableId} --as user --format json`;
try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok && data.data && data.data.fields) {
    data.data.fields.forEach(f => {
      console.log(`\n字段: ${f.name}`);
      console.log(`  类型: ${f.type}`);
      console.log(`  ID: ${f.id}`);
      if (f.type === 'lookup') {
        console.log(`  from: ${f.from}`);
        console.log(`  select: ${f.select}`);
        console.log(`  aggregate: ${f.aggregate}`);
        console.log(`  where: ${JSON.stringify(f.where, null, 2)}`);
      }
      if (f.type === 'formula') {
        console.log(`  expression: ${f.expression}`);
      }
      if (f.type === 'link') {
        console.log(`  link_table: ${f.link_table}`);
      }
    });
  }
} catch (e) {
  console.log('Error:', e.message);
}
