import { argv } from 'process'
import mainEntry from './entry/mainEntry'
import workerEntry from './entry/workerEntry'
import parseArgs from './utils/parseArgs'

const args = parseArgs(argv)
if (args.lm == null) mainEntry(args)
else workerEntry(args)