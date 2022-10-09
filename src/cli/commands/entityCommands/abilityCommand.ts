import AbilityData from '$/gameData/data/AbilityData'
import translate from '@/translate'
import { CommandDefinition } from '..'

const abilityCommand: CommandDefinition = {
  name: 'ability',
  args: [
    { name: 'entityId', type: 'int' },
    { name: 'uid', type: 'int' }
  ],
  exec: async (cmdInfo) => {
    const { args, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [entityId, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid)
    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentScene } = player
    if (!currentScene) return printError(translate('generic.notInScene'))

    const { entityManager } = currentScene
    const entity = entityManager.getEntity(entityId)
    if (!entity) return printError(translate('cli.commands.ability.error.entityNotFound'))

    const { abilityManager } = entity
    const { embryoList, abilityList, modifierList } = abilityManager

    print(`Ability debug info (${entityId}):`)

    print(' Embryo:')
    for (const embryo of embryoList) {
      const { id, name, overrideName } = embryo
      print(`  ${id}: ${name}(${overrideName})`)
    }

    print(' Applied ability:')
    for (const ability of abilityList) {
      const { id, abilityName, abilityOverride } = ability
      print(`  ${id}: ${await AbilityData.lookupString(abilityName) || abilityName?.hash}(${await AbilityData.lookupString(abilityOverride) || abilityOverride?.hash})`)
    }

    print(' Applied modifier:')
    for (const modifier of modifierList) {
      const { id, name } = modifier
      print(`  ${id}: ${name}`)
    }
  }
}

export default abilityCommand