# 技术实现规范

## 技术栈

TypeScript + Phaser 3 + Vite；优先桌面 Chrome/Edge。Canvas/WebGL 由
Phaser 管理。使用严格类型检查与构建脚本。

## 推荐目录

-   `src/main.ts` 启动入口
-   `src/game/scenes/BootScene.ts` 资源与设置
-   `src/game/scenes/HubScene.ts` 主世界
-   `src/game/scenes/FujiScene.ts` 富士山下长卷
-   `src/game/entities/Traveler.ts` 角色与动画
-   `src/game/entities/NPC.ts` NPC 状态机
-   `src/game/systems/InteractionSystem.ts` E 交互
-   `src/game/systems/StoryDirector.ts` 剧情事件/状态
-   `src/game/systems/CameraDirector.ts` 镜头与锁定
-   `src/game/systems/WeatherSystem.ts` 雨雪花瓣
-   `src/game/data/fujiEvents.ts` 数据化事件
-   `src/game/ui/` 对话、提示、暂停菜单
-   `public/assets/` sprites、背景、UI、可选环境音
-   `references/` 已审核概念图及资源来源说明

## 基础实现

-   逻辑尺寸 480×270；响应式整数倍适配；nearest-neighbor。
-   2D 横向移动、角色朝向、地面碰撞/边界、镜头平滑跟随与视差层。
-   以连续世界坐标划分五幕区域；参考初始总长度 6200
    逻辑像素（1200/1000/1800/1200/1000），按试玩调整。
-   事件状态：`not_started/running/completed`，一次性触发；剧情锁定期间屏蔽移动但保留
    Esc 菜单策略。
-   镜头接管时结束必须恢复控制；动画或资源失败时要有超时回退，防止软锁。
-   玩家折返不倒退剧情；当前世界环境由剧情阶段与坐标共同决定。
-   NPC 使用轻量状态机与脚本动画，不接入 LLM 或在线 AI。
-   不自动播放歌曲，不抓取播放器，不内嵌原曲或歌词；环境音可选，默认关闭。
-   预留未来歌曲模块的统一接口：`id/title/entryLandmark/worldFactory/promptText`，但**不要提前实现其他歌曲世界**。

## 质量

`npm run build`
必须成功；控制台无未处理异常；重启/返回主世界正常；五幕可从头到尾走通；操作锁定无死锁；资源缺失有可读错误；尽可能提供基础单元测试或可复现手动测试清单。
