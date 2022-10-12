require('dotenv').config() // esto nos permite acceder a las variables en el .env
const express = require('express')
const app = express()
const port = process.env.PORT

// sección de middlewares => ejecuciones en todas las llamadas, antes de las rutas
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views/")

// data a utilizar
const allLessons = require("./data/somedata.js")

app.get('/', (req, res) => {
  console.log(process.env.SECRET_WORD)
  // res.send('Hello World!')
  // no usamos sendFile con plantillas
  res.render("home.hbs", {
    teacherName: "Patata",
    ta1: "Carolina",
    ta2: "Iñigo"
  })
  // internamente, el render coje el layout y el archivo indicado, y crea un HTML para enviar
})

app.get("/lessons", (req, res) => {
  console.log(allLessons)
  res.render("all-lessons.hbs", {
    allLessons: allLessons // podriamos escribirlo como un solo allLessons (mismo nombre de propiedad y variable de donde viene el valor)
  })
})

// "/random-lesson"
app.get("/random-lesson", (req, res) => {
  let randomPos = Math.floor( Math.random() * allLessons.length )
  let randomLesson = allLessons[randomPos]

  res.render("random-lesson.hbs", {
    randomLesson: randomLesson
  })
})

// ruta que muestre solo las lecciones aprobadas
app.get("/lessons-approved", (req, res) => {

  let approvedLesson = []
  for (let i = 0; i < allLessons.length; i++) {
    if (allLessons[i].approved === true) {
      approvedLesson.push(allLessons[i])
    }
  }

  res.render("approved-lessons.hbs", {
    approvedLesson: approvedLesson
  })

})

// ruta que muestre las lecciones por bootcamp

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})