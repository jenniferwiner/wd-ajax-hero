(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({
        delay: 50
      }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };
  // click search button

  $('button').click(function(event) {
    // get user search
    let userSearch = $('#search').val();

    if (userSearch !== '') {
      $.ajax({
        method: 'GET',
        url: `http://omdbapi.com/?s=${userSearch}`,
        dataType: 'json',
        success: function(data) {

          let currentPlot = '';
          for (let item of data.Search) {
            let movieData = {
              id: item.imdbID,
              poster: item.Poster,
              title: item.Title,
              year: item.Year
            };

            $.ajax({
              method: 'GET',
              url: `http://omdbapi.com/?i=${item.imdbID}&plot=full`,
              dataType: 'json',
              success: function(dataPlots) {
                currentPlot = dataPlots.Plot;
                movieData['plot'] = currentPlot;
                movies.push(movieData);
              },
              error: function() {
                console.log('error');
              }
            });
            // console.log(movieData);
          }
          renderMovies();
          movies.length = 0;
        },
        error: function() {
          console.log('error');
        }
      });
      event.preventDefault();
    }
  });
})();
