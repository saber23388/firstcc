const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

const forms = [
  { tableId: 'tblCBTPo3h1dwNfL', tableName: '物品清单', formName: '易耗品新增申请' },
  { tableId: 'tblOwjNjhoJ8SrFi', tableName: '采购入库', formName: '采购入库登记' },
  { tableId: 'tbls2QL0odvDuQv0', tableName: '领用出库', formName: '领用出库登记' }
];

for (const f of forms) {
  console.log(`\n--- 创建表单: ${f.formName} (${f.tableName}) ---`);
  const cmd = `lark-cli base +form-create --base-token ${baseToken} --table-id ${f.tableId} --name "${f.formName}" --as user`;
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const data = JSON.parse(result);
    if (data.ok) {
      console.log(`✓ 成功: form_id=${data.data.form_id}`);
      console.log(`  share_token=${data.data.share_token}`);
      console.log(`  url=https://sansanfami.feishu.cn/share/base/form/${data.data.share_token}`);
    } else {
      console.log('✗ 返回:', JSON.stringify(data).slice(0, 300));
    }
  } catch (e) {
    const msg = e.stdout ? e.stdout.toString() : e.message;
    console.log('Error:', msg.slice(0, 500));
  }
}
