import { Controller } from "./controller.js"
import { logger } from "./util.js"
import config from './config.js'

const {
    location,
    pages: {
        homeHTML,
        controllerHTML
    }, constants: {
        CONTENT_TYPE
    }
} = config
const controller = new  Controller()

async function routes(request, response){
    const { method, url} = request
if(method == 'GET' && url ==='/'){ //quando endereço for '/' redireciona pra home
    response.writeHead( 302, {
        'Location': location.home
    })

    return response.end()
}
if(method == 'GET' && url ==='/home'){
    const {
        stream
    } = await controller.getFileStream(homeHTML)

    return stream.pipe(response)
}
if(method == 'GET' && url ==='/controller'){
    const {
        stream
    } = await controller.getFileStream(controllerHTML)

    return stream.pipe(response)
}

//passou por todos os get e não entrou, então é file
if(method === 'GET'){
    const {
        stream,
        type
    } = await controller.getFileStream(url)

    const contentType = CONTENT_TYPE[type] //constante recebe o formato
    if(contentType){ //se for um formado que eu previ ele coloca o formato que eu especifiquei, se não o browser identifica sozinho (isso vai ser em caso de imagem e tals)
        response.writeHead(200, {
            'Content-Type': contentType
        })
    }
    return stream.pipe(response)
}

response.writeHead(404)
    return response.end()
}

function handleError(error, response){
    if(error.message.includes('ENOENT')){ //se o erro for ENOENT é porque não encontrou algum arquivo
        logger.warn(`asset not found ${error.stack}`)
        response.writeHead(404);
        return response.end() //dizendo pro browser que a requisição foi terminada
    }

    logger.error(`caught error on API ${error.stack}`)  //se for outro erro imprevisto então entra como err 500
    response.writeHead(500)
    return response.end()

}
export function handler(request, response){
    return routes(request, response).catch(error => handleError(error, response)) //manipulando o erro basico e chamando a função de erros manipulados
}