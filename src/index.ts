import express, { Application, Request, Response} from "express"

const app: Application = express()
const port: number = 3000

// instalar motor de vistas 
app.set('view engine', 'ejs')
// definir carpeta
app.set('views', './src/views')

// endpoint raiz
app.get('/', (req: Request, res: Response) => {
  res.render('index', { info: 'Indeeeeex' })
})

// endpoint raiz
app.get('/login', (req: Request, res: Response) => {
  res.render('login', { info: 'Login Page' })
})

  app.post('/login', (req: Request, res: Response) => {
    // logica del login (nothing)
    res.send('Intento de login pero esto no hace una mierda')
  })

// endpoint registro
app.get('/register', (req: Request, res: Response) => {
  res.render('register', { info: 'Register Page' })
})

  app.post('/register', (req: Request, res: Response) => {
    // logica del register (nothing)
    res.send('Intento de register. Pero sigue sin haber nada')
  })

// endpoint cat
app.get('/cat', (req: Request, res: Response) => {
    res.send('<h1>Gato.</h1> <img style="height: 500px" src="https://preview.redd.it/get-server-rack-to-stop-cat-messing-with-my-computers-cat-v0-9sjf2dtnbvxd1.jpeg?width=1080&crop=smart&auto=webp&s=730a503c84234fa69ea82fd144a9b90231726ee9">')
})

// iniciar el servidor
app.listen(port, () => {
  console.log(`Link for app http://localhost:${port}`)
})