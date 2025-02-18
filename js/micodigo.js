// Cargar datos desde LocalStorage o iniciar arrays vacíos
let equipos = JSON.parse(localStorage.getItem("equipos")) || [];
let instructores = JSON.parse(localStorage.getItem("instructores")) || [];
let prestamos = JSON.parse(localStorage.getItem("prestamos")) || [];

function guardarDatos() {
    localStorage.setItem("equipos", JSON.stringify(equipos));
    localStorage.setItem("instructores", JSON.stringify(instructores));
    localStorage.setItem("prestamos", JSON.stringify(prestamos));
}

// Función para limpiar los campos de los formularios
function limpiarCampos(...ids) {
    ids.forEach(id => document.getElementById(id).value = "");
}

// Agregar un nuevo equipo
function agregarEquipo() {
    const nombre = document.getElementById("inputNombreEquipo").value.trim();
    const marca = document.getElementById("inputMarcaEquipo").value.trim();
    const cantidad = parseInt(document.getElementById("inputCantidadEquipo").value);

    if (!nombre || !marca || isNaN(cantidad) || cantidad <= 0) {
        return Swal.fire("Error", "Todos los campos son obligatorios y la cantidad debe ser mayor a 0", "error");
    };

    let equipoExistente = equipos.find(e => e.nombre === nombre && e.marca === marca);
    if (equipoExistente) {
        equipoExistente.cantidad += cantidad;
    } else {
        equipos.push({ nombre, marca, cantidad });
    };

    guardarDatos();
    Swal.fire("Éxito", "Equipo agregado correctamente", "success");
    limpiarCampos("inputNombreEquipo", "inputMarcaEquipo", "inputCantidadEquipo");
    imprimirEquipos();
}

function imprimirEquipos() {
    const tabla = document.getElementById("tablaEquipos");
    tabla.innerHTML = equipos.map(eq => `<tr><td>${eq.nombre}</td><td>${eq.marca}</td><td>${eq.cantidad}</td></tr>`).join("");
}

imprimirEquipos();

// Agregar Instructor
function agregarInstructor() {
    const id = document.getElementById("inputIdInstructor").value.trim();
    const nombre = document.getElementById("inputNombreInstructor").value.trim();

    if (!id || !nombre) {
        return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    };

    if (instructores.some(ins => ins.id === id)) {
        return Swal.fire("Error", "El instructor ya está registrado", "error");
    };

    instructores.push({ id, nombre });
    guardarDatos();
    Swal.fire("Éxito", "Instructor agregado correctamente", "success");
    limpiarCampos("inputIdInstructor", "inputNombreInstructor");
    imprimirInstructores();
}

function imprimirInstructores() {
    const tabla = document.getElementById("tablaInstructores");
    tabla.innerHTML = instructores.map(ins => `<tr><td>${ins.id}</td><td>${ins.nombre}</td></tr>`).join("");
}

imprimirInstructores();

// Registrar un préstamo
function agregarPrestamo() {
    const equipo = document.getElementById("inputNombreEquipoPrestar").value.trim();
    const marca = document.getElementById("inputMarcaEquipoPrestar").value.trim();
    const cantidad = parseInt(document.getElementById("inputCantidadPrestar").value);
    const idInstructor = document.getElementById("inputIdInstructorPresta").value.trim();

    if (!equipo || !marca || isNaN(cantidad) || cantidad <= 0 || !idInstructor) {
        return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    };
    let equipoInventario = equipos.find(e => e.nombre === equipo && e.marca === marca);
    if (!equipoInventario || equipoInventario.cantidad < cantidad) {
        return Swal.fire("Error", "No hay suficiente stock disponible", "error");
    };

    let instructorRegistrado = instructores.find(ins => ins.id === idInstructor);
    if (!instructorRegistrado) {
        return Swal.fire("Error", "El instructor no está registrado", "error");
    };

    let prestamoExistente = prestamos.find(p => p.id === idInstructor && p.equipo === equipo && p.marca === marca);
    if (prestamoExistente) {
        prestamoExistente.cantidad += cantidad;
    } else {
        prestamos.push({ id: idInstructor, equipo, marca, cantidad });
    };

    equipoInventario.cantidad -= cantidad;

    guardarDatos();
    Swal.fire("Éxito", "Préstamo registrado correctamente", "success");
    limpiarCampos("inputNombreEquipoPrestar", "inputMarcaEquipoPrestar", "inputCantidadPrestar", "inputIdInstructorPresta");
    imprimirEquipos();
    imprimirPrestamos();
};

function imprimirPrestamos() {
    const tabla = document.getElementById("tablaPrestamos");
    tabla.innerHTML = prestamos.map(p => `<tr><td>${p.id}</td><td>${p.equipo}</td><td>${p.marca}</td><td>${p.cantidad}</td></tr>`).join("");
};

imprimirPrestamos();
