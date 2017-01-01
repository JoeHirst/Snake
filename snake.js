	$(document).ready(function(){
			// get canvas context
			var cvs = $("canvas").get(0);
			var ctx = cvs.getContext("2d");
			// declare variables
			var food;
			var banana;
			var snake;
			var grid = 20;
			var h = cvs.height;
			var w = cvs.width;
			var appleSize = grid;
			var apple = new Image();
			var bananaImg = new Image();
			var hue = 0;
			var moveTimer = 0;

			//Makes the canvas look sharp
			cvs.width *= 2;
			cvs.height *= 2;
			cvs.style.width = cvs.width / 2;
			cvs.style.height = cvs.height / 2;
			ctx.scale(2, 2);
			$('canvas').css('background-color', 'black');

			function init(){

				apple.src = "food.png";
				bananaImg.src = "bannana.png";

				mousePress();
				keyPress();		

				reset();

				requestAnimationFrame(draw);

			}

			function reset(){
				snake = {
					direction: "right",
					x: 0,				
					y: 0,
					length: 5,
					pieces: [],
					score: 0
				};

				food = [];
				banana = [];

				addFood();
				addBanana();
				
			}

			function draw() {
				// calls at 15 fps
				if (moveTimer > 4) {
					updateSnake();
					moveSnake();
					moveTimer = 0;
				} else {
					moveTimer++;
				}

				ctx.clearRect(0, 0, w, h);
				drawFood();
				drawBanana();

				// Change snakes colour with score
				if (snake.score > 3) {
					hue += snake.score;
					ctx.filter = "hue-rotate(" + hue + "deg)";

					if (hue > 360) {
						hue = 0;
					}
				}

				drawSnake();

				ctx.filter = "none";

				// stores score as a string
				var snakeText = snake.score.toString();
				// add 0's to counter
				while (snakeText.length < 3) {
					snakeText = "0" + snakeText;
				}
				// displays score counter
				ctx.fillStyle = "red";
				ctx.textBaseline= "top";
				ctx.font = "20px monospace";
				ctx.fillText("Score: " + snakeText, 5, 0);

				requestAnimationFrame(draw);
			}

			// draw visible snake
			function drawSnake(){
				ctx.fillStyle = "green";
				ctx.strokeStyle = "darkgreen";
				ctx.lineWidth = 2;

				// draw square on snakes head
				ctx.beginPath();
				ctx.rect(snake.x, snake.y, grid, grid);
				
				// draws a square on all of the snakes body piecees
				for (var i = 0; i < snake.pieces.length; i++) {
					ctx.rect(snake.pieces[i].x, snake.pieces[i].y, grid, grid);
				}

				ctx.stroke();
				ctx.fill();
			}

			function updateSnake(){
				// detects collision with snakes head and body
				for (var i = 0; i < snake.pieces.length; i++) {
					if(snake.x == snake.pieces[i].x && snake.y == snake.pieces[i].y){
						reset();
					}
				}				

				// get the last element of the food array
				var foodIndex = food.length - 1;

				// go through food array 
				while (foodIndex >= 0) {
					// detects snake collision with food, increase snake length, remove food, increase score
					if(snake.x == food[foodIndex].x && snake.y == food[foodIndex].y){
						snake.length +=1;
						food.splice(foodIndex, 1); 
						snake.score+=1;
						//add new food
						addFood();
					}

					// go to the next piece of food
					foodIndex--;
				}

				// get the last element of the banana array
				var bananaIndex = banana.length - 1;

				// go through banana array 
				while (bananaIndex >= 0) {
					// detects snake collision with banana, increase snake length, remove banana, increase score
					if(snake.x == banana[bananaIndex].x && snake.y == banana[bananaIndex].y){
						snake.length +=1;
						banana.splice(bananaIndex, 1); 
						snake.score+=1;
						//add new banana
						addBanana();
					}

					// go to the next piece of food
					bananaIndex--;
				}

				// clamps down array to length of snake
				snake.pieces.length = Math.min(snake.pieces.length, snake.length - 1);
				
				// adds the snake pieces to beeginning of array, at the snakes head location
				snake.pieces.unshift({
					x: snake.x,
					y: snake.y
				});

			}
			
			// generates food in random locations
			function addFood(){

				var valid;
				// generates food if allowed
				while (true) {
					valid = true;

					var newFood = {
						x: Math.floor(Math.random()*(w / grid)) * grid,
						y: Math.floor(Math.random()*(h / grid)) * grid
					};
					// stops food being put on the snakes head
					if (snake.x == newFood.x && snake.y == newFood.y) {
						console.log("head");
						valid = false;
					}
					// stops food from being put on the sankes body 
					for (var i = 0; i < snake.pieces.length; i++) {
						if(newFood.x == snake.pieces[i].x && newFood.y == snake.pieces[i].y){
							console.log("body");
							valid = false;
						}
					}
					// stops food from being out on top of each other
					for (var i = 0; i < food.length; i++) {
						if(newFood.x == food[i].x && newFood.y == food[i].y){
							valid = false;
						}
					}
					// add new food to array
					if (valid) {
						food.push(newFood);
						break;
					}
				}
			}

			// draws the visible food
			function drawFood(){

				// makes the food smoothy change size
				var appleGrid = grid - 2;
				var foodSize = appleGrid - (Math.sin(appleSize) * 5); // makes the apple get biggeer and smalleer
				var position = (appleGrid - foodSize) / 2; // makes position of the apple the centre of a grid square

				//Draws at the foods location
				for (var i = 0; i < food.length; i++) {
					ctx.drawImage(apple, food[i].x + position, food[i].y + position, foodSize, foodSize);
				}

				appleSize += 0.15;
			}

			function addBanana(){
				var valid;
				// generates food if allowed
				while (true) {
					valid = true;

					var newBanana = {
						x: Math.floor(Math.random()*(w / grid)) * grid,
						y: Math.floor(Math.random()*(h / grid)) * grid
					};
					// stops food being put on the snakes head
					if (snake.x == newBanana.x && snake.y == newBanana.y) {
						valid = false;
					}
					// stops food from being put on the sankes body 
					for (var i = 0; i < snake.pieces.length; i++) {
						if(newBanana.x == snake.pieces[i].x && newBanana.y == snake.pieces[i].y){
							valid = false;
						}
					}
					// stops banana from being put on top of apples
					for (var i = 0; i < food.length; i++) {
						if(newBanana.x == food[i].x && newBanana.y == food[i].y){
							valid = false;
						}
					}
					// stops banana from being put on top of each other
					for (var i = 0; i < banana.length; i++) {
						if(newBanana.x == banana[i].x && newBanana.y == banana[i].y){
							valid = false;
						}
					}
					// add new food to array
					if (valid) {
						//var chance = Math.floor((Math.random()*3)+1);
							banana.push(newBanana);
							break;
						}	
					}
				}

			function drawBanana(){

				// makes the food smoothy change size
				var appleGrid = grid - 2;
				var foodSize = appleGrid - (Math.sin(appleSize) * 5); // makes the apple get biggeer and smalleer
				var position = (appleGrid - foodSize) / 2; // makes position of the apple the centre of a grid square

				//Draws at the foods location
				for (var i = 0; i < food.length; i++) {
					ctx.drawImage(bananaImg, banana[i].x + position, banana[i].y + position, foodSize, foodSize);
				}
			}

			// snake movement
			function moveSnake(){

				if(snake.direction == "right"){
					snake.x+= grid;
				}
				if(snake.direction == "left"){
					snake.x-= grid;
				}
				if(snake.direction == "up"){
					snake.y-= grid;
				}
				if(snake.direction == "down"){
					snake.y+= grid;
				}

				if(snake.x < 0){
					reset();
				}
				if(snake.x > w-20){
					reset();
				}
				if(snake.y > h-20){
					reset();
				}	
				if(snake.y < 0){
					reset();
				}			
			}
			// detects keys pressed and sets direction
			function keyPress(){

				$(document).keydown(function(e){

					if(e.keyCode == 37 && snake.direction != "right"){
						snake.direction = "left";
					}
					if(e.keyCode == 39 && snake.direction != "left"){
						snake.direction = "right";
					}
					if(e.keyCode == 38 && snake.direction != "down"){
						snake.direction = "up";
					}
					if(e.keyCode == 40 && snake.direction != "up"){
						snake.direction = "down";
					}

				})
			}

			function mousePress(){
				$("canvas").mousedown(function(e){
					if(e.offsetY > snake.y && snake.direction != "up"){
						snake.direction = "down";
					}
					else if(e.offsetY < snake.y && snake.direction != "down"){
						snake.direction = "up";
					}
					else if(e.offsetX < snake.x && snake.direction != "right"){
						snake.direction = "left";
					}
					else if(e.offsetX > snake.x && snake.direction != "left"){
						snake.direction = "right";
					}
					
				})
			}

			init();
		});