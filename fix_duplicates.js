const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';
const tableId = 'tblCBTPo3h1dwNfL';

// Get all records
const allRows = [];
const allRecordIds = [];
let fieldNames = null;

for (let offset = 0; offset < 250; offset += 200) {
  const cmd = `lark-cli base +record-list --base-token ${baseToken} --table-id ${tableId} --as user --limit 200 --offset ${offset} --format json`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok && data.data) {
      if (!fieldNames) fieldNames = data.data.fields;
      allRows.push(...data.data.data);
      allRecordIds.push(...data.data.record_id_list);
      if (!data.data.has_more) break;
    }
  } catch (e) {
    break;
  }
}

const nameIdx = fieldNames.indexOf('物品名称');
const specIdx = fieldNames.indexOf('规格型号');

// Find duplicates
const nameCount = {};
const nameRecords = {};

allRows.forEach((row, idx) => {
  const name = row[nameIdx];
  if (!name) return;
  if (!nameCount[name]) {
    nameCount[name] = 0;
    nameRecords[name] = [];
  }
  nameCount[name]++;
  nameRecords[name].push({
    recordId: allRecordIds[idx],
    name: name,
    spec: row[specIdx] || ''
  });
});

const duplicates = Object.entries(nameCount).filter(([_, count]) => count > 1);

console.log(`Total: ${allRows.length}, Unique: ${Object.keys(nameCount).length}, Duplicates: ${duplicates.length}`);

// Fix duplicates using record-upsert
const fs = require('fs');
let successCount = 0;
let failCount = 0;

for (const [name, count] of duplicates) {
  const records = nameRecords[name];
  
  for (const r of records) {
    if (!r.spec) continue;
    
    const newName = `${name}(${r.spec})`;
    const payload = {
      _record_id: r.recordId,
      fields: {
        '物品名称': newName
      }
    };
    
    const payloadFile = `fix_${r.recordId}.json`;
    fs.writeFileSync(payloadFile, JSON.stringify(payload), 'utf8');
    
    const cmd = `lark-cli base +record-upsert --base-token ${baseToken} --table-id ${tableId} --record-id ${r.recordId} --json @${payloadFile} --as user`;
    try {
      const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
      const data = JSON.parse(result);
      if (data.ok) {
        successCount++;
      } else {
        failCount++;
        if (failCount <= 3) console.log(`  ✗ ${r.recordId}: ${JSON.stringify(data).slice(0, 150)}`);
      }
    } catch (e) {
      failCount++;
      if (failCount <= 3) console.log(`  ✗ ${r.recordId}: ${e.message.slice(0, 100)}`);
    }
  }
}

console.log(`\n完成：成功 ${successCount}, 失败 ${failCount}`);
