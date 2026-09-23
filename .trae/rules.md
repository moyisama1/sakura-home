# sakura-home 工作流规则（所有会话自动加载）

## ✅ 写代码后必须做的 4 件事
每次修改完代码 **commit / push 之前**，必须依次执行：

1. **构建验证**：`npm run build` — 确保无编译错误
2. **IDE 诊断**：`GetDiagnostics` — 确保无 TS / JSX / CSS 红线
3. **代码审查**：调用 `TRAE-code-review` skill review 本次改动
4. **修复发现的问题**：review 发现的 bug / 反模式必须先修再 commit

## 🎨 项目约定
- 技术栈：React 18 + Vite 5 + 原生 CSS（无 Tailwind）
- 部署：Cloudflare Pages · 静态构建产物 `dist/`
- 前端数据：全部静态，集中在 `src/data/*.js`
- 新增组件必须在 `src/App.jsx` 里 import 并挂载
- CSS token 变量定义在 `:root {}`（index.css 顶部），新增主题色先看 token 里有没有

## 🚫 禁忌
- 不要用方案 B（R2/D1/Workers），已回退到纯静态方案 A
- 不要让 CSS 括号错位 — 修改 CSS 后必须 build 验证
- 不要遗留未使用的 import — 比如从方案 B 回退时 `useState` 可能没用了
- 图片放 `public/` 目录引用，不要用外部 API URL（部署后会失效）


