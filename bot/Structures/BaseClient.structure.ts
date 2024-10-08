import {
   Client,
   ClientOptions
} from 'discord.js';

import Logger from '../Services/Logger.service.js';

export default class BaseClient extends Client {
    public logger:Logger = new Logger(this);
    
    constructor(options:ClientOptions){
        super(options);

    }

    public async run(token:string):Promise<void>{
        this.logger.log('Client','Logging In');
        if (!token) throw new RangeError('NO TOKEN WAS PROVIDED.');
        await super.login(token)
            .then(x => {
                return x;
            })
            .catch(err => console.log(err));
    }
}

