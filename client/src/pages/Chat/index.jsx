import React, { useEffect, useState, useRef } from 'react';
import { AiFillDelete } from "react-icons/ai";
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
        //Updates message array on new message
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })

        //Updates message array on delete
        socket.on('updateMessages', (messageToDelete) => {
            // console.log(messageToDelete);
            setMessages(messages.filter(message => message.text !== messageToDelete.text))
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

    const deleteMessage = (index) => {
        console.log(index);
        socket.emit('deleteMessage', messages[index], () => {
            setMessages(messages.filter(message => message !== messages[index]))
        })
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
                {users.map(user => (user.name !== name.toLowerCase()) && <p key={user.id}>{user.name.toUpperCase()}</p>)}
            </div>
            <div className='chatWindow'>
                <div className='chatThread'>
                    {messages.map((message, i) => <div id={i} key={i} className='message'>
                        {message.user === 'admin' ? (
                            <p>{message.text}</p>
                        ) :
                            (name.toLowerCase() === message.user ?
                                (<div className='userMessage'>
                                    <div className='userBubble'>
                                        <AiFillDelete
                                            className='deleteMessage'
                                            onClick={(e) => deleteMessage(e.target.parentElement.parentElement.parentElement.parentElement.id)}
                                        />
                                        <p>{message.text}</p>
                                    </div>
                                </div>)
                                : (<div className='otherMessage'>
                                    <div className='otherBubble'>
                                        {messages[i - 1] && (message.user === messages[i - 1].user) ? null : <span>{message.user.toUpperCase()}</span>}
                                        {/* <span>{message.user.toUpperCase()}</span> */}
                                        <p>{message.text}</p>
                                    </div>
                                </div>))}
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