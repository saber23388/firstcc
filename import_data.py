import pandas as pd
import json

df = pd.read_excel(r'C:\Users\Administrator\Desktop\休闲园易耗品明细(1).xls')

records = []
for idx, row in df.iterrows():
    record = {
        "物品名称": str(row['名称']) if pd.notna(row['名称']) else "",
        "规格型号": str(row['型号']) if pd.notna(row['型号']) else "",
        "存放位置": str(row['存放地址']) if pd.notna(row['存放地址']) else "",
    }
    
    if pd.notna(row['金额']):
        record["单价"] = float(row['金额'])
    else:
        record["单价"] = 0
    
    records.append(record)

# Save to JSON file for batch creation
with open('records.json', 'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"Total records: {len(records)}")
print("First 3 records:")
for r in records[:3]:
    print(r)
