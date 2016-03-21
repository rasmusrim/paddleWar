var Paddle = function(side, parentEl) {
    if(side == LEFT) {
        side = 'left';
    } else {
        side = 'right';
    }
    
    // Create div
    parentEl.append('<div class="paddle ' + side + '" id="' + side + '"></div>');
    
    // Set default information
    this.setDiv($('#' + side));
    this.setSide(side);
    
    this.speed = 10;
    this.setScore(0);
            
};

Paddle.prototype.setSide = function(side) {
    this.side = side;
}

Paddle.prototype.getSide = function() {
    return this.side
}

Paddle.prototype.setAI = function(AI) {
    this.AI = AI;
}

Paddle.prototype.isAI = function() {
    return this.AI;
}




Paddle.prototype.setXPos = function (xPos) {
    this.xPos = xPos;
    
    // Move object
    this.getDiv().css('left', xPos);

}

Paddle.prototype.getXPos = function() {
    return this.xPos;
}

Paddle.prototype.setYPos = function (yPos) {
    this.yPos = yPos;
    
    // Move object
    this.getDiv().css('top', yPos);
}

Paddle.prototype.getYPos = function() {
    return this.yPos;
}


Paddle.prototype.setDiv = function(div) {
    this.div = div;
}

Paddle.prototype.getDiv = function() {
    return this.div;
}

Paddle.prototype.moveUp = function() {
    if(this.isAtBorder() == TOP) {
        return false;
    }
    
    this.setYPos(this.getYPos() - this.speed);
}

Paddle.prototype.moveDown = function() {
    if(this.isAtBorder() == BOTTOM) {
        return false;
    }

    
    this.setYPos(this.getYPos() + this.speed);
}

Paddle.prototype.isAtBorder = function() {
    if(this.getYPos() <= 0) {
        return TOP;
    }

    if(this.getYPos() + this.getDiv().height() >= $('#arena').height()) {
        return BOTTOM;
    }

}

Paddle.prototype.addScore = function() {
    this.score++;
}

Paddle.prototype.setScore = function(score) {
    this.score = score;
}

Paddle.prototype.getScore = function() {
    return this.score;
}
