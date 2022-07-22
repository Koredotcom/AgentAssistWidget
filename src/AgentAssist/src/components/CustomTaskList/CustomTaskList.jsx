import React from 'react';
import PropTypes from 'prop-types';

import { CustomTaskListComponentStyles } from './CustomTaskList.Styles';

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList = (props) => {
  if (!props.iframeUrl) {
    return null;
  }

  return (
    // <CustomTaskListComponentStyles>
    //   This is a dismissible demo component {props.iframeUrl}
     
    // </CustomTaskListComponentStyles>
                   
    <iframe
    title="agenAssistIframe"
    src={props.iframeUrl}
    height="100%"
    width="100%"    
    ></iframe>
    
  );
};

CustomTaskList.displayName = 'CustomTaskList';

CustomTaskList.propTypes = {
  iframeUrl: PropTypes.string.isRequired,
  dismissBar: PropTypes.func.isRequired,
};

export default CustomTaskList;
