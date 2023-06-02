document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const today = new Date();
  const gmtMinus3 = today.getTime() - (3 * 60 * 60 * 1000);
  const gmtMinus3Date = new Date(gmtMinus3);
  const yyyy = gmtMinus3Date.getFullYear();
  let mm = gmtMinus3Date.getMonth() + 1;
  let dd = gmtMinus3Date.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const currentDate = dd + '-' + mm + '-' + yyyy;
  const currentDateBarra = `${dd}/${mm}/${yyyy}`;

  let uvi;
  let inputTexto = document.getElementById('resultId');
  let fechaInicio;
  let fechaFin;
  let fechaHoy = document.getElementById('fechaHoy');
  fechaHoy.innerText = currentDateBarra;

  let url = 'https://ikiwi.net.ar/solicitar-prestamo/api/v1/engine/uvi/valores/';
  const fechaSeleccionadaKey = 'fechaSeleccionada';
  let montoContractual;

  function getUviValue(fecha) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const uviValues = [];

        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].fecha === fecha) {
            uviValues.push({
              fecha: data.data[i].fecha,
              valor: data.data[i].valor
            });
          }
        }

        return uviValues;
      })
      .catch(error => console.error(error));
  }

  async function calcularValoresUVI() {
    const tablaBody = document.getElementById('tablaBody');
    tablaBody.innerHTML = '';

    const fechaInicioValue = new Date(fechaInicio);
    const fechaFinValue = new Date(fechaFin);
    let currentDate = new Date(fechaInicioValue);

    while (currentDate <= fechaFinValue) {
      const dia = currentDate.getDate().toString().padStart(2, '0');
      const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const anio = currentDate.getFullYear().toString();
      const fecha = `${dia}-${mes}-${anio}`;

      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDia = nextDate.getDate().toString().padStart(2, '0');
      const nextMes = (nextDate.getMonth() + 1).toString().padStart(2, '0');
      const nextAnio = nextDate.getFullYear().toString();
      const nextFecha = `${nextDia}-${nextMes}-${nextAnio}`;

      const uviValues = await getUviValue(nextFecha);

      if (uviValues.length > 0) {
        const uviValue = uviValues[0];

        const row = document.createElement('tr');
        const fechaCell = document.createElement('td');
        const valorCell = document.createElement('td');
        const cantidadUviCell = document.createElement('td');
        const seleccionarFechaCell = document.createElement('td');

        fechaCell.textContent = uviValue.fecha;
        valorCell.textContent = `$${uviValue.valor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const cantidadUviObra = parseFloat(montoContractual) / uviValue.valor;
        cantidadUviCell.textContent = cantidadUviObra.toFixed(2);

        const seleccionarFechaBtn = document.createElement('button');
        seleccionarFechaBtn.textContent = 'Seleccionar';
        seleccionarFechaBtn.addEventListener('click', () => {
          guardarFechaSeleccionada(uviValue.fecha);
          alert(`Fecha seleccionada: ${uviValue.fecha}`);
        });

        seleccionarFechaCell.appendChild(seleccionarFechaBtn);

        row.appendChild(fechaCell);
        row.appendChild(valorCell);
        row.appendChild(cantidadUviCell);
        row.appendChild(seleccionarFechaCell);
        tablaBody.appendChild(row);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  function guardarFechaSeleccionada(fecha) {
    localStorage.setItem(fechaSeleccionadaKey, fecha);
  }

  function obtenerFechaSeleccionada() {
    return localStorage.getItem(fechaSeleccionadaKey);
  }

  const fechaInicioInput = document.getElementById('fechaInicio');
  const fechaFinInput = document.getElementById('fechaFin');
  const calcularBtn = document.getElementById('calcularBtn');
  const montoContractualInput = document.getElementById('montoContractual');

  fechaInicioInput.addEventListener('change', () => {
    fechaInicio = fechaInicioInput.value;
  });

  fechaFinInput.addEventListener('change', () => {
    fechaFin = fechaFinInput.value;
  });

  montoContractualInput.addEventListener('change', () => {
    montoContractual = montoContractualInput.value;
  });

  calcularBtn.addEventListener('click', () => {
    if (!fechaInicio || !fechaFin) {
      console.error('Debes seleccionar ambas fechas antes de continuar.');
      alert('Debes seleccionar ambas fechas antes de continuar.');
      return;
    }

    if (!montoContractual) {
      console.error('Debes especificar el monto contractual antes de continuar.');
      alert('Debes especificar el monto contractual antes de continuar.');
      return;
    }

    calcularValoresUVI();
  });
});
