var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
clientLogs = finesse.cslogger.ClientLogger || {};  // for logging

// Gadget Config needed for instantiating ClientServices
/** @namespace */
finesse.gadget.Config = (function () {
	var _prefs = new gadgets.Prefs();

	/** @scope finesse.gadget.Config */
	return {
		authorization: _prefs.getString("authorization"),
		country: _prefs.getString("country"),
		language: _prefs.getString("language"),
		locale: _prefs.getString("locale"),
		host: _prefs.getString("host"),
		hostPort: _prefs.getString("hostPort"),
		extension: _prefs.getString("extension"),
		mobileAgentMode: _prefs.getString("mobileAgentMode"),
		mobileAgentDialNumber: _prefs.getString("mobileAgentDialNumber"),
		xmppDomain: _prefs.getString("xmppDomain"),
		pubsubDomain: _prefs.getString("pubsubDomain"),
		restHost: _prefs.getString("restHost"),
		scheme: _prefs.getString("scheme"),
		localhostFQDN: _prefs.getString("localhostFQDN"),
		localhostPort: _prefs.getString("localhostPort"),
		clientDriftInMillis: _prefs.getInt("clientDriftInMillis")
	};
}());

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.SampleGadget = (function ($) {
    var numDialogs = 0;	     // used to count the calls (dialogs)
	var callvars = new Array();  // the callvars array of callvariables		
    var user, states, dialogs;
	var _agentAssistInstances = {};
	var _currentDialogId;
	var _agentId;
    
    /**
     * Populates the fields in the gadget with data
     */
    render = function () {
        var currentState = user.getState();
		//clientLogs.log("'AgentAssist Gadget >>> userCurrentState", currentState, user, numDialogs);
		// html is initially blank
        var html = '';	     
		if (numDialogs==1) {
			gadgets.window.adjustHeight();
		}
	     else {
				if (_agentAssistInstances[_currentDialogId]) {
					//clientLogs.log("AgentAssist Gadget >>> remove agentassist widget here", _agentAssistInstances[_currentDialogId])
					$(`#${_agentAssistInstances[_currentDialogId].containerId}`).html('');
					_agentAssistInstances[_currentDialogId] = null;
				}
				// automatically adjust the height of the gadget to show the html
				gadgets.window.adjustHeight();
	    }
    },
	
	_processCall = function (dialog) {

	     // if here then callvar1 didnt show up on initial dialog
		 // get the latest callvariables
		
		 _agentId = dialog._data.toAddress;
		 _currentDialogId = dialog._data.fromAddress;//dialog._id
		 console.log("AgentAssist _processCall ", dialog, _currentDialogId, _agentId);
		    /*clientLogs.log(`AgentAssist Gadget >>> _id ${currentDialogId}, state ${dialog.getState()},
			    callType ${dialog.getCallType()}, callbackInfo, ${dialog.getCallbackInfo()}, 
				    mediaProperties  ${dialog.getMediaProperties()}`)*/
			if (dialog.getState() === "ACTIVE" && !_agentAssistInstances[_currentDialogId]) {
				console.log("AgentAssist Gadget >>> creating agentassist widget")
				_agentAssistInstances[_currentDialogId] = new window.AgentAssist('agentout', _currentDialogId, _agentId , 'st-6e9d43c3-33f6-5b44-a8c3-5dfe5d08ffd1');
		//_agentAssistInstances[_currentDialogId] = new window.AgentAssist('agentout', _currentDialogId, user._id, 'st-a9812040-63ce-56e8-8cbc-d3776e419bae');
			}
			callvars = dialog.getMediaProperties();
			clientLogs.log("_processCall:cv1="+callvars["callVariable1"]);
			render();
	
	},
    
    /**
     *  Handler for additions to the Dialogs collection object.  This will occur when a new
     *  Dialog is created on the Finesse server for this user.
     */
     handleNewDialog = function(dialog) {
            // increment the number of dialogs
			numDialogs++;
            
            // get the call variable data from the dialog
			// dialog.getMediaProperties() returns an array of properties
            callvars = dialog.getMediaProperties();
			
			clientLogs.log("handleNewDialog:cv1="+callvars["callVariable1"]);
			// if callVariable1 is null then add a handler for subsequent dialog events
			//  where the call data will have been updated
			if (callvars["callVariable1"] == null )
			{
			    dialog.addHandler('change', _processCall);
			}
			else
			{
			// render the html in the gadget
			   clientLogs.log("rendering dialog");
			   render();
			}
    },
     
    /**
     *  Handler for deletions from the Dialogs collection object for this user.  This will occur
     *  when a Dialog is removed from this user's collection (example, end call)
     */
    handleEndDialog = function(dialog) {
		_currentDialogId = dialog._data.fromAddress; // dialog._id;

	   // decrement the number of dialogs
            numDialogs--;
 
            // render the html in the gadget
            render();
    },
    
    
   
     
    /**
     * Handler for the onLoad of a User object.  This occurs when the User object is initially read
     * from the Finesse server.  Any once only initialization should be done within this function.
     */
    handleUserLoad = function (userevent) {
        // Get an instance of the dialogs collection and register handlers for dialog additions and
        // removals
        dialogs = user.getDialogs( {
            onCollectionAdd : handleNewDialog,
            onCollectionDelete : handleEndDialog
        });
         
        render();
    },
      
    /**
     *  Handler for all User updates
     */
    handleUserChange = function(userevent) {
      
    };
	    
	/** @scope finesse.modules.SampleGadget */
	return {
	    
	    

	        
	    /**
	     * Performs all initialization for this gadget
	     */
	    init : function () {
			var prefs =  new gadgets.Prefs(),
			id = prefs.getString("id");
			
			var clientLogs = finesse.cslogger.ClientLogger;   // declare clientLogs

	        gadgets.window.adjustHeight();
	        
	        // Initiate the ClientServices and the logger and then load the user object.  ClientServices are
	        // initialized with a reference to the current configuration.
	        finesse.clientservices.ClientServices.init(finesse.gadget.Config);
			clientLogs.init(gadgets.Hub, "ScreenPop"); //this gadget id will be logged as a part of the message
	        user = new finesse.restservices.User({
				id: id, 
                onLoad : handleUserLoad,
                onChange : handleUserChange
            });
	            
	        states = finesse.restservices.User.States;
	    }
    };
}(jQuery));
