'use strict';

window.card = (function () {

  var nodeBeforeInsert = document.querySelector('.map__filters-container');
  var nodeBefore = nodeBeforeInsert.parentNode;
  var currentArticle = false;

  function closePopupAdArticle() {

    nodeBefore.removeChild(currentArticle);
    currentArticle = false;

  }

  return {

    showPopupAdArticle: function (newArticle) {

      if (currentArticle === false) {

        currentArticle = newArticle;
        nodeBefore.insertBefore(currentArticle, nodeBeforeInsert);

      } else {

        var bufferArticle = newArticle;
        nodeBefore.replaceChild(bufferArticle, currentArticle);
        currentArticle = bufferArticle;
      }

    },

    closePopupAdArticle: closePopupAdArticle
  };

})();
