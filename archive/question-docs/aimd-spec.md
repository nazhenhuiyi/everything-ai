# AIMD (AI-Enhanced Markdown) 协议规范草案 v0.1

这是一份关于 **AIMD (AI-Enhanced Markdown)** 的设计草案。它的目标是保留 Markdown 的简洁易读性，同时引入“语义层”和“数据层”，使其成为 AI 时代的高维信息载体。

## 1. 核心设计哲学
*   **渐进增强 (Progressive Enhancement)**：在普通 Markdown 编辑器中仍可阅读（忽略特殊语法），但在 AIMD 兼容编辑器中展现全息能力。
*   **显式语义 (Explicit Semantics)**：减少 AI 靠“猜”带来的幻觉，作者显式定义逻辑权重。
*   **数据共生 (Data Symbiosis)**：文本与支撑数据（快照、图谱）同构存储。

---

## 2. 扩展语法定义

### 2.1 语义块属性 (Block Attributes)
用于为段落、标题或列表添加元数据（置信度、意图、情绪）。

**语法**：
使用 `:::{key=value}` 包裹，或简写为行首的 `~[属性]`。

**示例**：
```markdown
:::{intent="hypothesis" confidence="0.6" source="intuition"}
我认为通用人工智能（AGI）可能会在 2027 年之前出现。这不仅仅是算力的问题，更是数据压缩效率的质变。
:::

~[irony=true] 也就是专家们常说的，“只要再过六个月”。
```

### 2.2 实体锚点 (Entity Anchors)
用于消除歧义，将文本中的名词链接到知识图谱中的唯一 ID。

**语法**：
`^[显示文本](KG:ID "描述/定义")`

**示例**：
```markdown
这就涉及到了 ^[苹果](KG:Apple_Inc "美国科技公司，而非水果") 的生态壁垒策略。
当 ^[乔布斯](KG:Steve_Jobs) 提出这一概念时...
```

### 2.3 全息引用 (Holographic References)
引用不再仅仅是一个 URL，而是包含时间和快照指纹。

**语法**：
`@[引文摘要](URL){time="ISO8601", snapshot="ipfs_hash", selecting="highlighed_text"}`

**示例**：
```markdown
正如 OpenAI 在其 @[技术报告](https://openai.com/research){time="2024-02-15", selecting="Scaling laws are strictly followed"} 中提到的那样...
```
*(注：AIMD 编辑器鼠标悬停时，会从本地/IPFS 拉取当时的网页快照，而非再次访问可能已变动的 URL)*

### 2.4 思维分叉 (Mental Branches)
保留被废弃的思考路径，或者平行的可能性推演。

**语法**：
使用 `<< branch:name` 和 `>>` 标记。

**示例**：
```markdown
主要原因在于 GPU 的带宽瓶颈。
<< branch:alternative_view
（备选思考：或者其实是因为 Transformer 架构本身的序列依赖性？这一点目前还缺乏实验数据，暂且按下不表。）
>>
```
*(注：在普通视图中，分支内容默认折叠；AI 伴读模式下可被检索)*

### 2.5 动态数据插槽 (Dynamic Slots)
用于“生物化文档”，内容随现实世界变化。

**语法**：
`{{ func:source(params) || 默认静态文本 }}`

**示例**：
```markdown
截止当前，英伟达的股价为 {{ stock:NVDA.price || $800 }}，这意味着市场的预期依然狂热。
```
*(注：当文档被打开时，若联网环境允许，数字会自动更新为最新股价；否则降级显示默认文本)*

---

## 3. 文档结构示例

一个完整的 AIMD 文件看起来是这样的：

```markdown
---
title: 反思 AI 时代的各种可能性
author: Zilin
created: 2026-01-29
graph_id: uuid-1234-5678
---

# 思考随笔

:::{mood="contemplative" confidence="0.9"}
我们正在经历一场从**碳基叙事**向**硅基叙事**的迁徙。
:::

## 1. 数据的维度

传统的文本是二维的。^[扁平人](KG:Flatland_Novel) 无法理解立方体。

<< branch:deleted_metaphor
（原本想用《三体》的二向箔做比喻，但感觉太陈词滥调了，删掉。）
>>

而在 AIMD 协议中，我们尝试引入第三个维度：**语境 (Context)**。

## 2. 动态的真理

真理往往具有时效性。比如：
目前最强的开源模型是 {{ api:huggingface.leaderboard.top(1) || Llama-3-70B }}。

*(注：如果你在 2027 年读这句话，上面的模型名字应该已经变了。)*
```

## 4. 渲染层表现 (Rendered View)

当这个文件被专门的 **AIMD Reader** 打开时：

1.  **置信度高亮**：低置信度的段落背景色会微微泛灰，表示“仅供参考”。
2.  **反讽提示**：带有 `irony=true` 的句子旁边会出现一个小丑图标，防止读者误解语气。
3.  **时间旅行**：点击引用链接，弹出的不是 404，而是作者写作那一刻的网页全息截图。
4.  **活体数据**：动态插槽中的数字在轻微跳动，显示它是实时的。
