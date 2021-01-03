import React from 'react';
import './App.css';
import LogoName from './LogoName';
import ListEmails from './ListEmails';
import SocketIo from './SocketIo';
import BeepOnNewMail from './BeepOnNewMail';

export default class App extends React.Component {
  private socketIo: SocketIo;

  constructor(props: any ) {
    super(props);
    this.socketIo = new SocketIo();
  }

  componentDidMount() {
    this.socketIo.startOn('/');
  }

  componentWillUnmount() {
    this.socketIo.stop();
  }

  render() { return (
      <div className="App">
        <header className="App-header">
          <LogoName/>
          <BeepOnNewMail socketIo={this.socketIo}/>
        </header>
        <ListEmails socketIo={this.socketIo}/>
      </div>
    );
  }
}
