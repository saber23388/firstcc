import json
import subprocess
import os

os.chdir('e:/AI应用/firstcc')

with open('records.json', 'r', encoding='utf-8') as f:
    records = json.load(f)

# Convert to batch create format
create_records = []
for r in records:
    record = {}
    for k, v in r.items():
        if v:
            record[k] = v
    create_records.append(record)

# Split into batches of 200
batches = []
for i in range(0, len(create_records), 200):
    batch = create_records[i:i+200]
    batches.append(batch)

print(f"Total records: {len(create_records)}")
print(f"Number of batches: {len(batches)}")

base_token = 'L6gtbn3ncaI31bsJyOhc9akKnZd'
table_id = 'tblCBTPo3h1dwNfL'  # 物品清单表

for idx, batch in enumerate(batches):
    print(f"\nProcessing batch {idx+1} ({len(batch)} records)...")
    
    batch_json = json.dumps({"create_records": batch}, ensure_ascii=False)
    
    # Write batch to temp file
    with open(f'batch_{idx}.json', 'w', encoding='utf-8') as f:
        f.write(batch_json)
    
    cmd = f'lark-cli base +record-batch-create --base-token {base_token} --table-id {table_id} --json @batch_{idx}.json --as user'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd='e:/AI应用/firstcc')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if data.get('ok'):
                created = data.get('data', {}).get('records', [])
                print(f"  Success: created {len(created)} records")
            else:
                print(f"  API Error: {data.get('error', {}).get('message', 'Unknown')}")
                print(f"  Full response: {result.stdout[:500]}")
        else:
            print(f"  Command failed: {result.stderr[:500]}")
    except Exception as e:
        print(f"  Error: {str(e)}")

print("\nImport completed!")
