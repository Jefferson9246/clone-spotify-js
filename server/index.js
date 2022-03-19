import server from "./server.js";

server.listen(3000) //quando o server na porta 3000 estiver ouvindo abre console
.on('lintening' , () => console.log('server running'))