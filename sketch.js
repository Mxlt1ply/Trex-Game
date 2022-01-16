var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstaclesGroup; 
var cloud, cloudsGroup, cloudImage;
var score;
var PLAY = 1;
var END = 0; 
var gameState = PLAY; 
var gameOver, gameOverImg; 
var restart; 
var jumpSound, dieSound, checkPointSound;


var newImage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");

  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
  
 
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  // trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  gameOver = createSprite(300,100)
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5; 

  trex.setCollider("rectangle",0,0, 400, trex.height)
  
  score = 0; 
  
}

function draw() {
  background(180);
  console.log('This is', gameState)
  

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score/100)
    
    if (ground.x < 0) {
      ground.x = ground.width/2;
    }

    if (keyDown("space")&& trex.y >=150) {
      trex.velocityY = -13;
      jumpSound.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //score
    score = score + Math.round(frameCount / 100);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play(); 
    }

    textSize(15);
    text("Score: " + score, 500, 40);


    if (obstaclesGroup.isTouching(trex)) {
      //gameState = END; 
      //dieSound.play(); 
      trex.velocityY = -12;
      jumpSound.play(); 
    }
    
    //spawn the clouds
    spawnClouds();

    //spawn the obstacles
    spawnObsctacles();


  }

  
    else if (gameState === END) {

    ground.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);

    restart.visible = true;
    gameOver.visible = true;


    score = 0; 
    

  }
  
  
  trex.collide(invisibleGround);
  

  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    
    //assigning lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
    }
}

function spawnObsctacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400,160,10,40);
    obstacle.velocityX = -(5 + score/100)

    var rand = Math.round(random(1,6));

    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      
      case 2: obstacle.addImage(obstacle2);
        break;
  
      case 3: obstacle.addImage(obstacle3);
        break;   

      case 4: obstacle.addImage(obstacle4);
        break;
  
      case 5: obstacle.addImage(obstacle5);
        break;  
      
      case 6: obstacle.addImage(obstacle6);
        break;

      default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300; 

    obstaclesGroup.add(obstacle);

  }
}

