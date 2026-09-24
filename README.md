# Nexus AI Learning Companion

A mobile-style learning product prototype by **Anrui Wu**, exploring how students can connect fragmented materials, knowledge relationships, practice and career preparation.

## Experience

- Ecosystem synchronization and capture workflows.
- Knowledge graph and contextual chat views.
- Quiz preparation, practice and results.
- Learning paths and document, article and video views.
- Interview preparation, session and report screens.

The app uses React, TypeScript, Vite and Tailwind CSS. It was extracted from the `nexus-app` module of the author's 3D portfolio into a standalone source package.

## Run the interface

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To build:

```bash
npm run build
npm run preview
```

The standalone build writes to `dist/` inside this repository.

## Optional live chat

The source includes a server-side `/api/nexus/chat` handler and a Vercel adapter. The existing adapter uses the Xiaoyao API endpoint and reads `XIAOYAO_API_KEY` from the server environment. A plain Vite development server does not execute this serverless handler, so local interface preview alone does not provide live chat.

No key is included. Configuring live chat sends submitted conversation content to the configured third-party endpoint and incurs provider usage. The handler instructs the model to distinguish demo context from actual private documents.

## Implementation boundaries

Ecosystem synchronization, OCR, document understanding, knowledge relationships and interview/quiz screens are product-prototype flows with example content. This repository does not demonstrate official QQ/Tencent Docs integrations, universal file parsing, a production vector database or validated improvements in learning outcomes. Read the implementation before treating a visible screen as evidence of a fully connected service.

## 中文说明

Nexus 学习伴侣以“资料聚合—知识组织—针对性练习—能力评估—职业应用”为产品主线。本仓库独立展示较新的 React 原型，不将旧的织光 AI Vue 仓库直接改名冒充同一版本。代码与界面包含演示数据，真实接口能力及未实现范围如上说明。

## Validation

See [VALIDATION.md](VALIDATION.md) for the checks performed during repository preparation and their limits.
