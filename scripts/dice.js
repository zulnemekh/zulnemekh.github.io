var c; // context
			var canvas = document.getElementById("canvas");
			var debug = true;
			var kill = false; //saftey feature to kill script
			
			var width = 500;
			var height = 500;
			
			function doResize() {
				// Adjust width when resizing window
				var el = document.getElementById('canvas-container');
				width = Math.min(el.offsetWidth, 500);
				canvas.width = width;
				
				// Roll the dice when the page resizes or loads
				draw();
				
				if (debug) console.log('onresize width', width);
			}

			function drawDice() {
				if(kill) return;
				drawSquare(); //replaced old way so stroke is enabled

				//draws glare
				c.fillStyle = "rgba(200,200,200,0.4)";
				c.globalAlpha = 1.0;
				c.beginPath();
				c.moveTo(-25,25);
				c.lineTo(25,25);
				c.bezierCurveTo(0, 15, -10, 15, -25, -25);
				c.closePath();
				c.fill();

				//draw dots
				var n = Math.floor(Math.random() * 6) + 1; //1-6 dots
				c.save();
				c.fillStyle = "black";
				if (n == 1) {
					drawDot(0,0);
				} else if (n == 2) {
					drawDot(16,16);
					drawDot(-16,-16);
				} else if (n == 3) {
					drawDot(0,0);
					drawDot(16,16);
					drawDot(-16,-16);
				} else if (n == 4) {
					drawDot(16,16);
					drawDot(-16,-16);
					drawDot(-16,16);
					drawDot(16,-16);
				} else if (n == 5) {
					drawDot(0,0);
					drawDot(16,16);
					drawDot(-16,-16);
					drawDot(-16,16);
					drawDot(16,-16);
				} else { //6
					drawDot(16,16);
					drawDot(-16,-16);
					drawDot(-16,16);
					drawDot(16,-16);
					drawDot(16,0);
					drawDot(-16,0);
				}
				c.restore();

			}

			function drawDot(x,y) {
				c.beginPath();
				c.arc(x,y,5,0,Math.PI*2,true);
				c.closePath();
				c.fill();
			}

			function drawSquare() {
				c.strokeStyle = "#000";
				c.fillStyle = "#FFF";
				c.beginPath();
				c.moveTo(-30, -30);
				c.lineTo(30,-30);
				c.lineTo(30,30);
				c.lineTo(-30,30);
				c.lineTo(-30,-30);
				c.closePath();
				c.stroke();
				c.fill();
			}

			function exists(pos1, pos2, positions) {
				if(kill) return false;
				for (var j = 0; j < positions.length; j++) {
					var p = positions[j];
					if (pos1+55 >= p[0] && pos1-55 <= p[0]) {
						if (pos2+55 >= p[1] && pos2-55 <= p[1]) {
							if(debug) console.log("Oh No ("+pos1+", "+pos2+") is already used!");
							return true;
						}
					}
				}
				return false;
			}

			function draw() {
				kill = false;
				var num = document.getElementById('number').value;
				
				c = canvas.getContext('2d');
				c.clearRect(0,0,width,height); //clears previous dice

				// all other translates are relative to this one, this is now 0,0
				// TODO: Fix for screens smaller than 500px
				c.translate(245, 245);

				var pos1 = 0;
				var pos2 = 0;
				var positions = new Array(num);

				// create 2dim array with num rows and 2 columns
				for (var i=0; i<num; i++) {
					positions[i] = new Array(2);
				}

				// draw the num of dice
				for (var i=0; i<num; i++) {

					if(debug) console.log("rolling: ("+pos1+", "+pos2+")"); //always starts at 0,0
					var counter = 0;

					while(exists(pos1,pos2,positions)) {
						pos1 = ( Math.floor(Math.random()*3) - 1 ) * ( Math.floor(Math.random()*145) + 60 );
						pos2 = ( Math.floor(Math.random()*3) - 1 ) * ( Math.floor(Math.random()*145) + 60 );
						if(debug) console.log("rolling: ("+pos1+", "+pos2+")");
						counter++;
						if (counter >= 500000) { //kills script if it takes too long
							alert("Are you trying to crash your browser!? Ceriously...");
							kill = true;
							break;
						}
					}
					if(kill) break;

					positions[i][0] = pos1;
					positions[i][1] = pos2;

					c.save();
					c.translate(pos1, pos2);
					c.rotate((Math.random()*175) * Math.PI / 180);
					drawDice();
					c.restore();
					//get new coordinates
					pos1 = ( Math.floor(Math.random()*3) - 1 ) * ( Math.floor(Math.random()*145) + 60 );
					pos2 = ( Math.floor(Math.random()*3) - 1 ) * ( Math.floor(Math.random()*145) + 60 );
				}
				c.translate(-245, -245); //moves translation back
			} // end draw()
			
			// Attach resize event
			window.onresize = doResize;
			
			// Perform resize
			doResize();