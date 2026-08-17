const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const itemTableId = 'tblCBTPo3h1dwNfL';

const cmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${itemTableId} --as user --limit 1 --format json`;

try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log('Raw response:');
  console.log(result.slice(0, 2000));
  
  const data = JSON.parse(result);
  console.log('\nParsed structure:');
  console.log('ok:', data.ok);
  console.log('data keys:', Object.keys(data.data || {}));
  
  if (data.data && data.data.records && data.data.records.length > 0) {
    const rec = data.data.records[0];
    console.log('\nFirst record keys:', Object.keys(rec));
    console.log('First record:', JSON.stringify(rec).slice(0, 500));
  }
} catch (e) {
  console.log('Error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout.toString().slice(0, 1000));
}
