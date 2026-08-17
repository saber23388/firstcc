import pandas as pd
import json
import subprocess
import os

os.chdir('e:/AI应用/firstcc')

df = pd.read_excel(r'C:\Users\Administrator\Desktop\休闲园易耗品明细(1).xls')

# Map Excel columns to Base fields
records = []
for idx, row in df.iterrows():
    record = {}
    
    if pd.notna(row['名称']):
        record['物品名称'] = str(row['名称']).strip()
    
    if pd.notna(row['型号']):
        record['规格型号'] = str(row['型号']).strip()
    
    if pd.notna(row['存放地址']):
        record['存放位置'] = str(row['存放地址']).strip()
    
    if pd.notna(row['金额']):
        try:
            record['单价'] = float(row['金额'])
        except:
            record['单价'] = 0
    
    records.append(record)

print(f"Total records to import: {len(records)}")

# Split into batches of 200
batches = []
for i in range(0, len(records), 200):
    batches.append(records[i:i+200])

base_token = 'L6gtbn3ncaI31bsJyOhc9akKnZd'
table_id = 'tblCBTPo3h1dwNfL'

total_created = 0

for batch_idx, batch in enumerate(batches):
    print(f"\nBatch {batch_idx + 1}: {len(batch)} records")
    
    payload = {"create_records": batch}
    payload_json = json.dumps(payload, ensure_ascii=False)
    
    with open(f'batch_{batch_idx}.json', 'w', encoding='utf-8') as f:
        f.write(payload_json)
    
    cmd = f'lark-cli base +record-batch-create --base-token {base_token} --table-id {table_id} --json @batch_{batch_idx}.json --as user'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd='e:/AI应用/firstcc')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if data.get('ok'):
                created = data.get('data', {}).get('record_id_list', [])
                total_created += len(created)
                print(f"  ✓ Created {len(created)} records")
            else:
                error_msg = data.get('error', {}).get('message', 'Unknown')
                print(f"  ✗ API Error: {error_msg}")
                print(f"  Response: {result.stdout[:300]}")
        else:
            print(f"  ✗ Command failed (exit {result.returncode})")
            print(f"  stderr: {result.stderr[:300]}")
    except Exception as e:
        print(f"  ✗ Exception: {str(e)}")

print(f"\n=== Import complete: {total_created} records created ===")
