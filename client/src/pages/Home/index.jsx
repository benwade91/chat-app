import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './home.css';


const Home = () => {
const [name, setName] = useState('')
const [room, setRoom] = useState('noon-goonz')

    return <>
    <div className='homeBody'>
        <div className='loginBubble'>
            <h1>Welcome {name}</h1>
            <div><input placeholder='username' type="text" value={name} onChange={e => setName(e.target.value)} /></div>
            <div><input placeholder='room name' type="text" value={room} onChange={e => setRoom(e.target.value)} /></div>
            <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                <button type='submit'>Enter</button>
            </Link>
        </div>
        </div>
    </>
}

export default Home;