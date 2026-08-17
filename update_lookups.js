const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

// Update 入库总量 lookup - use link-based matching
console.log('--- 更新 入库总量 (link-based matching) ---');
try {
  const cmd = `lark-cli base +field-update --base-token ${baseToken} --table-id ${tableId} --field-id fldnmI7Bu1 --json @field_lookup_inbound.json --i-have-read-guide --yes --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 成功:', data.data.field.name);
    console.log('  where:', JSON.stringify(data.data.field.where));
  } else {
    console.log('✗', JSON.stringify(data).slice(0, 500));
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Update 出库总量 lookup - use link-based matching
console.log('\n--- 更新 出库总量 (link-based matching) ---');
try {
  const cmd = `lark-cli base +field-update --base-token ${baseToken} --table-id ${tableId} --field-id fldzyPXTyR --json @field_lookup_outbound.json --i-have-read-guide --yes --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log('✓ 成功:', data.data.field.name);
    console.log('  where:', JSON.stringify(data.data.field.where));
  } else {
    console.log('✗', JSON.stringify(data).slice(0, 500));
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Wait a moment for recalculation, then verify
console.log('\n--- 等待公式重算后验证 ---');
setTimeout(() => {
  try {
    const cmd = `lark-cli base +record-get --base-token ${baseToken} --table-id ${tableId} --record-id recvqhA1Elscaj --as user`;
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    console.log('沙拉玻璃碗(大) 记录:');
    console.log(result);
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  try {
    const cmd = `lark-cli base +record-get --base-token ${baseToken} --table-id ${tableId} --record-id recvqhA1EmOcRo --as user`;
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    console.log('\n沙拉玻璃碗(小) 记录:');
    console.log(result);
  } catch (e) {
    console.log('Error:', e.message);
  }
}, 3000);
