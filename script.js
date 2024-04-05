const canvas = document.getElementById("canvas_");
var current_img = null;

function show_start_screen() {
  $('#start_screen').show();
  let start_screen = document.getElementById('start_screen');
  start_screen.width = window.innerWidth - 10;
  start_screen.height = window.innerHeight - 10;
}

function start_game() {
  $('#start_screen').hide();
  $('#start_button').hide();
  draw_img(game_data['states']['0,0']['north_loaded']); 
  direction = "north";
  const audio = new Audio("imgs/music.mp3");
  audio.loop = true;
  audio.play();
}

const draw_img = (img) => {
  current_img = img;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

const resize = () => {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  if(current_img)
    draw_img(current_img);
}

var current_state;
var game_data;

resize();
window.addEventListener("resize", resize);

$.getJSON( "game.json", function( data ) {
  $('#start_screen').hide();
  game_data = data;
  current_state = data['start_state'];
  load_imgs().then(() => {
    draw_img(game_data['states']['0,0']['north_loaded']); 
  });
  show_start_screen();
});

function all_loaded(){
  $('#splash').hide();
}

function load_imgs() {
  for (var key in game_data['states']){
    for(var direction in game_data['states'][key])
      if(game_data['states'][key][direction] != null){
          game_data['states'][key][direction+"_loaded"] = new Image();
          game_data['states'][key][direction+"_loaded"].onload = function() {};
          game_data['states'][key][direction+"_loaded"].src = game_data['states'][key][direction]; 
      }
  }
  all_loaded();
  return Promise.resolve("p");
}

const up_arrow = 38;
const down_arrow = 40;
const left_arrow = 37;
const right_arrow = 39;

var cur_pos_x = 0;
var cur_pos_y = 0;

let direction = "north";


document.body.onkeydown = function(e){
  let changed_position = false;
  let stored_x = cur_pos_x;
  let stored_y = cur_pos_y;
  if(e.keyCode == up_arrow){
    switch(direction){
      case "north":
        cur_pos_y++;
        break;
      case "south":
        cur_pos_y--;
        break;
      case "west":
        cur_pos_x--;
        break;
      case "east":
        cur_pos_x++;
        break;
      default:
        direction = "north";
        break;
    }
    changed_position = true;
  }
  else if(e.keyCode == down_arrow){
    switch(direction){
      case "north":
        cur_pos_y--;
        break;
      case "south":
        cur_pos_y++;
        break;
      case "west":
        cur_pos_x++;
        break;
      case "east":
        cur_pos_x--;
        break;
      default:
        direction = "north";
        break;
    }
    changed_position = true;
  }
  else if(e.keyCode == left_arrow)
    switch(direction){
      case "north":
        direction = "west";
        break;
      case "south":
        direction = "east";
        break;
      case "west":
        direction = "south";
        break;
      case "east":
        direction = "north";
        break;
      default:
        direction = "north";
        break;
    }
  else if(e.keyCode == right_arrow)
    switch(direction){
      case "north":
        direction = "east";
        break;
      case "south":
        direction = "west";
        break;
      case "west":
        direction = "north";
        break;
      case "east":
        direction = "south";
        break;
      default:
        direction = "north";
        break;
    }
  
  if(changed_position)
  {
    if((cur_pos_x  == -1 && cur_pos_y == 0) || (cur_pos_x  == -6 && cur_pos_y == 6))
    {
      if(cur_pos_x == -6) {
        $('#js1').show();
        setTimeout(() => {$('#js1').hide();}, 2000);
        var tempAudio = new Audio("imgs/girl.mp3");
        tempAudio.play();
      } 
      if(cur_pos_x == -1) {
        $('#js3').show();
        setTimeout(() => {$('#js3').hide();}, 2000);
        var tempAudio = new Audio("imgs/scream.mp3");
        tempAudio.play();
      } 
      cur_pos_x = 100; 
      cur_pos_y = 100;
    }
    if(cur_pos_y == 99 && direction == "south") {
      $('#js2').show();
      setTimeout(() => {$('#js2').hide();}, 2000);
      var tempAudio = new Audio("imgs/laugh.wav");
      tempAudio.play();
    }
    if(cur_pos_y == 101 && direction == "north") {
      $('#js4').show();
      setTimeout(() => {$('#js4').hide();}, 2000);
      var tempAudio = new Audio("imgs/woman.mp3");
      tempAudio.play();
    }
    if(cur_pos_x == 101 && cur_pos_y == 98 && direction == "west")
    {
      direction = "north";
      cur_pos_x = 0;
      cur_pos_y = 0;
      $('#infinite').show();
      setTimeout(() => {$('#infinite').hide();}, 2000);
    }
    let temp = cur_pos_x + "," + cur_pos_y;
    if(!key_input(temp, direction))
    {
      cur_pos_x = stored_x;
      cur_pos_y = stored_y;
    }
  }
  else
  {
    draw_img(game_data['states'][cur_pos_x + "," + cur_pos_y][direction+"_loaded"]);
  }
  console.log(cur_pos_x, cur_pos_y, direction);
};

function key_input(what_key, direction) {
  if (game_data['states'][what_key] != null) {
    next_state(what_key, direction);
    return true;
  }
  else 
    return false;
}

function next_state(state, direction) {
  current_state = state;
  draw_img(game_data['states'][current_state][direction+'_loaded']);
}
