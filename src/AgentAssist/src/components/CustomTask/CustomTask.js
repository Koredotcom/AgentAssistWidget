import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../../states/CustomTaskListState';
import CustomTaskList from './CustomTaskList';

const mapStateToProps = (state) => ({
  iframeUrl: state['agentassist'].customTaskList.iframeUrl,
});

const mapDispatchToProps = (dispatch) => ({
  changeIframeUrl: bindActionCreators(Actions.changeIframeUrl, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTaskList);
