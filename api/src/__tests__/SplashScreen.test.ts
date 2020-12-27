import Config from '../Config';
import SplashScreen from '../SplashScreen';

describe('SplashScreen', () => {
    it('should display the stmp port and url to http', () => {
        const config = { "http-port" : 1234, "smtp-port": 1225, db: {filename: "not used"} };

        const result = SplashScreen.computeSplashScreen(config);
        expect(result).toContain('1225');
        expect(result).toContain('http://localhost:1234');
    });
} );