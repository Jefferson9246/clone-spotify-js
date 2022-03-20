import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
const currentDir = dirname(fileURLToPath(import.meta.url))

const root = join( currentDir, '../')
const audioDirectory = join( root, 'audio')
const publicDirectory = join( root, 'public')
const songsDirectory = join(audioDirectory, 'songs')
export default {
    port: process.env.PORT || 3000,
    dir: {
        root, publicDirectory, audioDirectory,songsDirectory, fxDirectory: join(audioDirectory, 'fx')
    }, 
    pages: {
        homeHTML: 'home/index.html',
        controllerHTML: 'controller/index.html',
    },
    location: {
        home: '/home'
    },
    constants: {
        CONTENT_TYPE: { //setando o tipo do content pelo formato para o browser mostrar corretamente
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript'
        },
        audioMediaType: 'mp3',
        songVolume: '0.99',
        fallbackBitRate: '128000',
        englishConersation: join(songsDirectory, 'conversation.mp3'),
        bitRateDivisor: 8
    }
}