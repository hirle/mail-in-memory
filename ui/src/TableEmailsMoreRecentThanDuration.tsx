import React from 'react';
import {Mail} from '@mail-in-memory/model';
import {DateTime, Duration} from 'luxon';
import TableEmails from './TableEmails';

interface ComponentProps {
  mails: Mail[],
  duration: Duration
}

interface ComponentState {
    mails: Mail[],
}

export default class TableEmailsMoreRecentThanDuration extends React.Component<ComponentProps, ComponentState> {

  private pending?: NodeJS.Timeout;

  constructor(props: ComponentProps) {
      super(props);
      this.state = {mails: props.mails};
  }
    
  componentDidMount() {
    this.refreshCycle( );
  }

  componentDidUpdate(prevProps: ComponentProps) {
    if (this.props.mails !== prevProps.mails || this.props.duration !== prevProps.duration ) {
      this.refreshCycle( );
    }
  }

  private refreshCycle( ) {

    const mailsWithTimestampMoreRecentThan = this.props.mails
      .filter( mail => mail.mailTimestamp > DateTime.local().minus(this.props.duration).toJSDate() );

    this.setState({
      mails: mailsWithTimestampMoreRecentThan
    });

    if( this.pending ) {
      clearTimeout(this.pending);
      this.pending = undefined;
    }

    if( mailsWithTimestampMoreRecentThan.length ) {
      const minMailDateTime = mailsWithTimestampMoreRecentThan
        .map( mail => DateTime.fromJSDate(mail.mailTimestamp) )
        .reduce( ( currentMin, currentValue ) => currentValue < currentMin ? currentValue : currentMin );

      this.pending =  setTimeout( () => {
        this.refreshCycle();
      }, minMailDateTime.plus(this.props.duration).diff(DateTime.local()).valueOf() );
    }
  }

  componentWillUnmount() {
    if( this.pending ) {
      clearTimeout(this.pending);
      this.pending = undefined;
    }
  }

  render( ) {
    return <TableEmails mails={this.state.mails}/>
  }
}