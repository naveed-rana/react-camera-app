import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

// files path
import history from '../history'
import Contact from '../components/Contact';
import Header from '../Header';
import Home from '../components/Home';
import NotFoundPage from '../notFoundPage';

const AppRouter = () => (
        <Router history={history}>
            <div>
                <Header />
                <Switch>
                    <Route path='/' component={Home} exact={true} />
                    <Route path='/contact' component={Contact} />
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        </Router>
); 


export default AppRouter;