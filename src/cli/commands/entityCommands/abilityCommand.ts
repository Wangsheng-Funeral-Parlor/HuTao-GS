import { CLILike, CommandDefinition } from ".."

import AbilityScalarValueContainer from "$/ability/abilityScalarValueContainer"
import AbilityData from "$/gameData/data/AbilityData"
import translate from "@/translate"

async function printScalarValueContainer(
  print: CLILike["print"],
  container: AbilityScalarValueContainer,
  title: string,
  spaces = 0
) {
  const { valList } = container
  print(`${" ".repeat(spaces)}${title}:`)
  for (const entry of valList) {
    const { key, val } = entry
    print(`${" ".repeat(spaces + 1)}${await AbilityData.lookupString(key)}: ${val}`)
  }
}

const abilityCommand: CommandDefinition = {
  name: "ability",
  args: [
    { name: "entityId", type: "int" },
    { name: "uid", type: "int" },
  ],
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [entityId, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid)
    if (!player) return printError(translate("generic.playerNotFound"))

    const { currentScene } = player
    if (!currentScene) return printError(translate("generic.notInScene"))

    const { entityManager } = currentScene
    const entity = entityManager.getEntity(entityId)
    if (!entity) return printError(translate("cli.commands.ability.error.entityNotFound"))

    const { abilityManager } = entity
    const { dynamicValueMapContainer, sgvDynamicValueMapContainer, embryoList, abilityList, modifierList } =
      abilityManager

    print(`Ability debug info (${entityId}):`)

    await printScalarValueContainer(print, dynamicValueMapContainer, "Dynamic", 1)
    await printScalarValueContainer(print, sgvDynamicValueMapContainer, "SGVDynamic", 1)

    print(" Embryo:")
    for (const embryo of embryoList) {
      const { id, name, overrideName } = embryo
      print(`  ${id}: ${name}(${overrideName})`)
    }

    print(" Applied ability:")
    for (const ability of abilityList) {
      const { id, abilityName, abilityOverride, overrideMapContainer } = ability
      print(
        `  ${id}: ${(await AbilityData.lookupString(abilityName)) || abilityName?.hash}(${
          (await AbilityData.lookupString(abilityOverride)) || abilityOverride?.hash
        })`
      )
      await printScalarValueContainer(print, overrideMapContainer, "Override map", 3)
    }

    print(" Applied modifier:")
    for (const modifier of modifierList) {
      const { id, name } = modifier
      print(`  ${id}: ${name}`)
    }
  },
}

export default abilityCommand
