import { update } from '@/tools/autoPatch'
import { dumpEc2bKey } from '@/tools/ec2b'
import keyGen from '@/tools/keyGen'
import { decryptMetadata, dumpStringLiterals, encryptMetadata, patchMetadata } from '@/tools/metadata'
import { UAList, UAPatch } from '@/tools/UAPatch'
import { CommandDefinition } from '.'

const toolsCommands: CommandDefinition[] = [
  {
    name: 'updateDispatch',
    desc: 'Fetch new dispatch data',
    exec: async () => update()
  },
  {
    name: 'keygen',
    desc: 'Attempt to generate key from packet dumps',
    exec: async () => keyGen()
  },
  {
    name: 'ec2b',
    desc: 'Dump ec2b key',
    args: [
      { name: 'ver', type: 'str' },
      { name: 'name', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print } = cli

      const key = await dumpEc2bKey(args[0], args[1])
      print(key.toString('hex'))
    }
  },
  {
    name: 'metadec',
    desc: 'Decrypt metadata',
    args: [
      { name: 'src', type: 'str' },
      { name: 'dst', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print, printError } = cli

      try {
        await decryptMetadata(args[0], args[1])
        print('Success.')
      } catch (err) {
        printError(err)
      }
    }
  },
  {
    name: 'metaenc',
    desc: 'Encrypt metadata',
    args: [
      { name: 'src', type: 'str' },
      { name: 'dst', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print, printError } = cli

      try {
        await encryptMetadata(args[0], args[1])
        print('Success.')
      } catch (err) {
        printError(err)
      }
    }
  },
  {
    name: 'metapatch',
    desc: 'Patch metadata',
    args: [
      { name: 'src', type: 'str' },
      { name: 'dst', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print, printError } = cli

      try {
        await patchMetadata(args[0], args[1])
        print('Success.')
      } catch (err) {
        printError(err)
      }
    }
  },
  {
    name: 'metadmpstr',
    desc: 'Dump metadata strings',
    args: [
      { name: 'src', type: 'str' },
      { name: 'dst', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print, printError } = cli

      try {
        await dumpStringLiterals(args[0], args[1])
        print('Success.')
      } catch (err) {
        printError(err)
      }
    }
  },
  {
    name: 'ualist',
    desc: 'List RSA keys in UA',
    args: [
      { name: 'path', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print, printError } = cli

      try {
        (await UAList(args[0])).forEach((k, i) => print(`Key ${i}: ${k}`))
      } catch (err) {
        printError(err)
      }
    }
  },
  {
    name: 'uapatch',
    desc: 'Patch RSA key in UA',
    args: [
      { name: 'src', type: 'str' },
      { name: 'dst', type: 'str' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli } = cmdInfo
      const { print, printError } = cli

      try {
        await UAPatch(args[0], args[1])
        print('Success.')
      } catch (err) {
        printError(err)
      }
    }
  }
]

export default toolsCommands