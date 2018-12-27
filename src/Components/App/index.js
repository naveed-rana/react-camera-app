import React, { Component } from 'react';
// import Home from '../Home';
import axios from 'axios';

import { FacebookProvider, Share } from 'react-facebook';
//Main App Component and Setup React Toastify

class App extends Component {

  onFileHandler = (e) =>{
    
    // if(e.target.files.length >= 2){
    this.setState({err:''})
    const data = new FormData();
    data.append('image', e.target.files[0]);
    // data.append('file', e.target.files[1]);

    axios.post('http://127.0.0.1:2020/predict', data, {
      headers: {
        'Content-Type': `multipart/form-data`,
      }
    })
      .then((response) => {
        console.log(response.data);
        this.setState({result:response.data})
        
      }).catch((error) => {
        console.log(error);
        //handle error
      });
    // }

    // else{
    //   this.setState({err:'please select two images'})
    // }

  }

  render() {
    return (
      <div>
        {/* <Home /> */}
        {/* <FacebookProvider appId="297912580850097">
        <Share
        hashtag="#kendobrands" hashtag="#sephora" hashtag="#lvmh"
        quote="WOW, TRY THIS NEW FOUNDATION SHADE FINDER !"
        href="https://www.foundationshadefinder.com">
          {({ handleClick, loading }) => (
            <button type="button" onClick={handleClick}>Share</button>
          )}
        </Share>
      </FacebookProvider>  */}

      <p>select two images for Face pridictions</p>
        <input type="file" multiple onChange={(e) =>this.onFileHandler(e)}/>
      </div>
    );
  }
}

export default App;
