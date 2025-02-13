var count = 0;
var messages = {};
const timer = ms => new Promise(res => setTimeout(res, ms));
let pid;

var webSocket = new WebSocket('ws://172.105.206.64/websockets');
webSocket.onopen = function (event) {
    pid = setInterval(() => { webSocket.send(JSON.stringify({ msg: "give me new message" })); }, 6000);
};

webSocket.onmessage = function(event) {
    console.log(event.data);
    console.log("Get Message");
    
    var data = JSON.parse(event.data);

    var board_details = data[1];
    data = data[0];
    
    console.log(data);
    const l = ['bg', 'md'];
    //createNewMessage(0, 0, l[getRandomInt(0, 1)], data.message, data.nickname, data.email, data.image_path);
    createNewPostIt(data)
}

webSocket.onclose = function (event) {
    clearInterval(pid);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var index = 0;

function setPinColor(){
    index++;
    if (index == 5){
        index = 0;
    }
    return index;
}

function setNewPin(){
    return `<div class="top-pin ${pin_colors[setPinColor()]}">
<div class="top-pin-head">
    <div class="top-pin-highlight"></div>
</div>
</div>`;
}

var pin_colors = ['pin_red', 'pin_yellow', 'pin_green', 'pin_blue', 'pin_white'];

function createNewPostIt(item) {
    const color_list = ["pink", "blue", "green", "yellow", "white"];
    let color = getRandomInt(1, color_list.length - 1);
    color = color_list[color];

    var cur = count++;

    var str = `<div id = ${cur} class="paper ${color} rotate" style="top: ${getRandomInt(10, 60)}%; left: ${getRandomInt(10, 50)}%">
    `+ setNewPin()+`
        <div class = "message-content">
        <div class="upper-part">
            <div class="left-half">
                <img class="message-img" src=/images/posts/${item['image_path']}>
            </div>
            <div class="right-half">
                <p class="card-text">${item['message']}</p>
            </div>
        </div>
        <div class="card-footer lower-part">
            <i class="material-icons" style="font-size: 1.5vh; margin-right:1vh">
                account_circle</i>${item['nickname']}
        </div>
    </div>`;
    var parser = new DOMParser();
    var board = document.getElementById("board");
    var temp = parser.parseFromString(str, "text/html");
    messages[cur] = temp.body.firstChild;

    temp.body.firstChild.addEventListener('animationend', () => {
        console.log(`animation (id:${cur}) iteration finished`);
        if(cur - 3 >= 0) {
            document.getElementById('board').firstElementChild.style.animation = 'fade-out 2s';
            document.getElementById("board").firstElementChild.style.animationFillMode = "forwards";
            deleteMessage(cur - 3);
        }
    });

    return [board.appendChild(temp.body.firstChild), cur];
}

async function deleteMessage(id) {
    await timer(2000);
    console.log("Deleted message ", id);
    if (id in messages) {
        messages[id].remove();
    }
}

// const timer = ms => new Promise(res => setTimeout(res, ms));

// var sample_messages = [
//     { id: 0, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 1, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "green", img: "/resources/wave.jpg" },
//     { id: 2, img: "/board/flower-sqr.png", user: "username", message: "This content is a little bit longer. Here's to the crazy ones.The misfits. The rebels. The troublemakers. The round pegs inthe square holes. The ones who see things differently. They're not fond of rules. And they have no respect for the status quo.", color: "pink" },
//     { id: 3, img: "/board/wave.jpg", user: "username", message: "Another medium-length sample message. The red fox jumped over the lazy brown dog.", color: "white" },
//     { id: 4, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 5, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 6, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 7, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 8, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 9, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 10, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" },
//     { id: 11, user: "username", message: "This is a short message. Here's to the crazy ones.", color: "blue", img: "/resources/cat-vert.jpg" }
// ]

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// createNewPostIts(sample_messages);

// function createNewPostIt(item) {
//     var str = `<div id = ${item['id']} class="paper ${item['color']}">
//         <div class="top-tape"></div>
//         <div class = "content">
//         <div class="upper-part">
//             <div class="left-half">
//                 <img class="message-img" src=${item['img']}>
//             </div>
//             <div class="right-half">
//                 <p class="card-text">${item['message']}</p>
//             </div>
//         </div>
//         <div class="card-footer lower-part">
//             <i class="material-icons" style="font-size: 1.5vh; margin-right:1vh">
//                 account_circle</i>${item['user']}
//         </div>
//     </div>`;
//     var parser = new DOMParser();
//     var board = document.getElementById("board");
//     var temp = parser.parseFromString(str, "text/html");
//     board.appendChild(temp.body.firstChild);

//     return;
// }

// function removeOldestPostIt() {

//     document.getElementById('board').removeChild(document.getElementById('board').firstElementChild);
// }

// async function createNewPostIts(list) {

//     /*
//     TODO!!!!
//     show (5) posts in sample list
//     while(true){
//         pop first post on board
//         get next message from board
//         if (current message id = last id){
//             restart from first message on board
//         }
//     }
//     */
//     for (let i = 0; i < list.length; i++) {
//         var item = list[i];
//         createNewPostIt(item);
//         movePostIt(i);
//         console.log("Added post");
//         if (i > 5) {
//             console.log("Fade out to first element");
//             await timer(1000);
//             document.getElementById('board').firstElementChild.style.animation = 'fade-out 2s'
//             document.getElementById("board").firstElementChild.style.animationFillMode = "forwards";
//             console.log(document.getElementById('board').firstElementChild);
//             await timer(2000);
//             console.log("Removed oldest");
//             removeOldestPostIt();
//         }
//         await timer(3000);
//     }
//     return;
// }

// function movePostIts(list) {
//     for (let i = 0; i < list.length; i++) {
//         movePostIt(i);
//     }
// }

// function movePostIt(id) {
//     var speed = 10;
//     var boxElement = document.getElementById(id);
//     if (boxElement) {
//         var boxLeftPos = boxElement.offsetLeft,
//             boxRightPos = boxLeftPos + boxElement.offsetWidth;
//         // When right side of the box goes too far - change direction:
//         if (boxRightPos > document.body.offsetWidth) {
//             direction = -1;
//         }
//         // When left side of the box goes too far - change direction:
//         if (boxLeftPos < 0) {
//             direction = 1;
//         }
//         // Recalculate position:
//         boxElement.style.left = (getRandomInt(0, 50)) + 'vw';
//         boxElement.style.top = (getRandomInt(10, 60)) + 'vh';
//         // Calculate and store some of the box coordinates:

//     }
// }