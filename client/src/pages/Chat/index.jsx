import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const ENDPOINT = 'localhost:4001';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT, {transports: ['websocket']})

        setName(name);
        setRoom(room);
        
        socket.emit('join', {name, room})
        
    },[ENDPOINT, location.search])
    return <h1>Hello Chat</h1>
}

export default Chat;