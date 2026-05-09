# Shield & Scatter (`art/`)

Interactive **Next.js** + **Three.js** (@react-three/fiber) data portrait built from `public/data/posts.json` (exported from `datasets/case_threads_corpus/corpus_extended_unique.csv`) and `public/data/stats.json`.

## Setup

```bash
cd art
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Refresh dataset JSON

From the **repository root** (rebuilds `art/public/data/posts.json` and copies `stats_extended.json`):

```bash
python3 - <<'PY'
import csv, json, shutil
from pathlib import Path

QUERY_MAP = {
    "割頸": {"en": "neck-cutting", "key": "cut"},
    "乾哥乾妹": {"en": "sworn sibling labels", "key": "sibling"},
    "少年事件法": {"en": "Juvenile Delinquency Act", "key": "law"},
    "楊爸": {"en": "Father Yang", "key": "father"},
    "新北國中生": {"en": "New Taipei junior-high student", "key": "local"},
}
INST = {"chinatimessocial", "ettodaytw", "myudn", "plainlaw.me", "tvbslivenews"}
rows = []
for row in csv.DictReader(open("datasets/case_threads_corpus/corpus_extended_unique.csv", encoding="utf-8")):
    q = (row.get("query") or "").strip()
    meta = QUERY_MAP.get(q, {"en": q or "unknown", "key": "other"})
    rows.append({
        "username": row.get("username", ""),
        "post_date_label": row.get("post_date_label", ""),
        "query_zh": q,
        "query_en": meta["en"],
        "query_key": meta["key"],
        "likes": float(row.get("likes_num") or 0),
        "replies": float(row.get("replies_num") or 0),
        "reposts": float(row.get("reposts_num") or 0),
        "shares": float(row.get("shares_num") or 0),
        "institutional": row.get("username", "") in INST,
    })
out = Path("art/public/data")
out.mkdir(parents=True, exist_ok=True)
(out / "posts.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
shutil.copy("datasets/case_threads_corpus/stats_extended.json", out / "stats.json")
print("OK:", len(rows), "posts")
PY
```

## Production build

```bash
npm run build && npm start
```
