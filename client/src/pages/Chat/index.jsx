import React, { useEffect, useState, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
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

        if (message && message.trim().length > 0) {
            // setMessages([...messages, message])
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    // Auto scroll to bottom on new message
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    return <>
        <div className='chatBody'>
            <div className='onlineUsers'>
            <h3 className='onlineHeader'>ONLINE</h3>
                {users.map(user => (user.name !== name.toLowerCase()) && <p key={user.id}>{user.name}</p>)}
            </div>
            <div className='chatWindow'>
                <div className='chatThread'>
                    {messages.map((message, i) => <div key={i} className='message'>
                        {message.user === 'admin' ? (
                            <p>{message.text}</p>
                        ) :
                            (name.toLowerCase() === message.user ?
                                (<div className='userMessage'><div className='userBubble'><p>{message.text}</p></div></div>)
                                : (<div className='otherMessage'><div className='otherBubble'><span>{message.user}</span><p>{message.text}</p></div></div>))}
                    </div>)}
                    <div ref={messagesEndRef} />
                </div>
                <div className='inputBar'>
                    <input value={message}
                        onChange={event => setMessage(event.target.value)}
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <div className='sendBtn' onClick={event => sendMessage(event)}>
                        <span>SEND</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Chat;