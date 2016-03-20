var gameObj;

$(window).load(function() { 
    // Show dialog
    $('#selectTheme_dialog').dialog({
        title: 'Please select your theme'
        
    });
    
    
});

function loadTheme(theme) {
    $('#selectTheme_dialog').dialog("destroy");
    
    // Load CSS
    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'themes/' + theme + '/style.css') );
    $("head").append('<script type="text/javascript" src="themes/' + theme + '/config.js"></script>');
    
    // Show difficulty dialog
    $('#selectDifficulty_dialog').dialog({
        title: 'Select difficulty'
        
    });
}

function setDifficulty(difficulty) {
    $('#selectDifficulty_dialog').dialog("destroy");
    
    gameObj = new PaddleWar($('#arena'));
    gameObj.setAISpeed(difficulty);
    gameObj.start();
}
