# 歌境 · 富士山下：开发交接

## 1. 接手前必读

先阅读项目根目录：

- `AGENTS.md`
- `README.md`
- `GAME_DESIGN.md`
- `STORY.md`
- `ART_STYLE.md`
- `TECH_SPEC.md`
- `DEVELOPMENT_PLAN.md`

当前目录不是 Git 仓库。不要假设存在可用的提交历史或回滚机制，修改前先确认文件内容。

## 2. 当前状态

- 阶段 0–5 已通过验收。
- 阶段 6：电影感终极精修已实现，等待用户最终验收。
- 最新追加修改：手机来电已从“按住右滑”改为“单击接听按钮”，已通过独立点击测试。
- 当前正式启动流程：
  `BootScene → TitleScene → HubScene → FujiScene`
- 每次从 Hub 进入 FujiScene 都会停止旧 FujiScene、清空事件注册表并重新启动，确保完整剧情可以重新体验。

## 3. 技术栈与运行

- TypeScript 7
- Phaser 3.90.0
- Vite 8.3.4
- 逻辑画布：480×270
- CSS：按 16:9 `cover` 铺满视口，最近邻像素缩放
- 字体：Fusion Pixel 10px Monospaced 简体中文，自托管；授权说明在
  `public/assets/fonts/fusion-pixel-10px-monospaced/`

命令：

```powershell
cd C:\Users\luo20\Desktop\game
npm install
npm run dev
npm run build
```

开发地址：`http://127.0.0.1:5173/`

最近一次实际构建：

```text
> gejing-fuji@0.0.0 build
> tsc --noEmit && vite build

vite v8.3.4 building client environment for production...
✓ 30 modules transformed.
dist/index.html                    0.92 kB │ gzip:   0.60 kB
dist/assets/index-CJEXKxy2.js  1,265.28 kB │ gzip: 337.51 kB
✓ built in 949ms
```

只有 Phaser 单包超过 500 kB 的非阻断警告。

## 4. 核心代码入口

- `src/main.ts`：Phaser 初始化、字体预加载、场景注册。
- `src/game/scenes/TitleScene.ts`：黑底启动画面，任意键进入 Hub。
- `src/game/scenes/HubScene.ts`：主世界、入口、清除事件状态并启动新 FujiScene。
- `src/game/scenes/FujiScene.ts`：五幕连续世界、移动、事件演出、镜头、手机和终幕。
- `src/game/data/fujiEvents.ts`：一次性事件定义。
- `src/game/systems/StoryDirector.ts`：事件状态与 Registry 持久化。
- `src/game/systems/InteractionSystem.ts`：E 交互、物件名称渐显、底部 E 提示。
- `src/game/systems/WeatherSystem.ts`：雨、雪、樱花粒子。
- `src/game/systems/NarrationSystem.ts`：一次性旁白。
- `src/game/systems/GroundEffects.ts`：积水水花与雪地脚印。
- `src/game/ui/PhoneUI.ts`：单击“接听”按钮及花店留言。
- `src/game/ui/DialogueBox.ts`：深蓝像素对话框。
- `src/game/art/createFujiBackdrop.ts`：第一幕、共享富士山、夜景和光照。
- `src/game/art/createAct23Backdrop.ts`：花店街段和雪樱长卷。
- `src/game/art/createAct45Backdrop.ts`：雪路、回雨街、晨光与远景富士山。

## 5. 当前功能约束

必须保留以下底线：

- 玩家是见证者，不能改变 NPC 命运。
- 旧风衣只能由男性交给女性，玩家绝不能获得。
- 无战斗、解谜、任务、经验值或多结局。
- 不嵌入音乐、歌词、音频或外部播放器同步；歌曲由用户外部播放。
- 所有一次性剧情事件折返后不得重播。
- 锁定演出必须由最终定时器恢复控制，不能仅依赖 tween 完成。
- 小世界正常探索时顶部 HUD 隐藏；顶部操作提示只在 Hub 显示。
- 临时美术仍为项目内自制程序绘制，没有外部图像素材。

## 6. 已实现内容摘要

### 启动与主世界

- 黑底标题页、外部播放提示、任意键开始。
- Hub 至富士山入口距离已缩短。
- 每次重新进入 FujiScene 都重置完整剧情状态。

### 第一幕

- 寒雨街道、便利店、汽车、双 NPC、富士山、月牙。
- 倾斜雨伞、男性湿肩、车窗倒影。
- 车窗事件：镜头推近、递物/接物动作、NPC 字幕。
- 事件后男性抽烟，烟头闪烁、烟雾上升并被雨打散。
- 经过积水出现小水花。

### 手机与第二幕

- 花店前一次性手机事件。
- 手机使用单个像素“接听”按钮；点击即可接听。
- 接听后显示：“路过花店，想起你曾喜欢那里的白桔梗。”
- 花店回忆转场、橱窗回暖、行人剪影。
- 物件名称位于物件上方，E 操作提示固定在底部。

### 第三幕

- 雪地过渡至樱花长卷。
- 白粉粒子渐变、夕阳光照、电车驶过。
- 玩家位于两名 NPC 之间时触发三人影子交叠。
- 事件开始时粒子冻结 0.5 秒，交叠处出现暖黄色边缘光。

### 第四幕

- 樱花转回雪花、NPC 加速远去并渐隐。
- 纪念石交互支持拾起/放下。
- 雪地移动留下短暂脚印。
- NPC 停步时有轻微哈气。

### 第五幕

- 回到雨夜街道，汽车保留。
- 赠风衣演出：镜头推近、男性脱下风衣、女性接过并穿上、NPC 字幕。
- 旧风衣不会进入玩家交互。
- 雨渐停、晨光与左上太阳出现。
- 女性穿着风衣走向长椅；玩家按 E 坐在另一端。
- 女性起身离开，镜头拉回正常视距形成长椅与富士山构图。
- 终幕按 E 返回 HubScene。

## 7. 近期验证结果

- 最近一次 `npm run build` 通过，`tsc --noEmit` 通过。
- 此前通过独立无头 Chrome 实际跑过完整流程并返回 Hub，页面异常为 `[]`。
- 手机按钮修改后已单独用真实鼠标单击验证：
  - 点击“接听”后按钮消失；
  - 显示白桔梗留言；
  - 页面异常为 `[]`。
- 手机按钮改动后尚未再次执行完整数十秒全流程回归；新对话接手时建议先完成这一步。

## 8. 最终截图

- `docs/screenshots/stage6-title-final-1280x720.png`
- `docs/screenshots/stage6-act1-moon-smoke-final-1280x720.png`
- `docs/screenshots/stage6-phone-button-final-1280x720.png`
- `docs/screenshots/stage6-phone-message-final-1280x720.png`
- `docs/screenshots/stage6-snow-footprints-dialogue-showcase-1280x720.png`
- `docs/screenshots/stage6-coat-handoff-dialogue-1280x720.png`
- `docs/screenshots/stage6-finale-morning-final-1280x720.png`
- `docs/screenshots/stage6-return-hub-final-1280x720.png`

`docs/screenshots/` 中还保留了早期阶段的过程截图，可读取但不要当成当前最终版本。

## 9. 已知风险与待办

1. 手机按钮改动后建议重新跑一次完整流程：
   标题 → Hub → 车窗 → 手机单击 → 花店 → 雪樱 → 影子 → 第四幕 → 赠衣 → 长椅 → 返回 Hub。
2. 没有自动化测试框架；当前验证由 `tsc`、Vite build、无头浏览器截图和手动流程组成。
3. Phaser 主包约 1.27 MB，构建有体积警告，但不是阻断错误。
4. 美术仍以程序绘制为主，没有最终高清图集；若无新需求，不要擅自重做已验收角色和花店。
5. 不要重新引入滑动手机交互。
6. 不要提前继续开发阶段 6 之后的新功能；先等用户验收。

## 10. 新对话接手建议

新对话第一条可以直接说明：

> 请先读取 `HANDOFF.md` 和 `AGENTS.md`，确认当前阶段 6 状态。当前只做回归测试和用户验收后的问题修复，不新增阶段 6 之外的功能。

随后优先：

1. 运行 `npm run build`。
2. 启动 `npm run dev`。
3. 实际测试手机“接听”按钮点击。
4. 完整走通并返回 Hub。
5. 将发现的回归问题与截图汇报给用户，等待明确指令。
