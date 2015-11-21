var LIBRARY = [
  {title: 'C Major Scale', notes: 'A B C D E F G' },
  {title: 'Chromatic Scale', notes: 'A A# B C C# D D# E F F# G G#' },
  {title: 'Random Song', notes: 'A B*2 C D A*4 D E*2 F A B A A*2' },
  {title: 'Adup Licate', notes: 'A B*2 C D A*4 D E*2 F A B A A*2' },
  {title: 'Yankee Doodle', notes: 'C F*4 C F*4 B C D A*2 B*2 A B*2 C' },
  {title: 'Descending Notes', notes: 'G F E D C B A G F E D C B A' }
];

var BPM = 600;

// Add a song with the given title and notes to the library.
var addSongToLibrary = function(title, notes) {
  $('#library-list').append("<li>" +
                                "<i class='fa fa-bars'></i>" +
                                "<i class='fa fa-trash'></i>" +
                                "<span class='title'>" + title + "</span>" +
                                "<div class='notes' style='display: none;'>" + notes + "</div>" +
                              "</li>");
};


// Add all LIBRARY songs to the library.
var initializeLibrary = function() {
  for(var i=0; i < LIBRARY.length; i+=1) {
    addSongToLibrary(LIBRARY[i].title, LIBRARY[i].notes);
  }
};


// Play all songs in the playlist.
var playAll = function(e) {
  e.preventDefault();

  // Grab the top song in the queue, parse its notes and play them.
  // Then recurse until there are no more songs left in the queue.
  //
  var playNext = function() {
    var songItem = $('#playlist-list li:first-child');

    if (songItem.length == 0) {
      // No more songs.

      // Stop JukeBox logo from dancing
      $(".page-header").css("animation", "");

      // Re-enable the play button.
      $('#play-button').attr('disabled', false).text('Play All');

      // Fade out the message.
      $('#message').fadeOut();
      return;
    }

    var title = songItem.find('.title').text();
    var notes = songItem.find('.notes').text();
    var song = parseSong(notes);

    $('#message').html("Now playing: <strong>" + title + "</strong>").show();

    // Make JukeBox logo do a dance
    $(".page-header").css("animation", "dance 1.5s infinite");

    playSong(song, BPM, function() {
      songItem.remove();
      $('#library-list').append(songItem);
      playNext();
    });
  };

  // Disable the play button to start.
  $('#play-button').attr('disabled', true).text('Playing');

  playNext();
}


$(document).ready(function() {
  // Initialize the library with some songs.
  initializeLibrary();

  $("#song-form").on("submit", function(e) {
    var notes = $("input[name = 'notes']").val();
    var name = $("input[name = 'name']").val();

    addSongToLibrary(name, notes);

    $("input[name = 'notes']").val("");
    $("input[name = 'name']").val("");
    e.preventDefault();
  })

  // Play all songs in the playlist when the "play" button is clicked.
  $('#play-button').on('click', playAll);

  // Animations
  $('#library-list').on("click", ".fa-trash", function(e) {
    var li = $(this).parent();
    $(li).slideUp(500, function() {
      $(li).remove();
    });
  })

  $('#library-list').on("dblclick", "li", function(e) {
    var $notes = $(this).find(".notes")
    if ($notes.attr("style") === "display: none;")
      $notes.slideDown(300);
    else
      $notes.slideUp(300);

  })

  $('#playlist-list').on("dblclick", "li", function(e) {
    var $notes = $(this).find(".notes")
    if ($notes.attr("style") === "display: none;")
      $notes.slideDown(300);
    else
      $notes.slideUp(300);

  })

  $("#message").fadeIn(800, function() {
    setTimeout(function(){
      $("#message").fadeOut(800);
    }, 3000);
  })

  $(function() {
    $( "#playlist-list, #library-list" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
  });

  $("#filter-library").on("keyup", function(e) {
    $("#library-list li:contains('" + $(this).val() + "')").show();
    $("#library-list li:not(:contains('" + $(this).val() + "'))").hide();
  })

  $('#play-button').bind('webkitAnimationEnd', function(){
    this.style.webkitAnimationName = '';
  });

  $('.page-header').bind('webkitAnimationEnd', function(){
    this.style.webkitAnimationName = '';
  });

  $("#play-button").on("click", function(e) {
    if ($("#playlist-list li").length === 0) {
      e.preventDefault();
      $(this).css("animation", "shake 0.82s", function() {
        $("play-button").css("animation", "");
      });
    }
  })


});
