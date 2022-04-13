import React from 'react';
import PropTypes from 'prop-types';

import { CustomTaskListComponentStyles } from './CustomTaskList.Styles';

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList = (props) => {

  console.log("11111111111111111111 props", props)

  return (
    <CustomTaskListComponentStyles>
      <div id="agentassist-maincontainer">
      </div>
    </CustomTaskListComponentStyles>
  );
};

CustomTaskList.displayName = 'CustomTaskList';

CustomTaskList.propTypes = {
  isOpen: PropTypes.bool,
  dismissBar: PropTypes.func
};

export default CustomTaskList;
