function read(){
    let idAccount=document.getElementById("Cuentas").value
    let tiempo=document.getElementById("Dias").value
    let Categoria=document.getElementById("Rubro").value
    window.location.replace("/movimientos?Cuentas="+idAccount+"&Dias="+tiempo+"&Rubro="+Categoria)
}