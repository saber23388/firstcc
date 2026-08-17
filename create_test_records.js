const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const itemTableId = 'tblCBTPo3h1dwNfL';
const purchaseTableId = 'tblOwjNjhoJ8SrFi';
const outboundTableId = 'tbls2QL0odvDuQv0';

// Get a sample item record_id
const listCmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${itemTableId} --as user --limit 1 --format json`;
let itemRecordId;
let itemName;
try {
  const result = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  itemRecordId = data.data.record_id_list[0];
  itemName = data.data.data[0][0]; // first field is 物品名称
  console.log(`Using item: ${itemName} (${itemRecordId})`);
} catch (e) {
  console.log('Error getting item:', e.message);
  process.exit(1);
}

const fs = require('fs');

// Create purchase record
console.log('\n--- 创建采购入库记录 ---');
const purchasePayload = {
  create_records: [{
    "物品名称": [itemRecordId],
    "入库数量": 50,
    "入库单价": 110,
    "采购日期": "2026-07-25",
    "供应商": "测试供应商A",
    "经办人": "张三",
    "备注": "首次采购测试"
  }]
};
fs.writeFileSync('test_purchase.json', JSON.stringify(purchasePayload), 'utf8');
try {
  const cmd = `lark-cli base +record-batch-create --base-token ${baseToken} --table-id ${purchaseTableId} --json @test_purchase.json --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log(`✓ 采购记录创建成功: ${data.data.record_id_list[0]}`);
  } else {
    console.log('✗', JSON.stringify(data).slice(0, 300));
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Create outbound record
console.log('\n--- 创建领用出库记录 ---');
const outboundPayload = {
  create_records: [{
    "物品名称": [itemRecordId],
    "领用数量": 10,
    "领用日期": "2026-07-25",
    "领用人": "李四",
    "领用部门": "西餐厅",
    "备注": "日常领用测试"
  }]
};
fs.writeFileSync('test_outbound.json', JSON.stringify(outboundPayload), 'utf8');
try {
  const cmd = `lark-cli base +record-batch-create --base-token ${baseToken} --table-id ${outboundTableId} --json @test_outbound.json --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  const data = JSON.parse(result);
  if (data.ok) {
    console.log(`✓ 领用记录创建成功: ${data.data.record_id_list[0]}`);
  } else {
    console.log('✗', JSON.stringify(data).slice(0, 300));
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Verify linked records in item list
console.log('\n--- 验证物品清单关联记录 ---');
try {
  const cmd = `lark-cli base +record-get --base-token ${baseToken} --table-id ${itemTableId} --record-id ${itemRecordId} --as user`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// Verify purchase table
console.log('\n--- 验证采购入库表 ---');
try {
  const cmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${purchaseTableId} --as user --limit 3`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}

// Verify outbound table
console.log('\n--- 验证领用出库表 ---');
try {
  const cmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${outboundTableId} --as user --limit 3`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
  console.log(result);
} catch (e) {
  console.log('Error:', e.message);
}
