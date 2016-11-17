		$(document).ready(function(){
			// get canvas context
			var cvs = $("canvas").get(0);
			var ctx = cvs.getContext("2d");
			// declare variables
			var food;
			var snake;
			var grid = 20;
			var h = cvs.height;
			var w = cvs.width;

			//Makes the canvas look sharp
			cvs.width *= 2;
			cvs.height *= 2;
			cvs.style.width = cvs.width / 2;
			cvs.style.height = cvs.height / 2;
			ctx.scale(2, 2);

			function init(){

				keyPress();		

				reset();

				setInterval(draw, 1000 / 10);
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

				addFood();
			}

			function draw() {
				// calls functions and clears squares
				updateSnake();
				moveSnake();
				ctx.clearRect(0, 0, w, h);
				drawFood();
				drawSnake();

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
			}

			// draw visible snake
			function drawSnake(){
				ctx.fillStyle = "green";
				ctx.strokeStyle = "black";
				ctx.lineWidth = 1;
				// draw square on snakes head
				ctx.beginPath();
				ctx.rect(snake.x, snake.y, grid, grid);					
				ctx.stroke();
				ctx.fill();
				// draws a square on all of the snakes body piecees
				for (var i = 0; i < snake.pieces.length; i++) {
					ctx.beginPath();
					ctx.rect(snake.pieces[i].x, snake.pieces[i].y, grid, grid);
					ctx.stroke();
					ctx.fill();
				}

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

			window.addFood = addFood;

			// draws the visible food
			function drawFood(){
				ctx.fillStyle = "salmon";
				ctx.strokeStyle = "black";
				//Draws at the foods location
				for (var i = 0; i < food.length; i++) {
					ctx.beginPath();
					ctx.rect(food[i].x, food[i].y, grid, grid);
					ctx.stroke();
					ctx.fill();
				}
			}

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
			// detects keys pressed
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


			init();
		});