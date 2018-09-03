import React from 'react';
import ReactDOM from 'react-dom';
import {Switch,Route,Router} from 'react-router';
import Error from './containers/Error'
import RegisterScope from './containers/RegisterScope';
import AddFriend from './components/smartBearPortal/AddFriend';
import ErrorScore from './components/smartBearPortal/ErrorScore';
import HowAdoptScore from './components/smartBearPortal/HowAdopt'
import createBrowserHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules'
import './index.css'
const history = createBrowserHistory();

// const MainScore =CSSModules(({history})=>{
//     return(
//         <div className='containter'>
//             <Switch>
//                 <Route path='/register' component={RegisterScope}/>
//                 <Route path='/addfriend' component={AddFriend}/>
//                 <Route path='/howadopt' component={HowAdoptScore}/>
//                 <Route path='/errorbear' component={ErrorScore}/>
//             </Switch>
//         </div>
//     )
// },styles)
ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route path="/chatpet/error" component={Error} />
            <Route path='/chatpet/register' component={RegisterScope}/>
            <Route path='/chatpet/addfriend' component={AddFriend}/>
            <Route path='/chatpet/howadopt' component={HowAdoptScore}/>
            <Route path='/chatpet/errorbear' component={ErrorScore}/>
            {/*<Route path='/' component={MainScore}/>*/}
        </Switch>
    </Router>
    , document.getElementById('root'));
