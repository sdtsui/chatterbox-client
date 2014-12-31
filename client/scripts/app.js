var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  data: [],
  currentRoom: undefined,
  roomObject: {},
  friends: {}
};

app.init = function(){
  var context = this;

  this.fetch();
  this.refreshChatBox();

  setInterval(function(){
    context.refreshChatBox();
    context.fetch();
    context.removeRooms();
    context.retrieveRooms();
  }, 1000);

  $("#send").on('click', function(){
    app.createMessage();
  });
  $("#createRoom").on('click', function(){
    console.log("is our on click working for createroom?")
    app.createRoom();
  });

  // $("#main").find(".username").on('click', function(event){
  //   context.addFriend();
  // });
};

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
    var context = this;
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
       context.data[0] = data["results"];
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  };

app.refreshChatBox = function(){
  this.clearMessages();
  var context = this;
  _.each(this.data[0], function(value){
    console.log(context.currentRoom, value.roomname);
    if (context.currentRoom === undefined){
      if (context.friends.hasOwnProperty(value.username)){
        $("#chatbox").append("<div class=text>"+bESC(value.text)+"</div>").toggleClass("friend");
      } else {
        $("#chatbox").append("<div class=text>"+bESC(value.text)+"</div>");
      }

      $("#chatbox").append("<div class=username id="+bESC(value.username)+">"+bESC(value.username)+"</div><br>");

    }
    else if (context.currentRoom === value.roomname){
      if (context.friends.hasOwnProperty(value.username)){
        $("#chatbox").append("<div class=text>"+bESC(value.text)+"</div>").toggleClass("friend");
      } else {
        $("#chatbox").append("<div class=text>"+bESC(value.text)+"</div>");
      }

      $("#chatbox").append("<div class=username id="+bESC(value.username)+">"+bESC(value.username)+"</div><br>");
    }
  });

  $(".username").on('click', function(){
    var clickedUsername = $(this).attr('id');
    if(!context.friends[clickedUsername]){
      context.friends[clickedUsername] = clickedUsername;

    }
  });

};

app.clearMessages = function(){
  var chats = $("#chatbox");
  var children = chats.children();
  children.remove();
  };
app.removeRooms = function(){
  var rooms = $(".roomButtons");
  var children = rooms.children();
  children.remove();
  };


app.appendMessage =  function(message) {
    // var intoSelector = "."+message.username;
    var chats = $("#chatbox");
    chats.append("<div class ='username'>"+message.text+" "+message.username+"</div>");
  };

app.addFriend = function(userName){
    console.log("sup");
  };

app.createMessage = function(){
  var string = window.location.search;
  var username = string.split("").splice(10).join("");
  var message = {};
  message.text = $(".inputMsg").val();
  message.username = username;
  message.roomname = $(".inputRoom").val();
  this.send(message);
};

app.createRoom = function(roomName){
  var createRoom = $("#createRoom");
  var inputRoom = $(".inputRoom").val();
  if(!this.roomObject[inputRoom]){
    this.roomObject[inputRoom] = inputRoom;
  }
  return;
};

app.retrieveRooms = function(){
  //this.roomObject
  var context = this;
  _.each(this.data[0], function(value){
    if(!context.roomObject[bESC(value.roomname)]){
      context.roomObject[bESC(value.roomname)] = bESC(value.roomname);
    }
  });
  this.createRoomButtons();
};

app.createRoomButtons = function(){
  //this.roomObject
  var roomButtons = $(".roomButtons");
  var context = this;
  _.each(this.roomObject, function(value){
    roomButtons.append("<button class=roomNames id="+value+">"+value+"</button>");
  })
  $(".roomNames").on("click", function(){
    context.currentRoom = $(this).attr('id');
  })
}

app.init();

/**
 * Escaping function
 * @type {Object}
 */
var basicMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var bESC = function (string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return basicMap[s];
  });
};

/**
 * Returns time
 * @return {[type]} [description]
 */
app.time = function(){
  var dt = new Date();
  var time = (dt.getYear()+1900)+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+
  " "+dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  return time;
};
