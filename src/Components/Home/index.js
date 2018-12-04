import React, { Component } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Loader from '../images/loader.gif';
import cancel from '../images/retake.png';
import undo from '../images/undo.png';
import axios from 'axios';
import './style.css';

import SwipeableViews from 'react-swipeable-views';

class App extends Component {
  //constructor and intial state define here
    constructor(props) {
        super(props)
        this.state = {
            imgShow: false,
            image: '',
            cameraOn:true,
            blur: false,
            loader: false,
            card:false,
            url:'',
            imgSrc:'310'
        }
    }

    componentDidMount() {
        this.scrollToBottom();
        // document.getElementById('inner-circle').innerHTML = "Start Shade Finder";
      }
    
      componentDidUpdate() {
        this.scrollToBottom();
      }
    
      scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
      }

//onTake Event callout
    onTakePhoto(dataUri) {
        console.log(dataUri);
        
        this.setState({ cameraOn: false, imgShow: true, image: dataUri });
        if(dataUri !=='data:,'){
            this.setState({loader:true});

        const file = this.dataURLtoFile(dataUri)
        const data = new FormData()
        data.append('image', file, file.name)
        axios.post('/predict', data, {
            headers: {

                'Content-Type': 'multipart/form-data',
            },
        })
            .then(res => {
                this.setState({loader:false});
                if(res.data.predictions[0]){
                 let url = `https://www.fentybeauty.com/pro-filtr/soft-matte-longwear-foundation/FB30006.html?dwvar_FB30006_color=FB0${res.data.predictions[0].label.slice(0, 3)}`;
                this.setState({url,imgSrc:res.data.predictions[0].label.slice(0, 3),card:true})
                }

            }).catch(err => {
                // console.log("ERROR", err)
                alert("Something went wrong...");
            });
        }
    }

    onCameraError(error) {
        console.error('onCameraError', error);
    }

    onCameraStart(stream) {
        document.getElementById('inner-circle').innerHTML = "Start Shade Finder";
        console.log('onCameraStart');
    }


     // helper function: generate a new file from base64 String
      dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n) {
            u8arr[n - 1] = bstr.charCodeAt(n - 1)
            n -= 1 // to make eslint happy
        }
        return new File([u8arr], filename, { type: mime })
    }
     //end of helper function: generate a new file from base64 String

    //upload to the server image and redirect
    uploadToServer = () => {
        this.setState({ blur: true });
        console.log(this.state.image);
        // generate file from base64 string
    }

    cancelEvent = () => {
        
        this.setState({ cameraOn: true, card: false, blur: false });
    }

    urlHandler = () => {
        window.location.href = this.state.url;
    }




    render() {
        
        return (
            <div className="App">
              <div className="topHeader">
              <p><b>Foundation Shade Finder</b> <span className="aiButton">A.I</span></p>
              </div>

                {this.state.cameraOn ?
                    <div id="videoContainer">
                        <Camera
                            onTakePhoto={(dataUri) => { this.onTakePhoto(dataUri); }}
                            onCameraError={(error) => { this.onCameraError(error); }}
                            idealFacingMode={FACING_MODES.USER}
                            imageType={IMAGE_TYPES.JPG}
                            imageCompression={0.97}
                            isMaxResolution={true}
                            isImageMirror={false}
                            isDisplayStartCameraError={true}
                            sizeFactor={1}
                            onCameraStart={(stream) => { this.onCameraStart(stream); }}
                            onCameraStop={() => { this.onCameraStop(); }}
                        />
                        
                    </div>
                    :
                    <div>
                        {
                        this.state.image === 'data:,' ?
                        <img onClick={this.cancelEvent} className="cancel" src={cancel} alt="cancel" />
                         : 
                        <div>
                        <img className="imgShow" src={this.state.image} alt="takephoto" />
                        </div>
                        }
                    </div> 
                }
                  {this.state.loader ? 
                  <img className="loader" src={Loader} alt="" />
                  :""
                }
              {this.state.card ?      
            <div id="displayContainer">
            <SwipeableViews enableMouseEvents>
            <div>
               <div>
                <img width="100" height="100" className="shade" src={require(`../images/Shades/${this.state.imgSrc}.jpg`)} alt="shade"/>
                <br/>
                Best Shade For You!
                </div>
                <p className="shadesDetails">A soft matte, longwear foundation with buildable, medium to full coverage, in a boundary-breaking range of 40 shades.</p>
                <p className="makeLink" onClick={this.urlHandler}>Buy Shade Now</p>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>


             <div>
               <div>
                <img width="100" height="100" className="shade" src={require(`../images/Shades/${this.state.imgSrc}.jpg`)} alt="shade"/>
                <br/>
                Best Shade For You!
                </div>
                <p className="shadesDetails">A soft matte, longwear foundation with buildable, medium to full coverage, in a boundary-breaking range of 40 shades.</p>
                <p className="makeLink" onClick={this.urlHandler}>Buy Shade Now</p>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            </SwipeableViews>
            </div>
            :""}

            


             <div ref={el => { this.el = el; }} />
            </div>
        );
    }
}

export default App;