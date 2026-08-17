const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

// Verify the record with updated formulas
const recordCmd = `lark-cli base +record-get --base-token ${baseToken} --table-id ${tableId} --record-id recvqhA1Elscaj --as user`;
try {
  const result = execSync(recordCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log('=== 验证记录（公式应已计算）===');
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// Also check a record without linked data (to verify formula handles blank gracefully)
console.log('\n=== 验证另一条记录（无关联数据，公式应为 0）===');
const listCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${tableId} --as user --limit 2 --format json`;
try {
  const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok && data.data && data.data.record_id_list) {
    const secondRecordId = data.data.record_id_list[1]; // second record
    const cmd2 = `lark-cli base +record-get --base-token ${baseToken} --table-id ${tableId} --record-id ${secondRecordId} --as user`;
    const result2 = execSync(cmd2, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    console.log(result2);
  }
} catch (e) {
  console.log('Error:', e.message);
}
