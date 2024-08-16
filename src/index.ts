import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 } from "uuid";
import { foodMenu, foodMenuStep, mainMenuStep } from "./data";

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {})

io.on("connection", (socket) => {
    socket.data['step'] = mainMenuStep
    socket.data['current_order'] = []
    socket.data['order_history'] = []

    io.to(socket.id).emit("response", {
        "response": showMainMenu()})

    socket.on("request", (v) => {
        let step = socket.data['step'];
        let currentOrders = socket.data['current_order'] ?? [];
        let orderHistory = socket.data['order_history'] ?? [];


        if (v == 1) {
            io.to(socket.id).emit("response", {
                "response": showFoodMenu()
            })
            socket.data['step'] = foodMenuStep;
        } else

        // client want to checkout order
        if (v == 99) {
            if(currentOrders.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You have not added anything to cart, send 1 to show our food menu."
                })
                return;
            }
            const total = currentOrders.reduce((a: any, b: any) => a + b.price, 0)
            const order = {
                "amount": total,
                "food_items": currentOrders
            }
            orderHistory.push(order);
            orderHistory = orderHistory
            currentOrders = [];
            socket.data['current_orders'] = currentOrders;
        } else

        // client want to see order history
        if (v == 98) {
            if(currentOrders.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You have not added anything to cart, send 1 to show our food menu."
                })
                return;
            }
            const total = currentOrders.reduce((a: any, b: any) => a + b.price, 0)
            reply(socket.id, `Your order total amount is N${total}`)
        } else

        // client want to see current order 97
        if (v == 97) {
            if(orderHistory.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You do not have any order history with us."
                })
                return;
            }
            const total = currentOrders.reduce((a: any, b: any) => a + b.price, 0)
            reply(socket.id, `Your order total amount is N${total}`)
        } else

        // client want to cancel order
        if (v == 0) {
            if (currentOrders.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You have not added any item to cart."
                })
            }
            currentOrders = [];
            socket.data['current_order'] = currentOrders;
            socket.data['step'] = mainMenuStep;
            io.to(socket.id).emit("response", {
                "response": showMainMenu()
            })
        } else {
            if (step == foodMenuStep) {
                const itemAvailable = foodMenu.find((foodMenu) => foodMenu.code == v)
                console.log("Available Item ::: ", itemAvailable)
                if (itemAvailable) {
                    // add item to current cart
                    currentOrders.push(itemAvailable);
                    socket.data['current_order'] = currentOrders;
                    reply(socket.id, `${itemAvailable.name} have been added to your cart.`)
                }
            } else {
                reply(socket.id, "Invalid option")
            }
        }
    })
})

io.engine.generateId = (req) => {
    return v4()
}

function showFoodMenu() {
    return `<h2>Here is our food menu list</h2>
    <ul>
        ${foodMenu.map((v) => `<li><p>Name: ${v.name}</p> <p>Price: N${v.price}</p> <p>For ${v.name} select ${v.code}</p>`).join("")}
    </ul>`
}
function showMainMenu() {
    return `<ul>
        <li>Select 1 to Place an order</li>
        <li>Select 99 to checkout order</li>
        <li>Select 98 to see order history</li>
        <li>Select 97 to see current order</li>
        <li>Select 0 to cancel order</li>
    </ul>
    `
}

function reply(socketId: string, message: string) {
    io.to(socketId).emit("response", {
        "response": message
    })
}
app.use(express.static("src/public"))


httpServer.listen(4000, () => console.log(`Server started on PORT 4000`))