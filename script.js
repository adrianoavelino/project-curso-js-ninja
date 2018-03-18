(function($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  var app = (function appController(win, doc) {
    var ajax;
    var getInput = getInputs();

    function getInputs() {
      var inputs = {
        imagem: $('[data-js=car-imagem]').get(),
        marcaModelo: $('[data-js=car-marcamodelo]').get(),
        ano: $('[data-js=car-ano]').get(),
        placa: $('[data-js=car-placa]').get(),
        cor: $('[data-js=car-cor]').get()
      };
      return inputs;
    }

    function clearForm() {
      getInput['imagem'].value = "";
      getInput['marcaModelo'].value = "";
      getInput['ano'].value = "";
      getInput['placa'].value = "";
      getInput['cor'].value = "";
    }

    function initValues() {
      getInput['imagem'].value = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLd2U9PSVTK2s5LV7_J2SPiWmI97lt1WaYciV1l_selrvM2lg0IQ";
      getInput['marcaModelo'].value = "VW Gol";
      getInput['ano'].value = "2019";
      getInput['placa'].value = "CCC-0000";
      getInput['cor'].value = "Azul";
    }

    return {
      init: function init() {
        this.initCompanyInformation();
        this.initEvents();
        initValues();
        this.renderAllCars();
      },

      initCompanyInformation: function initCompanyInformation() {
        app.showCompanyInfo();
      },

      showCompanyInfo: function showCompanyInfo() {
        ajax = new XMLHttpRequest();
        ajax.open('GET', '/company.json');
        ajax.send();
        ajax.addEventListener('readystatechange', app.handleReadyStateChange, false);
      },

      handleReadyStateChange: function handleReadyStateChange() {
        if (app.isRequestOK()) {
          var data = app.parseData();
          var $title = $('[data-js=dealership-title]');
          $title.get().textContent = data.name + ' ' + data.phone;
        }
      },

      isRequestOK: function isRequestOK() {
        return ajax.readyState === 4 && ajax.status === 200;
      },

      parseData: function parseData() {
        var data;
        try {
          data = JSON.parse(ajax.responseText)
        } catch (error) {
          console.log('Erro:',error);
          data = null;
        }
        return data;
      },

      initEvents: function initEvents() {
        var $form = $('[data-js=form]');
        var $btnRemove = $('[data-js=button-remove]');
        $form.on('submit', app.handleSubmitForm);
        $btnRemove.on('click', app.handleRemoveCar);
      },

      handleSubmitForm: function handleSubmitForm(event) {
        event.preventDefault();
        var $dealershipTable = $('[data-js=dealership-table]');
        var newCar = app.getCar();
        $dealershipTable.get().appendChild(app.addNewCar());
        app.saveCar();
        var $dealershipTable = $('[data-js=dealership-table]');
        $dealershipTable.get().innerHTML = '';
        app.renderAllCars();
        clearForm();
      },

      handleRemoveCar: function handleRemoveCar(event) {
        event.preventDefault();
        var td = this.parentNode;
        var tr = td.parentElement;
        if (tr.parentElement) {
          tr.parentElement.removeChild(tr);
        }
      },

      addNewCar: function addNewCar() {
        var fragment = doc.createDocumentFragment();
        var tr = doc.createElement('tr');
        var img = doc.createElement('img');
        var tdImage =doc.createElement('td');
        var tdMarcaModelo = doc.createElement('td');
        var tdAno = doc.createElement('td');
        var tdPlaca = doc.createElement('td');
        var tdCor = doc.createElement('td');
        var tdRemove = doc.createElement('td');
        var buttonRemove = doc.createElement('button');

        buttonRemove.setAttribute('data-js', 'button-remove')
        buttonRemove.textContent = 'Remover';
        img.setAttribute('src', getInput['imagem'].value );

        tdImage.appendChild(img);
        tdMarcaModelo.textContent = getInput['marcaModelo'].value;
        tdAno.textContent = getInput['ano'].value;
        tdPlaca.textContent = getInput['placa'].value;
        tdCor.textContent = getInput['cor'].value;
        tdRemove.appendChild(buttonRemove);

        tr.appendChild(tdImage);
        tr.appendChild(tdMarcaModelo);
        tr.appendChild(tdAno);
        tr.appendChild(tdPlaca);
        tr.appendChild(tdCor);
        tr.appendChild(tdRemove);
        buttonRemove.addEventListener('click', app.handleRemoveCar);

        return fragment.appendChild(tr);
      },

      getCar: function getCar() {
        return {
          img: getInput['imagem'].value,
          modelo: getInput['marcaModelo'].value,
          ano: getInput['ano'].value,
          placa: getInput['placa'].value,
          cor: getInput['cor'].value
        }
      },

      makeMarkupCarTable: function makeMarkupCarTable(cars) {
        var fragmentCarTable = doc.createDocumentFragment();
        var markup = cars.map(app.appendCar(fragmentCarTable));
        return fragmentCarTable;
      },
      
      appendCar: function appendCar(fragment) {
        return function(car) {
          var tr = doc.createElement('tr');
          var img = doc.createElement('img');
          var tdImage =doc.createElement('td');
          var tdMarcaModelo = doc.createElement('td');
          var tdAno = doc.createElement('td');
          var tdPlaca = doc.createElement('td');
          var tdCor = doc.createElement('td');
          var tdRemove = doc.createElement('td');
          var buttonRemove = doc.createElement('button');
          buttonRemove.setAttribute('data-js', 'button-remove')
          buttonRemove.textContent = 'Remover';

          img.setAttribute('src', car.image );
          tdImage.appendChild(img);
          tdMarcaModelo.textContent = car.brandModel;
          tdAno.textContent = car.year;
          tdPlaca.textContent = car.plate;
          tdCor.textContent = car.color;
          tdRemove.appendChild(buttonRemove);

          tr.appendChild(tdImage);
          tr.appendChild(tdMarcaModelo);
          tr.appendChild(tdAno);
          tr.appendChild(tdPlaca);
          tr.appendChild(tdCor);
          tr.appendChild(tdRemove);

          return fragment.appendChild(tr);
        }
      },
      
      renderAllCars: function renderAllCars() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();
        ajax.addEventListener('readystatechange', function () {
          if (ajax.readyState === 4) {
            var cars = JSON.parse(ajax.responseText);
            var $dealershipTable = $('[data-js=dealership-table]');
            $dealershipTable.get().appendChild(app.makeMarkupCarTable(cars));  
            app.initEvents();
          }
        });
      },

      saveCar: function saveCar() {
        var querString = 'image=' + getInput['imagem'].value + '&' ;
        querString += 'brandModel=' + getInput['marcaModelo'].value + '&';
        querString += 'year=' + getInput['ano'].value + '&';
        querString += 'plate=' + getInput['placa'].value + '&';
        querString += 'color=' + getInput['cor'].value + '&';

        ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send(querString);
        ajax.addEventListener('readystatechange',function () {
          if (app.isRequestOK()) {
            console.log('Usuário cadastrado!', ajax.responseText);
          } 
        });
      }
      
    }
  })(window, document);
  
  app.init();

})(window.DOM);
