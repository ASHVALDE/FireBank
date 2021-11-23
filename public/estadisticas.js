function read() {
    let idAccount = document.getElementById("Cuentas").value
    let tiempo = document.getElementById("fechas").value
    let Categoria = document.getElementById("rubro").value
    if (idAccount == "na" || tiempo == "na" || Categoria=="na") {
        alert("Seleccione todos los campos")
    } else {
        window.location.replace("/estadisticas?Cuentas=" + idAccount + "&Dias=" + tiempo + "&Rubro=" + Categoria)
    }
}