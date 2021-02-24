import Mail from '../Mail';

describe('Mail', () => {
  it('create an object from Interface', () => {
    const isoString = '2020-12-25T23:00:00Z';
    const now = new Date(isoString);
    const mayBeMail = {
      messageId: "123-456-789",
      fromAddress: "from",
      toAddress: "to",
      subject: "about",
      body: "building",
      mailTimestamp: isoString
    }

    const underTest = Mail.create( mayBeMail );
    expect(underTest).toBeInstanceOf(Mail);
    expect(underTest.messageId).toBe("123-456-789");
    expect(underTest.fromAddress).toBe("from");
    expect(underTest.toAddress).toBe("to");
    expect(underTest.subject).toBe("about");
    expect(underTest.body).toBe("building");
    expect(underTest.mailTimestamp.getTime()).toBe(now.getTime());
  });
});
