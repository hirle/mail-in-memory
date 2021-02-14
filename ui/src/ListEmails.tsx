import React from 'react';
import {Mail} from '@mail-in-memory/model';
import {SocketMessages} from '@mail-in-memory/model';
import {GetEmailsFor, GetLastEmails, GetEmailsSince} from './api';
import { Radio, RadioChangeEvent } from 'antd';
import {Duration, DateTime} from 'luxon';
import SocketIo from './SocketIo';
import './ListEmails.css';
import 'antd/dist/antd.css'
import TableEmails from './TableEmails';
import TableEmailsMoreRecentThanDuration from './TableEmailsMoreRecentThanDuration';

interface ComponentProps {
    socketIo: SocketIo
}
  
enum ComponentStatus {
    Loading,
    Ready,
    Error
}

enum Horizon {
  Last10Minutes,
  LastHour,
  Last50,
  Today,
  All
}

interface ComponentState {
    connected: boolean,
    status: ComponentStatus,
    horizon: Horizon,
    mails: Mail[]
}

export default class ListEmails extends React.Component<ComponentProps, ComponentState> {

  constructor(props: ComponentProps) {
      super(props);
      this.state = {status: ComponentStatus.Loading, horizon: Horizon.Today, connected: false, mails: []};
  }
    
  componentDidMount() {
    this.refreshMails( this.state.horizon )
      .then( () => {
        this.setUpSocketIO();
      });
  }

  setUpSocketIO() {
      this.props.socketIo.addObserver(SocketMessages.Connect, this.onConnect.bind(this));
      this.props.socketIo.addObserver(SocketMessages.NewMail, this.onNewMail.bind(this));
      this.props.socketIo.addObserver(SocketMessages.Disconnect, this.onDisconnect.bind(this));
  }

  onNewMail( ) {
    this.refreshMails(this.state.horizon);
  }
  
  refreshMails( horizon: Horizon ): Promise<void>{
    return this.getMailsByHorizon(horizon)
      .then( mails => {
        this.setState({
          status: ComponentStatus.Ready,
          mails,
          connected:this.props.socketIo.isConnected()
        });
      })
      .catch( err => {
          console.log(err);
          this.setState({status: ComponentStatus.Error, mails: []});
      });
  } 

  getMailsByHorizon( horizon: Horizon ): Promise<Mail[]>{
    switch(horizon) {
      case Horizon.Last10Minutes: return GetEmailsFor( Duration.fromISO('PT10M'));
      case Horizon.LastHour: return GetEmailsFor( Duration.fromISO('PT1H'));
      case Horizon.Last50: return GetLastEmails( 50 );
      case Horizon.Today: return GetEmailsSince( DateTime.local().startOf('day') );
      case Horizon.All: return GetLastEmails( Number.MAX_SAFE_INTEGER );
      default: throw new Error('Illegal state ' + horizon)
    }
  }

  onConnect() {
    this.setState({connected: true});
  }

  onDisconnect() {
    this.setState({connected: false});
  }

  onChangeHorizon = (e: RadioChangeEvent) => {
    const newHorizon = e.target.value;
    this.setState({
      horizon: newHorizon
    });
    this.refreshMails(newHorizon);
  }

  render() {
      switch(this.state.status)  {
        case ComponentStatus.Loading: return <div>Loading...</div>;
        case ComponentStatus.Ready: return this.renderComponentReady();
        default: return <div className="error">Can't connect</div>;
      }
  }

  renderComponentReady() {
    let tableEmails;
    switch( this.state.horizon ) {
        case Horizon.Last10Minutes:
          tableEmails = <TableEmailsMoreRecentThanDuration
                          mails={this.state.mails}
                          duration={Duration.fromObject({minutes:10})}/>
          break;
        case Horizon.LastHour:
          tableEmails = <TableEmailsMoreRecentThanDuration
                          mails={this.state.mails}
                          duration={Duration.fromObject({hour:1})}/>
          break;
        case Horizon.Last50:
        case Horizon.All:
          tableEmails = <TableEmails mails={this.state.mails}/>
          break;
        default:
          tableEmails = <div className="error">Unknown horizon</div>
          break;
    }

    return (
      <article className='list-emails'>
        <Radio.Group onChange={this.onChangeHorizon} value={this.state.horizon}>
          <Radio value={Horizon.Last10Minutes}>Last 10 Minutes</Radio>
          <Radio value={Horizon.LastHour}>Last hour</Radio>
          <Radio value={Horizon.Last50}>Last 50</Radio>
          <Radio value={Horizon.Today}>Today</Radio>
          <Radio value={Horizon.All}>All</Radio>
        </Radio.Group>
        {tableEmails}
      </article>);
  }
}
    