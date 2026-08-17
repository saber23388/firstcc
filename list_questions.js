const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

const forms = [
  { tableId: 'tblCBTPo3h1dwNfL', formId: 'vewe7hEJLv', name: '易耗品新增申请' },
  { tableId: 'tblOwjNjhoJ8SrFi', formId: 'vewrP4YBj1', name: '采购入库登记' },
  { tableId: 'tbls2QL0odvDuQv0', formId: 'vewLFzOfzI', name: '领用出库登记' }
];

for (const f of forms) {
  console.log(`\n--- ${f.name} 题目列表 ---`);
  const cmd = `lark-cli base +form-questions-list --base-token ${baseToken} --table-id ${f.tableId} --form-id ${f.formId} --as user --format json`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok && data.data && data.data.questions) {
      data.data.questions.forEach(q => {
        console.log(`  ${q.question_id}: [${q.type}] ${q.title}`);
      });
      if (data.data.questions.length === 0) {
        console.log('  (无题目)');
      }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
