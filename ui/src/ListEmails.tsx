import React from 'react';
import {Mail} from '@mail-in-memory/model';
import {SocketMessages} from '@mail-in-memory/model';
import {GetLastEmails} from './api';
import SocketIo from './SocketIo';
import './ListEmails.css';

interface ComponentProps {
    socketIo: SocketIo
}
  
enum ComponentStatus {
    Loading,
    Ready,
    Error
}
  
  interface ComponentState {
      connected: boolean,
      status: ComponentStatus,
      mails: Mail[]
  }

  export default class CurrentTemperature
    extends React.Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);
        this.state = {status: ComponentStatus.Loading, connected: false, mails: []};
    }
      
    componentDidMount() {
        GetLastEmails()
          .then( mails => {        
            this.setState({
              status: ComponentStatus.Ready,
              mails,
              connected:this.props.socketIo.isConnected()
            });
  
            this.setUpSocketIO();
          })
          .catch( err => {
            console.log(err);
            this.setState({status: ComponentStatus.Error, mails: []});
          });
    }

    setUpSocketIO() {
        this.props.socketIo.addObserver(SocketMessages.Connect, this.onConnect.bind(this));
        this.props.socketIo.addObserver(SocketMessages.NewMail, this.onNewMail.bind(this));
        this.props.socketIo.addObserver(SocketMessages.Disconnect, this.onDisconnect.bind(this));
    }
    
    onNewMail( ) {
        GetLastEmails()
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
    
    onConnect() {
    this.setState({connected: true});
    }

    onDisconnect() {
    this.setState({connected: false});
    }

    render() {
        switch(this.state.status)  {
          case ComponentStatus.Loading: return <div>Loading...</div>;
          case ComponentStatus.Ready: return (
              <table>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Subject</th>
                        <th>Body</th>
                        <th>TimeStamp</th>
                    </tr>
                </thead>
                <tbody>
                  { this.state.mails.map( (mail, index) => (<tr key={index}>
                      <td >{mail.fromAddress}</td>
                      <td >{mail.toAddress}</td>
                      <td >{mail.subject||''}</td>
                      <td >{mail.body}</td>
                      <td >{mail.mailTimestamp.toLocaleString()}</td>
                      </tr>)
                ) }
                </tbody>
              </table>);
          default: return <div className="error">Can't connect</div>;
        }
    }
}
    