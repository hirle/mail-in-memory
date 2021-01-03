import React from 'react';
import {SocketMessages} from '@mail-in-memory/model';
import SocketIo from './SocketIo';
import './BeepOnNewMail.css';

interface ComponentProps {
    socketIo: SocketIo
}

interface ComponentState {
    beep: boolean,
    lastEmailDate?: Date
}


export default class BeepOnNewMail extends React.Component<ComponentProps, ComponentState> {

    private audioRef: React.RefObject<HTMLAudioElement>;

    constructor(props: ComponentProps) {
        super(props);
        this.state = {beep: true};
        this.audioRef = React.createRef();
    }

    componentDidMount() {
        this.props.socketIo.addObserver(SocketMessages.NewMail, this.onNewMail.bind(this))
    }

    onNewMail() {
        this.setState({lastEmailDate: new Date()});
        console.log(this.state.beep);
        if( this.state.beep && this.audioRef.current) {
            this.audioRef.current.play()
                .catch(err => {
                    console.log(err);
                })
        }
    }

    handleCheckboxChange = ( event: React.ChangeEvent<HTMLInputElement> ) => this.setState({ beep: event.target.checked })

    render() {
      return (
        <div className="beep-on-new-mail"> 
            <audio ref={this.audioRef} src="beep.mp3"/>
            <label>
                <input type="checkbox" checked={this.state.beep} onChange={this.handleCheckboxChange}></input>
                <span>Beep on new Mail</span>
            </label>
            { this.state.lastEmailDate && <div>Last email received at: {this.state.lastEmailDate.toLocaleString()}</div>}
        </div>);
    }
  }