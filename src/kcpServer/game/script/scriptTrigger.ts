import { LuaEngine, LuaFactory } from "wasmoon"

import ScriptArgs from "./scriptArgs"
import context from "./scriptLibContext"
import ScriptLoader from "./scriptLoader"
import scriptManager from "./scriptManager"

import BaseClass from "#/baseClass"
import Logger from "@/logger"
import { EventTypeEnum } from "@/types/enum"
import { getFunctionName, toCamelCase } from "@/utils/string"

interface conditionFunc {
  (context: context, args: ScriptArgs): boolean
}

interface actionFunc {
  (context: context, args: ScriptArgs): void
}

const logger = new Logger("ScriptTrigger", 0xff7f50)

export default class ScriptTrigger extends BaseClass {
  lua: LuaEngine
  isInit: boolean

  constructor() {
    super()

    super.initHandlers(this)
  }

  async init() {
    this.lua = await new LuaFactory().createEngine()
    this.isInit = true
  }

  async runTrigger(scriptLoader: ScriptLoader, scriptManager: scriptManager, type: EventTypeEnum, ...args: any[]) {
    const { currentGroup } = scriptManager

    if (!this.isInit) await this.init()

    const lua = await scriptLoader.init(this.lua, scriptManager.scene.id, currentGroup.id)

    const activeChallenge = currentGroup.scene.activeChallenge

    if (activeChallenge) activeChallenge.onGroupTriggerDeath(EventTypeEnum[type], currentGroup)
    if (currentGroup.trigger?.length > 0)
      await this.emit(toCamelCase(EventTypeEnum[type].replace("EVENT_", "")), scriptManager, lua, ...args)
  }

  /** Trigger Event **/

  // None

  // AnyMonsterDie

  handleAnyMonsterDie(scriptManager: scriptManager, lua: LuaEngine, configId: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_ANY_MONSTER_DIE)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = { param1: configId }

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // AnyGadgetDie

  handleAnyGadgetDie(scriptManager: scriptManager, lua: LuaEngine, gadgetId: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_ANY_MONSTER_DIE)
        .forEach(({ Event, Condition, Action }) => {
          if (Event !== EventTypeEnum.EVENT_ANY_GADGET_DIE) return

          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = { param1: gadgetId }

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // VariableChange

  handleVariableChange(scriptManager: scriptManager, lua: LuaEngine, oldValue: number, newValue: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_VARIABLE_CHANGE)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = { param1: oldValue, param2: newValue }

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // EnterRegion

  handleEnterRegion(scriptManager: scriptManager, lua: LuaEngine, configId: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_ENTER_REGION)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = { param1: configId }

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // LeaveRegion

  // GadgetCreate

  handleGadgetCreate(scriptManager: scriptManager, lua: LuaEngine, configIdList: number[]) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_GADGET_CREATE)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          configIdList.forEach((configId) => {
            const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
            const args: ScriptArgs = { param1: configId }

            if (condition) {
              const conditionResult: boolean = condition({ ...context, args }, args)
              logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

              if (conditionResult && Action) {
                logger.verbose(`${EventTypeEnum[Event]} Action`)
                action({ ...context, args }, args)
              }
            } else if (action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          })
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // GadgetStateChange

  handleGadgetStateChange(scriptManager: scriptManager, lua: LuaEngine, configId: number, state: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_GADGET_STATE_CHANGE)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = { param1: state, param2: configId }

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // DungeonSettle

  handleDungeonSettle(scriptManager: scriptManager, lua: LuaEngine, ischallenge: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.block.groupList.forEach((sceneGroup) => {
        sceneGroup.trigger
          .filter(({ Event }) => Event === EventTypeEnum.EVENT_DUNGEON_SETTLE)
          .forEach(({ Event, Condition, Action }) => {
            const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
            const action: actionFunc = lua.global.get(getFunctionName(Action))

            const context: context = { currentGroup: sceneGroup, scriptManager: scriptManager, uid: 0 }
            const args: ScriptArgs = { param1: ischallenge ? 0 : 1 }

            if (condition) {
              const conditionResult: boolean = condition({ ...context, args }, args)
              logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult}`)

              if (conditionResult && Action) {
                logger.verbose(`${EventTypeEnum[Event]} Action`)
                action({ ...context, args }, args)
              }
            } else if (action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          })

        lua.global.resetThread()
      })
    } finally {
      lua.global.resetThread()
    }
  }

  // SelectOption

  handleSelectOption(scriptManager: scriptManager, lua: LuaEngine, configId: number, optionid: number) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_SELECT_OPTION)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = { param1: configId, param2: optionid }

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // ClientExecute

  // AnyMonsterLive

  handleAnyMonsterLive(scriptManager: scriptManager, lua: LuaEngine, configIdList: number[]) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_ANY_MONSTER_LIVE)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          configIdList.forEach((configId) => {
            const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
            const args: ScriptArgs = { param1: configId }

            if (condition) {
              const conditionResult: boolean = condition({ ...context, args }, args)
              logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult} ${JSON.stringify(args)}`)

              if (conditionResult && Action) {
                logger.verbose(`${EventTypeEnum[Event]} Action`)
                action({ ...context, args }, args)
              }
            } else if (action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          })
        })
    } finally {
      lua.global.resetThread()
    }
  }
  // SpecificMonsterHPChange

  // CityLevelupUnlockDungeonEntry

  // DungeonBroadcastOnTimer

  // TimerEvent

  // ChallengeSuccess

  handleChallengeSuccess(scriptManager: scriptManager, lua: LuaEngine) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_CHALLENGE_SUCCESS)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = null

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // ChallengeFail

  handleChallengeFail(scriptManager: scriptManager, lua: LuaEngine) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_CHALLENGE_FAIL)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = null

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.verbose(`${EventTypeEnum[Event]} Condition ${conditionResult}`)

            if (conditionResult && Action) {
              logger.verbose(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.verbose(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }
  // SealBattleBegin

  // SealBattleEnd

  // Gather

  // QuestFinish

  // MonsterBattle

  // CityLevelup

  // CutsceneEnd

  // AvatarNearPlatform

  // PlatformReachPoint

  // UnlockTransPoint

  // QuestStart

  // GroupLoad
  handleGroupLoad(scriptManager: scriptManager, lua: LuaEngine) {
    const { currentGroup } = scriptManager

    try {
      currentGroup.trigger
        .filter(({ Event }) => Event === EventTypeEnum.EVENT_GROUP_LOAD)
        .forEach(({ Event, Condition, Action }) => {
          const condition: conditionFunc = lua.global.get(getFunctionName(Condition))
          const action: actionFunc = lua.global.get(getFunctionName(Action))

          const context: context = { currentGroup: currentGroup, scriptManager: scriptManager, uid: 0 }
          const args: ScriptArgs = null

          if (condition) {
            const conditionResult: boolean = condition({ ...context, args }, args)
            logger.debug(`${EventTypeEnum[Event]} Condition ${conditionResult}`)

            if (conditionResult && Action) {
              logger.debug(`${EventTypeEnum[Event]} Action`)
              action({ ...context, args }, args)
            }
          } else if (action) {
            logger.debug(`${EventTypeEnum[Event]} Action`)
            action({ ...context, args }, args)
          }

          return
        })
    } finally {
      lua.global.resetThread()
    }
  }

  // GroupWillUnload

  // GroupWillRefresh

  // GroupRefresh

  // DungeonRewardGet

  // SpecificGadgetHPChange

  // MonsterTideOver

  // MonsterTideCreate

  // MonsterTideDie

  // SealampPhaseChange

  // BlossomProgressFinish

  // BlossomChestDie

  // GadgetPlayStart

  // GadgetPlayStartCD

  // GadgetPlayStop

  // GadgetLuaNotify

  // MPPlayPrepare

  // MPPlayBattle

  // MPPlayPrepareInterrupt

  // SelectDifficulty

  // SceneMPPlayBattleState

  // SceneMPPlayBattleStageChange

  // SceneMPPlayBattleResult

  // SealBattleProgressDecrease

  // GeneralRewardDie

  // SceneMPPlayBattleInterrupt

  // MonsterDieBeforeLeaveScene

  // SceneMPPlayOpen

  // OfferingLevelup

  // DungeonRevive

  // SceneMPPlayAllAvatarDie

  // DungeonAllAvatarDie

  // GeneralRewardTaken

  // PlatformReachArrayPoint

  // SceneMultistagePlayStageEnd

  // SceneMultistagePlayEndStageReq

  // MechanicusPickedCard

  // PoolMonsterTideOver

  // PoolMonsterTideCreate

  // PoolMonsterTideDie

  // DungeonAvatarSlipDie

  // GalleryStart

  // GalleryStop

  // TimeAxisPass

  // FleurFairDungeonAllPlayerEnter

  // GadgetTalkDone

  // SetGameTime

  // HideAndSeekPlayerQuit

  // AvatarDie

  // SceneMultistagePlayStageStart

  // GalleryProgressPass

  // GalleryProgressEmpty

  // GalleryProgressFull

  // HuntingFinishFinal

  // UseWidgetToyFoxCamera

  // LunaRiteSacrifice

  // SumoSwitchTeamEvent

  // FishingStart

  // FishingStop

  // FishingQTEFinish

  // FishingTimeoutFlee

  // RogueCellStateChange

  // RogueCellConstruct

  // RogueCellFinishSelectCard

  // AnyMonsterCapture

  // ActivityInteractGadget

  // ChallengePause

  // LevelTagChange

  // CustomDungeonStart

  // CustomDungeonRestart

  // CustomDungeonReactive

  // CustomDungeonOutStuck

  // CustomDungeonExitTry

  // CustomDungeonOfficialRestart

  // AnyMonsterCaptureAndDisappear

  // MichiaeInteract

  // SelectUIInteract

  // LuaNotify

  // PhotoFinish

  // IrodoriMasterReady

  // RogueStartFight

  // RogueCreageFightGadget

  // RogueCreageRepairGadget

  // RogueOpenAccess

  // GadgetGivingFinished

  // ObservationPointNotify

  // GadgetGivingTakeback

  // EchoShellInteract

  // PlatformArrival

  // PlayerBackGalleryRevivePoint

  // GalleryCannotStartAfterCountdown
}
