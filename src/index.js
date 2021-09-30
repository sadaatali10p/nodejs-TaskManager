const express = require('express')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')
const AuthRouter = require('./routers/auth')

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
app.use(AuthRouter)

app.listen(port, () => {
    console.log('server is up on port ' + port)
})
