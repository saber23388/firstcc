const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

// Test with 1 record, matching actual field names
const payload = {
  create_records: [
    {
      "物品名称": "测试易耗品-沙拉碗",
      "规格型号": "大号",
      "存放位置": "西餐厅",
      "单价": 110,
      "购买人": "夏信侠",
      "分类": ["厨房用品"],
      "单位": ["个"],
      "备注": "测试记录"
    }
  ]
};

const fs = require('fs');
fs.writeFileSync('test_payload.json', JSON.stringify(payload, null, 2), 'utf8');

const cmd = `lark-cli base +record-batch-create --base-token ${baseToken} --table-id ${tableId} --json @test_payload.json --as user`;

try {
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.error('Error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout.toString());
  if (e.stderr) console.log('stderr:', e.stderr.toString());
}
