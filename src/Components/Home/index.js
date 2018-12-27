import React, { Component } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Loader from '../images/loader.gif';
import cancel from '../images/retake.png';
import undo from '../images/undo.png';
import loaderIframe from '../images/loaderiframe.gif';
import axios from 'axios';
import './style.css';

import SwipeableViews from 'react-swipeable-views';



var intervalID;

class App extends Component {
  //constructor and intial state define here
    constructor(props) {
        super(props)
        this.state = {
            imgShow: false,
            image: '',
            cameraOn:false,
            blur: false,
            loader: false,
            card:true,
            url:'',
            imgSrc:'310',
            index: 0,
            urlSrc:'',
            iframe:false,
            iframeLoader:false,
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
                this.setState({index:0,url,imgSrc:res.data.predictions[0].label.slice(0, 3),card:true})
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
        document.getElementById('inner-circle').innerHTML = "START SHADE FINDER";
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
        
        this.setState({urlSrc:this.state.url,card:false,iframe:true,iframeLoader:true});
    }

    urlHandlerForOtherSite = (url) =>{
       this.setState({urlSrc:url,card:false,iframe:true,iframeLoader:true});
    }
   
    handleChangeIndex = index => {
        this.setState({
          index,
        });
      };

      showMoreHandler = nextIndex =>{
        this.setState({index:nextIndex})
        this.intervalManager(true);
      }

      onIframeCloseHandler = () =>{
        this.setState({iframe:false,card:true,iframeLoader:false});
      }
     
      onLoadHandler = () =>{
        this.setState({iframeLoader:false});
      }

      urlHandlerForNewWindow = (url) =>{
        window.open(url, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no');
      }

      intervalManager = (flag) => {
        if(flag)
        intervalID =  setInterval(()=>{
            this.setState((prevstate) => {
                if(prevstate.index === 5){
                    return {
                        index:0
                      };
                }
                else{
                return {
                  index: prevstate.index + 1
                };}
              });
          }, 10000);
        else
          clearInterval(intervalID);
     }


    render() {

        const { index } = this.state;
        
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
                            isImageMirror={true}
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
                  <div className="mainloaderContainer"> 
                  <img className="loader" src={Loader} alt="" />
                  </div>
                  :""
                }
              {this.state.card ?      
            <div id="displayContainer">
            <SwipeableViews
            springConfig={{duration: '10s', easeFunction: 'linear', delay: '0s'}} 
            enableMouseEvents index={index} 
            onChangeIndex={this.handleChangeIndex}>
            <div>
               <div>
                <img onClick={()=>this.intervalManager(false)} width="100" height="100" className="shade" src={require(`../images/Shades/${this.state.imgSrc}.jpg`)} alt="shade"/>
                <br/>
                Found Your Best Shade!
                </div>
                <p className="shadesDetails"><b>FENTY BEAUTY BY RIHANNA</b></p>
                <p className="makeLink" onClick={this.urlHandler}>
                <span>
                ENTER FENTY BEAUTY
                </span>
                </p>
                <span onClick={()=> this.showMoreHandler(1)} className="showMoreFound"><small>FIND SHADE MYSELF</small> </span>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            
            {/* -----------swap 1------------ */}
             <div>
               <div>
                <img onClick={()=>this.intervalManager(false)} width="100" height="100" className="shade" src={require(`../images/Shades/swap1.jpg`)} alt="shade"/>
                <br/>
                Kat Von D Lock-It Foundation
                </div>
                <p className="shadesDetails">Creamy and pigmented, Lock-It Foundation is the only 24-hour-wear liquid formula we can count on to create a perfect canvas on ANY skin type! With 30 shades and undertones, everyone can rock a flawless complexion without ever touching up</p>
                <p className="makeLink" onClick={() => this.urlHandlerForNewWindow('https://www.katvondbeauty.com/face/foundation/lock-it-foundation/20005.html?dwvar_20005_color=2045L')}>
                <span>
                ENTER KAT VON D BEAUTY
                </span>
                </p>
                <span onClick={()=> this.showMoreHandler(2)} className="findMoreLockIt"><small>
                FIND MORE
                </small> </span>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            {/* ----------- end of swap 1------------ */}

            {/* -----------swap 2------------ */}
            <div>
               <div>
                <img onClick={()=>this.intervalManager(false)} width="100" height="100" className="shade" src={require(`../images/Shades/swap2.jpg`)} alt="shade"/>
                <br/>
                Marc Jacobs
                </div>
                <p className="shadesDetails">Self-setting finish. Invisible SPF Foundation Innovation. (YOU)thful, only better.An innovative, medium foundation with up to 24-hour longwear and first-to-market, flashback-free SPF 25 for a youthful look.</p>
                <p className="makeLink" onClick={() => this.urlHandlerForNewWindow('https://www.marcjacobsbeauty.com/shameless/youthful-look-24-hour-foundation-spf-25/MJ30017.html?dwvar_MJ30017_color=MJ3097')}>
                <span>            
                    ENTER KAT MARC JACOBS
                </span>
                </p>
                <span onClick={()=> this.showMoreHandler(3)} className="findMoreMarc"><small>
                FIND MORE </small> </span>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            {/* ----------- end of swap 2------------ */}

            {/* -----------swap 3------------ */}
            <div>
               <div>
                <img onClick={()=>this.intervalManager(false)} width="100" height="100" className="shade" src={require(`../images/Shades/swap3.jpg`)} alt="shade"/>
                <br/>
                Make Up Forever 
                </div>
                <p className="shadesDetails">No more waiting, no more dating: find your perfect match with these limited edition petite bottles of our best-selling foundation, a multiple award winner with buildable to medium coverage, available...</p>
                <p className="makeLink" onClick={() => this.urlHandlerForNewWindow('https://www.makeupforever.com/us/en-us/make-up/face/foundation/ultra-hd-foundation-petite?sku=8705')}>

                <span>
                ENTER MAKE UP FOREVER
                </span>
                </p>
                <span onClick={()=> this.showMoreHandler(4)} className="showMore"><small>FIND MORE </small> </span>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            {/* ----------- end of swap 3------------ */}
         
             {/* -----------swap 4------------ */}
            <div>
               <div>
                <img onClick={()=>this.intervalManager(false)} width="100" height="100" className="shade" src={require(`../images/Shades/swap4.jpg`)} alt="shade"/>
                <br/>
                Benefit Cosmetics
                </div>
                <p className="shadesDetails">light-medium coverage liquid foundation broad spectrum SPF 15 sunscreen</p>
                <p className="makeLink" onClick={() => this.urlHandlerForNewWindow('https://www.benefitcosmetics.com/us/en/product/hello-happy-soft-blur-foundation')}>
                <span>
                ENTER BENEFIT COSMETICS
                </span>
                </p>
                <span onClick={()=> this.showMoreHandler(5)} className="findMoreBenefit"><small>
                FIND MORE </small> </span>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            {/* ----------- end of swap 4------------ */}

            {/* -----------swap 5------------ */}
            <div>
               <div>
                <img onClick={()=>this.intervalManager(false)} width="100" height="100" className="shade" src={require(`../images/Shades/swap5.jpg`)} alt="shade"/>
                <br/>
                NARS Cosmetics 
                </div>
                <p className="shadesDetails" style={{textTransform: 'lowercase'}}>A UNIQUELY LIGHTWEIGHT FOUNDATION THAT PROVIDES 16 HOURS OF FADE-RESISTANT WEAR WITH FULL-POWERED RADIANCE.</p>
                <p className="makeLink" onClick={() => this.urlHandlerForNewWindow('https://www.narscosmetics.com/USA/mali-natural-radiant-longwear-foundation/0607845066323.html')}>
                <span>
                ENTER MAKE UP FOREVER
                </span>
                </p>
                <span onClick={()=> this.showMoreHandler(0)} className="showMore"><small>FIND MORE</small> </span>
                <p><img width="30" className="retake" onClick={this.cancelEvent} src={undo} alt=""/></p>  
            </div>
            {/* ----------- end of swap 5------------ */}     
            </SwipeableViews>
            </div>
            :""}
            
            {this.state.iframe ? 
            <div className="iframeContainer">
            <img onClick={this.onIframeCloseHandler} className="closeIframe" src={require('../images/cancel.png')} alt="close"/>
            <iframe width="100%" onLoad={this.onLoadHandler} height={window.screen.height/2} title="some" src={this.state.urlSrc} frameBorder="0">
            </iframe>
            </div>            
            :""}
            
            {this.state.iframeLoader ? 
            <div className="loaderContainer">
            <img className="iframeLoader" src={loaderIframe} alt=""/>
            </div>
            : "" }

             <div ref={el => { this.el = el; }} />
            </div>
        );
    }
}

export default App;