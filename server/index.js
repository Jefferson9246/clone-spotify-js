import config from "./config.js";
import server from "./server.js";
import { logger } from './util.js'

// console.log(config)
server.listen(3000) //quando o server na porta 3000 estiver ouvindo abre console
.on('lintening' , () => logger.info(`server running ${config.port}`))

// impede que a aplicação caia, caso um erro não tratado aconteça!
// uncaughtException => throw
// unhandledRejection => Promises
process.on('uncaughtException', (error) => logger.error(`unhandledRejection happened: ${error.stack || error }`))
process.on('unhandledRejection', (error) => logger.error(`unhandledRejection happened: ${error.stack || error }`))