const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

// Check form-detail help
console.log('--- form-detail help ---');
const cmd = `lark-cli base +form-detail --help`;
try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// Check form-get help
console.log('\n--- form-get help ---');
const cmd2 = `lark-cli base +form-get --help`;
try {
  const result = execSync(cmd2, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// Check form-submit help
console.log('\n--- form-submit help ---');
const cmd3 = `lark-cli base +form-submit --help`;
try {
  const result = execSync(cmd3, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}
