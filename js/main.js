document.addEventListener('DOMContentLoaded', function () {
  app.init();
});

let app = {  
  //URL_PROXY: 'http://localhost:1234/proxy.php',
  URL_PROXY: 'https://salvacam.x10.mx/polen/backend/proxy.php',
  URL_IMG: 'https://salvacam.x10.mx/polen/backend/img/data.png',

  spinnerDiv: document.getElementById('spinnerDiv'),
  updateButton: document.getElementById('update'),
  infoImg: document.getElementById('infoImg'),  

  myModal: document.getElementById('myModal'),
  closeModalButton: document.getElementById('close-modal'),

  infoButton: document.getElementById('infoButton'),
  responsibility: document.getElementById('responsibility'),

  init: function() {
    app.updateButton.addEventListener('click', app.getData);
    app.closeModalButton.addEventListener('click', ()=>{ app.myModal.style.display = "none"; });    
    app.infoButton.addEventListener('click', app.showInfo);

    app.getData();

    //Guardar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js')
        .then(function() {
          //console.log('Service Worker Registered');
        });
    }
  },

  showInfo: function() {
    if (app.responsibility.classList.contains('hide')) {
      app.responsibility.classList.remove('hide');
      app.infoButton.textContent = 'Ocultar Información';
    } else {
      app.responsibility.classList.add('hide');
      app.infoButton.textContent = 'Ver Información';
    }
  },

  showLastData: function(){   
    app.spinnerDiv.classList.add('hide');
    app.myModal.style.display = "block";
  },

  getData: function() {
    app.spinnerDiv.classList.remove('hide');

    try {
      fetch(app.URL_PROXY)
      .then(
        function(response) {
          if (response.status !== 200) {
            //console.log('Status Code: ' + response.status);  
            app.showLastData();
            return;
          }          
          app.spinnerDiv.classList.add('hide');
          app.infoImg.src = app.URL_IMG + '?t=' + new Date().getTime();           
        }
      )
      .catch(function(err) {
        app.showLastData();
      });
    } catch (err) {
      app.showLastData();
    }
  }

}
