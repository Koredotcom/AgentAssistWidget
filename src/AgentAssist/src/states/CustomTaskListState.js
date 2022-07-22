const ACTION_IFRAME_URL = 'IFRAME_URL';

const initialState = {
  iframeUrl: "about:blank",
};

export class Actions {
  static dismissBar = () => ({ type: ACTION_IFRAME_URL });
}

export function reduce(state = initialState, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ACTION_IFRAME_URL: {
      return {
        ...state,
        iframeUrl: action.iframeUrl,
      };
    }

    default:
      return state;
  }
}
