import React from 'react';
// import { shallow } from '../../setup/setupEnzyme';
import { mount } from '../../setup/setupEnzyme';

import List from '../../Components/List';

describe('List tests', () => {

    //////////
    // Shallow Rendering
    /////////

    // it('renders list-items', () => {
    //     const items = ['one', 'two', 'three'];
    //     const wrapper = shallow(<List items={items} />);

    //     // Expect the wrapper object to be defined
    //     expect(wrapper.find('.list-items')).toBeDefined();
    //     expect(wrapper.find('.item')).toHaveLength(items.length);
    // });

    // it('renders a list item', () => {
    //     const items = ['Thor', 'Loki'];
    //     const wrapper = shallow(<List items={items} />);

    //     // Check if an element in the Component exists
    //     expect(wrapper.contains(<li key='Thor' className="item">Thor</li >)).toBeTruthy();
    // });

    // it('renders correct text in item', () => {
    //     const items = ['one', 'two', 'three'];
    //     const wrapper = shallow(<List items={items} />);

    //     //Expect the child of the first item to be an array
    //     expect(wrapper.find('.item').get(0).props.children).toEqual('one');
    // });

    //////////
    // Ful DOM rendering
    //////////

    // it('renders list-items', () => {
    //     const items = ['one', 'two', 'three'];
    //     const wrapper = shallow(<List items={items} />);

    //     // Expect the wrapper object to be defined
    //     expect(wrapper.find('ListItem')).toBeDefined();
    //     expect(wrapper.find('ListItem')).toHaveLength(items.length);
    // });

    /////////
    // Mount enables us to perform a full render.
    /////////

    it('renders list-items', () => {
        const items = ['one', 'two', 'three'];

        // Replace shallow iwth mount
        const wrapper = mount(<List items={items} />);

        // Let's check what wrong in our instance
        console.log(wrapper.debug());

        // Expect the wrapper object to be defined
        expect(wrapper.find('.list-items')).toBeDefined();
        expect(wrapper.find('.item')).toHaveLength(items.length);
    });

});