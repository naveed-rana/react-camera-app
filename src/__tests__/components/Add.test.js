import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../Components/Add';
// import { Provider } from 'react-redux';
// import store from '../../Components/Redux/store';


window.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
