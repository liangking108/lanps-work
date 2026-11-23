# LaNPs — 个人作品集与工作台

> 梁皓钧 / 产品设计出身的前端开发者 / 贵阳
> 原生 HTML + CSS + JavaScript 手写，**无框架、无依赖、无构建步骤**。

---

## 一、为什么不用 Vue / React

这个站是求职作品，面试时要能讲清每一行代码。所以：

- 原生实现 → 每个类名、每行动效都能讲清来龙去脉
- 零依赖 → 没有 `node_modules`，打开就能跑，加载快
- Vue 3 放到项目二（AI 工具站）里做，做完再写进简历

**一句话原则：写在简历上的技术，必须是能当场讲清的技术。**

---

## 二、本地预览

任选一种（三选一，都要在**项目根目录**执行）：

```bash
# 方式 1：Python（推荐，Windows 一般自带）
python -m http.server 5173

# 方式 2：Node
npx serve .

# 方式 3：VS Code 装 Live Server 插件
# 右键 index.html → Open with Live Server
```

然后浏览器打开 <http://localhost:5173>

> 直接双击 `index.html` 也能看，但用本地服务器更接近真实环境（相对路径、缓存行为都正常）。

---

## 三、文件结构

```
lanps-work/
├── index.html            # 全部页面结构（单页，分区块）
├── assets/
│   ├── css/
│   │   └── style.css     # 全部样式，含设计变量 / 响应式 / 无障碍
│   └── js/
│       └── main.js       # 导航 / 滚动揭示 / 数字滚动 / 进度条
└── README.md
```

---

## 四、技术要点（面试可讲的部分）

| 要点 | 实现方式 | 讲什么 |
|---|---|---|
| 响应式三端 | CSS 变量 + Grid/Flex + 4 个断点（1024 / 860 / 720） | 断点为什么这样切；移动端怎么处理导航 |
| 滚动揭示动效 | `IntersectionObserver` + `.reveal` 类切换 | 为什么不用 scroll 事件监听（性能） |
| 数字滚动 | `requestAnimationFrame` + easeOutCubic 缓动 | 缓动函数怎么选；为什么用 rAF |
| 阅读进度 | `scrollHeight / innerHeight` 比值 | 滚动事件用 rAF 节流，`passive: true` |
| 导航高亮 | 比较各 section 的 `getBoundingClientRect().top` | 为什么不能用 offsetTop（会算错嵌套） |
| 无障碍 | `prefers-reduced-motion` 降级、`:focus-visible`、`aria-*` | 动效敏感人群、键盘用户怎么照顾 |
| 语义化 | `header / main / section / article / ol` | 对 SEO 与读屏软件的意义 |

---

## 五、部署上线（Vercel，5 分钟）

### 1. 推 GitHub

```bash
cd lanps-work
git init
git add .
git commit -m "feat: LaNPs 作品集与工作台 v1"
git branch -M main
git remote add origin https://github.com/<你的用户名>/lanps-work.git
git push -u origin main
```

### 2. Vercel 导入

1. 打开 <https://vercel.com> → 用 GitHub 登录
2. **Add New → Project** → 选中 `lanps-work` 仓库
3. Framework Preset 选 **Other**，Build Command 留空，Output Directory 留空
4. Deploy → 拿到 `xxx.vercel.app` 链接

### 3. 绑定 LaNPswork.com

Vercel 项目 → **Settings → Domains** → 添加 `LaNPswork.com`，按提示到域名商改 DNS（A 记录指向 `76.76.21.21`，或 CNAME 指向 `cname.vercel-dns.com`）。

---

## 六、待替换 / 待补充（投递前必须处理）

- [ ] `index.html` 里 GitHub 链接目前是 `https://github.com/` 占位，换成真实主页
- [ ] 项目一的「查看源码」指向真实仓库地址
- [ ] 换成自己的截图 / 渲染图后，把 `.work__visual` 的渐变占位换成 `<img>`（记得 WebP + `loading="lazy"`）
- [ ] 补上邮箱（如有），或改成微信二维码
- [ ] 作品集里加入 Rhino / Keyshot 的渲染图（放新 section 或做成独立子页）

---

## 七、内容红线

本站**不得出现**任何游戏外挂、DMA/RDMA、绕过反作弊相关字样、截图或代码。
旧站 LaNPswork.com 的历史内容需先清理，再解析到本仓库。

---

*版本 v1.0 · 2026-11-23 · 与《梁皓钧-简历初稿》《转型行动方案》配套使用*
