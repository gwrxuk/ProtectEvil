"use client";

import { useEffect, useState } from "react";
import type { StatsPayload } from "@/lib/types";

const ART_STATEMENT_EN = `Shield & Scatter is a data portrait built from a non-probability convenience sample of public Threads posts captured in April–May 2026 around Taiwan’s 2023 junior-high neck-cutting homicide and its legal aftermath. Each luminous orb is one deduplicated post row; size encodes displayed “likes,” hue encodes the Traditional-Chinese search surface that surfaced it, and a cooler tint marks institutional press handles. A slowly rotating wire veil stands in for layered juvenile-data shields—legal opacity that can shelter offenders’ identities while victims’ civil files may remain structurally exposed. The extreme skew (high Gini) is not decorative: it shows how a handful of viral posts concentrate attention while statutory silence frustrates symmetric review. This piece does not celebrate outrage; it visualises the informational geometry produced when rehabilitation statutes, personal-data law, and cross-border speech collide without a reconciling design.`;

const CONTEXT_ZH = `《護盾與星屑》以 2026 年 4–5 月間、於 Threads 公開版面爬梳並去識別後的案例帖子為資料來源（非隨機便利樣本），指向 2023 年新北國中割頸案及其司法後續。作品假設：少年司法與個資法制意在保護未成年人與資料主體，但在本案的公共討論中，法定資訊屏障、跨境言論與民事卷宗的結構性曝光並未形成對稱保護——被害與加害在「可看見／不可看見」上的落差，本身即成為社會認知的材料。

互動方式：拖曳旋轉視角、滾輪縮放；游標懸停可讀取使用者代號與搜尋詞（中英對照）；下方滑桿可依「愛心數」下限過濾帖子，觀察輿論重量如何集中在少數節點。`;

const CONTEXT_EN_SHORT = `Context (short): The artwork uses the same empirical snapshot referenced in the accompanying legal essay—public engagement metrics only, no private messages. It invites viewers to feel how platform attention concentrates while formal juvenile proceedings remain sealed; it is critical infrastructure for democratic oversight, not a mob toolkit.`;

export function Overlay() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [open, setOpen] = useState(true);
  const [langZH, setLangZH] = useState(true);

  useEffect(() => {
    fetch("/data/stats.json")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const gini = stats?.concentration?.gini_likes;
  const top10 = stats?.concentration?.top10_share_of_likes;
  const n = stats?.n_rows_unique;
  const press = stats?.press_concentration?.institutional_share_of_total_likes;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          background:
            "linear-gradient(180deg, rgba(7,9,15,0.94) 0%, rgba(7,9,15,0.55) 75%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto", maxWidth: 560 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            Shield & Scatter{" "}
            <span style={{ fontWeight: 400, color: "#8b95a8", fontSize: 14 }}>
              護盾與星屑
            </span>
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#9aa4b8" }}>
            Data-driven installation · Threads corpus · April–May 2026
          </p>
        </div>
        <div style={{ pointerEvents: "auto", display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setLangZH((v) => !v)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(15,18,28,0.9)",
              color: "#e8ecf4",
              fontSize: 12,
            }}
          >
            {langZH ? "中文說明 on" : "中文說明 off"}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(15,18,28,0.9)",
              color: "#e8ecf4",
              fontSize: 12,
            }}
          >
            {open ? "Hide statement" : "Show statement"}
          </button>
        </div>
      </header>

      {open && (
        <aside
          className="panel-scroll"
          style={{
            position: "fixed",
            top: 100,
            left: 18,
            width: "min(420px, 94vw)",
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            zIndex: 10,
            padding: "16px 18px",
            borderRadius: 14,
            background: "rgba(10,13,22,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            fontSize: 13,
            lineHeight: 1.55,
            color: "#d2d8e6",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: 14, color: "#fff" }}>
            Art statement
          </h2>
          <p style={{ margin: "0 0 14px" }}>{ART_STATEMENT_EN}</p>

          {langZH && (
            <>
              <h3
                style={{
                  margin: "16px 0 8px",
                  fontSize: 13,
                  color: "#c45c4a",
                }}
              >
                背景與脈絡（中文）
              </h3>
              <p style={{ margin: "0 0 12px" }} lang="zh-Hant">
                {CONTEXT_ZH}
              </p>
            </>
          )}

          <h3 style={{ margin: "16px 0 8px", fontSize: 13, color: "#8b95a8" }}>
            Context (English)
          </h3>
          <p style={{ margin: "0 0 12px" }}>{CONTEXT_EN_SHORT}</p>

          {stats && (
            <section
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                fontSize: 12,
                color: "#9aa4b8",
              }}
            >
              <div style={{ fontWeight: 600, color: "#e8ecf4", marginBottom: 8 }}>
                Embedded statistics (corpus)
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Unique posts *n* = {n}</li>
                <li>
                  Gini (likes) ≈ {gini != null ? gini.toFixed(3) : "—"} — heavy
                  concentration of attention
                </li>
                <li>
                  Top-10 share of likes ≈{" "}
                  {top10 != null ? (top10 * 100).toFixed(1) : "—"}%
                </li>
                {press != null && (
                  <li>
                    Institutional press share of likes ≈ {(press * 100).toFixed(1)}
                    %
                  </li>
                )}
              </ul>
            </section>
          )}

          <div
            style={{
              marginTop: 14,
              fontSize: 11,
              color: "#5c6578",
            }}
          >
            <div>
              Legend: warm reds = “neck-cutting” query · gold = sworn-sibling
              labels · blue = Juvenile Act · violet = Father Yang · teal = New
              Taipei junior-high · lighter tint = institutional handle.
            </div>
            {langZH && (
              <div style={{ marginTop: 8 }} lang="zh-Hant">
                圖例：暖紅＝「割頸」搜尋 · 金黃＝「乾哥／乾妹」標籤 · 藍＝「少年事件法」
                · 紫＝「楊爸」 · 青綠＝「新北國中生」 · 較亮偏冷色＝媒體／機構帳號。
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
