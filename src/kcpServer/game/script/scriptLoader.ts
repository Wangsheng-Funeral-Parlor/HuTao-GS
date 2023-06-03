import { join } from "path"
import { cwd } from "process"

import { LuaEngine } from "wasmoon"

import ScriptLib from "./scriptLib"

import config from "@/config"
import Logger from "@/logger"
import {
  EntityTypeEnum,
  EventTypeEnum,
  GadgetStateEnum,
  RegionShapeEnum,
  SealBattleTypeEnum,
  VisionLevelTypeEnum,
} from "@/types/enum"
import { readFile } from "@/utils/fileSystem"

const logger = new Logger("ScriptLoader", 0xff7f50)

export default class ScriptLoader {
  public async init(lua: LuaEngine, sceneId: number, groupId: number): Promise<LuaEngine> {
    lua.global.set("require", (module: string) => {
      logger.verbose("Call require", module)
    })

    lua.global.set("EntityType", EntityTypeEnum)
    lua.global.set("EventType", EventTypeEnum)
    lua.global.set("GadgetState", GadgetStateEnum)
    lua.global.set("RegionShape", RegionShapeEnum)
    lua.global.set("SealBattleType", SealBattleTypeEnum)
    lua.global.set("VisionLevelType", VisionLevelTypeEnum)

    lua.global.set("ScriptLib", new ScriptLib())

    return await this.ScriptByPath(lua, `Scene/${sceneId}/scene${sceneId}_group${groupId}.lua`)
  }

  public async ScriptByPath(lua: LuaEngine, path: string): Promise<LuaEngine> {
    const script = (await readFile(join(cwd(), `data/game/${config.game.version}/Scripts/`, path))).toString()

    await lua.doString(script).catch((err) => logger.error("ScriptByPath", path, err))

    return lua
  }
}
