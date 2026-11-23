# LaNPs — 个人作品集与工作台

> 梁皓钧 / 产品设计出身的开发者 / 贵阳
> 原生 HTML + CSS + JavaScript 手写，无框架、无运行时依赖、无构建步骤。

站点：<https://lanps-work.vercel.app>
工具台：<https://lanps-tools.vercel.app>
GitHub：<https://github.com/liangking108>

---

## 一、这一版做了什么

v3 不再采用通用模板式作品集，而是围绕真实经历重组信息：

- **先证明能上线**：首屏直接把两个已部署产品作为核心证据。
- **再展示设计能力**：同心·茶事、触香两件完整科班作品，可打开图集查看主视觉、结构、场景与展示页。
- **用工作台表达方法**：工具栈以文件树、能力面板和属性检查器呈现，不堆砌技能进度条。
- **保留真实经历**：产品设计、前端开发、AI 工作流、闲鱼电商副业与 2026 届求职状态。
- **让联系路径更短**：邮箱、电话、GitHub 与简历均可直接操作。

视觉方向为深碳灰、冷蓝与少量青绿状态色，强调编辑工作台质感。中文正文优先使用 MiSans / HarmonyOS Sans SC / PingFang SC 等系统字体，代码元素使用 JetBrains Mono / Consolas。

---

## 二、本地预览

在项目根目录执行任一方式：

```bash
# Python
python -m http.server 5173

# Node
npx serve .
```

打开 <http://localhost:5173>。也可以直接打开 `index.html`。

---

## 三、文件结构

```text
lanps-work/
├── index.html                         # 单页结构与真实内容
├── assets/
│   ├── css/
│   │   └── style.css                  # 设计系统、版式、响应式、无障碍
│   ├── js/
│   │   └── main.js                    # 导航、揭示、进度、灯箱等交互
│   ├── docs/
│   │   └── lianghaojun-frontend-resume.pdf
│   └── img/
│       └── works/                     # 两件作品的 WebP 图集
├── README.md
└── vercel.json
```

---

## 四、页面结构

1. Hero：`把设计 / 做成能上线的产品。`
2. 精选项目：LaNPs 作品集与工作台、LaNPs 工具台
3. 设计作品：同心·茶事、触香
4. 工具栈：编辑器式能力工作台
5. 关于：真实经历时间线
6. 联系：终端窗口 + 联系卡片
7. 图集灯箱与页脚

---

## 五、实现要点

| 要点 | 实现方式 |
|---|---|
| 响应式 | 1120 / 920 / 720 / 380 四级断点，Grid 与 Flex 降级 |
| 滚动揭示 | `IntersectionObserver`，仅触发一次 |
| 阅读进度 | `requestAnimationFrame` + `passive` 滚动监听 |
| 导航状态 | 滚动吸顶、区块高亮、移动端菜单开合 |
| 作品图集 | 原生灯箱，支持缩略图、方向键、Esc、焦点回归 |
| 邮箱复制 | Clipboard API，失败时回退到 `execCommand` |
| 简历下载 | 三处入口统一指向 `assets/docs/lianghaojun-frontend-resume.pdf` |
| 无障碍 | 跳转链接、`:focus-visible`、`aria-*`、减少动效适配 |
| 字体排版 | 中文系统字体栈 + 小字号等宽代码字体 + 可读行高 |

---

## 六、部署

Vercel 中选择 **Other**：

- Build Command：留空
- Output Directory：留空
- Framework Preset：Other

推送至 `main` 后由 Vercel 自动部署。

---

## 七、内容原则

页面只使用可验证的真实项目与经历。求职方向包括前端开发、UI 视觉、产品助理、AI 应用与电商运营；贵阳本地或远程均可。简历会根据投递方向调整。
