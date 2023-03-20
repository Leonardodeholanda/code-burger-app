const express = require('express')
const { v4 } = require('uuid')
const cors = require('cors')

const port = 3001
const app = express()
app.use(express.json())
app.use(cors())

const ordered = []

// MIDDLEWARE 
const checkOrderId = ( request, response, next ) => {
    const { id } = request.params

    const index = ordered.findIndex( order => order.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

// LISTAR PEDIDOS
app.get('/order', (request, response) => {

    
    return response.json(ordered)
})

// RECEBER PEDIDOS
app.post('/order', (request, response) => {
    const { order, clientName, price, status } = request.body

    const newOrder = { id: v4(), order, clientName, price, status }

    ordered.push(newOrder)

    return response.status(201).json(newOrder)
})

// ALTERAR PEDIDOS
app.put('/order/:id', checkOrderId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order, clientName, price, status }

    ordered[index] = updateOrder

    return response.json(updateOrder)
})

// DELETAR PEDIDOS
app.delete("/order/:id", checkOrderId, (request, response) => {
    const index = request.orderIndex    

    ordered.splice(index, 1)


    return response.status(204).json()
})

// RETORNAR PEDIDOS
app.get('/order/:id', (request, response) => {
    const { id } = request.params
    const { order, clientName, price, status } = request.body

    const yourOrder = { id, order, clientName, price, status }

    return response.json(yourOrder)
})

// STATUS PEDIDOS
app.patch('/order/:id', checkOrderId, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateStatus = { id, order, clientName, price, status: "Pronto" }

    ordered[index] = updateStatus
    
    return response.json(updateStatus)

})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
