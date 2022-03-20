import { jest, expect, describe, test, beforeEach} from '@jest/globals'
import config from '../../../server/config.js';
import { Controller } from '../../../server/controller.js';
import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';


const {
    pages, location,
    constants: {
        CONTENT_TYPE
    }
} = config

describe('#Controller - teste site for api response', () => {
    beforeEach(()=>{
        jest.restoreAllMocks();
        jest.clearAllMocks()
    }),
    test.todo('GET / - should get filestream')
})