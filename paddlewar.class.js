// Constants
var LEFT = 1;
var RIGHT = 2;
var TOP = 3;
var BOTTOM = 4;


var PaddleWar = function(fieldEl) {
    
    // Setting theme and arena
    this.setFieldEl(fieldEl);
    
    console.log(this.getFieldEl().height());
    console.log(this.getFieldEl().width());
    
    // Load sounds
    this.addSound('background', soundsObj.background.filename, soundsObj.background.volume);
    this.addSound('paddleHit', soundsObj.paddleHit.filename, soundsObj.paddleHit.volume);
    this.addSound('score', soundsObj.score.filename, soundsObj.score.volume);
    
    
    // Add ball. Positioning is made in ballObj.start();
    this.setBallObj(new Ball());
   
    // Adding and positioning paddles
    paddleObj = this.addPaddle(LEFT, this.getFieldEl());
    paddleObj.setXPos(50);
    paddleObj.setYPos(this.getFieldEl().height() / 2 - paddleObj.getDiv().height() / 2);
    paddleObj.setAI(true);
    
    paddleObj = this.addPaddle(RIGHT, this.getFieldEl());
    paddleObj.setXPos(this.getFieldEl().width() - 50 - paddleObj.getDiv().width());
    paddleObj.setYPos(this.getFieldEl().height() / 2 - paddleObj.getDiv().height() / 2);
    
    
    
    // Add keyboard shortcuts
    window.onkeydown = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        
         
        if (key == 38) {
            gameObj.getPaddleObj(RIGHT).moveUp();
        } else if (key == 40) {
            gameObj.getPaddleObj(RIGHT).moveDown();
            
        }
    };

    
    

}

PaddleWar.prototype.setTheme = function(theme) {
    this.theme = theme;
    
    // Load CSS
    var cssLink = $("<link rel='stylesheet' type='text/css' href='themes/" + theme + "/style.css'>");
    $("head").append(cssLink); 
    
}
    
PaddleWar.prototype.getTheme = function() {
    return this.theme;
}

PaddleWar.prototype.setBallObj = function(ballObj) {
    this.ballObj = ballObj;
    
    
}

PaddleWar.prototype.getBallObj = function() {
    return this.ballObj;
}

PaddleWar.prototype.setFieldEl = function(fieldEl) {
    this.fieldEl = fieldEl;
    
    
}

PaddleWar.prototype.getFieldEl = function() {
    return this.fieldEl;
}

PaddleWar.prototype.setAISpeed = function(aiSpeed) {
    this.aiSpeed = aiSpeed;
}

PaddleWar.prototype.getAISpeed = function() {
    if(this.aiSpeed) {
        return this.aiSpeed;
    } else {
        return 60;
    }
}



PaddleWar.prototype.addPaddle = function(side, parentEl) {
    if(this.paddlesArr == undefined) {
        this.paddlesArr = new Array();
    }
    
    this.paddlesArr[side] = new Paddle(side, parentEl);
    
    return this.paddlesArr[side];
    
    
}

PaddleWar.prototype.getPaddleObj = function(side) {
    return this.paddlesArr[side];
}

PaddleWar.prototype.getPaddles = function() {
    return this.paddlesArr;
}


PaddleWar.prototype.start = function() {
    var that = this;
   
    // Start background sound
    this.playSound('background');
    
    // Get random angle
    this.getBallObj().setAngle(this.getBallObj().getRandomAngle());
       
    // Get random direction
    var direction = Math.floor(Math.random() * 2) + 1;
    this.getBallObj().setDirection(direction);
    
    this.getBallObj().setXPos(this.getFieldEl().width() / 2 - this.getBallObj().getDiv().width() / 2);
    this.getBallObj().setYPos(this.getFieldEl().height() / 2 - this.getBallObj().getDiv().height() / 2);

    

    // Start AI paddles
    this.AIPaddlesInterval = setInterval(function() { that.moveAIPaddles(); }, this.getAISpeed());
    
    // Reset speed increase
    this.getBallObj().setSpeedIncrease(0);    
    
    // Countdown
    this.startCountdown();
   
   

}

PaddleWar.prototype.moveAIPaddles = function() {

    var paddlesArr = this.getPaddles();
    
    var sidesArr = [LEFT, RIGHT];
  
    for(side of sidesArr) {
        paddleObj = paddlesArr[side];
    
        if(paddleObj.getAI()) {

            // Calculate middle Y-position of paddle
            var middleY = paddleObj.getYPos() + paddleObj.getDiv().height() / 2;

            // Move up or down depending on position of ball
            if(middleY > this.getBallObj().getYPos()) {
                paddleObj.moveUp();
            }

            if(middleY < this.getBallObj().getYPos()) {
                paddleObj.moveDown();
            }

        }
    }
     
}

PaddleWar.prototype.moveBall = function() {
        
    var that = this;
    this.getBallObj().move();    
    
    
    
    if(this.isAtBorder()) {
        this.getBallObj().bounceY();
    }
    
    if(this.hitPaddle()) {
        this.getBallObj().bounceX();
        this.getBallObj().setAngle(this.getBallObj().getRandomAngle());
        
        // Increase ball speed
        this.getBallObj().setSpeedIncrease(this.getBallObj().getSpeedIncrease() + 0.5);

        // Play sound
        this.playSound('paddleHit');

    }
    
    var side;
    
    if(side = this.isOutsideArena()) {
        // Play sound
        this.playSound('score');
               
        // Stop ball from spinning
        $('#ball').removeClass('spin');
         
        // Start over
        clearInterval(this.ballInterval);
        clearInterval(this.AIPaddlesInterval);
        
        // Increase score
        if(side == LEFT) {
            this.getPaddleObj(RIGHT).addScore();
        } else {
            
            this.getPaddleObj(LEFT).addScore();
        }

        this.updateScoreBoard();
        
        // Has anyone won?
        if(this.getPaddleObj(RIGHT).getScore() == 5 || this.getPaddleObj(LEFT).getScore() == 5) {
            $('#message').text('Game over');
            $('#message').show();
        
            // Hide player who lost
            if(this.getPaddleObj(RIGHT).getScore() == 5) {
                this.getPaddleObj(LEFT).getDiv().hide();
            } else {
                this.getPaddleObj(RIGHT).getDiv().hide();
            }
            
            this.stopSound('background');
        } else {
            // Start new game
            this.start();
        }
    } else {
        // Start new interval.
        this.ballInterval = setTimeout(function() { that.moveBall(); }, this.getBallObj().getSpeed() - this.getBallObj().getSpeedIncrease());
    }

}


PaddleWar.prototype.isAtBorder = function() {
    // At top?
    if(this.getBallObj().getYPos() <= 0) {
        return TOP;
    }
    
    if(this.getBallObj().getYPos() + this.getBallObj().getDiv().height() >= this.getFieldEl().height()) {
        return BOTTOM;
    }
    
    return false;
}

PaddleWar.prototype.hitPaddle = function() {
    
    var paddlesArr = this.getPaddles();
    var ballObj = this.getBallObj();
    
    if(ballObj.getDirection() == LEFT) {
        if(ballObj.getXPos() <= paddlesArr[LEFT].getXPos() + paddlesArr[LEFT].getDiv().width()
           &&
           ballObj.getXPos() > paddlesArr[LEFT].getXPos()
           &&
           
           ballObj.getYPos() >= paddlesArr[LEFT].getYPos() && ballObj.getYPos() <= paddlesArr[LEFT].getYPos() + paddlesArr[LEFT].getDiv().height()) {
            return true;
        }
    }
        
    if(ballObj.getDirection() == RIGHT) {
        if(ballObj.getXPos() + ballObj.getDiv().width() >= paddlesArr[RIGHT].getXPos()
           &&
           ballObj.getXPos() + ballObj.getDiv().width() < paddlesArr[RIGHT].getXPos() + paddlesArr[RIGHT].getDiv().width()
           &&
           ballObj.getYPos() >= paddlesArr[RIGHT].getYPos() && (ballObj.getYPos() + ballObj.getDiv().height() <= paddlesArr[RIGHT].getYPos() + paddlesArr[RIGHT].getDiv().height())) {
           
            return true;
        }
    }

}

PaddleWar.prototype.isOutsideArena = function() {
    if(this.getBallObj().getXPos() < 0) {
       return LEFT;
    }
    
    if(this.getBallObj().getXPos() > this.getFieldEl().width()) {
        return RIGHT;
    }
}

PaddleWar.prototype.updateScoreBoard = function() {
    $('#scoreBoard').html(this.getPaddleObj(LEFT).getScore() + ' - ' + this.getPaddleObj(RIGHT).getScore());
}

PaddleWar.prototype.startCountdown = function() {
    
    var that = this;
    
    $('#message').text(3);
    $('#message').show();
    
    setTimeout(function() { that.countdown(); }, 1000);
    
    
}

PaddleWar.prototype.countdown = function() {
    $('#message').text($('#message').text() - 1);
    var that = this;
    // If countdown is finished, hide numbers and start the ball.
    if($('#message').text() == 0) {
        $('#message').hide();
        
        // Make ball spin
        $('#ball').addClass('spin');
        
        // Start ball
        this.moveBall();
        
        // Play sound of ball starting.
        this.playSound('paddleHit');
    } else {
        // Start new timeout for next second.
        setTimeout(function() { that.countdown(); }, 1000);
    }

}

PaddleWar.prototype.addSound = function(key, file, volume = 1) {
    if(this.soundsArr == undefined) {
        this.soundsArr = new Array();
    }
    
    this.soundsArr[key] = new Audio(file);
    this.soundsArr[key].volume = volume;
    
    // If background sound, loop.
    if(key == 'background') {
        this.soundsArr[key].addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
}
    


PaddleWar.prototype.playSound = function(key) {
    if(!this.isMuted()) {
        this.soundsArr[key].play();
    }
}

PaddleWar.prototype.stopSound = function(key) {
    this.soundsArr[key].pause();
}

PaddleWar.prototype.getSoundsArr = function() {
    return this.soundsArr;
}

PaddleWar.prototype.toggleMute = function() {
    this.mute = !this.mute;
    
    if(this.mute) {
        $('#soundFx').addClass('muted');
    } else {
        $('#soundFx').removeClass('muted');
    }
    
    if(this.mute) {
        this.stopSound('background');
    } else {
        this.playSound('background');
        
        
    }
}

PaddleWar.prototype.isMuted = function() {
    return this.mute;
    
}