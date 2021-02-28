import React from 'react';
import {Mail} from '@mail-in-memory/model';
import 'antd/dist/antd.css';
import { Table } from 'antd';

interface TableEmailsProps {
    mails: Mail[]
}

const TableEmails: React.FunctionComponent<TableEmailsProps> = (props: TableEmailsProps) => {
    const columns = [
        {
            title: 'From',
            dataIndex: 'fromAddress',
            key: 'fromAddress',
        },
        {
            title: 'To',
            dataIndex: 'toAddress',
            key: 'toAddress',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Body',
            dataIndex: 'body',
            key: 'body',
        },
        {
            title: 'TimeStamp',
            dataIndex: 'mailTimestamp',
            key: 'mailTimestamp',
            render: (date:Date) => date.toLocaleString(),
        }
    ];
    
    return <Table
        dataSource={props.mails}
        columns={columns}
        pagination ={{hideOnSinglePage:true}}
        rowKey='messageId'
        />;
}

export default TableEmails