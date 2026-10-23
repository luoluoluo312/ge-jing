# 歌境（V1.0）

一个在浏览器中运行的横向 2D
像素互动短片。玩家作为无名旅人，在歌曲意象构成的世界里见证一场告别与释怀。

## 已确定的方向

-   主世界是可左右行走的连续像素画卷，首版仅开放富士山地标；靠近按 E
    进入歌曲世界。
-   歌曲世界是一条连续横向长卷，不做关卡菜单、战斗、解谜、任务列表、失败条件和多结局。
-   玩家可通过世界左上角的播放器控制歌曲，不抓取外部播放器进度、不显示歌词。
-   故事五幕：寒雨中的告别 → 旧物唤起回忆 → 短暂重温过去 →
    意识到无法挽留 → 接受并继续前行。
-   主要自由探索，关键剧情短暂锁定移动；自然互动为主，极少量原创台词。
-   玩家见证释怀，不能改变男女 NPC
    的核心命运；旧风衣最终由男性赠给女性，**不赠给玩家**。

## 技术建议

TypeScript + Phaser 3 + Vite，适配桌面浏览器，优先键盘操作。

## 本资料使用顺序

先阅读
`AGENTS.md`、`GAME_DESIGN.md`、`STORY.md`、`ART_STYLE.md`、`TECH_SPEC.md`、`DEVELOPMENT_PLAN.md`，然后按
`CODEX_PROMPTS.md` 分阶段执行。每个阶段先运行、试玩、验收再继续。

## 运行方式

```powershell
npm install
npm run dev
```

生产构建：

```powershell
npm run build
```

开发服务器默认地址为 `http://127.0.0.1:5173/`。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，将本项目推送到默认分支 `main`：

   ```powershell
   git init
   git add .
   git commit -m "Release 歌境"
   git branch -M main
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中将 **Source** 设为 **GitHub Actions**。
4. 推送后，`.github/workflows/deploy.yml` 会自动构建并发布 `dist`。

`vite.config.ts` 使用相对资源路径 `base: './'`，因此站点可以部署在
`https://<用户名>.github.io/<仓库名>/` 子路径下。

## 操作

- `A` / `D` 或左右方向键：移动
- `E`：观察、互动或返回
- `Esc`：暂停或继续
- 手机来电出现后：点击手机上的“接听”按钮

启动画面按任意键进入主世界。每次从主世界重新进入《富士山下》，完整剧情和一次性事件都会重置。

## 关于音乐

游戏内提供极简播放/暂停控制，不包含歌词或外部播放器同步功能。

## 版权与音频

歌词由创作者提供仅用于内部构思；游戏成品不直接复现歌词或原曲音频。公开发布前应审核歌曲名称、关联宣传及相关素材的授权与使用边界。
