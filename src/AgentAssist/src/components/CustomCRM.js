import React from "react";
// import { Iframe } from "react-iframe";

export default class CustomCRM extends React.Component{

    render(){
        // const customStyle = {
        //     "marginLeft": "250px",
        //     "marginTop": "200px",
        //     "fontSize": "xxx-large"
        // }
        return(
            // <div>
            //     <h1 style={ customStyle }>Task has been completed............</h1>
            // </div>
            <div>
               
                <iframe
                title="agenAssistIframe"
                src={this.props.srcURL}
                height="720"
                width="1280"
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
                ></iframe>
          </div>
        );
    }

}
