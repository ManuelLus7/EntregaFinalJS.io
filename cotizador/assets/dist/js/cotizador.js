const tiposSeguro = {
    mantenimiento: {
      nombre: "Mantenimiento de Oferta",
      tasa: 0.4
    },
    ejecucion: {
      nombre: "Ejecución de Contrato",
      tasa: 0.4
    },
    anticipo: {
      nombre: "Anticipo Financiero",
      tasa: 0.4
    },
    fondo_reparo: {
      nombre: "Fondo de Reparo",
      tasa: 0.4
    }
  };
  
  document.getElementById("calcularBtn").addEventListener("click", guardarCotizacion);
  document.getElementById("historialBtn").addEventListener("click", mostrarHistorial);
  
  // Agregar eventos 'input' para actualizar el resultado en tiempo real
  document.getElementById("razon_social").addEventListener("input", actualizarCotizacion);
  document.getElementById("obra").addEventListener("input", actualizarCotizacion);
  document.getElementById("fecha").addEventListener("input", actualizarCotizacion);
  document.getElementById("tipo_seguro").addEventListener("input", actualizarCotizacion);
  document.getElementById("suma_asegurada").addEventListener("input", actualizarCotizacion);
  
  function guardarCotizacion() {
    const razonSocial = document.getElementById("razon_social").value;
    const obra = document.getElementById("obra").value;
    const fecha = document.getElementById("fecha").value;
    const tipoSeguro = document.getElementById("tipo_seguro").value;
    const sumaAsegurada = parseFloat(document.getElementById("suma_asegurada").value);
  
    if (!razonSocial || !obra || !fecha || !tipoSeguro || isNaN(sumaAsegurada)) {
      document.getElementById("resultado").style.display = "none";
      return;
    }
  
    const seguro = tiposSeguro[tipoSeguro];
    const prima = Math.max(sumaAsegurada * seguro.tasa / 100, 2500);
    const iva = prima * 0.21;
    const total = prima + iva;
  
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
      <h2>Resultados de la Cotización:</h2>
      <p><strong>Razón Social:</strong> ${razonSocial}</p>
      <p><strong>Obra:</strong> ${obra}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Tipo de Seguro:</strong> ${seguro.nombre}</p>
      <p><strong>Tasa Trimestral:</strong> ${seguro.tasa}%</p>
      <p><strong>Suma Asegurada:</strong> $${sumaAsegurada.toFixed(2)}</p>
      <p><strong>Prima:</strong> $${prima.toFixed(2)}</p>
      <p><strong>IVA (21%):</strong> $${iva.toFixed(2)}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    `;
    resultado.style.display = "block";
  
    guardarEnHistorial(razonSocial, obra, tipoSeguro, sumaAsegurada, total);

    alert("Cotización Guardada con Éxito. Historial Actualizado.");
  
    limpiarFormulario();
  }
  
  function guardarEnHistorial(razonSocial, obra, tipoSeguro, sumaAsegurada, total) {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
  
    historial.push({
      razonSocial,
      obra,
      tipoSeguro,
      sumaAsegurada,
      total
    });
  
    localStorage.setItem("historial", JSON.stringify(historial));
  
    mostrarHistorial();
  }
  
  function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
  
    if (historial.length === 0) {
      alert('No hay historial disponible.');
      return;
    }
  
    const tabla = document.createElement("table");
    tabla.classList.add("historial-table");
  
    const encabezado = tabla.createTHead();
    const filaEncabezado = encabezado.insertRow();
    const encabezados = ["Razón Social", "Obra", "Tipo de Seguro", "Suma Asegurada", "Total", "Acciones"];
  
    encabezados.forEach((texto) => {
      const encabezado = document.createElement("th");
      encabezado.textContent = texto;
      filaEncabezado.appendChild(encabezado);
    });
  
    const cuerpo = tabla.createTBody();
  
    historial.forEach((cotizacion, index) => {
      const fila = cuerpo.insertRow();
      const tipoSeguro = tiposSeguro[cotizacion.tipoSeguro];
  
      if (tipoSeguro) {
        const celdas = [
          cotizacion.razonSocial,
          cotizacion.obra,
          tipoSeguro.nombre,
          cotizacion.sumaAsegurada.toFixed(2),
          cotizacion.total.toFixed(2),
          `<button onclick="eliminarCotizacion(${index})">Eliminar</button>`
        ];
  
        celdas.forEach((texto) => {
          const celda = document.createElement("td");
          celda.innerHTML = texto;
          fila.appendChild(celda);
        });
  
        cuerpo.appendChild(fila);
      }
    });
  
    const historialDiv = document.getElementById("historial");
    historialDiv.innerHTML = "";
    historialDiv.appendChild(tabla);
    historialDiv.style.display = "block";
  }
  
  function actualizarCotizacion() {
    const razonSocial = document.getElementById("razon_social").value;
    const obra = document.getElementById("obra").value;
    const fecha = document.getElementById("fecha").value;
    const tipoSeguro = document.getElementById("tipo_seguro").value;
    const sumaAsegurada = parseFloat(document.getElementById("suma_asegurada").value);
  
    if (!razonSocial || !obra || !fecha || !tipoSeguro || isNaN(sumaAsegurada)) {
      document.getElementById("resultado").style.display = "none";
      return;
    }
  
    const seguro = tiposSeguro[tipoSeguro];
    const prima = Math.max(sumaAsegurada * seguro.tasa / 100, 2500);
    const iva = prima * 0.21;
    const total = prima + iva;
  
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
      <h2>Resultados de la Cotización:</h2>
      <p><strong>Razón Social:</strong> ${razonSocial}</p>
      <p><strong>Obra:</strong> ${obra}</p>
      <p><strong>Tipo de Seguro:</strong> ${seguro.nombre}</p>
      <p><strong>Tasa Trimestral:</strong> ${seguro.tasa}%</p>
      <p><strong>Suma Asegurada:</strong> $${sumaAsegurada.toFixed(2)}</p>
      <p><strong>Prima:</strong> $${prima.toFixed(2)}</p>
      <p><strong>IVA (21%):</strong> $${iva.toFixed(2)}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p><strong>Fecha de Entrada en Vigencia:</strong> ${fecha}</p>
    `;
    resultado.style.display = "block";
  }
  
  function limpiarFormulario() {
    document.getElementById("razon_social").value = "";
    document.getElementById("obra").value = "";
    document.getElementById("tipo_seguro").value = "";
    document.getElementById("suma_asegurada").value = "";
    document.getElementById("resultado").style.display = "none";
    document.getElementById("fecha").value = "";
  }
  
  function eliminarCotizacion(index) {
    if (confirm("¿Estás seguro de eliminar esta cotización?")) {
      const historial = JSON.parse(localStorage.getItem("historial"));
      historial.splice(index, 1);
      localStorage.setItem("historial", JSON.stringify(historial));
      mostrarHistorial();
    }

mostrarHistorial();
}

function redireccionar() {
  window.location.href = "../uvi/index.html";
}
