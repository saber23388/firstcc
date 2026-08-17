const { execSync } = require('child_process');

const cmd = 'lark-cli base +base-create --name "休闲园易耗品进销存管理" --table-name "物品清单" --fields @fields.json --as user --time-zone Asia/Shanghai';

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
