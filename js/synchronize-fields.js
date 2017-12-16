'use strict';

window.synchronize_fields = (function () {

  return {

    synchronizeFields: function (field1, field2, values1, values2, callbackFunc) {

      var index = values1.indexOf(field1.value);

      callbackFunc(field2, values2[index]);

    }

  };

})();
