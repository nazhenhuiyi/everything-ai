---
name: git-workflow
description: git 工作流，负责管理代码提交规范、常用命令速查表、进阶技巧、冲突解决等。
---

# Git 工作流指南

本指南旨在规范团队的 Git 使用流程，确保代码历史清晰，协作顺畅。

## 1. 提交规范 (Commit Message Format)

我们采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

**格式**: `type(scope): subject`

*   **type**: 提交类型 (必填)
    *   `feat`: 新功能 (feature)
    *   `fix`: bug 修复
    *   `docs`: 文档变更
    *   `style`: 代码格式 (不影响代码运行的变动)
    *   `refactor`: 重构 (既不是新增功能，也不是修改 bug 的代码变动)
    *   `perf`: 性能优化
    *   `test`: 增加测试
    *   `chore`: 构建过程或辅助工具的变动
    *   `revert`: 回退
*   **scope**: 影响范围 (可选)，例如 `auth`, `api`, `ui`
*   **subject**: 简短描述 (必填)，使用祈使句，不加句号

**示例**:
```text
feat(auth): 添加 Google 登录支持
fix(api): 修复用户注册时的空指针异常
docs: 更新 README 安装说明
```

## 2. 标准开发流程 (Standard Development Flow)

### Step 1: 同步主分支
在开始新工作之前，确保你的本地 `main` (或 `master`) 分支是最新的。

```bash
git checkout main
git pull origin main
```

### Step 2: 创建 Feature 分支
基于最新的 `main` 创建一个新的分支。分支名建议包含类型和描述。

**格式**: `type/short-description`

```bash
# 示例: 创建一个用于开发登录页面的分支
git checkout -b feat/login-page
```

### Step 3: 开发与提交
在分支上进行开发。保持提交粒度适中。

```bash
# 添加文件到暂存区
git add <file>
# 或者添加所有修改
git add .

# 提交更改 (遵循提交规范)
git commit -m "feat(ui): 实现登录表单布局"
```

### Step 4: 推送到远程仓库
第一次推送时需要关联远程分支。

```bash
git push -u origin feat/login-page
```
后续推送只需运行 `git push`。

### Step 5: 提交 Pull Request (PR)
1.  在 GitHub/GitLab 页面上，你会看到一个 "Compare & pull request" 的提示。
2.  点击按钮创建 PR。
3.  **Title**: 遵循 Commit 规范。
4.  **Description**: 描述变更内容、截图 (如果是 UI 变更)、关联的 Issue 编号。
5.  指定 Reviewer 进行代码审查。

## 3. 进阶技巧 (Advanced Tips)

### 修改最后一次提交
如果你提交后发现漏了文件或写错了 Commit Message：

```bash
git add .
git commit --amend --no-edit # 保持原 Message
# 或者
git commit --amend -m "新提交信息"
```
*注意: 如果已经 push 过了，需要 `git push -f` (慎用，仅在私有分支使用)。*

### 整理提交历史 (Interactive Rebase)
在合并前，如果你的 commit 比较乱（比如有很多 "fix typos"），可以使用 rebase 整理。

```bash
# 整理最近 3 次提交
git rebase -i HEAD~3
```
将需要合并的 commit 前面的 `pick` 改为 `squash` (或 `s`)。
