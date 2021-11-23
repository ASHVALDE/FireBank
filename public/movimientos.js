function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

function read(){
    let idAccount=document.getElementById("Cuentas").value
    let tiempo=document.getElementById("Dias").value
    let Categoria=document.getElementById("Rubro")
    if (idAccount=="na" || tiempo=="na"){
      alert("Seleccione todos los campos")
    }else{
      window.location.replace("/movimientos?Cuentas="+idAccount+"&Dias="+tiempo+"&Rubro="+getSelectValues(Categoria))

    }
}