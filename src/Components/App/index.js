import React, { Component } from 'react';
import 'typeface-roboto/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

import Add from '../Add';

//Main App Component and Setup React Toastify

class App extends Component {
  render() {
    return (
      <div>
        <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                    />

                    <Add />
    
      </div>
    );
  }
}

export default connect(null,null)(App);
