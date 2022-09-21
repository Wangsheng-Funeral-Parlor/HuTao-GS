import mainEntry from './entry/mainEntry'
import workerEntry from './entry/workerEntry'
import parseArgs from './utils/parseArgs'

const args = parseArgs(process.argv)
if (args.lm == null) mainEntry(args)
else workerEntry(args)