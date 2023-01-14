var count = 0;
var messages = {};
let pid;

var webSocket = new WebSocket('ws://143.89.6.61/websockets');
var board_details;
var color_list;

var volume = undefined;
var bg_music = undefined;
var background_img = undefined;
var background_video = undefined;

webSocket.onopen = function (event) {
  pid = setInterval(() => { webSocket.send(JSON.stringify({ msg: "give me new message" })); }, 1000);
};

webSocket.onmessage = function (event) {
  data = JSON.parse(event.data);
  board_details = data[1][0];
  color_list = board_details.post_colors.split('  ');

  
  var board_title = document.getElementById("board_title");
  board_title.innerHTML = board_details.title;
  board_title.style.color = board_details.title_color;
  data = data[0];
  l = ['bg', 'md','sm']; r = ['bg-rabbit', 'md-rabbit', 'sm-rabbit']
  if (data.card_index == 0)
  {
    if(data.message.length > 100) s = l[getRandomInt(0, 1)];
    else s = l[getRandomInt(0, 2)];
  } 
  else
  {
    if(data.message.length > 100) s = r[getRandomInt(0, 1)];
    else s = r[getRandomInt(0, 2)];
  }
  createNewMessage(0, 0, s, data.message, data.card_index);
  textFit(document.getElementsByClassName('msg'));
  
  if(background_img == undefined && background_video == undefined) {
    background_img = board_details.background_img;
    background_video = board_details.background_video;
  }

  if(background_img != board_details.background_img) {
    background_img = board_details.background_img;
    document.querySelector('body').style.backgroundImage = `url(/images/${background_img})`;
  }

  if(background_video != board_details.background_video) {
    background_video = board_details.background_video;
    document.querySelector('video source').src = `/videos/${background_video}`;
    document.querySelector('video').load();
  }

  if(bg_music === undefined) {
    bg_music = board_details.bg_music;
    volume = Number(board_details.bg_music_volume);
    document.querySelector('#bg_music').volume = volume / 100;
  } else if(bg_music != board_details.bg_music) {
    bg_music = board_details.bg_music;
    document.querySelector('source').src = "/music/" + bg_music;
    document.querySelector('source').type = board_details.bg_music_extension;
    document.querySelector('#bg_music').load();
  }

  if(Number(board_details.bg_music_volume) != volume) {
    volume = Number(board_details.bg_music_volume);
    document.querySelector('#bg_music').volume = volume / 100;
  }

  /*if(document.querySelector('#bg_music').paused) {
    document.querySelector('#bg_music').play();
  } */
}

webSocket.onclose = function (event) {
  clearInterval(pid);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// distribute evenly across viewport (avoid too much overlapping)
function getRandomPos(cur, min, max){
  if (cur%2 == 0){
    max =max/2+20;
  } else {
    min = max/2-20;
  }
  return getRandomInt(min,max);
}

function createNewMessage(pos_x = 0, pos_y = 0, size = 'md', message = ". This content is a little bit longer.") {
  // color_list = ["rgba(255, 255, 255, 0.856)", "rgba(238, 228, 218, 0.87)", "rgba(237, 194, 46, 0.87)"];
  // color = getRandomInt(0, 2);

  var height = 16,
    width = 16,
    top = 2;
  var cur = count++;
  
  // control for speed of message generation
  // 9 implies "a single message is generated by every 9 seconds"
  if(count >= 207){
    count = 0;
  }
  if(cur % 7 != 0) {
    return;
  }
  

  if (size == 'bg') {
    top = getRandomPos(cur, 2, 70);
  } else if (size == 'md') {
    top = getRandomPos(cur, 2, 75);
  } else if (size == 'sm'){
    size = "sm";
    top = getRandomPos(cur, 2, 80);
  }
  if (size == 'bg-rabbit') {
    top = (getRandomPos(cur, 2, 70)-25);
  } else if (size == 'md-rabbit') {
    top = (getRandomPos(cur, 2, 75)-25);
  } else if (size == 'sm-rabbit') {
    size = "sm-rabbit";
    top = (getRandomPos(cur, 2, 80)-25);
  }
  let duration = [110,130,160];
  var rabbit =`<div id="${cur}" class="bg-img bg-img-rabbit fly ${size}" style="top: ${top}%; left: -30%; animation-duration: ${duration[getRandomInt(0,2)]}s;">
        <div class="msg-top">
        </div>
        <div class="msg-body">
          <div class="msg-text" style = "height:38%"> 
            <div class="msg" style="vertical-align: middle;">
              ${message}
            </div>
          </div>
        </div>
      </div>`;
  var short = `<div id="${cur}" class="position-absolute card ${size}" style="background-image: url(/images/mainboard/newyear_half.png);top: ${top}%; left: -30%; animation-duration: ${duration[getRandomInt(0,2)]}s;">
        <div class="msg-body">
          <div class="msg-half">
          </div>
          <div class="msg-half msg-text"><div class="msg" style="vertical-align: middle;">
              ${message}
              </div>
          </div>
        </div>
        
      </div>`;

  var long = `<div id="${cur}" class="card position-absolute ${size}" style="background-image: url(/images/mainboard/newyear_full.png);top: ${top}%; left: -30%;animation-duration: ${duration[getRandomInt(0,2)]}s;">
    <div class="msg-body">
      <div class="msg-full">
        <div class="msg" style="vertical-align: middle;">
          ${message}
        </div>
      </div>
    </div>
  </div>`;
  var parser = new DOMParser();
  var container = document.getElementById("container");
  if (data.card_index == 0){
      console.log("CARD");
      if (message.length < 100) {
          var temp = parser.parseFromString(short, "text/html");
      } else {
          var temp = parser.parseFromString(long, "text/html");
      }
  }
  else {var temp = parser.parseFromString(rabbit, "text/html");
  console.log("RABBIT")
  };
  console.log(temp.body.firstChild);
  messages[cur] = temp.body.firstChild;
  temp.body.firstChild.addEventListener('animationiteration', () => {
    console.log(`animation (id:${cur}) iteration finished`);
    deleteMessage(cur);
  })
  return [container.appendChild(temp.body.firstChild), cur];
}

function deleteMessage(id) {
  if (id in messages) {
    messages[id].remove();
  }
}
