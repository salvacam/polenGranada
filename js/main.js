document.addEventListener('DOMContentLoaded', function () {
  app.init();
});

let app = {  
  URL_PROXY: 'https://calcicolous-moonlig.000webhostapp.com/polen/proxy.php',
  //URL_PROXY: 'http://localhost:8000/proxy.php',

  spinnerDiv: document.getElementById('spinnerDiv'),
  dataDiv: document.getElementById('dataDiv'),
  updateButton: document.getElementById('update'),

  myModal: document.getElementById('myModal'),
  closeModalButton: document.getElementById('close-modal'),
  modalText: document.getElementById('modal-text'),
  
  accordion: undefined,


  infoButton: document.getElementById('infoButton'),
  responsibility: document.getElementById('responsibility'),

  init: function() {
    app.updateButton.addEventListener('click', app.getData);
    app.closeModalButton.addEventListener('click', app.closeModal);    
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

  showDataConnection: function(data) {
    app.dataDiv.innerHTML = data;
    app.makeAccordion();
  },

  makeAccordion: function() {
    app.accordion = document.getElementById('accordion');
    let targets = app.accordion.querySelectorAll('section > p:first-of-type');
    let i = 0;
    let currentTarget;
    let expandedSection = true;

    for (i = 0; i < targets.length; i++) {
      targets[i].addEventListener('click', function () {
        expandedSection = true;
        if (currentTarget == this.parentNode && currentTarget.classList.contains("expanded")) {
          expandedSection = false;
        }
        
        if (currentTarget) {
          currentTarget.classList.remove("expanded");
        }
        
        if (expandedSection) {
          currentTarget = this.parentNode;
          currentTarget.classList.add("expanded");
        }
      }, false);
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

            app.updateButton.classList.add('hide');

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