import React from 'react';
import './App.css';
import ListEmails from './ListEmails';
import SocketIo from './SocketIo';

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
          Mail-In-Memory
        </header>
        <ListEmails socketIo={this.socketIo}/>
      </div>
    );
  }
}
