import context from "./scriptLibContext"

import BeginCameraSceneLook, { BeginCameraSceneLookNotify } from "#/packets/BeginCameraSceneLook"
import ChallengeFactory from "$/challenge/factory"
import Vector from "$/utils/vector"
import Logger from "@/logger"
import { EventTypeEnum, GadgetStateEnum } from "@/types/enum"
import { PlayerDieTypeEnum } from "@/types/proto/enum"
import { toCamelCase } from "@/utils/string"

const logger = new Logger("ScriptLib", 0xff7f50)

export default class ScriptLib {
  _
  public ActivateDungeonCheckPoint(_context: context, var1: number) {
    logger.warn("Call unimplemented ActivateDungeonCheckPoint", var1)

    return 0
  }

  public ActivateGroupLinkBundle(_context: context, groupId: number) {
    logger.warn("Call unimplemented ActivateGroupLinkBundle", groupId)

    return 0
  }

  public ActiveChallenge(
    context: context,
    challengeId: number,
    challengeIndex: number,
    timeLimitOrGroupId: number,
    groupId: number,
    objectiveKills: number,
    param5: number
  ) {
    logger.debug(
      "Call ActiveChallenge",
      challengeId,
      challengeIndex,
      timeLimitOrGroupId,
      groupId,
      objectiveKills,
      param5
    )

    const challenge = ChallengeFactory.getChallenge(
      challengeId,
      challengeIndex,
      timeLimitOrGroupId,
      groupId,
      objectiveKills,
      param5,
      context.currentGroup.scene,
      context.currentGroup
    )

    context.currentGroup.scene.activeChallenge = challenge
    challenge.start()

    return 0
  }

  public ActiveGadgetItemGiving(_context: context, var1: number, var2: number, var3: number) {
    logger.warn("Call unimplemented ActiveGadgetItemGiving", var1, var2, var3)

    return 0
  }

  public AddBlossomScheduleProgressByGroupId(_context: context, groupId: number) {
    logger.warn("Call unimplemented AddBlossomScheduleProgressByGroupId", groupId)

    return 0
  }

  public AddEntityGlobalFloatValueByConfigId(_context: context, configId: number, var1: string, var2: number) {
    logger.warn("Call unimplemented AddEntityGlobalFloatValueByConfigId", configId, var1, var2)

    return 0
  }

  public AddExhibitionAccumulableData(_context: context, uid: number, var1: string, var2: number) {
    logger.warn("Call unimplemented AddExhibitionAccumulableData", uid, var1, var2)

    return 0
  }

  //var2 FlowSuiteOperatePolicy enum
  public AddExtraFlowSuite(_context: context, groupId: number, var1: number, var2: number) {
    logger.warn("Call unimplemented AddExtraFlowSuite", groupId, var1, var2)

    return 0
  }

  public AddExtraGroupSuite(context: context, groupId: number, suite: number) {
    const { scriptManager } = context
    logger.debug("Call AddExtraGroupSuite", groupId, suite)
    scriptManager.addGroupSuite(groupId, suite)
  }

  public AddPlayerGroupVisionType(_context: context, uid: number[], var1: number[]) {
    logger.warn("Call unimplemented AddPlayerGroupVisionType", uid, var1)

    return 0
  }

  public AddQuestProgress(_context: context, var1: string) {
    logger.warn("Call unimplemented AddQuestProgress", var1)

    return 0
  }

  public AddRegionalPlayVarValue(_context: context, uid: number, var1: number, var2: number) {
    logger.warn("Call unimplemented AddRegionalPlayVarValue", uid, var1, var2)

    return 0
  }

  public AddSceneTag(_context: context, var1: number, var2: number) {
    logger.warn("Call unimplemented AddSceneTag", var1, var2)

    return 0
  }

  public AddTeamEntityGlobalFloatValue(_context: context, uid: string, var1: string, var2: number) {
    logger.warn("Call unimplemented AddTeamEntityGlobalFloatValue", uid, var1, var2)

    return 0
  }

  public AssignPlayerShowTemplateReminder(
    _context: context,
    var1: number,
    table: { param_uid_vec: any[]; param_vec: any[]; uid_vec: number[] }
  ) {
    logger.warn("Call unimplemented AssignPlayerShowTemplateReminder", var1, table)

    return 0
  }

  public AttachChildChallenge(
    _context: context,
    var1: number,
    var2: number,
    var3: number,
    var4: number[],
    var5: any[],
    table: { success: number; fail: number }
  ) {
    logger.warn("Call unimplemented AttachChildChallenge", var1, var2, var3, var4, var5, table)

    return 0
  }

  public AttachGalleryAbilityGroup(_context: context, var1: any[], galleryID: number, var2: number) {
    logger.warn("Call unimplemented AttachGalleryAbilityGroup", var1, galleryID, var2)

    return 0
  }

  public AutoMonsterTide(
    context: context,
    chalengeIndex: number,
    groupId: number,
    ordersConfigId: number,
    tideCount: number,
    sceneLimit: number,
    param6: number
  ) {
    logger.warn(
      "Call unimplemented AutoMonsterTide",
      context,
      chalengeIndex,
      groupId,
      ordersConfigId,
      tideCount,
      sceneLimit,
      param6
    )

    return 0
  }

  public AutoPoolMonsterTide(
    _context: context,
    var1: number,
    var2: number,
    var3: number[],
    var4: number,
    var5: any[],
    var6: any[],
    table: {
      total_count: number
      min_count: number
      max_count: number
      tag: number
      fill_time: number
      fill_count: number
      is_ordered: boolean
    }
  ) {
    logger.warn("Call unimplemented AutoPoolMonsterTide", var1, var2, var3, var4, var5, var6, table)

    return 0
  }

  public BeginCameraSceneLook(
    context: context,
    table: {
      look_pos: Vector
      is_allow_input: boolean
      duration: number
      is_force: boolean
      is_broadcast: boolean
      is_recover_keep_current: boolean
      delay: number
      is_set_follow_pos: boolean
      follow_pos: Vector
      is_force_walk: boolean
      is_change_play_mode: boolean
      is_set_screen_XY: boolean
      screen_x: number
      screen_y: number
    }
  ) {
    const {
      look_pos,
      is_allow_input,
      duration,
      is_force,
      is_broadcast,
      is_recover_keep_current,
      is_set_follow_pos,
      follow_pos,
      is_force_walk,
      is_change_play_mode,
      is_set_screen_XY,
      screen_x,
      screen_y,
    } = table
    const { scriptManager } = context
    const NotifyData: BeginCameraSceneLookNotify = {
      lookPos: look_pos,
      AllowInput: is_allow_input,
      duration: duration,
      Force: is_force,
      RecoverKeepCurrent: is_recover_keep_current,
      FollowPos: is_set_follow_pos,
      followPos: follow_pos,
      ForceWalk: is_force_walk,
      ChangePlayMode: is_change_play_mode,
      ScreenXY: is_set_screen_XY,
      screenX: screen_x,
      screenY: screen_y,
    }
    logger.debug("Call BeginCameraSceneLook", context.currentGroup.id, table)
    if (is_broadcast) BeginCameraSceneLook.broadcastNotify(context.currentGroup.scene.broadcastContextList, NotifyData)
    else BeginCameraSceneLook.sendNotify(scriptManager.host.context, NotifyData)
    return 0
  }

  public BeginCameraSceneLookWithTemplate(
    _context: context,
    var1: number,
    table: {
      look_configid: number
      look_pos: Vector
      follow_type: number
      follow_pos: Vector
      is_broadcast: boolean
      delay: number
    }
  ) {
    logger.warn("Call unimplemented BeginCameraSceneLookWithTemplate", var1, table)
    return 0
  }

  public CancelGroupTimerEvent(_context: context, groupId: number, var1: string) {
    logger.warn("Call unimplemented CancelGroupTimerEvent", groupId, var1)

    return 0
  }

  public CauseDungeonFail(_context: context) {
    logger.warn("Call unimplemented CauseDungeonFail")

    return 0
  }

  public ChangeDeathZone(_context: context, var1: number, table: { is_open: boolean }) {
    logger.warn("Call unimplemented ChangeDeathZone", var1, table)

    return 0
  }

  public ChangeGroupGadget(context: context, table: { config_id: number; state: GadgetStateEnum }) {
    logger.debug("Call ChangeGroupGadget", table)
    const entity = context.currentGroup.gadgetList.find((gadget) => gadget.configId === table.config_id)
    if (!entity) {
    } else {
      entity.setGadgetState(table.state)
      return 0
    }
  }

  public ChangeGroupVariableValue(context: context, variable: string, value: number) {
    variable = toCamelCase(variable)
    logger.debug("Call ChangeGroupVariableValue", variable, value)
    context.currentGroup.Variables.find((Variable) => Variable.Name === variable).Value += value
    return 0
  }

  public ChangeGroupVariableValueByGroup(context: context, variable: string, value: number, groupId: number) {
    variable = toCamelCase(variable)
    logger.debug("Call ChangeGroupVariableValueByGroup", variable, value, groupId)

    const group = context.scriptManager.getGroup(groupId)

    group.Variables.find((Variable) => Variable.Name === variable).Value += value

    return 0
  }

  public ChangeToTargetLevelTag(_context: context, var1: number) {
    logger.warn("Call unimplemented ChangeToTargetLevelTag", var1)

    return 0
  }

  public ChangeToTargetLevelTagWithParamTable(
    _context: context,
    var1: number,
    table: {
      pos: Vector
      radius: number
      rot: Vector
    }
  ) {
    logger.warn("Call unimplemented ChangeToTargetLevelTagWithParamTable", var1, table)

    return 0
  }

  public CheckIsInGroup(_context: context, groupId: number, gadgetId: number) {
    logger.warn("Call unimplemented CheckIsInGroup", groupId, gadgetId)

    return 0
  }

  public CheckIsInMpMode(_context: context) {
    logger.warn("Call unimplemented CheckIsInMpMode")

    return 0
  }

  public CheckRemainGadgetCountByGroupId(_context: context, table: { group_id: number }) {
    logger.warn("Call unimplemented CheckRemainGadgetCountByGroupId", table)

    return 0
  }

  public CheckSceneTag(_context: context, var1: number, var2: number) {
    logger.warn("Call unimplemented CheckSceneTag", var1, var2)

    return 0
  }

  public ClearPlayerEyePoint(_context: context, var1: number) {
    logger.warn("Call unimplemented ClearPlayerEyePoint", var1)

    return 0
  }

  public ClearPoolMonsterTide(_context: context, groupId: number, var1: number) {
    logger.warn("Call unimplemented ClearPoolMonsterTide", groupId, var1)

    return 0
  }

  public ContinueTimeAxis(_context: context, var1: string) {
    logger.warn("Call unimplemented ContinueTimeAxis", var1)

    return 0
  }

  public CreateBlossomChestByGroupId(_context: context, groupId: number, var1: number) {
    logger.warn("Call unimplemented CreateBlossomChestByGroupId", groupId, var1)

    return 0
  }

  public CreateChannellerSlabCampRewardGadget(_context: context, var1: number) {
    logger.warn("Call unimplemented CreateChannellerSlabCampRewardGadget", var1)

    return 0
  }

  public CreateEffigyChallengeMonster(_context: context, var1: number, var2: number[]) {
    logger.warn("Call unimplemented CreateEffigyChallengeMonster", var1, var2)

    return 0
  }

  public CreateFatherChallenge(
    _context: context,
    var1: number,
    var2: number,
    var3: number,
    table: { success: number; fail: number; fail_on_wipe: boolean }
  ) {
    logger.warn("Call unimplemented CreateFatherChallenge", var1, var2, var3, table)

    return 0
  }

  public CreateGadget(context: context, table: { config_id: number }) {
    const { scriptManager, currentGroup } = context
    logger.debug("Call CreateGadget", table)
    scriptManager.CreateGadget(currentGroup.id, table.config_id)
    return 0
  }

  public CreateGadgetByConfigIdByPos(_context: context, configId: number, pos: Vector, rot: Vector) {
    logger.warn("Call unimplemented CreateGadgetByConfigIdByPos", configId, pos, rot)

    return 0
  }

  public CreateGroupTimerEvent(_context: context, var1: number, var2: string, var3: number) {
    logger.warn("Call unimplemented CreateGroupTimerEvent", var1, var2, var3)

    return 0
  }

  public CreateGroupVariable(_context: context, var1: string, var2: number) {
    logger.warn("Call unimplemented CreateGroupVariable", var1, var2)

    return 0
  }

  public CreateMonster(context: context, table: { config_id: number; delay_time: number }) {
    const { scriptManager, currentGroup } = context
    logger.debug("Call CreateMonster", table)
    scriptManager.CreateMonster(currentGroup.id, table.config_id, table.delay_time)
    return 0
  }

  public CreateMonsterByConfigIdByPos(_context: context, var1: number, pos: Vector, rot: Vector) {
    logger.warn("Call unimplemented CreateMonsterByConfigIdByPos", var1, pos, rot)

    return 0
  }

  public CreateMonsterFaceAvatar(
    _context: context,
    table: {
      entity_id: number
      monsters: number[]
      ranges: number[]
      angle: number
    }
  ) {
    logger.warn("Call unimplemented CreateMonsterFaceAvatar", table)

    return 0
  }

  public DelAllSubEntityByOriginOwnerConfigId(_context: context, var1: number) {
    logger.warn("Call unimplemented DelAllSubEntityByOriginOwnerConfigId", var1)

    return 0
  }

  public DelPlayerGroupVisionType(_context: context, uid: number[], var1: number[]) {
    logger.warn("Call unimplemented DelPlayerGroupVisionType", uid, var1)

    return 0
  }

  public DelSceneTag(_context: context, var1: number, var2: number) {
    logger.warn("Call unimplemented DelSceneTag", var1, var2)

    return 0
  }

  public DelWorktopOption(_context: context, var1: number) {
    logger.warn("Call unimplemented DelWorktopOption", var1)

    return 0
  }

  public DelWorktopOptionByGroupId(context: context, groupId: number, configId: number, option: number) {
    const { scriptManager } = context
    logger.debug("Call DelWorktopOptionByGroupId", groupId, configId, option)
    const gadget = scriptManager.getGroup(groupId).gadgetList.find((gadget) => gadget.configId === configId)
    gadget.setWorktopOption(gadget.worktopOption.filter((Option) => Option != option))
    return 0
  }

  public EndMonsterTide(_context: context, var1: number, var2: number, var3: number) {
    logger.warn("Call unimplemented EndMonsterTide", var1, var2, var3)

    return 0
  }

  public EndTimeAxis(_context: context, var1: string) {
    logger.warn("Call unimplemented EndTimeAxis", var1)

    return 0
  }

  public EnterPersistentDungeon(
    _context: context,
    evt: any,
    param2: number,
    var1: number,
    table: {
      pos: Vector
      rot: Vector
    }
  ) {
    logger.warn("Call unimplemented EnterPersistentDungeon", evt, param2, var1, table)

    return 0
  }

  public EnterWeatherArea(_context: context, var1: number) {
    logger.warn("Call unimplemented EnterWeatherArea", var1)

    return 0
  }

  public ExecuteGadgetLua(_context: context, ...arg) {
    logger.warn("Call unimplemented ExecuteGadgetLua", arg)

    return 0
  }

  public ExecuteGroupLua(_context: context, ...arg) {
    logger.warn("Call unimplemented ExecuteGroupLua", arg)

    return 0
  }

  public ExpeditionChallengeEnterRegion(_context: context, ...arg) {
    logger.warn("Call unimplemented ExpeditionChallengeEnterRegion", arg)

    return 0
  }

  public FailMistTrialDungeonChallenge(_context: context, ...arg) {
    logger.warn("Call unimplemented FailMistTrialDungeonChallenge", arg)

    return 0
  }

  public FinishExpeditionChallenge(_context: context, ...arg) {
    logger.warn("Call unimplemented FinishExpeditionChallenge", arg)

    return 0
  }

  public FinishGroupLinkBundle(_context: context, ...arg) {
    logger.warn("Call unimplemented FinishGroupLinkBundle", arg)

    return 0
  }

  public ForceRefreshAuthorityByConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented ForceRefreshAuthorityByConfigId", arg)

    return 0
  }

  public GetActivityOpenAndCloseTimeByScheduleId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetActivityOpenAndCloseTimeByScheduleId", arg)

    return 0
  }

  public GetAvatarEntityIdByUid(_context: context, ...arg) {
    logger.warn("Call unimplemented GetAvatarEntityIdByUid", arg)

    return 0
  }

  public GetBlossomRefreshTypeByGroupId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetBlossomRefreshTypeByGroupId", arg)

    return 0
  }

  public GetBlossomScheduleStateByGroupId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetBlossomScheduleStateByGroupId", arg)

    return 0
  }

  public GetChannellerSlabLoopDungeonLimitTime(_context: context, ...arg) {
    logger.warn("Call unimplemented GetChannellerSlabLoopDungeonLimitTime", arg)

    return 0
  }

  public GetConfigIdByEntityId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetConfigIdByEntityId", arg)

    return 0
  }

  public GetCurTriggerCount(_context: context, ...arg) {
    logger.warn("Call unimplemented GetCurTriggerCount", arg)

    return 0
  }

  public GetCurrentLevelTagVec(_context: context, ...arg) {
    logger.warn("Call unimplemented GetCurrentLevelTagVec", arg)

    return 0
  }

  public GetDeathZoneStatus(_context: context, ...arg) {
    logger.warn("Call unimplemented GetDeathZoneStatus", arg)

    return 0
  }

  public GetEffigyChallengeLimitTime(_context: context, ...arg) {
    logger.warn("Call unimplemented GetEffigyChallengeLimitTime", arg)

    return 0
  }

  public GetEffigyChallengeMonsterLevel(_context: context, ...arg) {
    logger.warn("Call unimplemented GetEffigyChallengeMonsterLevel", arg)

    return 0
  }

  public GetEffigyChallengeV2DungeonDifficulty(_context: context, ...arg) {
    logger.warn("Call unimplemented GetEffigyChallengeV2DungeonDifficulty", arg)

    return 0
  }

  public GetEntityIdByConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetEntityIdByConfigId", arg)

    return 0
  }

  public GetEntityType(_context: context, ...arg) {
    logger.warn("Call unimplemented GetEntityType", arg)

    return 0
  }

  public GetExhibitionAccumulableData(_context: context, ...arg) {
    logger.warn("Call unimplemented GetExhibitionAccumulableData", arg)

    return 0
  }

  public GetGadgetAbilityFloatValue(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGadgetAbilityFloatValue", arg)

    return 0
  }

  public GetGadgetConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGadgetConfigId", arg)

    return 0
  }

  public GetGadgetIdByEntityId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGadgetIdByEntityId", arg)

    return 0
  }

  public GetGadgetStateByConfigId(context: context, groupId: number, configId: number) {
    logger.debug("Call  GetGadgetStateByConfigId", groupId, configId)

    return context.scriptManager.getGroup(groupId)?.gadgetList.find((gadget) => gadget.configId === configId)
      ?.gadgetState
  }

  public GetGalleryProgressScore(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGalleryProgressScore", arg)

    return 0
  }

  public GetGalleryUidList(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGalleryUidList", arg)

    return 0
  }

  public GetGameHour(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGameHour", arg)

    return 0
  }

  public GetGroupLogicStateValue(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGroupLogicStateValue", arg)

    return 0
  }

  public GetGroupMonsterCount(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGroupMonsterCount", arg)

    return 0
  }

  public GetGroupMonsterCountByGroupId(context: context, groupId: number) {
    const { scriptManager } = context
    logger.debug("Call GetGroupMonsterCountByGroupId", groupId)
    const group = scriptManager.getGroup(groupId)
    return group.aliveMonsterCount
  }

  public GetGroupSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGroupSuite", arg)

    return 0
  }

  public GetGroupTempValue(_context: context, ...arg) {
    logger.warn("Call unimplemented GetGroupTempValue", arg)

    return 0
  }

  public GetGroupVariableValue(context: context, variable: string) {
    variable = toCamelCase(variable)
    logger.debug("Call GetGroupVariableValue", variable)

    return context.currentGroup.Variables.find((Variable) => Variable.Name === variable)?.Value
  }

  public GetGroupVariableValueByGroup(context: context, name: string, groupId: number) {
    logger.debug("Call GetGroupVariableValueByGroup", name, groupId)
    return context.scriptManager.getGroup(groupId)?.Variables?.find((Variable) => Variable.Name === name)?.Value
  }

  public GetHostQuestState(_context: context, ...arg) {
    logger.warn("Call unimplemented GetHostQuestState", arg)

    return 0
  }

  public GetHuntingMonsterExtraSuiteIndexVec(_context: context, ...arg) {
    logger.warn("Call unimplemented GetHuntingMonsterExtraSuiteIndexVec", arg)

    return 0
  }

  public GetLanternRiteValue(_context: context, ...arg) {
    logger.warn("Call unimplemented GetLanternRiteValue", arg)

    return 0
  }

  public GetLevelTagNameById(_context: context, ...arg) {
    logger.warn("Call unimplemented GetLevelTagNameById", arg)

    return 0
  }

  public GetMonsterIdByEntityId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetMonsterIdByEntityId", arg)

    return 0
  }

  public GetOfferingLevel(_context: context, ...arg) {
    logger.warn("Call unimplemented GetOfferingLevel", arg)

    return 0
  }

  public GetOpeningDungeonListByRosterId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetOpeningDungeonListByRosterId", arg)

    return 0
  }

  public GetPlayerVehicleType(_context: context, ...arg) {
    logger.warn("Call unimplemented GetPlayerVehicleType", arg)

    return 0
  }

  public GetPosByEntityId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetPosByEntityId", arg)

    return 0
  }

  public GetQuestState(_context: context, ...arg) {
    logger.warn("Call unimplemented GetQuestState", arg)

    return 0
  }

  public GetRegionConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetRegionConfigId", arg)

    return 0
  }

  public GetRegionEntityCount(_context: context, ...arg) {
    logger.warn("Call unimplemented GetRegionEntityCount", arg)

    return 0
  }

  public GetRotationByEntityId(_context: context, ...arg) {
    logger.warn("Call unimplemented GetRotationByEntityId", arg)

    return 0
  }

  public GetSceneOwnerUid(_context: context, ...arg) {
    logger.warn("Call unimplemented GetSceneOwnerUid", arg)

    return 0
  }

  public GetSceneUidList(_context: context, ...arg) {
    logger.warn("Call unimplemented GetSceneUidList", arg)

    return 0
  }

  public GetServerTime(_context: context, ...arg) {
    logger.warn("Call unimplemented GetServerTime", arg)

    return 0
  }

  public GetServerTimeByWeek(_context: context, ...arg) {
    logger.warn("Call unimplemented GetServerTimeByWeek", arg)

    return 0
  }

  public GoToFlowSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented GoToFlowSuite", arg)

    return 0
  }

  public GoToGroupSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented GoToGroupSuite", arg)

    return 0
  }

  public InitTimeAxis(_context: context, ...arg) {
    logger.warn("Call unimplemented InitTimeAxis", arg)

    return 0
  }

  public IsChannellerSlabLoopDungeonConditionSelected(_context: context, ...arg) {
    logger.warn("Call unimplemented IsChannellerSlabLoopDungeonConditionSelected", arg)

    return 0
  }

  public IsEffigyChallengeConditionSelected(_context: context, ...arg) {
    logger.warn("Call unimplemented IsEffigyChallengeConditionSelected", arg)

    return 0
  }

  public IsInRegion(_context: context, ...arg) {
    logger.warn("Call unimplemented IsInRegion", arg)

    return 0
  }

  public IsPlayerAllAvatarDie(_context: context, ...arg) {
    logger.warn("Call unimplemented IsPlayerAllAvatarDie", arg)

    return 0
  }

  public IsWidgetEquipped(_context: context, ...arg) {
    logger.warn("Call unimplemented IsWidgetEquipped", arg)

    return 0
  }

  public KillEntityByConfigId(context: context, table: { config_id: number }) {
    logger.debug("Call KillEntityByConfigId", table)
    context.currentGroup.gadgetList
      .find((gadget) => gadget.configId === table.config_id)
      .kill(null, PlayerDieTypeEnum.PLAYER_DIE_NONE)
    return 0
  }

  public KillExtraFlowSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented KillExtraFlowSuite", arg)

    return 0
  }

  public KillExtraGroupSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented KillExtraGroupSuite", arg)

    return 0
  }

  public KillGroupEntity(_context: context, ...arg) {
    logger.warn("Call unimplemented KillGroupEntity", arg)

    return 0
  }

  public KillMonsterTide(_context: context, ...arg) {
    logger.warn("Call unimplemented KillMonsterTide", arg)

    return 0
  }

  public LockMonsterHp(_context: context, ...arg) {
    logger.warn("Call unimplemented LockMonsterHp", arg)

    return 0
  }

  public MarkPlayerAction(_context: context, ...arg) {
    logger.warn("Call unimplemented MarkPlayerAction", arg)

    return 0
  }

  public ModifyClimatePolygonParamTable(_context: context, ...arg) {
    logger.warn("Call unimplemented ModifyClimatePolygonParamTable", arg)

    return 0
  }

  public ModifyFatherChallengeProperty(_context: context, ...arg) {
    logger.warn("Call unimplemented ModifyFatherChallengeProperty", arg)

    return 0
  }

  public MoveAvatarByPointArray(_context: context, ...arg) {
    logger.warn("Call unimplemented MoveAvatarByPointArray", arg)

    return 0
  }

  public MoveAvatarByPointArrayWithTemplate(_context: context, ...arg) {
    logger.warn("Call unimplemented MoveAvatarByPointArrayWithTemplate", arg)

    return 0
  }

  public MovePlayerToPos(_context: context, ...arg) {
    logger.warn("Call unimplemented MovePlayerToPos", arg)

    return 0
  }

  public PauseTimeAxis(_context: context, ...arg) {
    logger.warn("Call unimplemented PauseTimeAxis", arg)

    return 0
  }

  public PlayCutScene(_context: context, ...arg) {
    logger.warn("Call unimplemented PlayCutScene", arg)

    return 0
  }

  public PrintContextLog(_context: context, msg: string) {
    logger.debug(msg)
  }

  public PrintGroupWarning(_context: context, ...arg) {
    logger.warn("Call unimplemented PrintGroupWarning", arg)

    return 0
  }

  public PrintLog(_context: context, ...arg) {
    logger.warn("Call unimplemented PrintLog", arg)

    return 0
  }

  public RefreshBlossomDropRewardByGroupId(_context: context, ...arg) {
    logger.warn("Call unimplemented RefreshBlossomDropRewardByGroupId", arg)

    return 0
  }

  public RefreshBlossomGroup(_context: context, ...arg) {
    logger.warn("Call unimplemented RefreshBlossomGroup", arg)

    return 0
  }

  public RefreshGroup(context: context, table: { group_id: number; suite: number }) {
    const { scriptManager } = context
    logger.debug("Call RefreshGroup", table)
    const groupId = context.currentGroup.block.groupList.find((group) => group.id === table.group_id)?.id
    if (groupId) scriptManager.RefreshGroup(groupId, table.suite)
    else return 1
    return 0
  }

  public RefreshHuntingClueGroup(_context: context, ...arg) {
    logger.warn("Call unimplemented RefreshHuntingClueGroup", arg)

    return 0
  }

  public RemoveEntityByConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented RemoveEntityByConfigId", arg)

    return 0
  }

  public RemoveExtraFlowSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented RemoveExtraFlowSuite", arg)

    return 0
  }

  public RemoveExtraGroupSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented RemoveExtraGroupSuite", arg)

    return 0
  }

  public RevokePlayerShowTemplateReminder(_context: context, ...arg) {
    logger.warn("Call unimplemented RevokePlayerShowTemplateReminder", arg)

    return 0
  }

  public ScenePlaySound(_context: context, ...arg) {
    logger.warn("Call unimplemented ScenePlaySound", arg)

    return 0
  }

  public SendServerMessageByLuaKey(_context: context, ...arg) {
    logger.warn("Call unimplemented SendServerMessageByLuaKey", arg)

    return 0
  }

  public SetBlossomScheduleStateByGroupId(_context: context, ...arg) {
    logger.warn("Call unimplemented SetBlossomScheduleStateByGroupId", arg)

    return 0
  }

  public SetChallengeEventMark(_context: context, ...arg) {
    logger.warn("Call unimplemented SetChallengeEventMark", arg)

    return 0
  }

  public SetEntityServerGlobalValueByConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented SetEntityServerGlobalValueByConfigId", arg)

    return 0
  }

  public SetEntityServerGlobalValueByEntityId(_context: context, ...arg) {
    logger.warn("Call unimplemented SetEntityServerGlobalValueByEntityId", arg)

    return 0
  }

  public SetEnvironmentEffectState(_context: context, ...arg) {
    logger.warn("Call unimplemented SetEnvironmentEffectState", arg)

    return 0
  }

  public SetFlowSuite(_context: context, ...arg) {
    logger.warn("Call unimplemented SetFlowSuite", arg)

    return 0
  }

  public SetGadgetEnableInteract(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGadgetEnableInteract", arg)

    return 0
  }

  public SetGadgetHp(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGadgetHp", arg)

    return 0
  }

  public SetGadgetStateByConfigId(context: context, configId: number, gadgetState: number) {
    logger.debug("Call SetGadgetStateByConfigId", configId, gadgetState)
    const gadget = context.currentGroup.gadgetList.find((gadget) => gadget.configId === configId)
    if (gadget) gadget.setGadgetState(gadgetState, true)
    else return 1
    return 0
  }

  public SetGadgetTalkByConfigId(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGadgetTalkByConfigId", arg)

    return 0
  }

  public SetGroupDead(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGroupDead", arg)

    return 0
  }
  public SetGroupGadgetStateByConfigId(context: context, groupId: number, configId: number, gadgetState: number) {
    const { scriptManager } = context
    logger.debug("Call SetGroupGadgetStateByConfigId", groupId, configId, gadgetState)
    const group = scriptManager.getGroup(groupId)
    const gadget = group.gadgetList.find((gadget) => gadget.configId === configId)
    gadget.setGadgetState(gadgetState)
    return 0
  }

  public SetGroupLogicStateValue(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGroupLogicStateValue", arg)

    return 0
  }

  public SetGroupReplaceable(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGroupReplaceable", arg)

    return 0
  }

  public SetGroupTempValue(_context: context, ...arg) {
    logger.warn("Call unimplemented SetGroupTempValue", arg)

    return 0
  }

  public SetGroupVariableValue(context: context, variable: string, value: number) {
    logger.debug("Call SetGroupVariableValue", variable, value)
    const oldvalue = Number(this.GetGroupVariableValue(context, variable))
    context.currentGroup.scene.scriptManager.emit(
      EventTypeEnum.EVENT_VARIABLE_CHANGE,
      context.currentGroup.id,
      oldvalue,
      value
    )
    return 0
  }

  public SetGroupVariableValueByGroup(context: context, key: string, value: number, groupId: number) {
    const { scriptManager } = context
    logger.debug("Call SetGroupVariableValueByGroup", key, value, groupId)
    const variable = scriptManager.getGroup(groupId)?.Variables.find((Variable) => Variable.Name === key)
    if (variable.Value) variable.Value = value
    else return 1
    return 0
  }

  public SetHandballGalleryBallPosAndRot(_context: context, ...arg) {
    logger.warn("Call unimplemented SetHandballGalleryBallPosAndRot", arg)

    return 0
  }

  public SetIsAllowUseSkill(_context: context, ...arg) {
    logger.warn("Call unimplemented SetIsAllowUseSkill", arg)

    return 0
  }

  public SetMonsterAIByGroup(_context: context, ...arg) {
    logger.warn("Call unimplemented SetMonsterAIByGroup", arg)

    return 0
  }

  public SetMonsterBattleByGroup(_context: context, ...arg) {
    logger.warn("Call unimplemented SetMonsterBattleByGroup", arg)

    return 0
  }

  public SetMonsterHp(_context: context, ...arg) {
    logger.warn("Call unimplemented SetMonsterHp", arg)

    return 0
  }

  public SetPlatformPointArray(_context: context, ...arg) {
    logger.warn("Call unimplemented SetPlatformPointArray", arg)

    return 0
  }

  public SetPlatformRouteId(_context: context, ...arg) {
    logger.warn("Call unimplemented SetPlatformRouteId", arg)

    return 0
  }

  public SetPlayerEyePoint(_context: context, ...arg) {
    logger.warn("Call unimplemented SetPlayerEyePoint", arg)

    return 0
  }

  public SetPlayerEyePointStream(_context: context, ...arg) {
    logger.warn("Call unimplemented SetPlayerEyePointStream", arg)

    return 0
  }

  public SetPlayerGroupVisionType(_context: context, ...arg) {
    logger.warn("Call unimplemented SetPlayerGroupVisionType", arg)

    return 0
  }

  public SetPlayerInteractOption(_context: context, ...arg) {
    logger.warn("Call unimplemented SetPlayerInteractOption", arg)

    return 0
  }

  public SetTeamEntityGlobalFloatValue(_context: context, ...arg) {
    logger.warn("Call unimplemented SetTeamEntityGlobalFloatValue", arg)

    return 0
  }

  public SetTeamServerGlobalValue(_context: context, ...arg) {
    logger.warn("Call unimplemented SetTeamServerGlobalValue", arg)

    return 0
  }

  public SetWeatherAreaState(_context: context, ...arg) {
    logger.warn("Call unimplemented SetWeatherAreaState", arg)

    return 0
  }

  public SetWorktopOptions(context: context, options: number[]) {
    logger.debug("Call SetWorktopOptions", options)
    context.currentGroup.gadgetList
      .find((gadget) => gadget.configId === Number(context.args.param1))
      .setWorktopOption(options)
    return 0
  }
  public SetWorktopOptionsByGroupId(context: context, groupId: number, configId: number, options: number[]) {
    const { scriptManager } = context
    logger.debug("Call SetWorktopOptionsByGroupId", groupId, configId, options)
    const group = scriptManager.getGroup(groupId)
    const gadget = group?.gadgetList.find((gadget) => gadget.configId === configId)
    gadget?.setWorktopOption(options)
    return 0
  }

  public ShowClientGuide(_context: context, ...arg) {
    logger.warn("Call unimplemented ShowClientGuide", arg)

    return 0
  }

  public ShowClientTutorial(_context: context, ...arg) {
    logger.warn("Call unimplemented ShowClientTutorial", arg)

    return 0
  }

  public ShowReminder(_context: context, ...arg) {
    logger.warn("Call unimplemented ShowReminder", arg)

    return 0
  }

  public ShowReminderRadius(_context: context, ...arg) {
    logger.warn("Call unimplemented ShowReminderRadius", arg)

    return 0
  }

  public StartChallenge(_context: context, ...arg) {
    logger.warn("Call unimplemented StartChallenge", arg)

    return 0
  }

  public StartFatherChallenge(_context: context, ...arg) {
    logger.warn("Call unimplemented StartFatherChallenge", arg)

    return 0
  }

  public StartGallery(_context: context, ...arg) {
    logger.warn("Call unimplemented StartGallery", arg)

    return 0
  }

  public StartHomeGallery(_context: context, ...arg) {
    logger.warn("Call unimplemented StartHomeGallery", arg)

    return 0
  }

  public StartPlatform(_context: context, ...arg) {
    logger.warn("Call unimplemented StartPlatform", arg)

    return 0
  }

  public StartSealBattle(_context: context, ...arg) {
    logger.warn("Call unimplemented StartSealBattle", arg)

    return 0
  }

  public StopChallenge(_context: context, ...arg) {
    logger.warn("Call unimplemented StopChallenge", arg)

    return 0
  }

  public StopGallery(_context: context, ...arg) {
    logger.warn("Call unimplemented StopGallery", arg)

    return 0
  }

  public StopPlatform(_context: context, ...arg) {
    logger.warn("Call unimplemented StopPlatform", arg)

    return 0
  }

  public TowerCountTimeStatus(_context: context, ...arg) {
    logger.warn("Call unimplemented TowerCountTimeStatus", arg)

    return 0
  }

  public TowerMirrorTeamSetUp(_context: context, ...arg) {
    logger.warn("Call unimplemented TowerMirrorTeamSetUp", arg)

    return 0
  }

  public TransPlayerToPos(_context: context, ...arg) {
    logger.warn("Call unimplemented TransPlayerToPos", arg)

    return 0
  }

  public TryReallocateEntityAuthority(_context: context, ...arg) {
    logger.warn("Call unimplemented TryReallocateEntityAuthority", arg)

    return 0
  }

  public TryRecordActivityPushTips(_context: context, ...arg) {
    logger.warn("Call unimplemented TryRecordActivityPushTips", arg)

    return 0
  }

  public UnfreezeGroupLimit(_context: context, ...arg) {
    logger.warn("Call unimplemented UnfreezeGroupLimit", arg)

    return 0
  }

  public UnhideScenePoint(_context: context, ...arg) {
    logger.warn("Call unimplemented UnhideScenePoint", arg)

    return 0
  }

  public UnlockFloatSignal(_context: context, ...arg) {
    logger.warn("Call unimplemented UnlockFloatSignal", arg)

    return 0
  }

  public UnlockForce(_context: context, ...arg) {
    logger.warn("Call unimplemented UnlockForce", arg)

    return 0
  }

  public UnlockMonsterHp(_context: context, ...arg) {
    logger.warn("Call unimplemented UnlockMonsterHp", arg)

    return 0
  }

  public UnlockScenePoint(_context: context, ...arg) {
    logger.warn("Call unimplemented UnlockScenePoint", arg)

    return 0
  }

  public UpdatePlayerGalleryScore(_context: context, ...arg) {
    logger.warn("Call unimplemented UpdatePlayerGalleryScore", arg)

    return 0
  }

  public sendCloseCommonTipsToClient(_context: context, ...arg) {
    logger.warn("Call unimplemented sendCloseCommonTipsToClient", arg)

    return 0
  }

  public sendShowCommonTipsToClient(_context: context, ...arg) {
    logger.warn("Call unimplemented sendShowCommonTipsToClient", arg)

    return 0
  }
}
