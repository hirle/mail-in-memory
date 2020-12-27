// Dependencies
import Box from 'cli-box';
import Clc from 'cli-color';
import Config from './Config';

export default class SplashScreen {

    static computeSplashScreen( config: Config) {

        const firstLine = 'Mail In Memory'
        const secondLine = Clc.blue('Receiving SMTP on port:') + ' ' + config['smtp-port'];
        const localhostUrl = `http://localhost:${config['http-port']}`;
        const thirdLine = Clc.blue('Web UI visible @:') + ' ' + Clc.yellow.underline(localhostUrl) + Clc.yellow(' '); 
        
        return Box("45x08", [firstLine, secondLine, thirdLine].join('\n\n'));
    }
}
