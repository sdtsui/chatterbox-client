// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  data: [],
  currentRoom: undefined
};

/**
 * Fetches and adds events.
 * @return {[type]} [description]
 */
// var message = {
//   "username": "shawndrost",
//   "text": "hellohello",
//   "roomname": "roomHR"
// };

app.time = function(){
  var dt = new Date();
  var time = (dt.getYear()+1900)+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+
  " "+dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  return time;
};


app.init = function(){
    var context = this;
    this.fetch();
    this.refreshChatBox();
    this.checkRoom();
    $("#main").find(".username").on('click', function(event){
      context.addFriend();
    });
    setInterval(function(){
      context.refreshChatBox();
      console.log("context", context);
      console.log('context 123', context.data[0][0].text);
      context.fetch();
    }, 1000);

    $("#send").on('click', function(){
      app.createMessage();
    });
    $("#joinRoom").on('click', function(){
      app.updateRoom();
    });
  };

app.send = function(message){
    console.log('sending')
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
    console.log("hi");
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
  if (this.currentRoom === "default"){
    _.each(this.data[0], function(value){
        $("#chatbox").append("<div>"+bESC(value.text)+"<br></div>");
      });
  } else {
    _.each(this.data[0], function(value){
      if (this.currentRoom === value.roomName){
        $("#chatbox").append("<div>"+bESC(value.text)+"<br></div>");
        }
    });
      }
  };

app.clearMessages = function(){
    var chats = $("#chatbox");
    var children = chats.children();
    children.remove();
  };

app.addRoom = function(roomName){
    var roomSelect = $("#roomSelect");
    roomSelect.append("<div>"+roomName+"</div>");

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
app.checkRoom = function(){
  this.currentRoom = $(".inputMsg").val()
}

app.init();



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


