import fs from 'fs'
import fsPromises from 'fs/promises'
import config from './config.js'
import { randomUUID } from 'crypto'
import { join, extname } from 'path'
import { PassThrough } from 'stream'
import Throttle from 'throttle'
import { logger } from './util.js'
import streamsPromises from 'stream/promises'
import { ChildProcess } from 'child_process'
import { once } from 'events'

const {
    dir: {
        publicDirectory
    },
    constants: {
        fallbackBitRate,
        englishConversation,
        bitRateDivisor
    }
} = config
export class Service {
    constructor(){
        this.clientStreams = new Map()
        this.currentSong = englishConversation
        this.currentBitRate = 0
        this.throttleTransform = {}
        this.currentReadable = {}
    }
    createFileStream(filename){
       return  fs.createReadStream(filename) //lendo o arquivo como stream onde vai lendo conforme for chegando
    }

    createClientStream(){
        const id = randomUUID()
        const clientStream = new PassThrough()
        this.clientStreams.set(id, clientStream)

        return {
            id,
            clientStream
        }
    }

    removeClientStream(id){
        this.clientStreams.delete(id)
    }

    _executeSoxCommand(args) {
        return childProcess.spawn('sox', args)
      }

    async getBitRate(song) {
    try {
        const args = [
        '--i', // info
        '-B', // bitrate
        song
        ]
        const {
        stderr, // tudo que é erro
        stdout, // tudo que é log
        // stdin // enviar dados como stream
        } = this._executeSoxCommand(args)

        await Promise.all([
        once(stderr, 'readable'),
        once(stdout, 'readable'),
        ])

        const [success, error] = [stdout, stderr].map(stream => stream.read())
        if (error) return await Promise.reject(error)
        return success
        .toString()
        .trim()
        .replace(/k/, '000')

    } catch (error) {
        logger.error(`erro no bitrate: ${error}`)

        return fallbackBitRate
    }
    }

      broadCast() {
        return new Writable({
          write: (chunk, enc, cb) => {
            for (const [id, stream] of this.clientStreams) {
              // se o cliente desconectou não devemos mais mandar dados pra ele
              if (stream.writableEnded) {
                this.clientStreams.delete(id) //deletando o cache do cliente que saiu
                continue;
              }
    
              stream.write(chunk)
            }
    
            cb()
          }
        })
      }

      async startStreamming() {
        logger.info(`starting with ${this.currentSong}`)
        const bitRate = this.currentBitRate = (await this.getBitRate(this.currentSong)) / bitRateDivisor
        const throttleTransform = this.throttleTransform = new Throttle(bitRate)
        const songReadable = this.currentReadable = this.createFileStream(this.currentSong)
        return streamsPromises.pipeline(
          songReadable,
          throttleTransform, //vai segurar a quantidade que será mandado pra frente ao ler
          this.broadCast()
        )
      }
    
      stopStreamming() {
        this.throttleTransform?.end?.()
      }

    async getFileInfo(file){
        const fullFilePath = join(publicDirectory, file)
        await fsPromises.access(fullFilePath) //validando se existe
        const fileType = extname(fullFilePath)
        return {
            type: fileType,
            name: fullFilePath
        }
    }
    async getFileStream(file){
        const {
            name, type
        } = await this.getFileInfo(file)
        return {
            stream: this.createFileStream(name),
            type
        }
    }
}