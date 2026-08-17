const { execSync } = require('child_process');

const baseToken = 'L6gtbn3ncaI31bsJyOhc9akKnZd';

const forms = [
  { tableId: 'tblCBTPo3h1dwNfL', name: '易耗品新增申请' },
  { tableId: 'tblOwjNjhoJ8SrFi', name: '采购入库登记' },
  { tableId: 'tbls2QL0odvDuQv0', name: '领用出库登记' }
];

for (const f of forms) {
  console.log(`\n--- ${f.name} ---`);
  
  // Get form list to find the form id
  const listCmd = `lark-cli base +form-list --base-token ${baseToken} --table-id ${f.tableId} --as user --format json`;
  try {
    const listResult = execSync(listCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
    const listData = JSON.parse(listResult);
    
    if (listData.ok && listData.data.forms.length > 0) {
      const formId = listData.data.forms[0].id;
      console.log(`form_id: ${formId}`);
      
      // Get form detail
      const getCmd = `lark-cli base +form-get --base-token ${baseToken} --table-id ${f.tableId} --form-id ${formId} --as user --format json`;
      const getResult = execSync(getCmd, { encoding: 'utf8', maxBuffer: 10*1024*1024, cwd: 'e:/AI应用/firstcc' });
      const getData = JSON.parse(getResult);
      
      if (getData.ok) {
        console.log('详情:');
        console.log(JSON.stringify(getData.data, null, 2).slice(0, 1000));
      }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
