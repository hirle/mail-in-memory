import renderer from "react-test-renderer";
import SocketIo from "../SocketIo";
import BeepOnNewMail from "../BeepOnNewMail";
import { Mail } from "@mail-in-memory/model";
import { SocketMessages } from "@mail-in-memory/model";
import MockDate from 'mockdate';


describe("BeepOnNewMail", () => {
  
  afterEach( () => {
    MockDate.reset();
  });  
it("should update date on new mail", () => {
    const fixedDate = new Date('2021-02-28T09:33:30Z')
    MockDate.set(fixedDate);

    const mySocketIo = new SocketIo();
    const component = renderer.create(<BeepOnNewMail socketIo={mySocketIo} />);
    let initialTree = component.toJSON();
    expect(initialTree).toMatchInlineSnapshot(`
      <div
        className="beep-on-new-mail"
      >
        <audio
          src="beep.mp3"
        />
        <label>
          <input
            checked={true}
            onChange={[Function]}
            type="checkbox"
          />
          <span>
            Beep on new Mail
          </span>
        </label>
      </div>
    `);

    const incomingMail = Mail.create({
      messageId: "123-234-456-789",
      fromAddress: "foo@email.org",
      toAddress: "jest@test.mail-in-memory",
      subject: "Cool",
      body: "With jest, unit testing is so cool",
      mailTimestamp: new Date("2021-02-28T09:33:22Z"),
    });
    mySocketIo.notify(SocketMessages.NewMail, incomingMail);

    let afterMail = component.toJSON();
    // eslint-disable-next-line
    expect(afterMail).toMatchInlineSnapshot(`
      <div
        className="beep-on-new-mail"
      >
        <audio
          src="beep.mp3"
        />
        <label>
          <input
            checked={true}
            onChange={[Function]}
            type="checkbox"
          />
          <span>
            Beep on new Mail
          </span>
        </label>
        <div>
          Last email received at: 
          ${fixedDate.toLocaleString()}
        </div>
      </div>
    `);
  });
});
