import React, { Component } from 'react';
import { Socket } from 'phoenix'
import './App.css';

class App extends Component {
  state = {
    host: "ws://localhost:4001/socket",
    channel: "",
    messages: [],
    connected: false,
  }

  handleInputChange = ({ target: { name, value }}) => {
    this.setState({ [name]: value })
  }

  handleConnect = () => {
    const { host, channel } = this.state

    this.socket = new Socket(host)
    this.channel = this.socket.channel(channel)
    console.log(this.channel)

    this.channel.on('new_msg', payload => {
      this.appendMessage(payload.body)
    })

    this.channel.join()
      .receive("ok", resp => {
        console.log('ok')
        this.setState({ connected: true })
        this.appendMessage(resp)
      })
      .receive("error", resp => {
        console.log('error')
        this.setState({ connected: false })
        this.appendMessage(resp)
      })
  }

  appendMessage = (message) => {
    this.setState(({ messages: prevMessages }) => ({
      messages: prevMessages.concat(message)
    }))
  }

  render() {
    const { messages, connected } = this.state

    return (
      <div className="App">
        <label>
          Host:
          <input
            type="text"
            name="host"
            value={this.state.host}
            onChange={this.handleInputChange}
          />
        </label>

        <label>
          Channel:
          <input
            type="text"
            name="channel"
            value={this.state.channel}
            onChange={this.handleInputChange}
          />
        </label>

        <span>
          {connected ? 'Connected!' : 'Not connected.'}
        </span>

        <button onClick={this.handleConnect}>Connect</button>

        <ul>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
