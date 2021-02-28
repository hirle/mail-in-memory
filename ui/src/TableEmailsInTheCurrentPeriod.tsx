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

export default class TableEmailsInTheCurrentPeriod extends React.Component<ComponentProps, ComponentState> {

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
  
      const nowMs = DateTime.utc().valueOf();
      const durationMs = this.props.duration.valueOf();
      const minCurrentPeriodMs = Math.trunc( nowMs / durationMs )  * durationMs;
      const maxCurrentPeriodMs = minCurrentPeriodMs + durationMs;

      const mailsInPeriod = this.props.mails
        .filter( mail => mail.mailTimestamp.getTime() >= minCurrentPeriodMs && mail.mailTimestamp.getTime() < maxCurrentPeriodMs );

      this.setState({
        mails: mailsInPeriod
      });
  
      if( this.pending ) {
        clearTimeout(this.pending);
        this.pending = undefined;
      }
  
      if( mailsInPeriod.length ) {
        const durationToEndOfPeriodMs = maxCurrentPeriodMs - nowMs ;

        this.pending =  setTimeout( () => {
          this.refreshCycle();
        }, durationToEndOfPeriodMs );
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


