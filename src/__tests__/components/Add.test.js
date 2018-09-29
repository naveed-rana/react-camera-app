import React from 'react';
import ReactDOM from 'react-dom';
import Add from '../../Components/Desktop/Add';

it('renders Add Component', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Add />, div);
    ReactDOM.unmountComponentAtNode(div);
});
