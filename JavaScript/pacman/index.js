const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const scoreCount = document.querySelector('#scoreCount');
// console.log(scoreCount);
// console.log(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
  static width = 40
  static height = 40
  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  draw() {
    // c.fillStyle = 'blue';
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.drawImage(this.image, this.position.x, this.position.y);
  }

}

class player {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openrate = 0.12
    this.rotation = 0
  }
  draw() {
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)
    c.beginPath();// used to start the new path of line by emptying sub-paths.
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
    c.lineTo(this.position.x, this.position.y);
    c.fillStyle = 'yellow' //used to add color, gradient or pattern. We can also add code using backticks``.
    c.fill() // fills the current path with current fill style
    c.closePath()// draws line from current point to starting point
    c.restore()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if(this.radians < 0 || this.radians>0.75){
      this.openrate = -this.openrate;
    }
    this.radians += this.openrate;
  }
}

class ghost {
  static speed = 2
  constructor({ position, velocity, color = 'red' }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.color = color
    this.prevCollision = []
    this.speed = 2
    this.scared = false
  }
  draw() {
    c.beginPath();// used to start the new path of line by emptying sub-paths.
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.scared? 'blue' : this.color //used to add color, gradient or pattern. We can also add code using backticks``.
    c.fill() // fills the current path with current fill style
    c.closePath()// draws line from current point to starting point
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Pellet {
  constructor({ position }) {
    this.position = position
    this.radius = 3
  }
  draw() {
    c.beginPath();// used to start the new path of line by emptying sub-paths.
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'white' //used to add color, gradient or pattern. We can also add code using backticks``.
    c.fill() // fills the current path with current fill style
    c.closePath()// draws line from current point to starting point
  }
}

class PowerUp {
  constructor({ position }) {
    this.position = position
    this.radius = 10
  }
  draw() {
    c.beginPath();// used to start the new path of line by emptying sub-paths.
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'white' //used to add color, gradient or pattern. We can also add code using backticks``.
    c.fill() // fills the current path with current fill style
    c.closePath()// draws line from current point to @starting point
  }
}

const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

const pellets = [];
const boundaries = [];
const PowerUps = [];
const ghosts = [
  new ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: ghost.speed,
      y: 0
    }
  }),
  new ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2
    },
    velocity: {
      x: ghost.speed,
      y: 0
    },
    color: 'pink'
  })
];
let lastKey = '';
let score = 0;

const pl = new player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
});

const keys = {
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  a: {
    pressed: false
  },
}

map.forEach((rows, i) => {
  rows.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage('pacmanMap/pipeHorizontal.png')
          })
        );
        break;

      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage('pacmanMap/pipeVertical.png')
          })
        );
        break;

      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('pacmanMap/pipeCorner1.png')
          })
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('pacmanMap/pipeCorner2.png')
          })
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('pacmanMap/pipeCorner3.png')
          })
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('pacmanMap/pipeCorner4.png')
          })
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('pacmanMap/block.png')
          })
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('pacmanMap/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('pacmanMap/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('pacmanMap/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('pacmanMap/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('pacmanMap/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('pacmanMap/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('pacmanMap/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('pacmanMap/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('pacmanMap/pipeConnectorLeft.png')
          })
        )
        break
      case '.':
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break

        case 'p':
        PowerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
    }
  })
})

function cirlceCollideWithRectangle({
  circle,
  rectangle
}) {
  const padding = Boundary.width/2 - circle.radius -1
  return (
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
  )
}

let animationID

function animate() {
  animationID = requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (keys.w.pressed && lastKey === 'w') {
    for (let i = 0; i < boundaries.length; i++) {
      const item = boundaries[i];
      if (
        cirlceCollideWithRectangle({
          circle: {
            ...pl,
            velocity: {
              x: 0,
              y: -5
            }
          },
          rectangle: item
        })
      ) {
        pl.velocity.y = 0
        break;
      } else {
        pl.velocity.y = -5
      }
    }
  }
  else if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const item = boundaries[i];
      if (
        cirlceCollideWithRectangle({
          circle: {
            ...pl,
            velocity: {
              x: -5,
              y: 0
            }
          },
          rectangle: item
        })
      ) {
        pl.velocity.x = 0
        break;
      } else {
        pl.velocity.x = -5
      }
    }
  }
  else if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const item = boundaries[i];
      if (
        cirlceCollideWithRectangle({
          circle: {
            ...pl,
            velocity: {
              x: 0,
              y: 5
            }
          },
          rectangle: item
        })
      ) {
        pl.velocity.y = 0
        break;
      } else {
        pl.velocity.y = 5
      }
    }
  }
  else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const item = boundaries[i];
      if (
        cirlceCollideWithRectangle({
          circle: {
            ...pl,
            velocity: {
              x: 5,
              y: 0
            }
          },
          rectangle: item
        })
      ) {
        pl.velocity.x = 0
        break;
      } else {
        pl.velocity.x = 5
      }
    }
  }
  boundaries.forEach(item => {
    item.draw();

    if (
      cirlceCollideWithRectangle({
        circle: pl,
        rectangle: item
      })
    ) {
      console.log('colliding');
      pl.velocity.x = 0;
      pl.velocity.y = 0;
    }
  })

  //direct touch with ghost when powered up
  for(let i = ghosts.length-1; i>=0; i--){
    const ghost = ghosts[i]
    if(
      Math.hypot(
        ghost.position.x - pl.position.x,
        ghost.position.y - pl.position.y) < ghost.radius + pl.radius)
    {
      if(ghost.scared){
        ghosts.splice(i,1);
      }
      else{
        cancelAnimationFrame(animationID);
        console.log('you loose');
      }
    }
  }

  //winning condition **********
  if (pellets.length === 0) {
    console.log('you win***********');
    cancelAnimationFrame(animationID);
  }


  //power ups 
  for (let i = PowerUps.length - 1; i >= 0; i--) {
    const powerup = PowerUps[i];
    powerup.draw()
    if (
      Math.hypot(
        powerup.position.x - pl.position.x,
        powerup.position.y - pl.position.y) < powerup.radius + pl.radius) {
          PowerUps.splice(i,1);
          //ghost scared
          ghosts.forEach(ghost => {
            ghost.scared = true;
            setTimeout(() => {
              ghost.scared = false;
            }, 3000);
          })
        }
  }
  //reversing loop removing flashing of pellets
  for (let i = pellets.length - 1; i > 0; i--) {
    const dots = pellets[i];
    dots.draw()

    if (
      Math.hypot(
        dots.position.x - pl.position.x,
        dots.position.y - pl.position.y) < dots.radius + pl.radius) {
      console.log('touching');
      pellets.splice(i, 1);
      score += 10;
      scoreCount.innerHTML = score;
    }
  }


  pl.update();
  ghosts.forEach(ele => {
    ele.update();

    if (
        Math.hypot(
        ele.position.x - pl.position.x,
        ele.position.y - pl.position.y) < ele.radius + pl.radius && !ele.scared){
          cancelAnimationFrame(animationID);
          console.log('you loose');
        }

    const collisions = [ ]
    boundaries.forEach(item => {
      if (
        !collisions.includes('right') &&
        cirlceCollideWithRectangle({
          circle: {
            ...ele,
            velocity: {
              x: ele.speed,
              y: 0
            }
          },
          rectangle: item
        })
      ) {
        collisions.push('right');
      }

      if (
        !collisions.includes('left') &&
        cirlceCollideWithRectangle({
          circle: {
            ...ele,
            velocity: {
              x: -ele.speed,
              y: 0
            }
          },
          rectangle: item
        })
      ) {
        collisions.push('left');
      }

      if (
        !collisions.includes('top') &&
        cirlceCollideWithRectangle({
          circle: {
            ...ele,
            velocity: {
              x: 0,
              y: -ele.speed
            }
          },
          rectangle: item
        })
      ) {
        collisions.push('top');
      }

      if (
        !collisions.includes('down') &&
        cirlceCollideWithRectangle({
          circle: {
            ...ele,
            velocity: {
              x: 0,
              y: ele.speed
            }
          },
          rectangle: item
        })
      ) {
        collisions.push('down');
      }

    })

    if (collisions.length > ele.prevCollision.length)
      ele.prevCollision = collisions

    if (JSON.stringify(collisions) != JSON.stringify(ele.prevCollision)) {
      if(ele.velocity.x>0) ele.prevCollision.push('right');
      else if(ele.velocity.x<0) ele.prevCollision.push('left');
      else if(ele.velocity.y>0) ele.prevCollision.push('down');
      else if(ele.velocity.y<0) ele.prevCollision.push('top');
      console.log('collisions : ', collisions);
      console.log('previous collisions : ', ele.prevCollision);
      const pathways = ele.prevCollision.filter((collision) => {
        return !collisions.includes(collision)
      })
      console.log({pathways})
      const direction = pathways[Math.floor(Math.random()*pathways.length)]
      console.log({direction});
      switch(direction){
        case 'down':
          ele.velocity.y=ele.speed
          ele.velocity.x=0
          break

        case 'top':
          ele.velocity.y=-ele.speed
          ele.velocity.x=0
          break

        case 'left':
          ele.velocity.x= -ele.speed
          ele.velocity.y=0
          break

        case 'right':
          ele.velocity.x=ele.speed
          ele.velocity.y=0
          break
      }
      ele.prevCollision = []
    }

  })

  // pl.velocity.y = 0;
  // pl.velocity.x = 0;
  if (pl.velocity.x<0) {
    pl.rotation = Math.PI
  }
  else if(pl.velocity.x>0){
    pl.rotation = 0
  }
  else if(pl.velocity.y>0){
    pl.rotation = Math.PI/2
  }
  else if(pl.velocity.y<0){
    pl.rotation = Math.PI*1.5
  }
}
animate();


// player.draw();
// pl.draw()
// pl.update()

addEventListener('keydown', (event) => {
  console.log(event.key);
  switch (event.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
  console.log('w : ', keys.w.pressed);
  console.log('a :', keys.a.pressed);
  console.log('s :', keys.s.pressed);
  console.log('d :', keys.d.pressed);
});

addEventListener('keyup', (event) => {
  console.log(event.key);
  switch (event.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
  console.log('w : ', keys.w.pressed);
  console.log('a :', keys.a.pressed);
  console.log('s :', keys.s.pressed);
  console.log('d :', keys.d.pressed);
});

// const boundary = new Boundary({
//     position: {
//         x: 0,
//         y: 0,
//     }
// });
// boundary.draw();


// const boundary2 = new Boundary({
//     position: {
//         x: 42,
//         y: 0,
//     }
// });
// boundary2.draw();
// const boundary3 = new Boundary({
//     position: {
//         x: 84,
//         y: 0,
//     }
// });
// boundary3.draw();
// const boundary4 = new Boundary({
//     position: {
//         x: 126,
//         y: 0,
//     }
// });
// boundary4.draw();