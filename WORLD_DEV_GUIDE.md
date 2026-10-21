# 歌境 · 新歌曲世界核心开发规范

本文是《歌境》后续歌曲世界的统一开发指南。第一个世界《富士山下》
已经完成从原型到 1.0 的完整验证，新世界应复用其中稳定的技术骨架、视觉
基线和验证方法，而不是重新发明一套场景结构。

适用范围：

- 当前项目：`C:\Users\luo20\Desktop\game`
- 技术栈：TypeScript + Phaser 3 + Vite
- 首个参考实现：`FujiScene` /《富士山下》
- 后续示例：`QilixiangScene` /《七里香》

基本原则：

1. 每个世界是独立 Scene，共用 Title、Hub 和基础系统。
2. 世界之间不共享剧情状态；每次进入必须可以从头体验。
3. 玩家是见证者，不能改变该世界 NPC 的核心命运。
4. 不加入战斗、解谜、任务、经验值、失败条件或多结局。
5. 不嵌入原曲音频、歌词、第三方播放器抓取或播放进度同步。

---

## 1. 架构复用指南

### 1.1 总览

推荐结构：

```text
src/
  main.ts
  game/
    scenes/
      BootScene.ts
      TitleScene.ts
      HubScene.ts
      FujiScene.ts
      QilixiangScene.ts
    data/
      fujiEvents.ts
      qilixiangEvents.ts
    systems/
      StoryDirector.ts
      NarrationSystem.ts
      InteractionSystem.ts
      WeatherSystem.ts
      GroundEffects.ts
    ui/
      DialogueBox.ts
      PhoneUI.ts
    entities/
      Traveler.ts
      NPC.ts
    art/
      createFujiBackdrop.ts
      createQilixiangBackdrop.ts
```

稳定的全局入口：

- `BootScene`：只做启动依赖和基础准备。
- `TitleScene`：全系列共用的品牌启动画面。
- `HubScene`：全系列共用的主世界和地标入口。
- `main.ts`：注册所有 Scene 的唯一入口。

每个歌曲世界新增：

- 独立 Scene，例如 `QilixiangScene.ts`。
- 独立事件文件，例如 `qilixiangEvents.ts`。
- 独立背景绘制模块，例如 `createQilixiangBackdrop.ts`。
- 世界专属实体或效果，但优先复用公共系统和现有实体。

### 1.2 复用 TitleScene

`TitleScene` 是《歌境》的品牌入口，不应为每首歌复制一份。

保留：

- 黑底或世界通用的极简启动视觉。
- 主标题“歌境”。
- “请自行在外部播放对应歌曲”的提示原则。
- 任意键进入 Hub。
- 启动时重置剧情 Registry。

新增歌曲世界时，通常只需更新副提示，或增加世界说明，不要改变全局品牌
标题。例如：

```text
歌境
请自行在外部播放《七里香》
按任意键开始
```

Title 不应负责选择歌曲、保存进度或直接启动 `QilixiangScene`。歌曲选择
应放在 Hub 的地标交互中。

### 1.3 复用 HubScene

Hub 是可扩展的主世界。新增歌曲世界时，原则上只增加地标和入口，不复制
Hub 的技术逻辑。

新增入口的标准步骤：

1. 在 `createWorld()` 中绘制新地标。
2. 为新地标增加一个 `InteractionSystem` target。
3. 入口提示中写明歌曲名称和“请先在外部播放”的说明。
4. 玩家确认后启动对应世界 Scene。
5. 启动前重置该世界的剧情和旁白状态。

入口 target 示例：

```ts
this.interactions.addTarget({
  id: 'qilixiang-entry',
  x: QILIXIANG_ENTRY_X,
  y: GROUND_Y,
  range: 42,
  label: '七里香入口',
  onInteract: () => this.openWorldPrompt('QilixiangScene', '七里香'),
});
```

进入世界时应集中处理生命周期：

```ts
private enterSongWorld(sceneKey: string): void {
  this.registry.set('completedStoryEvents', []);
  this.registry.set('seenNarrations', []);
  this.registry.set('currentWorldScene', sceneKey);

  if (this.scene.isSleeping(sceneKey) || this.scene.isActive(sceneKey)) {
    this.scene.stop(sceneKey);
  }

  this.scene.launch(sceneKey);
  this.scene.sleep();
}
```

现有代码可以直接为 `FujiScene` 保留专门方法；增加到第二个世界后，建议将
停止目标 Scene、重置 Registry、启动目标 Scene 提取成一个通用的
`enterSongWorld(sceneKey)`，避免每个入口复制整套逻辑。

注意：

- `HubScene` 入睡时，其 UI、玩家和入口状态会保留；返回后必须调用
  `handleWake()` 恢复输入和暂停状态。
- 新世界返回 Hub 时使用 `scene.wake('HubScene')`，然后让当前世界
  `scene.sleep()`。
- 每次重新进入时先 `stop` 旧 Scene，再 `launch`，确保 `create()` 重新执行。

### 1.4 注册新世界

所有 Scene 必须在 `src/main.ts` 注册：

```ts
import { QilixiangScene } from './game/scenes/QilixiangScene';

scene: [
  BootScene,
  TitleScene,
  HubScene,
  FujiScene,
  QilixiangScene,
],
```

Scene key 必须唯一且稳定：

```ts
super('QilixiangScene');
```

不要用显示名称作为 key，不要在运行时动态拼接 Scene key。

### 1.5 克隆 FujiScene 的正确方式

`FujiScene` 是可运行骨架，不应直接复制后只替换名字。

建议复制并替换以下内容：

- Scene key：`QilixiangScene`。
- 世界宽度、地面高度、各幕起始/结束坐标。
- 背景创建函数和世界专属实体。
- NPC 名称、位置、动作和世界事件。
- Camera cue、主要演出时长和镜头焦点。
- 手机或专属 UI，只保留新世界实际需要的部分。

必须保留的生命周期能力：

1. `create()`：
   - 注册键盘。
   - 创建背景和实体。
   - 创建系统对象。
   - 注册交互点。
   - 设置镜头边界。
   - 创建暂停层。
   - 监听 `Phaser.Scenes.Events.WAKE`。
2. `update()`：
   - 处理 Esc。
   - 暂停时停止玩家移动并返回。
   - 计算当前幕区域和环境进度。
   - 更新天气、NPC、脚印等环境系统。
   - 剧情锁定时停止玩家并返回。
   - 正常探索时处理移动、镜头、交互和事件触发。
3. `returnToHub()`：
   - 重置键盘。
   - 唤醒 Hub。
   - 当前 Scene `sleep()`。
4. `handleWake()`：
   - 清理锁定、暂停、对话和临时物件。
   - 恢复交互。
   - 恢复镜头跟随。

建议拆分：

- `FujiScene.ts` 已接近千行。新世界优先把背景按幕拆成多个绘制函数，并
  放在 `createXxxBackdrop.ts`；如演出继续增加，可再拆出世界专属
  `systems/` 或 `directors/`。
- 不要为了“架构好看”一次性引入状态机框架、通用剧情引擎或复杂依赖。
  先保证可运行、事件数据化、故障可恢复，再做抽象。

### 1.6 事件系统如何接入

现有事件模型由两部分组成：

- `fujiEvents.ts`：声明世界事件数据。
- `StoryDirector`：管理事件状态、一次性标记和 Registry 持久化。

新世界应新建专属事件文件：

```text
src/game/data/qilixiangEvents.ts
```

事件 ID 和 `completionFlag` 必须唯一。推荐命名：

```ts
id: 'qi-window-rain'
completionFlag: 'qi.act1.windowRain.completed'
```

不要复用 `fuji.act1...` 等富士山命名。

事件基本字段：

```ts
type WorldEvent = {
  id: string;
  zone: { minX: number; maxX: number };
  trigger:
    | { type: 'interaction'; targetId: string }
    | { type: 'zone' };
  once: boolean;
  lockInput: boolean;
  cameraCue: {
    focusX: number;
    focusY: number;
    durationMs: number;
  };
  dialogue?: {
    title: string;
    body: string;
    footer: string;
  };
  visualEffect: {
    type: string;
    durationMs: number;
  };
  completionFlag: string;
};
```

如果新世界的视觉效果类型与富士山完全不同，应在新事件文件中定义专属
视觉枚举，不要无限扩大 `fujiEvents.ts` 中只属于《富士山下》的联合类型。

注册方式：

```ts
this.storyDirector = new StoryDirector(this, QILIXIANG_EVENTS);
```

交互型事件必须保证 target ID 与 `InteractionSystem` 注册一致：

```ts
trigger: {
  type: 'interaction',
  targetId: 'qilixiang-letter',
}
```

区域型事件在 `update()` 中根据玩家坐标调用：

```ts
const event = this.storyDirector.begin('qi-zone-rain', this.traveler.x);
if (event) {
  this.startRainEvent(event);
}
```

事件结束必须调用：

```ts
this.storyDirector.complete(event);
```

不要手动修改 completed 标记，不要绕过 `StoryDirector.begin()` 直接播放
一次性剧情。`begin()` 同时负责检查事件是否已开始/完成以及玩家是否在
事件区域内。

### 1.7 旁白系统如何接入

每个世界 Scene 创建自己的 `NarrationSystem`：

```ts
this.narration = new NarrationSystem(this);
```

两种使用方式：

```ts
// 一次性旁白，重进世界并重置 Registry 后可再次显示。
this.narration.playOnce(
  'qi-act2-leaving',
  '风经过时，树影替人记住了这一刻。',
);

// 每次进入都显示的短引导。
this.narration.show(
  '雨落下来，像一场没有说完的告别。',
  3500,
);
```

约束：

- 一次性旁白的 ID 必须带世界前缀。
- 旁白只用于补足情绪和方向感，不解释所有画面信息。
- 旁白与 Dialog 不同时争抢同一视觉区域。
- 不显示原歌词，不尝试与外部播放器同步。
- 进入世界的情景引子建议停留 3–4 秒，之后自动淡出。

### 1.8 交互系统如何接入

每个 Song World 创建一个玩家交互系统：

```ts
this.interactions = new InteractionSystem(this, this.traveler);
```

注册交互点：

```ts
this.interactions.addTarget({
  id: 'qilixiang-window',
  x: WINDOW_X,
  y: GROUND_Y,
  range: 40,
  label: '观察窗边',
  name: '旧窗',
  nameRange: 72,
  nameOffsetY: 60,
  onInteract: () => this.startWindowEvent(),
});
```

字段约定：

- `id`：用于启用/禁用和关联事件，必须唯一。
- `x` / `y`：世界坐标，不是屏幕坐标。
- `range`：允许按 E 的距离。
- `nameRange`：显示物件名称的距离。
- `nameOffsetY`：名称相对物件的位置偏移。
- `enabled`：是否仍允许靠近和交互。
- `interactive`：是否显示 E 提示并允许按 E。

事件完成后再关闭交互：

```ts
this.interactions.setTargetEnabled('qilixiang-window', false);
```

演出开始时统一关闭：

```ts
this.interactions.setEnabled(false);
```

演出结束后按当前暂停状态恢复：

```ts
this.interactions.setEnabled(!this.paused);
```

---

## 2. 像素美术与渲染基线

### 2.1 逻辑分辨率

所有 Song World 固定使用：

```ts
const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
```

禁止使用其他逻辑分辨率作为正式版本。浏览器端可以缩放，但世界坐标、角色
比例、UI 间距和镜头边界都应以 480×270 为基准。

基础角色尺寸：

- 玩家：约 30–34 逻辑像素高。
- NPC：约 32–38 逻辑像素高。
- 建筑、树木、山体应明显大于角色，保留环境呼吸感。

### 2.2 Phaser 与 CSS 设置

`main.ts` 必须保留：

```ts
pixelArt: true,
antialias: false,
roundPixels: true,
```

画布 CSS 必须保留 nearest-neighbor：

```css
image-rendering: pixelated;
image-rendering: crisp-edges;
```

不要对 Canvas 使用：

- 平滑缩放。
- CSS `filter: blur(...)`。
- 半像素位移。
- 带平滑插值的矩形描边。

当前屏幕适配采用固定逻辑画布加 `cover`；如果未来改变适配方式，必须确保
像素块仍保持锐利，不出现非整数模糊和重要 UI 被裁切。

### 2.3 像素 UI 规范

UI 必须统一使用项目自托管像素字体：

```ts
fontFamily: PIXEL_FONT_FAMILY
```

名牌、旁白和底部提示统一设置：

```ts
setScrollFactor(0)
```

推荐深度：

| 层级 | depth | 内容 |
| --- | ---: | --- |
| 远景 | -45 ～ -25 | 天空、云、远山 |
| 背景 | -24 ～ -10 | 城市、道路、远景树 |
| 地面 | -9 ～ -1 | 地面、铁轨、积水 |
| 阴影 | 3 ～ 4 | NPC 与环境阴影 |
| 玩家/NPC | 5 ～ 9 | 角色和手持物 |
| 世界提示 | 20 | 物件名牌、底部 E 提示 |
| 旁白 | 70 ～ 79 | 顶部一次性旁白 |
| 手机/横幅 | 80 ～ 89 | 手机及消息 UI |
| 对话框 | 90 ～ 99 | 剧情对话 |
| 暂停层 | 100 | Esc 暂停界面 |

禁止对象：

- 对话被角色、粒子或前景树遮住。
- 旁白和对话框同时占用同一区域。
- 手机横幅盖住顶部旁白。
- 暂停层被其他 UI 压住。

### 2.4 渐显渐隐规范

所有像素 UI 使用短暂、克制的透明度变化。

推荐值：

- 物件名牌出现：`180–240ms`
- 物件名牌消失：`140–200ms`
- 底部 E 提示出现/消失：`120–180ms`
- 旁白出现：`380–480ms`
- 旁白消失：`300–420ms`
- 一次性旁白停留：`2600–3200ms`
- 进入世界的情景引子停留：`3000–4000ms`
- 手机消息文字浮现：在头像出现后延迟 `150–250ms`，再用 `350–450ms`
  淡入

不要使用长时间呼吸闪动、霓虹脉冲或现代玻璃拟态 UI。

### 2.5 视差层基线

默认纵向分层：

| 层 | `scrollFactor` | 说明 |
| --- | ---: | --- |
| UI | 0 | 固定屏幕 |
| 天空主色块 | 0 | 不随镜头移动 |
| 远山、富士山 | 0.08 | 几乎静止，负责宏大尺度 |
| 远景城市/森林 | 0.3 | 缓慢跟镜 |
| 世界主体、角色 | 1 | 与玩家同步移动 |

复杂画面可以增加中间层，但不要随意破坏层次关系。常见顺序：

```text
天空色带
远处光晕与雾
远景山体 / 城市
中景树林 / 建筑
地面
角色影子
角色与交互物
近距离前景
固定 UI
```

视差层在镜头左右边界处不得露出空底、透明缝或被截断的主山体。

### 2.6 光影要求

每个世界至少明确三组光：

1. 天空环境色。
2. 中景统一色温。
3. 角色附近局部点光或轮廓光。

推荐做法：

- 灯光使用低透明度矩形叠层和少量高亮像素。
- 夕阳、晨光使用色带渐变，不要直接给整张画面加模糊滤镜。
- 角色阴影使用低透明度多边形或像素块。
- 雨后地面反射只用简化色块，不模拟复杂镜面。
- 雪、雨、花瓣使用低分辨率粒子，不使用高清烟雾贴图。

---

## 3. 避坑指南

### 3.1 防软锁：最高优先级

任何 `lockInput: true` 的剧情必须有最终兜底定时器。

正确模式：

```ts
this.inputLocked = event.lockInput;
this.interactions.setEnabled(false);
this.input.keyboard?.resetKeys();
this.traveler.stop();

// ...启动镜头、对话、动画...

this.scheduleEventStep(event.visualEffect.durationMs, () => {
  this.finishEvent(event);
});
```

结束函数：

```ts
private finishEvent(event: WorldEvent): void {
  if (!this.inputLocked) {
    return;
  }

  this.storyDirector.complete(event);
  this.inputLocked = false;
  this.interactions.setEnabled(!this.paused);
  this.input.keyboard?.resetKeys();
  this.cameras.main.zoomTo(1, 500, 'Sine.easeInOut');
  this.cameras.main.startFollow(this.traveler, true, 0.12, 0.12);
}
```

绝对禁止：

- 只依赖 tween `onComplete` 解锁。
- 只依赖动画帧播放完成解锁。
- 动画对象被销毁后仍等待其回调。
- 演出开始时关闭交互，却在所有结束分支漏掉恢复。
- 暂停时结束演出后不能恢复。

还必须在以下情况恢复：

- Scene `WAKE`
- Esc 从暂停恢复
- 返回 Hub 后再次进入
- 资源加载失败后的超时兜底
- 某个可选动画没有创建成功

建议同时维护：

```ts
private readonly eventTimers: Phaser.Time.TimerEvent[] = [];
```

在 Scene 停止或重进前，统一清理仍在运行的演出 Timer。

### 3.2 状态重置：保证每次都能从头体验

进入任一歌曲世界前，必须重置：

```ts
this.registry.set('completedStoryEvents', []);
this.registry.set('seenNarrations', []);
```

同时处理当前 Scene：

```ts
if (this.scene.isSleeping(worldSceneKey) ||
    this.scene.isActive(worldSceneKey)) {
  this.scene.stop(worldSceneKey);
}

this.scene.launch(worldSceneKey);
```

`stop` 后再 `launch` 会重新执行 `create()`，清空临时对象、定时器和事件
状态。不要仅 `wake` 一个已完成世界后直接继续。

每次进入必须验证：

- 一次性剧情可以重新触发。
- 已完成事件不会残留为 `completed`。
- 玩家位置、NPC 位置和经验值式的状态全部归零。
- 手机、对话框、旁白和暂停层不残留。
- 新世界右上 HUD 与 Hub 顶部操作提示不会互相串场。

### 3.3 场景拼接：禁止硬切和隐形墙

多幕地图是一张连续世界，不是多个独立关卡。

要求：

- 地面高度、角色脚底基线和镜头高度保持一致。
- 幕与幕之间预留重叠区域。
- 季节变化使用像素块锯齿、雪泥、光照和地面材质交错过渡。
- 不能出现一列垂直色块把两张背景硬拼在一起。
- 除世界左右边界外，不放置不可见碰撞墙。
- NPC 离场用渐远、渐隐和场景纵深表达，不用空气墙阻挡玩家。
- 镜头边界设置到整个世界宽度，并检查左右两端。

推荐过渡结构：

```text
上一幕地面延伸到下一幕
重叠区使用不规则像素边缘
中层树/建筑错位遮挡接缝
天气和色温逐段插值
最后让新地面完全覆盖旧地面
```

验收时必须实际从世界最左走到最右，再从右返回主线，确认没有卡住、跳变和
黑色边带。

### 3.4 层级遮挡

固定 UI 永远使用 `setScrollFactor(0)`。

检查项：

- 右上手机横幅不会遮住顶部旁白。
- 对话框打开时暂停或隐藏其他长文本。
- 暂停层覆盖所有游戏内容和 UI。
- 角色、前景树不能遮盖名牌和 E 提示。
- 远景天空层的 depth 不能高于角色。
- 交互名称跟随物件时，偏移值应适配不同高度，不能统一写死。

### 3.5 镜头

镜头接管演出时必须遵循：

1. `camera.stopFollow()`
2. 执行有限时长的 pan / zoom
3. 最终固定定时器恢复
4. `camera.startFollow(traveler)`
5. 恢复 `zoom = 1`

镜头动画不能成为唯一解锁条件。暂停和恢复后，应当能从最终定时器正常继续。

### 3.6 一次性事件与折返

所有要求只发生一次的事件必须设置：

```ts
once: true
```

并通过 `StoryDirector.complete(event)` 写入完成标记。

折返验收：

- 已触发事件回到区域后不重播。
- 已拾取/触碰物体不会错误重置剧情。
- 环境光影可以随玩家位置变化，但事件状态不能倒退。
- 返回 Hub 再进入时会重置整个世界，属于新一次体验。

### 3.7 暂停与 Esc

`setPaused()` 必须同时满足：

```ts
this.paused = paused;
this.pauseOverlay.setVisible(paused);
this.interactions.setEnabled(!paused && !this.inputLocked);
this.traveler.stop();
this.input.keyboard?.resetKeys();
```

暂停恢复后再次按 Esc，必须能继续探索。在剧情锁定时暂停，也要等待原剧情
定时器结束，再根据当前暂停状态恢复交互。

### 3.8 控制台与资源

发布前必须确认：

- 没有未处理异常。
- 没有 404 资源请求。
- 字体只加载一次。
- 不出现缺失纹理。
- Phaser 包体积警告可以记录为已知问题，但不能有 TypeScript 错误。
- 不依赖开发服务器缓存；使用构建后的 `dist` 进行一次完整试玩。

---

## 4. 开发新世界的执行流程

### 第一步：写故事与分镜

先完成新世界的叙事，再写代码。

工作：

1. 将现有世界专属故事归档到 `docs/worlds/fuji/STORY.md`。
2. 用新世界故事替换根目录 `STORY.md`，或明确改为多世界索引。
3. 写清 4–6 幕空间结构和情绪变化。
4. 标记所有关键互动、一次性事件、镜头和 NPC 命运边界。
5. 确认玩家不能改变世界核心结局。
6. 确认不提前写原歌词字幕。

交付物：

- 可执行的分幕表。
- 每幕的关键动作和镜头。
- 每个事件的触发位置与完成条件。

### 第二步：设定配色与场景坐标

工作：

1. 归档旧世界美术规范。
2. 更新 `ART_STYLE.md` 为新世界配色、角色、建筑、天气和光照。
3. 定义世界总宽度。
4. 定义每一幕的 `START_X` / `END_X`。
5. 定义地面高度、入口、主要互动点、NPC 停点和镜头焦点。
6. 先画低分辨率色块分镜，确认比例后再绘正式像素细节。

场景坐标示例：

```ts
export const WORLD_WIDTH = 6400;
export const GROUND_Y = 238;

export const ACT1_START_X = 0;
export const ACT1_END_X = 1300;
export const ACT2_START_X = 1150;
export const ACT2_END_X = 2600;
export const ACT3_START_X = 2450;
export const ACT3_END_X = 4200;
export const ACT4_START_X = 4050;
export const ACT4_END_X = 6400;
```

相邻幕必须有意重叠，例如上一幕结束 `1300`、下一幕开始 `1150`。

### 第三步：编写专属事件

新建：

```text
src/game/data/qilixiangEvents.ts
```

工作：

1. 定义每个事件的唯一 ID。
2. 定义交互或区域 trigger。
3. 标记 `once` 和 `lockInput`。
4. 设置 `cameraCue`。
5. 设置最终 `durationMs` 和兜底结束时间。
6. 设置唯一 `completionFlag`。
7. 接入 `new StoryDirector(this, QILIXIANG_EVENTS)`。

完成标准：

- 每个事件可从 `not_started` 进入 `running` 再进入 `completed`。
- 事件结束后输入和交互恢复。
- 事件折返不重播。

### 第四步：绘制场景与背景

新建：

```text
src/game/art/createQilixiangBackdrop.ts
```

工作：

1. 先完成静态天空、远景、中景、地面和前景。
2. 按 `0 / 0.08 / 0.3 / 1` 设置视差。
3. 按幕拆成绘制函数。
4. 逐幕检查地面接缝和视差空洞。
5. 最后加入雨、雪、花、灯、影子等环境层。
6. 不在背景模块内写剧情状态。

建议子函数：

```ts
createQilixiangBackdrop(scene)
createAct1Backdrop(scene)
createAct2Backdrop(scene)
createAct3Backdrop(scene)
drawParallaxFar(scene)
drawStreetSeam(scene)
```

### 第五步：Hub 入口、Scene 注册与 Title 关联

工作：

1. 在 Hub 绘制新地标。
2. 为地标增加 `InteractionSystem` target。
3. 点击入口后显示外部播放提示。
4. 进入前重置剧情 Registry。
5. 停止旧目标 Scene 并启动新世界。
6. 在 `main.ts` 注册新 Scene。
7. 在 Title 中只增加世界说明，不复制全球 Launch Scene。

完成后的启动链：

```text
BootScene
  → TitleScene
  → HubScene
      → FujiScene
      → QilixiangScene
```

---

## 5. 发布前验收 Checklist

### 构建与静态检查

- [ ] `npm run build` 通过。
- [ ] `tsc --noEmit` 无错误。
- [ ] 没有新增未使用 import 或孤儿变量。
- [ ] `.gitignore` 包含 `node_modules/` 和 `dist/`。
- [ ] GitHub Pages 使用相对资源路径。

### 完整流程

- [ ] Title → Hub → 新地标入口。
- [ ] 入口提示明确歌曲名称和外部播放要求。
- [ ] 新世界可从头进入第一幕。
- [ ] 所有幕可从左走到右。
- [ ] 所有互动点名称和 E 提示位置正确。
- [ ] 返回 Hub 正常。
- [ ] 再次进入新世界，所有事件与旁白重置。

### 演出与控制

- [ ] 每个 `lockInput` 事件有独立兜底结束定时器。
- [ ] 每个锁输入事件结束后玩家可移动。
- [ ] Esc 暂停/恢复正常。
- [ ] Esc 在剧情锁定期间暂停后不会软锁。
- [ ] 镜头结束恢复 follow 和 zoom = 1。
- [ ] 一次性事件折返不重播。
- [ ] 玩家不能获得只属于 NPC 的关键物件。

### 画面

- [ ] 逻辑分辨率保持 480×270。
- [ ] Canvas 使用 nearest-neighbor。
- [ ] 所有菜单、旁白、对话和 UI 不被遮挡。
- [ ] 旁白和对话不重叠。
- [ ] 视差层没有空底。
- [ ] 多幕接缝没有垂直硬切线。
- [ ] 没有不可见墙和场景交界卡死。
- [ ] 镜头左右边界没有黑边。

### 控制台

- [ ] 没有未处理异常。
- [ ] 没有 404。
- [ ] 没有缺失纹理或字体错误。
- [ ] 使用构建后的 `dist` 完成一次真实试玩。

---

## 6. 开发红线

以下内容不得在未经明确需求时加入：

- 战斗、血量、失败条件。
- 解谜和任务列表。
- 经验值、装备栏和掉落系统。
- 多结局和玩家改变 NPC 核心命运。
- 嵌入原曲、歌词或第三方播放器同步。
- 为单个功能提前发明通用框架。
- 用彩色矩形和圆形作为正式美术交付。
- 用动画完成回调作为唯一解锁路径。
- 用隐形墙阻止玩家追随 NPC。
- 把所有世界塞进一个巨型 Scene 或一个巨型事件文件。

---

## 7. 新世界开工时的最短提示

后续开发《七里香》或其他世界时，可以直接使用以下指令：

```text
先完整阅读 WORLD_DEV_GUIDE.md、AGENTS.md 和当前世界相关文档。
按指南新建独立 Scene、events、backdrop 和 Hub 入口；
复用 TitleScene、HubScene、StoryDirector、NarrationSystem 和
InteractionSystem，不修改已验收世界的剧情与美术。
先完成故事、坐标和事件表，再绘制背景；每次修改后运行构建并实际试玩。
```

这份规范的目标不是让每个世界长得一样，而是让每个世界都能安全地使用
同一套生命周期、状态管理、输入保护和验收方法，把创作者的时间留给故事、
美术和音乐意象本身。
