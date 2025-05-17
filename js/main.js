document.addEventListener('DOMContentLoaded', function () {
  app.init();
});

let app = {  
  //URL_PROXY: 'https://salvacam.kesug.com/polen/proxy.php',  
  URL_PROXY: 'https://salvacam.x10.mx/polen/backend/proxy.php',
  //URL_PROXY: 'http://localhost:1234/proxy.php',

  spinnerDiv: document.getElementById('spinnerDiv'),
  updateButton: document.getElementById('update'),
  infoImg: document.getElementById('infoImg'),  

  myModal: document.getElementById('myModal'),
  closeModalButton: document.getElementById('close-modal'),
  modalText: document.getElementById('modal-text'),

  infoButton: document.getElementById('infoButton'),
  responsibility: document.getElementById('responsibility'),

  init: function() {
    app.updateButton.addEventListener('click', app.getData);
    app.closeModalButton.addEventListener('click', app.closeModal);    
    app.infoButton.addEventListener('click', app.showInfo);

    if(localStorage.getItem('_polen_granada')) {
      let dataConnection = JSON.parse(localStorage.getItem('_polen_granada'));
      app.showDataConnection(dataConnection.data);
      app.infoButton.classList.remove('hide');
    }

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

  showDataConnection: function(data) {
    //app.infoImg.src = "https:" + data;
    app.infoButton.classList.remove('hide');
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
    app.showModal("Error conexión, se muestran los últimos datos obtenidos");    
    let dataConnection = JSON.parse(localStorage.getItem('_polen_granada'));
    app.updateButton.classList.remove('hide');
    app.showDataConnection(dataConnection.data);
  },

  showModal: function(text) {
    app.modalText.innerHTML = text;
    app.myModal.style.display = "block";
  },

  closeModal: function() {
    app.myModal.style.display = "none";
  },

  getData: function() {
    app.spinnerDiv.classList.remove('hide');
    //app.updateButton.classList.add('hide');

    try {
      fetch(app.URL_PROXY)
      .then(
        function(response) {

          app.spinnerDiv.classList.add('hide');
          if (response.status !== 200) {
            //console.log('Looks like there was a problem. Status Code: ' + response.status);  
            app.showLastData();
            return;
          }

          response.text()
          .then(function(string) {

            //app.updateButton.classList.add('hide');

            localStorage.setItem('_polen_granada', JSON.stringify({"data": string}));
            
            app.showDataConnection(string);
          })
          .catch(function(err){
            app.showLastData();
          })
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
