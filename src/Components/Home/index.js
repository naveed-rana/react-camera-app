import React, { Component } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Loader from "../images/loader.gif";
import cancel from "../images/retake.png";
import undo from "../images/undo.png";
import axios from "axios";
import "./style.css";

import SwipeableViews from "react-swipeable-views";

var intervalID;

class App extends Component {
  //constructor and intial state define here
  constructor(props) {
    super(props);
    this.state = {
      imgShow: false,
      image: "",
      cameraOn: true,
      blur: false,
      loader: false,
      card: false,
      index: 0,
      cardData: [
        [
          "https://www.fentybeauty.com/pro-filtr/soft-matte-longwear-foundation/FB30006.html?dwvar_FB30006_color=FB0240",
          "FENTY BEAUTY     Pro Filt'r Mattee Longwear Foundation",
          "240 Warm"
        ],
        [
          "https://www.sephora.com/product/diorskin-forever-undercover-foundation-P427506?icid2=products%20grid:p427506:product&skuId=2037125",
          "DIOR Diorskin Forever Undercover Foundation",
          "025 Soft Beige - light with neutral undertone"
        ],
        [
          "https://www.sephora.com/product/lock-it-tattoo-foundation-P311138?icid2=products%20grid:p311138:product&skuId=1398874",
          "KAT VON D      Lock-It Foundation",
          "52 Medium - Warm Undertone"
        ],
        [
          "https://www.sephora.com/product/lock-it-foundation-mini-P438613?skuId=2144012",
          "KAT VON D    Lock-It Foundation Mini",
          "52 Medium - Warm Undertone"
        ],
        [
          "https://www.sephora.com/product/shameless-youthful-look-24h-foundation-spf-25-P427500?icid2=products%20grid:p427500:product&skuId=2035806",
          "MARC JACOBS      Shameless Youthful Look Foundation",
          "Medium Y340"
        ],
        [
          "https://www.sephora.com/product/re-marc-able-full-coverage-foundation-concentrate-P398803?icid2=products%20grid:p398803:product&skuId=1711084",
          "MARC JACOBS      Re(marc)able Full Cover Foundation",
          "32 Beige Light"
        ],
        [
          "https://www.sephora.com/product/ultra-hd-invisible-cover-foundation-P398321?icid2=products%20grid:p398321:product&skuId=1708882",
          "MAKE UP FOREVER     ULTRA HD FOUNDATION  INVISIBLE COVER FOUNDATION",
          "Y315 Sand"
        ],
        [
          "https://www.sephora.com/product/water-blend-face-body-foundation-P410512?icid2=products%20grid:p410512:product&skuId=1856343",
          "MAKE UP FOREVER                      Water Blend Face & Body Foundation",
          "R300 Vanella"
        ],
        [
          "https://www.sephora.com/product/matte-velvet-skin-full-coverage-foundation-P434023?icid2=products%20grid:p434023:product&skuId=2106359",
          "MAKE UP FOREVER                Matte Velvet Skin Foundation",
          "R330 Warm Ivory"
        ],
        [
          "https://www.sephora.com/product/hello-happy-soft-blur-foundation-P432858?icid2=products%20grid:p432858:product&skuId=2086502",
          "BENEFIT COSMETICS   Hello Happy Soft Blur Foundation",
          "Medium Warm"
        ]
      ]
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  //onTake Event callout
  onTakePhoto(dataUri) {
    console.log(dataUri);

    this.setState({ cameraOn: false, imgShow: true, image: dataUri });
    if (dataUri !== "data:,") {
      this.setState({ loader: true });
      const file = this.dataURLtoFile(dataUri, "myimage.png");
      console.log("after file", file);
      const data = new FormData();
      data.append("image", file);

      axios
        .post("https://www.foundationshadefinder.com/predict", data, {
          headers: {
            "Content-Type": `multipart/form-data`
          }
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            loader: false,
            index: 0,
            card: true,
            cardData: res.data
          });
        })
        .catch(err => {
          console.log("ERROR", err);
          // alert("Something went wrong...");
          this.setState({
            loader: false,
            index: 0,
            card: true,
            cardData: "false"
          });
        });
    }
  }

  onCameraError(error) {
    console.error("onCameraError", error);
  }

  onCameraStart(stream) {
    document.getElementById("inner-circle").innerHTML = "START SHADE FINDER";
    console.log("onCameraStart");
  }

  // helper function: generate a new file from base64 String
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
  //end of helper function: generate a new file from base64 String

  //upload to the server image and redirect
  uploadToServer = () => {
    this.setState({ blur: true });
    console.log(this.state.image);
    // generate file from base64 string
  };

  cancelEvent = () => {
    this.setState({ cameraOn: true, card: false, blur: false });
  };

  urlHandler = url => {
    window.open(
      url,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no"
    );
  };

  handleChangeIndex = index => {
    this.setState({
      index
    });
  };

  showMoreHandler = nextIndex => {
    this.intervalManagerPrevious(false);
    this.setState({ index: nextIndex });
    this.intervalManager(true);
  };

  intervalManager = flag => {
    if (flag)
      intervalID = setInterval(() => {
        this.setState(prevstate => {
          if (prevstate.index === 9) {
            this.intervalManager(false);
            return {
              index: 9
            };
          } else {
            return {
              index: prevstate.index + 1
            };
          }
        });
      }, 3000);
    else clearInterval(intervalID);
  };

  showPreviousHandler = nextIndex => {
    this.intervalManager(false);
    this.setState({ index: nextIndex });
    this.intervalManagerPrevious(true);
  };

  intervalManagerPrevious = flag => {
    if (flag)
      intervalID = setInterval(() => {
        this.setState(prevstate => {
          if (prevstate.index === 0) {
            this.intervalManagerPrevious(false);
            return {
              index: 0
            };
          } else {
            return {
              index: prevstate.index - 1
            };
          }
        });
      }, 3000);
    else clearInterval(intervalID);
  };

  fbs_click = () => {
    // u=location.href;
    // t=document.title;
    window.open(
      `http://www.facebook.com/sharer.php?u=https://www.foundationshadefinder.com?id=${Math.random()}&t=FoundationShadeFounder&hashtag=%23kendobrand`,
      "sharer",
      "toolbar=0,status=0,width=626,height=436"
    );
    return false;
  };

  fileChangeHandler = e => {
    console.log("image", e.target.files[0]);

    this.setState({
      loader: true,
      cameraOn: false,
      imgShow: true,
      image: URL.createObjectURL(e.target.files[0])
    });

    const datasd = new FormData();
    datasd.append("image", e.target.files[0]);

    axios
      .post("https://www.foundationshadefinder.com/predict", datasd, {
        headers: {
          "Content-Type": `multipart/form-data`
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          loader: false,
          index: 0,
          card: true,
          cardData: res.data
        });
      })
      .catch(err => {
        console.log("ERROR", err);
        // alert("Something went wrong...");
        this.setState({
          loader: false,
          index: 0,
          card: true,
          cardData: "false"
        });
      });
  };

  render() {
    const { index, cardData } = this.state;

    return (
      <div className="App">
        <div className="topHeader">
          <p>
            <b>Foundation Shade Finder</b> <span className="aiButton">A.I</span>
          </p>
        </div>

        {this.state.cameraOn ? (
          <div id="videoContainer">
            <Camera
              onTakePhoto={dataUri => {
                this.onTakePhoto(dataUri);
              }}
              onCameraError={error => {
                this.onCameraError(error);
              }}
              idealFacingMode={FACING_MODES.USER}
              imageCompression={0.97}
              isMaxResolution={true}
              isImageMirror={true}
              isDisplayStartCameraError={true}
              sizeFactor={1}
              onCameraStart={stream => {
                this.onCameraStart(stream);
              }}
              onCameraStop={() => {
                this.onCameraStop();
              }}
            />

            <div className="camIcon">
              <div className="image-upload">
                <label htmlFor="file-input3">
                  <img
                    style={{ width: "42px" }}
                    src={require("../images/cam.png")}
                  />
                </label>
                <input
                  id="file-input3"
                  accept="image/*"
                  name="image4"
                  onChange={this.fileChangeHandler}
                  type="file"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {this.state.image === "data:," ? (
              <img
                onClick={this.cancelEvent}
                className="cancel"
                src={cancel}
                alt="cancel"
              />
            ) : (
              <div>
                <img
                 
                  className="imgShow"
                  src={this.state.image}
                  alt="takephoto"
                />
              </div>
            )}
          </div>
        )}
        {this.state.loader ? (
          <div className="mainloaderContainer">
            <img className="loader" src={Loader} alt="" />
          </div>
        ) : (
          ""
        )}
        {this.state.card ? (
          <div id="displayContainer">
            {cardData === "false" ||
            cardData === "not-success" ||
            cardData === "[info] No Face Found. Try Capturing again" ? (
              <div>
                <p style={{ marginBottom: 150, fontWeight: "bold" }}>
                  Something went wrong... Try Capturing again
                </p>
                <p>
                  <img
                    onClick={this.cancelEvent}
                    className="cancel"
                    src={cancel}
                    alt="cancel"
                  />
                </p>
              </div>
            ) : (
              <SwipeableViews
                springConfig={{
                  duration: "10s",
                  easeFunction: "linear",
                  delay: "0s"
                }}
                // axis={['x-reverse']}
                enableMouseEvents
                index={index}
                onChangeIndex={this.handleChangeIndex}
              >
                {/* ----------- swap 0------------ */}
                <div>
                  <div>
                    <img
                      // onClick={() => this.showPreviousHandler(9)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/1-fentybeauty/${cardData[0][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(1)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b> FENTY BEAUTY Pro Filt'r Mattee Longwear Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[0][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[0][0])}
                  >
                    <span>ENTER FENTY BEAUTY</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(0)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>

                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[0][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[0][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 0------------ */}

                {/* ----------- swap 1------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(0)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/10-DIOR/${cardData[1][0].slice(-3)}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(2)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>DIOR Diorskin Forever Undercover Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[1][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[1][0])}
                  >
                    <span>ENTER DIOR</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(1)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[1][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[1][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 1------------ */}

                {/* ----------- swap 2------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(1)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/2-KAT VON D/${cardData[2][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(3)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>KAT VON D Lock-It Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[2][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[2][0])}
                  >
                    <span>ENTER KAT VON D</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(2)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[2][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[2][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 2------------ */}

                {/* ----------- swap 3------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(2)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/3-Mini KAT VON D/${cardData[3][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(4)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>KAT VON D Lock-It Foundation Mini</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[3][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[3][0])}
                  >
                    <span>ENTER KAT VON D</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(3)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[3][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[3][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 3------------ */}

                {/* ----------- swap 4------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(3)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/4-Marc Jacobs Shameless/${cardData[4][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(5)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>MARC JACOBS Shameless Youthful Look Foundation </b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[4][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[4][0])}
                  >
                    <span>ENTER MARC JACOBS</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(4)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[4][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[4][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 4------------ */}

                {/* ----------- swap 5------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(4)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/5-Marc Jacobs Re(marc)able Full Cover Foundation/${cardData[5][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(6)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>MARC JACOBS Re(marc)able Full Cover Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[5][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[5][0])}
                  >
                    <span>ENTER MARC JACOBS</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(5)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>
                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[5][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[5][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 5------------ */}

                {/* ----------- swap 6------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(5)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/6-MAKE UP FOREVER ULTRA HD FOUNDATION/${cardData[6][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(7)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>
                      MAKE UP FOREVER ULTRA HD FOUNDATION INVISIBLE COVER
                      FOUNDATION
                    </b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[6][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[6][0])}
                  >
                    <span>ENTER MAKE UP FOREVER</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(6)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[6][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[6][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 6------------ */}

                {/* ----------- swap 7------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(6)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/7-MAKE UP FOREVER Water Blend Face & Body FOUNDATION/${cardData[7][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(8)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>MAKE UP FOREVER Water Blend Face & Body Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[7][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[7][0])}
                  >
                    <span>ENTER MAKE UP FOREVER</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(7)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[7][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[7][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 7------------ */}

                {/* ----------- swap 8------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(7)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/8-MAKE UP FOREVER Matte Velvet Skin Foundation/${cardData[8][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      onClick={() => this.showMoreHandler(9)}
                      style={{ marginLeft: "10%", marginBottom: "30px" }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>MAKE UP FOREVER Matte Velvet Skin Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[8][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[8][0])}
                  >
                    <span>ENTER MAKE UP FOREVER</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(8)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}

                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[6][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[6][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ----------- end of swap 8------------ */}

                {/* ----------- swap 9------------ */}
                <div>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(8)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/9-BENEFIT COSMETICS SOFT BLUR FOUNDATION/${cardData[9][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      // onClick={() => this.showMoreHandler(1)}
                      style={{
                        visibility: "hidden",
                        marginLeft: "10%",
                        marginBottom: "30px"
                      }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p
                    onClick={() => this.intervalManager(false)}
                    className="shadesDetails"
                  >
                    <b>BENEFIT COSMETICS Hello Happy Soft Blur Foundation</b>
                  </p>
                  <p onClick={() => this.intervalManager(false)}>
                    <b>{cardData[9][2]}</b>
                  </p>
                  {/* <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[9][0])}
                  >
                    <span>ENTER BENEFIT COSMETICS</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(9)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p> */}
                  <table
                    style={{
                      position: "absolute",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>

                        <td style={{ width: "15%" }}>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={() => this.urlHandler(cardData[9][0])}
                              style={{ width: "42px" }}
                              src={require("../images/enter.png")}
                              alt=""
                            />
                            <div
                              onClick={() => this.urlHandler(cardData[9][0])}
                            >
                              Enter
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.cancelEvent}
                              style={{ width: "42px" }}
                              src={require("../images/cam.png")}
                              alt=""
                            />
                            <div onClick={this.cancelEvent}> New Photo </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {" "}
                            <img
                              className="retake"
                              onClick={this.fbs_click}
                              style={{ width: "42px" }}
                              src={require("../images/share.png")}
                              alt=""
                            />
                            <div onClick={this.fbs_click}> Share </div>
                          </div>
                        </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                        <td style={{ visibility: "hidden" }}>.. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ----------- end of swap 9------------ */}

                {/* ----------- dummy no 10------------ */}
                <div style={{ visibility: "hidden" }}>
                  <div>
                    <img
                      onClick={() => this.showPreviousHandler(8)}
                      style={{ marginRight: "10%", marginBottom: "30px" }}
                      width="27"
                      src={require("../images/back.png")}
                      alt=""
                    />
                    <img
                      onClick={() => this.intervalManager(false)}
                      width="100"
                      height="100"
                      className="shade"
                      src={require(`../images/Shades/9-BENEFIT COSMETICS SOFT BLUR FOUNDATION/${cardData[9][0].slice(
                        -3
                      )}.jpg`)}
                      alt="shade"
                    />
                    <img
                      // onClick={() => this.showMoreHandler(1)}
                      style={{
                        visibility: "hidden",
                        marginLeft: "10%",
                        marginBottom: "30px"
                      }}
                      width="30"
                      src={require("../images/next.png")}
                      alt=""
                    />
                    <br />
                    Found Your Shade!
                  </div>
                  <p className="shadesDetails">
                    <b>BENEFIT COSMETICS Hello Happy Soft Blur Foundation</b>
                  </p>
                  <p>
                    <b>{cardData[9][2]}</b>
                  </p>
                  <p
                    className="makeLink"
                    onClick={() => this.urlHandler(cardData[9][0])}
                  >
                    <span>ENTER BENEFIT COSMETICS</span>
                  </p>
                  <span
                    onClick={() => this.showMoreHandler(9)}
                    className="showMoreFound"
                  >
                    FIND MORE SHADES{" "}
                  </span>
                  <p>
                    <span onClick={this.fbs_click} className="shareonfb">
                      SHARE ON FACEBOOK{" "}
                    </span>
                  </p>

                  <p>
                    <img
                      width="30"
                      className="retake"
                      onClick={this.cancelEvent}
                      src={undo}
                      alt=""
                    />
                  </p>
                </div>
              </SwipeableViews>
            )}
          </div>
        ) : (
          ""
        )}
        {/* 
        <input
               style={{marginTop:'100px'}} type="file" multiple onChange={(e) =>this.onFileHandler(e)}/>  */}

        <div
          ref={el => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}

export default App;
