import config from "./config.js";
import server from "./server.js";
import { logger } from './util.js'

// console.log(config)
server.listen(3000) //quando o server na porta 3000 estiver ouvindo abre console
.on('lintening' , () => logger.info(`server running ${config.port}`))