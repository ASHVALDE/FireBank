const express = require('express')
const path = require('path');
const session = require("express-session")
const app = express()
const port = process.env.PORT || 3000
let options = {};
var request = require('request');

const Categorias = {
  ["Hogar e Interiores"]: ["ILUMINACION", "ABC HOME", "4 TINTAS"],
  ["Medicina"]: ["MEDICA", "MEDICOS", "PHARMACY", "OPTICA", "FARMACIA"],
  ["Compras Virtuales"]: ["REV.", "SUPERMARKET", "CUOTA", "AMAZON", "MERCADO", "GEANT", "REDIVA", "EL CORTE INGLES", "2CO.COM"],
  ["Comida"]: ["STARBUCKS", "PASTAS", "SUBWAY", "PANADERIA", "RESTAURANTE", "EMPANADAS", "A PAO DE QUEIJARIA", "879 HOUSE", "DUTY FREE AMERIC", "7 ELEVEN", "OPEN BAR", "BRIO DOLPHIN", "123 COMIDA", "PARRILLADA", "PEPSIVEN", "SUSHI", "STARBUCKS"],
  ["Turismo y cultura"]: ["AIRBNB", "VIAJE", "WIKIPEDI", "SHERATON LIMA", "ARTESANAL", "HOTEL ART DESIGN"],
  ["Vehiculos y transporte"]: ["DIDI", "AUTOMOVI", "JAYS TRAVEL CENTER", "UBER"],
  ["Ropa"]: ["MEDIERIAS", "BARBER", "NIKE", "ADIDAS", "ZARA", "A EAGLE OUTFTR", "FOREVER 21", "3SECOND.CO"],
  ["Mascotas"]: ["PETMEDS"],
  ["Empresas Reportadas Negativamente"]: ["ITALO HMADRID", "AA INFLIGHT MC FACET 2"],
  ["Software y Tecnologias"]: ["STEAM", "MICROSOFT", "DIRECTV", "NETFLIX", "OCULUS", "FACEBK", "GOOGLE", "YOUTUBE", "69CASES", "1PASSWORD", "42ND STREET PHOTO"],
  ["Economia y acciones"]: ["HOVEREX", "NETELLER", "PAYPAL", "VISA", "XAPO", "ADS", "ABEONACOIN"],
  ["Retiros"]: ["DEVUELTO", "COMISION", "DEB", "DEBITO", "RETIRO", "COBRO"],
  ["Entradas"]: ["CRED.", "SUELDO", "CAMBIOS", "DEPOSITO", "TRASPASO", "PAGO", "ABONO"],
  ["Donaciones"]: ["SOLIDARIDAD", "3SECOND"],
}

bodyParser = require('body-parser'),
app.use(session({ secret: "3d2qd2dcj20j", resave: true, saveUninitialized: true }))
app.use(express.json())
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + 'public')); //Serves resources from public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})


app.post('/auth', (req, res) => {
  app.set('json spaces', 40);
  var responsex = ""
  request.post({

    "url": "https://banking.sandbox.prometeoapi.com/login/",
    "json": true,
    "headers": {
      "X-API-Key": "51mxMHOk90UGuJCYHFYqu7PrZLdoCqfSxj9uTcGMfz67SwszdKofhVAaIhmd0ULB"
    },
    "form": {
      "provider": "test",
      "username": req.body["user"],
      "password": req.body["pass"]
    }
  }, function (err, response, body) {
    if (body["status"] == "logged_in") {
      req.session.key = body["key"]
      req.session.logged = true
      req.session.user = req.body["user"]
      res.redirect("/inicio")
    } else {
      res.redirect("/")
    }
  });
})



app.get("/inicio", (req, res) => {
  var name = ""
  if (req.session.logged) {
    request.get({
      "url": "https://banking.sandbox.prometeoapi.com/info/",
      "json": true,
      "headers": {
        "X-API-Key": "51mxMHOk90UGuJCYHFYqu7PrZLdoCqfSxj9uTcGMfz67SwszdKofhVAaIhmd0ULB"
      },
      "qs": {
        "key": req.session.key
      }
    }, function (e, res2, body) {
      if (body["status"] == "error") { res.redirect("/logout"); return null; }
      name = body["info"]["name"]
      request.get({
        "url": "https://banking.sandbox.prometeoapi.com/account/",
        "json": true,
        "headers": {
          "X-API-Key": "51mxMHOk90UGuJCYHFYqu7PrZLdoCqfSxj9uTcGMfz67SwszdKofhVAaIhmd0ULB"
        },
        "qs": {
          "key": req.session.key
        }
      }, function (e, res3, body2) {
        let cuentas = ""
        if (body2["accounts"].length <= 1) {
          cuentas = " 1 cuenta bancaria"
        } else {
          cuentas = body2["accounts"].length + " cuentas bancarias"
        }
        req.session.cuentas = body2

        res.render(path.join(__dirname, '/inicio.html'), { "name": name.toUpperCase(), "cuentas": cuentas });
      });

    })
  } else {
    res.redirect("/")
  }

})

app.get("/movimientos", (req, res) => {
  if (req.session.logged) {
    idcuenta = req.query.Cuentas
    tiempo = req.query.Dias
    Rubro = req.query.Rubro
    movimientos = {}
    if (idcuenta && tiempo && Rubro) {
      let Rubros = Rubro.replace(/_/g," ").split(",")
      console.log(Rubros)
      let moneda = ""
      let accountnumber = ""
      let diactual = new Date();
      let currentdate = diactual.getDate() + "/" + (diactual.getMonth() + 1) + "/" + diactual.getFullYear()
      diactual.setDate(diactual.getDate() - tiempo)
      let targetdate = diactual.getDate() + "/" + (diactual.getMonth() + 1) + "/" + diactual.getFullYear()
      Object.keys(req.session.cuentas["accounts"]).forEach(key => {
        if (key === idcuenta) {
          moneda = req.session.cuentas["accounts"][key]["currency"]
          accountnumber = req.session.cuentas["accounts"][key]["number"]
        }
      })
      request.get({
        "url": "https://banking.sandbox.prometeoapi.com/account/" + accountnumber + "/movement/",
        "json": true,
        "headers": {
          "X-API-Key": "51mxMHOk90UGuJCYHFYqu7PrZLdoCqfSxj9uTcGMfz67SwszdKofhVAaIhmd0ULB"
        },
        "qs": {
          "key": req.session.key,
          "currency": moneda,
          "date_start": targetdate,
          "date_end": currentdate
        }
      }, function (e, r, b) {
        Object.keys(b["movements"]).forEach(function (k) {

          if (Categorias['Hogar e Interiores'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Hogar e Interiores'
          } else if (Categorias['Medicina'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Medicina'
          } else if (Categorias['Compras Virtuales'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Compras Virtuales'
          } else if (Categorias['Comida'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Comida'
          } else if (Categorias['Turismo y cultura'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Turismo y cultura'
          } else if (Categorias['Vehiculos y transporte'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Vehiculos y transporte'
          } else if (Categorias['Ropa'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Ropa'
          } else if (Categorias['Mascotas'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Mascotas'
          } else if (Categorias['Empresas Reportadas Negativamente'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Empresas Reportadas Negativamente'
          } else if (Categorias['Software y Tecnologias'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Software y Tecnologias'
          } else if (Categorias['Economia y acciones'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Economia y acciones'
          } else if (Categorias['Retiros'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Retiros'
          } else if (Categorias['Entradas'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Entradas'
          } else if (Categorias['Donaciones'].some(v => b["movements"][k]["detail"].includes(v))) {
            b["movements"][k]["Categoria"] = 'Donaciones'
          } else {
            b["movements"][k]["Categoria"] = 'Otro'
          }
        })

        res.render(path.join(__dirname, '/movimientos.html'), { "cuentas": req.session.cuentas, "movimientos": b, "rubro": Rubros })
      });

    } else {

      res.render(path.join(__dirname, '/movimientos.html'), { "cuentas": req.session.cuentas, "movimientos": {} })
    }
  } else {
    res.redirect("/")
  }

})

app.get("/logout", (req, res) => {
  if (req.session.key) {
    request.get({
      "url": "https://banking.sandbox.prometeoapi.com/info/",
      "json": true,
      "headers": {
        "X-API-Key": "51mxMHOk90UGuJCYHFYqu7PrZLdoCqfSxj9uTcGMfz67SwszdKofhVAaIhmd0ULB"
      },
      "qs": {
        "key": req.session.key
      }
    });
    req.session.destroy()
  }
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})