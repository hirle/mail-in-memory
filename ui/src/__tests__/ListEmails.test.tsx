import renderer from "react-test-renderer";
import SocketIo from "../SocketIo";
import ListEmails from '../ListEmails';

describe('ListEmails', () => {
    it('should show loading', () => {
        const mySocketIo = new SocketIo();
        const component = renderer.create(<ListEmails socketIo={mySocketIo} />);
        let mustBeLoading = component.toJSON();
        expect(mustBeLoading).toMatchSnapshot();
    });
});