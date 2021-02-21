// Link.react.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import {Mail} from '@mail-in-memory/model';
import TableEmails from '../TableEmails';

test('Link changes the class when hovered', () => {
    const testMails: Mail[] = [
        Mail.create( {
            fromAddress: 'foo@email.org',
            toAddress: 'jest@test.mail-in-memory',
            subject: 'Cool',
            body: 'With jest, unit testing is so cool',
            mailTimestamp: Date.parse('2021-02-21T18:13:00Z')
        }),
        Mail.create( {
            fromAddress: 'bar@email.org',
            toAddress: 'jest@test.mail-in-memory',
            subject: 'Great',
            body: 'Jest is really great',
            mailTimestamp: Date.parse('2021-02-21T18:13:10Z')
        })
    ];

  const component = renderer.create(
    <TableEmails 
        mails={testMails}
     />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});