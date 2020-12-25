import Mail from '../Mail';

describe('Mail', () => {
  it('create an object from Interface', () => {
    const now = new Date();
    const mayBeMail = {
      fromAddress: "from",
      toAddress: "to",
      subject: "about",
      body: "building",
      mailTimestamp: new Date()
    }

    const underTest = Mail.create( mayBeMail );
    expect(underTest).toBeInstanceOf(Mail);
    expect(underTest.fromAddress).toBe("from");
    expect(underTest.toAddress).toBe("to");
    expect(underTest.subject).toBe("about");
    expect(underTest.body).toBe("building");
    expect(underTest.mailTimestamp.getTime()).toBe(now.getTime());
  });
});
