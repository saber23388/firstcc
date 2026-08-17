const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

// Get raw response for form-list
const cmd = `lark-cli base +form-list --base-token ${baseToken} --table-id tblCBTPo3h1dwNfL --as user`;
try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log('Raw response:');
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}
