const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

// Check form-questions-create help
console.log('--- form-questions-create help ---');
const cmd = `lark-cli base +form-questions-create --help`;
try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// Check form-questions-list for existing questions
console.log('\n--- 物品清单表单题目 ---');
const listCmd = `lark-cli base +form-questions-list --base-token ${baseToken} --table-id tblCBTPo3h1dwNfL --form-id vewe7hEJLv --as user --format json`;
try {
  const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}
