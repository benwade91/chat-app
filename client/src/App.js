import React from 'react-dom';
import{ BrowserRouter as Router, Route} from 'react-router-dom';
import './style/global-style.css'
import Home from './pages/Home';
import Chat from './pages/Chat';

const App = () => {
   return <Router>
        <Route path='/' exact component={Home}></Route>
        <Route path='/chat' component={Chat}></Route>
    </Router>
}

export default App;