var Ball = function(xPos, yPos) {
    $('#arena').append('<div class="ball" id="ball"></div>');
    this.setDiv($('#ball'));
    
    this.setXPos(xPos);
    this.setYPos(yPos);
    
};

Ball.prototype.getAngle = function() {
    return this.angle;
}

Ball.prototype.setAngle = function(angle) {
    this.angle = angle;
}

Ball.prototype.getDirection = function() {
    return this.direction;
}

Ball.prototype.setDirection = function(direction) {
    this.direction = direction;
}

Ball.prototype.setPaddles = function(paddlesArr) {
    this.paddlesArr = paddlesArr;
}

Ball.prototype.getPaddles = function() {
    return this.paddlesArr;
}




Ball.prototype.move = function() {
    
    // Calculating X move
    var stepX = this.getAngle() / 90;
    stepX = 1 - Math.abs(stepX);
    
    if(this.getDirection() == LEFT) {
        stepX *= -1;
    }
    
    // Calculating Y move
    var stepY = this.getAngle() / 90;
    
    
    this.setXPos(this.getXPos() + stepX * 4);
    this.setYPos(this.getYPos() + stepY * 4);
    
    
    
}

Ball.prototype.bounceY = function(position) {
    this.setAngle(this.getAngle() * -1);
}

Ball.prototype.bounceX = function() {
    if(this.getDirection() == LEFT) {
        this.setDirection(RIGHT);
    } else {
        this.setDirection(LEFT);

    }
}

Ball.prototype.setXPos = function (xPos) {
    this.xPos = xPos;
    
    // Move object
    this.getDiv().css('left', xPos);

}

Ball.prototype.getXPos = function() {
    return this.xPos;
}

Ball.prototype.setYPos = function (yPos) {
    this.yPos = yPos;
    
    // Move object
    this.getDiv().css('top', yPos);
}

Ball.prototype.getYPos = function() {
    return this.yPos;
}

Ball.prototype.setDiv = function(div) {
    this.div = div;
}

Ball.prototype.getDiv = function() {
    return this.div;
}




Ball.prototype.getRandomAngle = function() {
    var max = 60;
    var min = -60;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


Ball.prototype.setSpeed = function(speed) {
    this.speed = speed;
}

Ball.prototype.getSpeed = function() {
    if(this.speed) {
        return this.speed;
    } else {
        return 10;
    }
}

Ball.prototype.setSpeedIncrease = function(speedIncrease) {
    this.speedIncrease = speedIncrease;
}

Ball.prototype.getSpeedIncrease = function() {
    return this.speedIncrease;
}


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


