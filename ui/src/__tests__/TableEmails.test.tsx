// Link.react.test.js
import React from "react";
import renderer from "react-test-renderer";
import { Mail } from "@mail-in-memory/model";
import TableEmails from "../TableEmails";

test("Link changes the class when hovered", () => {
  const date1 = new Date("2021-02-21T18:13:00Z");
  const date2 = new Date("2021-02-21T18:13:10Z");
  const testMails: Mail[] = [
    Mail.create({
      messageId: "123-234-456-789",
      fromAddress: "foo@email.org",
      toAddress: "jest@test.mail-in-memory",
      subject: "Cool",
      body: "With jest, unit testing is so cool",
      mailTimestamp: date1
    }),
    Mail.create({
      messageId: "234-456-789-012",
      fromAddress: "bar@email.org",
      toAddress: "jest@test.mail-in-memory",
      subject: "Great",
      body: "Jest is really great",
      mailTimestamp: date2
    }),
  ];

  const component = renderer.create(<TableEmails mails={testMails} />);
  const tree = component.toJSON();
  // eslint-disable-next-line
  expect(tree).toMatchInlineSnapshot(`
    <div
      className="ant-table-wrapper"
    >
      <div
        className="ant-spin-nested-loading"
      >
        <div
          className="ant-spin-container"
        >
          <div
            className="ant-table"
          >
            <div
              className="ant-table-container"
            >
              <div
                className="ant-table-content"
                onScroll={[Function]}
                style={Object {}}
              >
                <table
                  style={
                    Object {
                      "tableLayout": "auto",
                    }
                  }
                >
                  <colgroup />
                  <thead
                    className="ant-table-thead"
                  >
                    <tr>
                      <th
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        From
                      </th>
                      <th
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        To
                      </th>
                      <th
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        Subject
                      </th>
                      <th
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        Body
                      </th>
                      <th
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        TimeStamp
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="ant-table-tbody"
                  >
                    <tr
                      className="ant-table-row ant-table-row-level-0"
                      data-row-key="123-234-456-789"
                      onClick={[Function]}
                      style={Object {}}
                    >
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        foo@email.org
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        jest@test.mail-in-memory
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        Cool
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        With jest, unit testing is so cool
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        ${date1.toLocaleString()}
                      </td>
                    </tr>
                    <tr
                      className="ant-table-row ant-table-row-level-0"
                      data-row-key="234-456-789-012"
                      onClick={[Function]}
                      style={Object {}}
                    >
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        bar@email.org
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        jest@test.mail-in-memory
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        Great
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        Jest is really great
                      </td>
                      <td
                        className="ant-table-cell"
                        colSpan={null}
                        rowSpan={null}
                        style={Object {}}
                      >
                        ${date2.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
});
