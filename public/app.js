// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append(
      "<div class='card'>" +
        "<div class='card-header teal'>" +
          data[i].title +
        "</div>" +
        "<div class='card-body'>" +
          "<blockquote class='blockquote mb-0'>" +
            "<p>" +
            data[i].link +
            "</p>" +
          "</blockquote>" +
        "</div>" +
      "</div>"
      );
  }
});

// $("#home").click(function(){
//   $.ajax({
//     method: "GET",
//     url: "/"
//   })
// });

// $("#news").click(function(data){
//   $.ajax({
//     method: "GET",
//     url: "/"
//   })
// });

$("#scrapeArticles").click(function(){
  console.log("Scraper clicked")
  $.ajax({
    method: "GET",
    url: "/scrape/",
    // success: function(data){
    //   // do stuff
    //   // call next ajax function
    //   $.ajax({
    //     method: "GET",
    //     url: "/articles/" 
    //   });
    // }
  })
});

$("#clearArticles").click(function(){
  console.log("Clear button clicked");
  $.ajax({
    method: "GET",
    url: "/clearall"
  })
  $("#articles").empty();
  });


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button class='noteBtn btn btn-default navbar-btn text-white' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
