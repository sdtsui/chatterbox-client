// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  data: [],
};


app.init = function(){
    // debugger;
    // this.data.push(this.fetch());
    var context = this;
    $("#main").find(".username").on('click', function(event){
      context.addFriend();
    });
    $("button").on('click', function(){
      context.handleSubmit();
    })
    this.fetch();
    this.createChatBox();
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
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
       context.data.push(data["results"]);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  };

app.createChatBox = function(){
  console.log(this.data)
  _.each(this.data[0], function(value){
    console.log(value);
    $("#chatbox").append("<div>"+value.text+"<br></div>");
  })

};

app.clearMessages = function(){
    var chats = $("#chats");
    var children = chats.children();
    children.remove();
  };

app.addRoom = function(roomName){
    var roomSelect = $("#roomSelect");
    roomSelect.append("<div>"+roomName+"</div>");
  };
app.addMessage =  function(message) {
    var chats = $("#chats");
    chats.append("<div class ='username'>"+message.text+" "+message.username+"</div>");
    // var intoSelector = "."+message.username;
  };
app.addFriend = function(userName){
    console.log("sup");
  };

app.handleSubmit = function(){
    this.addMessage($('input').val());
  };
app.init();
