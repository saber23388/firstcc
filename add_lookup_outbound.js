const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tbl6BW6KDRw5PRLw';

const cmd = `lark-cli base +field-create --base-token ${baseToken} --table-id ${tableId} --json @field_lookup_outbound.json --i-have-read-guide --as user`;

try {
  const result = execSync(cmd, { 
    encoding: 'utf8', 
    maxBuffer: 10 * 1024 * 1024,
    cwd: 'e:/AI应用/firstcc'
  });
  console.log(result);
} catch (e) {
  console.error('Error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout.toString());
  if (e.stderr) console.log('stderr:', e.stderr.toString());
}
