const { execSync } = require('child_process');

// Check form-create help
console.log('--- form-create help ---');
const cmd = `lark-cli base +form-create --help`;
try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}
