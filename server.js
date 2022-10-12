require('dotenv').config() // esto nos permite acceder a las variables en el .env
const express = require('express')
const app = express()
const port = process.env.PORT

// sección de middlewares => ejecuciones en todas las llamadas, antes de las rutas
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views/")
const hbs = require("hbs")
hbs.registerPartials(__dirname + "/views/partials")

// data a utilizar
const allLessons = require("./data/somedata.js") // local
const DogApi = require('doggo-api-wrapper'); // de API
const myDog = new DogApi();

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

  // let approvedLesson = []
  // for (let i = 0; i < allLessons.length; i++) {
  //   if (allLessons[i].approved === true) {
  //     approvedLesson.push(allLessons[i])
  //   }
  // }

  // * con filter
  // let approvedLesson = allLessons.filter((eachLesson) => {
  //   return eachLesson.approved === true
  // })

  res.render("approved-lessons.hbs", {
    // approvedLesson: approvedLesson
    allLessons: allLessons
  })

})

// ruta que muestre las lecciones por bootcamp
app.get("/lessons/:bootcamp", (req, res) => {
  console.log(req.params.bootcamp)
  let { bootcamp } = req.params // destructurando la propiedad bootcamp de el obj req.params

  let bootcampArr = allLessons.filter((eachLesson) => {
    return eachLesson.bootcamp === bootcamp
  })
  console.log(bootcampArr)

  let dataToSend = {
    bootcampName: bootcamp,
    bootcampArr: bootcampArr
  }

  // if (bootcamp === "web") {
    res.render("lessons-bootcamp.hbs", dataToSend)
  // } 

})


// RUTAS DE PERRITOS
// ruta para ver imagen de un perrito aleatorio
app.get("/dog", (req, res) => {

  myDog.getARandomDog() // esta API está en Finlandia
  .then(data => {
    console.log(data)
    res.render("random-dog.hbs", {
      dogImage: data.message
    })
  })
  .catch(err => console.error(err))

})

// ruta para listar las razas de perritos
app.get("/list", (req, res) => {

  myDog.getListOfAllBreeds()
  .then((response) => {
    console.log(response)
    // [
    //   "affenpinscher",
    //   "african",
    //   "airedale"
    // ]
    let breedsArr = Object.keys(response.message)
    console.log(breedsArr)
    res.render("breeds.hbs", {
      breedsArr: breedsArr
    })
  })
  .catch((error) => {
    console.log(error)
  })

})

app.get("/dogs-by-breed/:breed", (req, res) => {

  const { breed } = req.params // lo mismo que usar req.params.breed
  console.log(breed)

  myDog.getAllDogsByBreed(breed)
  .then((response) => {
    console.log(response)
    res.render("all-dogs.hbs", {
      dogList: response.message
    })
  })
  .catch((error) => {
    console.log(error)
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})