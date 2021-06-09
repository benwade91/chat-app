import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import './chat.css';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const ENDPOINT = 'localhost:4001';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT)

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => { })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages]);

    useEffect(() => {
        socket.on('roomData', (data) => {
            setUsers(data.users);
        })
    }, [users]);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            // setMessages([...messages, message])
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return <>
        <div className='chatBody'>
            <div className='chatWindow'>
                <div className='chatThread'>
                    <ScrollToBottom>
                        {messages.map((message, i) => <div key={i}>{message.text}</div>)}
                    </ScrollToBottom>
                </div>
                <div className='inputBar'>
                    <input value={message}
                        onChange={event => setMessage(event.target.value)}
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <span>Send</span>
                </div>
            </div>
            <div>
                {users.map(user => <p key={user.id}>{user.name}</p>)}
            </div>
        </div>
    </>
}

export default Chat;