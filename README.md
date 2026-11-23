# LaNPs — 个人作品集与工作台

> 梁皓钧 / 产品设计出身的开发者 / 贵阳
> 原生 HTML + CSS + JavaScript 手写，无框架、无依赖、无构建步骤。

---

## 一、本地预览

任选一种（在项目根目录执行）：

```bash
# Python
python -m http.server 5173

# Node
npx serve .

# 或直接双击 index.html
```

浏览器打开 <http://localhost:5173>。

---

## 二、文件结构

```
lanps-work/
├── index.html            # 页面结构（单页，分区块）
├── assets/
│   ├── css/
│   │   └── style.css     # 设计变量 / 版式 / 响应式 / 无障碍
│   ├── js/
│   │   └── main.js       # 导航 / 滚动揭示 / 数字滚动 / 进度条 / 图集
│   └── img/
│       └── works/        # 设计作品预览与结构示意
└── README.md
```

---

## 三、实现要点

| 要点 | 实现方式 |
|---|---|
| 响应式三端 | CSS 变量 + Grid/Flex + 4 个断点（1024 / 860 / 720） |
| 滚动揭示动效 | `IntersectionObserver` + `.reveal` 类切换，只触发一次 |
| 数字滚动 | `requestAnimationFrame` + easeOutCubic 缓动 |
| 阅读进度 | `scrollHeight / innerHeight` 比值，rAF 节流 + `passive: true` |
| 导航高亮 | 比较各 section 的 `getBoundingClientRect().top` |
| 设计作品展示 | 主推作品 + 结构示意交错排版，WebP 缩略图按需加载 |
| 作品图集 | 原生灯箱：缩略图切换、方向键翻页、Esc 关闭、焦点回归 |
| 无障碍 | `prefers-reduced-motion` 降级、`:focus-visible`、`aria-*`、`skip-link` |
| 语义化 | `header / main / section / article / ol` |

---

## 四、部署（Vercel）

1. Framework Preset 选 **Other**
2. Build Command、Output Directory 留空
3. Deploy → 得到 `*.vercel.app` 链接
4. 如需自定义域名，在 **Settings → Domains** 添加并按提示配置 DNS

---

*站点：LaNPswork.com · 工具台：tools.LaNPswork.com*
