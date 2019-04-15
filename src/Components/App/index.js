import React, { Component } from "react";
import Home from "../Home";
import axios from "axios";
import "axios-progress-bar/dist/nprogress.css";
import { loadProgressBar } from "axios-progress-bar";
//Main App Component and Setup React Toastify
import { CirclePicker } from "react-color";

class App extends Component {
  componentWillMount() {
    loadProgressBar({ showSpinner: false });
  }

  componentDidMount = () => {
    // let config = {
    //   onUploadProgress: progressEvent => {
    //     let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
    //     console.log('percentCompleted',percentCompleted);
    //     // do whatever you like with the percentage complete
    //     // maybe dispatch an action that will update a progress bar or something
    //   }
    // }
    // axios.post('/path/to/post/', data, config)
    //         .then(response => console.log(response));
    // axios.post('http://',null,config)
    //     .then((res)=>{
    //         console.log("Res");
    //         console.log(res);
    //     })
    //     .catch((err)=>{
    //         console.log("err");
    //         console.log(err);
    //     })
    //     let data = {"user":{
    //       name:"umar",
    //       pass:'umar'
    //     }}
    // axios.post('http://10.123.68.232:2020/loginuser',data).then((data)=>{
    //       console.log(data);
    //     })
    //     axios.post(EndPoint+'/loginuser',data)
    //     .then((res)=>{
    //         console.log("Res");
    //         console.log(res.data);
    //     })
    //     .catch((err)=>{
    //         console.log("err");
    //         console.log(err);
    //     })
  };

  // onFileHandler = (e) =>{

  //     let data = {"user":{
  //       name:"umar",
  //       pass:'umar'
  //     }}
  // axios.post('http://10.123.68.232:2020/loginuser',data).then((data)=>{
  //       console.log(data);
  //     })

  // axios.get('http://10.123.68.232:2020/logginUserData')
  // .then((res)=>{
  //     console.log("Res");
  //     console.log(res.data);

  // })
  // .catch((err)=>{
  //     console.log("err");
  //     console.log(err);
  // })

  // let data = {"user":{
  //     name:"naveed",
  //     pass:'pass'
  //   }}

  // if(e.target.files.length >= 2){
  // this.setState({err:''})
  // const data = new FormData();
  // data.append('image', e.target.files[0]);

  // let file = this.dataURLtoFile(img,'myimgname.jpg')
  // console.log(file);
  // const data = new FormData();
  // data.append('image',file);

  // axios.post('https://www.foundationshadefinder.com/predict', data, {
  //   headers: {
  //     'Content-Type': `multipart/form-data`,
  //   }
  // })
  //   .then((response) => {
  //     console.log(response.data);
  //     this.setState({result:response.data})

  //   }).catch((error) => {
  //     console.log(error);
  //     //handle error
  //   });
  // }

  // else{
  //   this.setState({err:'please select two images'})
  // }

  // }

  //   fbs_click = ()  =>{
  //     // u=location.href;
  //     // t=document.title;
  // window.open('http://www.facebook.com/sharer.php?u=https://www.foundationshadefinder.com&t=FoundationShadeFounder&hashtag=%23kendobrands',
  //             'sharer',
  //             'toolbar=0,status=0,width=626,height=436');
  //         return false;
  //     }

  dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1);
      n -= 1; // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime });
  };

  render() {
    // console.log(document.getElementById('siteurlchange'));
    return (
      <div>
        <Home />
        {/* <CirclePicker /> */}
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

        {/* <p onClick={this.fbs_click}>select two images for Face pridictions</p> */}
        {/* <input type="file" multiple onChange={(e) =>this.onFileHandler(e)}/>  */}
      </div>
    );
  }
}

export default App;
