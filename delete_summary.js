const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

// Step 1: Delete 库存汇总表
console.log('--- 删除库存汇总表 ---');
const deleteCmd = `lark-cli base +table-delete --base-token ${baseToken} --table-id tbl6BW6KDRw5PRLw --as user --yes`;
try {
  const result = execSync(deleteCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 库存汇总表已删除');
  } else {
    console.log('✗ 返回:', JSON.stringify(data).slice(0, 300));
  }
} catch (e) {
  const msg = e.stdout ? e.stdout.toString() : e.message;
  if (msg.includes('"ok":true')) {
    console.log('✓ 库存汇总表已删除');
  } else {
    console.log('Error:', msg.slice(0, 300));
  }
}
