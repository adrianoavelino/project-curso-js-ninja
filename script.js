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
        if (!app.validateForm()) {
          return false;
        };
        var $dealershipTable = $('[data-js=dealership-table]');
        app.saveCar(app.renderAllCars);
        clearForm();
      },

      validateForm: function validateForm() {
        var msg = null;
        var msgError = {
          imagem: '',
          marcaModelo:'',
          ano:'',
          placa:'',
          cor:''
        };

        if (!getInput['imagem'].value) {
          msg = 'Preencha o campo Imagem do carro';
          msgError['imagem'] = msg;
        }

        if (!getInput['marcaModelo'].value) {
          msg = 'Preencha o campo Marca / Modelo';
          msgError['marcaModelo'] = msg;
        }

        if (!getInput['ano'].value) {
          msg = 'Preencha o campo ano';
          msgError['ano'] = msg;
        }

        if (!getInput['placa'].value) {
          msg = 'Preencha o campo placa';
          msgError['placa'] = msg;
        }

        if (!getInput['cor'].value) {
          msg = 'Preencha o campo cor';
          msgError['cor'] = msg;
        }

        for(var error in msgError){
          var input = getInput[error].parentNode.childNodes[5];
          input.textContent = msgError[error];
        }

        return !msg;
      },

      handleRemoveCar: function handleRemoveCar(event) {
        event.preventDefault();
        var td = this.parentNode;
        var tr = td.parentElement;
        if (tr.parentElement) {
          var plate = tr.childNodes[3].textContent;
          var $dealershipTable = $('[data-js=dealership-table]');
          // $dealershipTable.get().innerHTML = 'Atualizando ...';
          app.removeCar.call(this, app.renderAllCars);
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
        var $dealershipBodyTable = $('[data-js=dealership-table]');
        var $dealershipHeaderTable = $('[data-js=dealership-header]');
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();
        ajax.addEventListener('readystatechange', function () {
          if (ajax.readyState === 4) {
            var cars = JSON.parse(ajax.responseText);
            if(!cars.length) {
              app.renderDealershipTableEmpty();
              return;
            }
            app.renderDealershipHeaderTable();
            app.renderDealershipBodyTable(cars);
            app.initEvents();
          }
        });
      },

      renderDealershipTableEmpty: function renderDealershipTableEmpty() {
        var $dealershipBodyTable = $('[data-js=dealership-table]');
        var $dealershipHeaderTable = $('[data-js=dealership-header]');
        $dealershipHeaderTable.get().innerHTML = '<tr> <td colspan="6">Não existem carros cadastrados</td> </tr>';
        $dealershipBodyTable.get().innerHTML = '';
      },

      renderDealershipHeaderTable: function renderDealershipHeaderTable() {
        var $dealershipHeaderTable = $('[data-js=dealership-header]');
        $dealershipHeaderTable.get().innerHTML = '<tr> <th colspan="6">Lista de Carros</th> </tr>' + ' <tr> <th>Imagem</th> <th>Marca / Modelo</th> <th>Ano</th> <th>Placa</th> <th>Cor</th> <th>#</th> </tr>';  
      },

      renderDealershipBodyTable: function renderDealershipBodyTable(cars) {
        var $dealershipBodyTable = $('[data-js=dealership-table]');
        $dealershipBodyTable.get().innerHTML = '';
        $dealershipBodyTable.get().appendChild(app.makeMarkupCarTable(cars));  
      },

      saveCar: function saveCar(callback) {
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
            callback();
          } 
        });
      },

      removeCar: function removeCar(callback) {
        var td = this.parentNode;
        var tr = td.parentElement;
        var plateCarDeleted = tr.childNodes[3].textContent;
        var querString =  'plate=' + plateCarDeleted;
        ajax = new XMLHttpRequest();
        ajax.open('DELETE', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send(querString);
        ajax.addEventListener('readystatechange',function () {
          if (app.isRequestOK()) {
            console.log('Carro deletado!', ajax.responseText);
            callback();
          }
        });
      }
    }
  })(window, document);
  
  app.init();

})(window.DOM);
