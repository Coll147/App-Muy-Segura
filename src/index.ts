import express, { Application, Request, Response} from "express"
import Database from "better-sqlite3"
import bcrypt from "bcrypt"

const app: Application = express()
const port: number = 3000

// instalar motor de vistas 
app.set('view engine', 'ejs')
// definir carpeta
app.set('views', './src/views')


// configurar bbdd bettersqlite
const db = new Database("database.db")

// configruar poder leer info de formularios
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// endpoint raiz
app.get('/', (req: Request, res: Response) => {
  res.render('index', { info: 'Indeeeeex' })
})

// endpoint login
app.get('/login', (req: Request, res: Response) => {
  res.render('login', { info: 'Login Page' })
})

  app.post('/login', (req: Request, res: Response) => {
    // logica del login (nothing)
    const { username, password } = req.body
    console.log(username, password)

    // consultamos el usuario en la base de datos
    const selectUser = db.prepare('SELECT * FROM users WHERE username = ?')
    const user = selectUser.get(username) as { id: number; username: string; password: string } | undefined

    if (!user) {
      console.log("Usuario no encontrado")
      return res.send("Usuario no correcto")
    }
    console.log("Usuario encontrado: ", user)

    // Comparamos con la contraseña hasheada
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      console.log("Contraseña incorrecta")
      return res.send("Contraseña incorrecta")
    }
    console.log("Todo bonito todo hermoso ya loguiaste")
    
      // deberíamos añadir una cookie
    
    // si todo va bien a redirigir y tal
    res.send("Login exitoso. Bienvenido " + username)
  })

// endpoint registro
app.get('/register', (req: Request, res: Response) => {
  res.render('register', { info: 'Register Page' })
})

  app.post('/register', (req: Request, res: Response) => {
    const {username, password, passwordConfirm} = req.body
    console.log(username, password, passwordConfirm)
    
    // Validar si la contraseña coincie
    if (password !== passwordConfirm) {
      return res.send('Las contraseñas no coinciden')
    }

    // Si el usuario no estar indexarle en la db
    const selectUser = db.prepare('SELECT * FROM users WHERE username = ?')
    const user = selectUser.get(username)
    if (user) {
      console.log("El user ya existe :V")
      return res.send('El usuario ya existe')
    }
    console.log("El user no existe, momento de meterlo en la DB")
    
    // Hashear la contraseña y tal (POR FIN ALGO DE SEGURO EN LA APPPP SEGURA)
    const saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds)

    // Insertar usuario
    const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
    insertUser.run(username, hashedPassword)
    console.log("Completado, redirigiendo")

    // Redirigir
    res.redirect('/')
  })

// endpoint protegido para users logueados
app.get('/protected', (req: Request, res: Response) => {
    res.send('solo los usuarios logeados pueden ver esto')
})

// endpoint libros
app.get('/libros', (req: Request, res: Response) => {
  // habria que sacarlo de una base de datos
  const libros = [
    { name: 'Mi libro', autor: 'Yo mismo' },
    { name: 'Otro libro', autor: 'Otro autor' },
    { name: 'Libro interesante', autor: 'Autor famoso' },
    { name: 'Libro de aventuras', autor: 'Aventurero' }
  ]
  res.render('libros', { libros })
})

// Funcion para inicializar la base de datos
function initDB() {
  // Crea la tabla de usuarios si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `

db.exec(createTableQuery)
}

// Crear tablas
initDB()




// endpoint cat
app.get('/cat', (req: Request, res: Response) => {
    res.send('<h1>Gato.</h1> <img style="height: 500px" src="https://preview.redd.it/get-server-rack-to-stop-cat-messing-with-my-computers-cat-v0-9sjf2dtnbvxd1.jpeg?width=1080&crop=smart&auto=webp&s=730a503c84234fa69ea82fd144a9b90231726ee9">')
})

// iniciar el servidor
app.listen(port, () => {
  console.log(`Link for app http://localhost:${port}`)
})