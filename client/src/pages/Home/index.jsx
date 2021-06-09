import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
const [name, setName] = useState('')
const [room, setRoom] = useState('')

    return <>
        <div>
            <h1>Hello {name}</h1>
            <div><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
            <div><input type="text" value={room} onChange={e => setRoom(e.target.value)} /></div>
            <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                <button type='submit'>Sign In</button>
            </Link>
        </div>
    </>
}

export default Home;