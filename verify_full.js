const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

console.log('=== 物品清单当前字段结构 ===');
const listCmd = `lark-cli base +field-list --base-token ${baseToken} --table-id ${tableId} --as user --format json`;
try {
  const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok && data.data && data.data.fields) {
    data.data.fields.forEach(f => {
      let extra = '';
      if (f.type === 'lookup') extra = ` from ${f.from}(${f.select}) agg=${f.aggregate}`;
      if (f.type === 'formula') extra = ` = ${(f.expression || '').slice(0, 80)}`;
      console.log(`  [${f.type}] ${f.name}${extra}`);
    });
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Now check the record with linked data
console.log('\n=== 验证记录（含 lookup/formula）===');
const recordCmd = `lark-cli base +record-get --base-token ${baseToken} --table-id ${tableId} --record-id recvqhA1Elscaj --as user`;
try {
  const result = execSync(recordCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}
