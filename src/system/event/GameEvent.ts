/**
 * 游戏事件管理器
 * 基于 EventEmitter 实现的游戏事件订阅系统
 * 用于封装 Warcraft III 原生游戏事件（单位死亡、伤害、技能等）
 */

import { bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define";
import { EventEmitter, EventHandler, SubscribeOptions } from "./EventEmitter";

/**
 * 玩家单位事件 ID（用于 ConvertPlayerUnitEvent）
 * @see https://jass.fandom.com/wiki/PlayerUnitEvent
 */
export const PlayerUnitEventId = {
  ATTACKED: 18,        // EVENT_PLAYER_UNIT_ATTACKED
  RESCUED: 19,         // EVENT_PLAYER_UNIT_RESCUED
  DEATH: 20,           // EVENT_PLAYER_UNIT_DEATH
  DECAY: 21,           // EVENT_PLAYER_UNIT_DECAY
  DETECTED: 22,        // EVENT_PLAYER_UNIT_DETECTED
  HIDDEN: 23,          // EVENT_PLAYER_UNIT_HIDDEN
  SELECTED: 24,        // EVENT_PLAYER_UNIT_SELECTED
  DESELECTED: 25,      // EVENT_PLAYER_UNIT_DESELECTED
  CONSTRUCT_START: 26, // EVENT_PLAYER_UNIT_CONSTRUCT_START
  CONSTRUCT_CANCEL: 27,// EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL
  CONSTRUCT_FINISH: 28,// EVENT_PLAYER_UNIT_CONSTRUCT_FINISH
  UPGRADE_START: 29,   // EVENT_PLAYER_UNIT_UPGRADE_START
  UPGRADE_CANCEL: 30,  // EVENT_PLAYER_UNIT_UPGRADE_CANCEL
  UPGRADE_FINISH: 31,  // EVENT_PLAYER_UNIT_UPGRADE_FINISH
  TRAIN_START: 32,     // EVENT_PLAYER_UNIT_TRAIN_START
  TRAIN_CANCEL: 33,    // EVENT_PLAYER_UNIT_TRAIN_CANCEL
  TRAIN_FINISH: 34,    // EVENT_PLAYER_UNIT_TRAIN_FINISH
  RESEARCH_START: 35,  // EVENT_PLAYER_UNIT_RESEARCH_START
  RESEARCH_CANCEL: 36, // EVENT_PLAYER_UNIT_RESEARCH_CANCEL
  RESEARCH_FINISH: 37, // EVENT_PLAYER_UNIT_RESEARCH_FINISH
  ISSUED_ORDER: 38,    // EVENT_PLAYER_UNIT_ISSUED_ORDER
  ISSUED_POINT_ORDER: 39, // EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER
  ISSUED_TARGET_ORDER: 40,// EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER
  HERO_LEVEL: 41,      // EVENT_PLAYER_HERO_LEVEL
  HERO_SKILL: 42,      // EVENT_PLAYER_HERO_SKILL
  HERO_REVIVABLE: 43,  // EVENT_PLAYER_HERO_REVIVABLE
  HERO_REVIVE_START: 44, // EVENT_PLAYER_HERO_REVIVE_START
  HERO_REVIVE_CANCEL: 45,// EVENT_PLAYER_HERO_REVIVE_CANCEL
  HERO_REVIVE_FINISH: 46,// EVENT_PLAYER_HERO_REVIVE_FINISH
  SUMMON: 47,          // EVENT_PLAYER_UNIT_SUMMON
  DROP_ITEM: 48,       // EVENT_PLAYER_UNIT_DROP_ITEM
  PICKUP_ITEM: 49,     // EVENT_PLAYER_UNIT_PICKUP_ITEM
  USE_ITEM: 50,        // EVENT_PLAYER_UNIT_USE_ITEM
  LOADED: 51,          // EVENT_PLAYER_UNIT_LOADED
  DAMAGED: 52,         // EVENT_PLAYER_UNIT_DAMAGED (1.29+)
  DAMAGING: 53,        // EVENT_PLAYER_UNIT_DAMAGING (1.31+)
  SPELL_CHANNEL: 274,  // EVENT_PLAYER_UNIT_SPELL_CHANNEL
  SPELL_CAST: 275,     // EVENT_PLAYER_UNIT_SPELL_CAST
  SPELL_EFFECT: 276,   // EVENT_PLAYER_UNIT_SPELL_EFFECT
  SPELL_FINISH: 277,   // EVENT_PLAYER_UNIT_SPELL_FINISH
  SPELL_ENDCAST: 278,  // EVENT_PLAYER_UNIT_SPELL_ENDCAST
} as const;

/**
 * 游戏事件类型
 */
export const enum GameEventType {
  // 单位事件
  UNIT_DEATH = "game:unit:death",
  UNIT_DAMAGED = "game:unit:damaged",
  UNIT_ATTACKED = "game:unit:attacked",
  UNIT_SELECTED = "game:unit:selected",
  UNIT_DESELECTED = "game:unit:deselected",
  UNIT_SPELL_CAST = "game:unit:spellCast",
  UNIT_SPELL_EFFECT = "game:unit:spellEffect",
  UNIT_SPELL_FINISH = "game:unit:spellFinish",
  
  // 玩家事件
  PLAYER_CHAT = "game:player:chat",
  PLAYER_LEAVE = "game:player:leave",
  PLAYER_DEFEAT = "game:player:defeat",
  PLAYER_VICTORY = "game:player:victory",
  
  // 游戏事件
  GAME_TIMER = "game:timer",
  GAME_SAVE = "game:save",
  GAME_LOAD = "game:load",
}

/**
 * 单位事件数据基类
 */
export interface UnitEventData {
  /** 触发事件的单位 */
  unit: unit;
  /** 单位类型 ID */
  unitTypeId: number;
  /** 所属玩家 */
  owner: player;
}

/**
 * 单位死亡事件数据
 */
export interface UnitDeathEventData extends UnitEventData {
  /** 击杀者 */
  killer?: unit;
}

/**
 * 单位伤害事件数据
 */
export interface UnitDamageEventData extends UnitEventData {
  /** 伤害来源 */
  source: unit;
  /** 伤害值 */
  damage: number;
  /** 攻击类型 */
  attackType?: number;
  /** 伤害类型 */
  damageType?: number;
}

/**
 * 技能事件数据
 */
export interface SpellEventData extends UnitEventData {
  /** 技能 ID */
  abilityId: number;
  /** 目标单位（可选） */
  targetUnit?: unit;
  /** 目标点 X */
  targetX?: number;
  /** 目标点 Y */
  targetY?: number;
}

/**
 * 玩家聊天事件数据
 */
export interface PlayerChatEventData {
  /** 玩家 */
  player: player;
  /** 玩家索引 */
  playerId: number;
  /** 聊天内容 */
  message: string;
}

/**
 * 游戏事件处理器
 */
export type GameEventHandler<T = any> = EventHandler<T>;

/**
 * 辅助函数：为所有玩家注册单位事件
 * 模拟 TriggerRegisterAnyUnitEventBJ
 */
function registerAnyUnitEvent(trig: trigger, eventId: number): void {
  const event = ConvertPlayerUnitEvent(eventId);
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(trig, Player(i), event, null);
  }
}

/**
 * 游戏事件管理器
 */
export class GameEventManager extends EventEmitter {
  private static instance: GameEventManager | undefined;
  
  /** 原生触发器 */
  private nativeTriggers: trigger[] = [];
  
  /** 已注册的事件类型 */
  private registeredEvents: Set<GameEventType> = new Set();
  
  private constructor() {
    super("GameEventManager");
  }
  
  /**
   * 获取游戏事件管理器实例
   */
  public static getInstance(): GameEventManager {
    if (!GameEventManager.instance) {
      GameEventManager.instance = new GameEventManager();
    }
    return GameEventManager.instance;
  }
  
  /**
   * 初始化常用游戏事件
   */
  public initialize(): void {
    // 可选择性注册常用事件
    print("[GameEventManager] 初始化完成");
  }
  
  /**
   * 注册单位死亡事件
   */
  public registerUnitDeathEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_DEATH)) return;
    
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    registerAnyUnitEvent(trig, PlayerUnitEventId.DEATH);
    TriggerAddAction(trig, () => {
      const dyingUnit = GetTriggerUnit();
      const killingUnit = GetKillingUnit();
      
      const data: UnitDeathEventData = {
        unit: dyingUnit,
        unitTypeId: GetUnitTypeId(dyingUnit),
        owner: GetOwningPlayer(dyingUnit),
        killer: killingUnit,
      };
      
      this.emit(GameEventType.UNIT_DEATH, data);
    });
    
    this.registeredEvents.add(GameEventType.UNIT_DEATH);
  }
  
  /**
   * 注册单位被攻击事件
   */
  public registerUnitAttackedEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_ATTACKED)) return;
    
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    registerAnyUnitEvent(trig, PlayerUnitEventId.ATTACKED);
    TriggerAddAction(trig, () => {
      const attackedUnit = GetTriggerUnit();
      const attacker = GetAttacker();
      
      const data: UnitDamageEventData = {
        unit: attackedUnit,
        unitTypeId: GetUnitTypeId(attackedUnit),
        owner: GetOwningPlayer(attackedUnit),
        source: attacker,
        damage: 0, // 攻击事件没有具体伤害值
      };
      
      this.emit(GameEventType.UNIT_ATTACKED, data);
    });
    
    this.registeredEvents.add(GameEventType.UNIT_ATTACKED);
  }
  
  /**
   * 注册技能释放事件
   */
  public registerSpellEvent(): void {
    if (this.registeredEvents.has(GameEventType.UNIT_SPELL_EFFECT)) return;
    
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    registerAnyUnitEvent(trig, PlayerUnitEventId.SPELL_EFFECT);
    TriggerAddAction(trig, () => {
      const caster = GetTriggerUnit();
      const targetUnit = GetSpellTargetUnit();
      
      const data: SpellEventData = {
        unit: caster,
        unitTypeId: GetUnitTypeId(caster),
        owner: GetOwningPlayer(caster),
        abilityId: GetSpellAbilityId(),
        targetUnit: targetUnit,
        targetX: GetSpellTargetX(),
        targetY: GetSpellTargetY(),
      };
      
      this.emit(GameEventType.UNIT_SPELL_EFFECT, data);
      
      // 同时发射技能特定事件
      this.emit(`${GameEventType.UNIT_SPELL_EFFECT}:${data.abilityId}`, data);
    });
    
    this.registeredEvents.add(GameEventType.UNIT_SPELL_EFFECT);
  }
  
  /**
   * 注册玩家聊天事件
   * @param prefix 聊天前缀（可选，用于命令过滤）
   * @param exactMatch 是否精确匹配
   */
  public registerPlayerChatEvent(prefix: string = "", exactMatch: boolean = false): void {
    const trig = CreateTrigger();
    this.nativeTriggers.push(trig);
    
    // 为所有玩家注册聊天事件
    for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
      TriggerRegisterPlayerChatEvent(trig, Player(i), prefix, exactMatch);
    }
    
    TriggerAddAction(trig, () => {
      const chatPlayer = GetTriggerPlayer();
      
      const data: PlayerChatEventData = {
        player: chatPlayer,
        playerId: GetPlayerId(chatPlayer),
        message: GetEventPlayerChatString(),
      };
      
      this.emit(GameEventType.PLAYER_CHAT, data);
    });
    
    this.registeredEvents.add(GameEventType.PLAYER_CHAT);
  }
  
  // =====================
  // 便捷订阅方法
  // =====================
  
  /**
   * 订阅单位死亡事件
   */
  public onUnitDeath(
    handler: GameEventHandler<UnitDeathEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitDeathEvent();
    return this.on(GameEventType.UNIT_DEATH, handler, options);
  }
  
  /**
   * 订阅单位被攻击事件
   */
  public onUnitAttacked(
    handler: GameEventHandler<UnitDamageEventData>,
    options?: SubscribeOptions
  ): number {
    this.registerUnitAttackedEvent();
    return this.on(GameEventType.UNIT_ATTACKED, handler, options);
  }
  
  /**
   * 订阅技能释放事件
   * @param handler 处理器
   * @param abilityId 指定技能 ID（可选）
   * @param options 订阅选项
   */
  public onSpellEffect(
    handler: GameEventHandler<SpellEventData>,
    abilityId?: number,
    options?: SubscribeOptions
  ): number {
    this.registerSpellEvent();
    const eventName = abilityId 
      ? `${GameEventType.UNIT_SPELL_EFFECT}:${abilityId}` 
      : GameEventType.UNIT_SPELL_EFFECT;
    return this.on(eventName, handler, options);
  }
  
  /**
   * 订阅玩家聊天事件
   */
  public onPlayerChat(
    handler: GameEventHandler<PlayerChatEventData>,
    options?: SubscribeOptions
  ): number {
    if (!this.registeredEvents.has(GameEventType.PLAYER_CHAT)) {
      this.registerPlayerChatEvent();
    }
    return this.on(GameEventType.PLAYER_CHAT, handler, options);
  }
  
  /**
   * 销毁管理器
   */
  public override destroy(): void {
    super.destroy();
    
    for (const trig of this.nativeTriggers) {
      DestroyTrigger(trig);
    }
    this.nativeTriggers = [];
    this.registeredEvents.clear();
  }
}

/**
 * 快捷访问游戏事件管理器
 */
export const gameEvents = GameEventManager.getInstance();
