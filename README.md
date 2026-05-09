# Shield & Scatter（護盾與星屑）

Data-driven interactive artwork in **Next.js** + **Three.js** (`@react-three/fiber`). It visualises a **non-probability convenience sample** of **public** Threads posts captured in **April–May 2026** around one criminal case and its legal aftermath. Static JSON lives in `public/data/` (see [Dataset](#dataset)).

---

## The criminal case (context)

In **December 2023**, a **homicide** occurred at a **junior-high school in New Taipei City, Taiwan**: a student died after **knife wounds to the neck** in a school corridor. The perpetrators were **juveniles**; the case proceeded under **Taiwan’s juvenile-justice framework** (including restrictions on identifying minors and non-public proceedings). In **2025–2026**, higher courts **finalised lengthy custodial sentences** for the juvenile defendants; the judgment produced sustained **public debate** about whether sentences and disclosure rules adequately balance **rehabilitation, victim interests, and democratic oversight**.

This repository’s **legal essay** (`paper.md` in the parent project) analyses **structural** tensions: layered statutes can **shield juvenile offenders’ identifying information** while **civil-procedure practice** may leave **victim-side addresses or filings** comparatively exposed; **cross-border speech** (e.g. commentary from outside Taiwan) may not be enforceable in the same way as domestic publication; and **platform discourse** can concentrate attention on a **few viral posts** (high inequality of “likes”) while formal records remain sealed.

**Important:** The artwork **does not retry the crime**, **does not identify victims**, and **does not celebrate doxxing or vigilantism**. It uses **aggregated public engagement metrics** from archived Threads search snapshots to show **how attention distributes** on one platform at one time—not to instruct harm.

---

## The artwork

**Title:** *Shield & Scatter* / 《護盾與星屑》.

**Metaphor**

- **Orbs:** Each sphere is **one deduplicated row** in the corpus (`posts.json`). **Radius** scales with displayed **likes** (engagement). **Colour** encodes the **Traditional-Chinese search query** that surfaced the post (e.g. graphic case labels vs. legal-act keywords vs. victim-family-facing keywords). **Cooler / bluish tint** marks **institutional press-style handles** in the sample.
- **Veil:** A slow, semi-transparent **wire shell** suggests **statutory and procedural opacity**—the “shields” that conceal certain facts from public view—while the scattered bright nodes suggest **where public conversation actually accumulates** on the platform layer.
- **Skew:** Embedded statistics (from `stats.json`) include a high **Gini coefficient** on likes and a large **top-10 share** of total likes: a **few nodes carry most of the visible weight**. That inequality is **the point**: democratic oversight and grief do not distribute evenly when formal channels are sealed and informal channels are skewed.

**Interaction**

- **Drag** to orbit, **scroll** to zoom.
- **Hover** an orb for handle, query (**Chinese + English gloss**), and like count.
- **Slider** filters out low-like posts so you can see how **discussion collapses toward the head** of the distribution.

---

## Art statement

The following is the **author-facing statement** mirrored in the web UI (`components/Overlay.tsx`).

### English (full)

> Shield & Scatter is a data portrait built from a non-probability convenience sample of public Threads posts captured in April–May 2026 around Taiwan’s 2023 junior-high neck-cutting homicide and its legal aftermath. Each luminous orb is one deduplicated post row; size encodes displayed “likes,” hue encodes the Traditional-Chinese search surface that surfaced it, and a cooler tint marks institutional press handles. A slowly rotating wire veil stands in for layered juvenile-data shields—legal opacity that can shelter offenders’ identities while victims’ civil files may remain structurally exposed. The extreme skew (high Gini) is not decorative: it shows how a handful of viral posts concentrate attention while statutory silence frustrates symmetric review. This piece does not celebrate outrage; it visualises the informational geometry produced when rehabilitation statutes, personal-data law, and cross-border speech collide without a reconciling design.

### 中文摘要（介面同步）

> 《護盾與星屑》以 2026 年 4–5 月間、於 Threads 公開版面爬梳並去識別後的案例帖子為資料來源（非隨機便利樣本），指向 2023 年新北國中割頸案及其司法後續。作品假設：少年司法與個資法制意在保護未成年人與資料主體，但在本案的公共討論中，法定資訊屏障、跨境言論與民事卷宗的結構性曝光並未形成對稱保護——被害與加害在「可看見／不可看見」上的落差，本身即成為社會認知的材料。
>
> 互動方式：拖曳旋轉視角、滾輪縮放；游標懸停可讀取使用者代號與搜尋詞（中英對照）；下方滑桿可依「愛心數」下限過濾帖子，觀察輿論重量如何集中在少數節點。

### Short English context line

> The artwork uses the same empirical snapshot referenced in the accompanying legal essay—public engagement metrics only, no private messages. It invites viewers to feel how platform attention concentrates while formal juvenile proceedings remain sealed; it is critical infrastructure for democratic oversight, not a mob toolkit.

---

## Why call it “failure” of the judicial system?

The parent project argues **not** that individual judges acted in bad faith in every instance, but that **the composite architecture**—juvenile anonymity rules, personal-data statutes, territorial enforcement limits, and civil procedure defaults—can produce **predictable asymmetry**: offenders and victims do not stand in **symmetrical** positions with respect to **information, risk, and public accountability**. The artwork makes **one slice** of that argument tangible: **where speech and attention go** when formal records are sealed.

---

## Dataset

| File | Source |
|------|--------|
| `public/data/posts.json` | Derived from `datasets/case_threads_corpus/corpus_extended_unique.csv` |
| `public/data/stats.json` | Copy of `datasets/case_threads_corpus/stats_extended.json` |

### Refresh JSON from the research corpus

From the **repository root**:

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

---

## Setup

```bash
cd art
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build && npm start
```

---

## Stack

- **Next.js 14** (App Router)
- **three**, **@react-three/fiber**, **@react-three/drei**

---

## Licence / use

The installation is **research and exhibition-oriented**. Respect **platform terms**, **privacy**, and **judicial restrictions** on identifying juveniles when citing or extending this work. Do not use the piece to **harass** or **identify** non-public figures.
