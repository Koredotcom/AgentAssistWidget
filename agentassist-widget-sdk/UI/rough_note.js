$.ajax({
  url: "ajax.aspx",
  type: "get", //send it through get method
  data: { 
    ajaxid: 4, 
    UserID: UserID, 
    EmailAddress: EmailAddress
  },
  success: function(response) {
    //Do Something
  },
  error: function(xhr) {
    //Do Something to handle error
  }
});

// javascript files list
            'libs/kore-no-conflict-start.js',
            'libs/jquery.js',
            'libs/jquery.tmpl.min.js',
            'libs/jquery-ui.min.js',
            'libs/moment.js',
            '../libs/ie11CustomProperties.js',
            '../libs/lodash.min.js',
            '../libs/d3.v4.min.js',
            '../libs/KoreGraphAdapter.js',
            '../libs/anonymousassertion.js',
            '../kore-bot-sdk-client.js',
            '../libs/perfect-scrollbar.js',
            'chatWindow.js',
            'libs/jquery.daterangepicker.js',
            'libs/jquery-clockpicker.js',
            '../libs/kore-pickers.js',
            '../libs/emoji.js',
            '../libs/recorder.js',
            '../libs/recorderWorker.js',
            '../libs/purejscarousel.js',
            './custom/customTemplate.js',
            'kore-config.js',
            'libs/kore-no-conflict-end.js',
            'libs/jquery-3.1.1.js',
            'agentindex.js',
// 

// css files list
            './css/reset.css',
            './fonts/inter.css',
            './css/styles.css',
            'fonts/AgentAssist-icons/style.css',
            'libs/jquery-ui.min.css',
            'libs/daterangepicker.css',
            'libs/jquery-clockpicker.css',
            '../libs/kore-pickers.css',
            'chatWindow.css',
            '../libs/emojione.sprites.css',
            '../libs/purejscarousel.css',
            '../libs/prefect-scrollbar.css',
            './custom/customTemplate.css',

// 