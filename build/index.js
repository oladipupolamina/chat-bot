"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const data_1 = require("./data");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {});
io.on("connection", (socket) => {
    socket.data['step'] = data_1.mainMenuStep;
    socket.data['current_order'] = [];
    socket.data['order_history'] = [];
    io.to(socket.id).emit("response", {
        "response": showMainMenu()
    });
    socket.on("request", (v) => {
        var _a, _b;
        let step = socket.data['step'];
        let currentOrders = (_a = socket.data['current_order']) !== null && _a !== void 0 ? _a : [];
        let orderHistory = (_b = socket.data['order_history']) !== null && _b !== void 0 ? _b : [];
        if (v == 1) {
            io.to(socket.id).emit("response", {
                "response": showFoodMenu()
            });
            socket.data['step'] = data_1.foodMenuStep;
        }
        else 
        // client want to checkout order
        if (v == 99) {
            if (currentOrders.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You have not added anything to cart, send 1 to show our food menu."
                });
                return;
            }
            const total = currentOrders.reduce((a, b) => a + b.price, 0);
            const order = {
                "amount": total,
                "food_items": currentOrders
            };
            orderHistory.push(order);
            orderHistory = orderHistory;
            currentOrders = [];
            socket.data['current_orders'] = currentOrders;
        }
        else 
        // client want to see order history
        if (v == 98) {
            if (currentOrders.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You have not added anything to cart, send 1 to show our food menu."
                });
                return;
            }
            const total = currentOrders.reduce((a, b) => a + b.price, 0);
            reply(socket.id, `Your order total amount is N${total}`);
        }
        else 
        // client want to see current order 97
        if (v == 97) {
            if (orderHistory.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You do not have any order history with us."
                });
                return;
            }
            const total = currentOrders.reduce((a, b) => a + b.price, 0);
            reply(socket.id, `Your order total amount is N${total}`);
        }
        else 
        // client want to cancel order
        if (v == 0) {
            if (currentOrders.length == 0) {
                io.to(socket.id).emit("response", {
                    "response": "You have not added any item to cart."
                });
            }
            currentOrders = [];
            socket.data['current_order'] = currentOrders;
            socket.data['step'] = data_1.mainMenuStep;
            io.to(socket.id).emit("response", {
                "response": showMainMenu()
            });
        }
        else {
            if (step == data_1.foodMenuStep) {
                const itemAvailable = data_1.foodMenu.find((foodMenu) => foodMenu.code == v);
                console.log("Available Item ::: ", itemAvailable);
                if (itemAvailable) {
                    // add item to current cart
                    currentOrders.push(itemAvailable);
                    socket.data['current_order'] = currentOrders;
                    reply(socket.id, `${itemAvailable.name} have been added to your cart.`);
                }
            }
            else {
                reply(socket.id, "Invalid option");
            }
        }
    });
});
io.engine.generateId = (req) => {
    return (0, uuid_1.v4)();
};
function showFoodMenu() {
    return `<h2>Here is our food menu list</h2>
    <ul>
        ${data_1.foodMenu.map((v) => `<li><p>Name: ${v.name}</p> <p>Price: N${v.price}</p> <p>For ${v.name} select ${v.code}</p>`).join("")}
    </ul>`;
}
function showMainMenu() {
    return `<ul>
        <li>Select 1 to Place an order</li>
        <li>Select 99 to checkout order</li>
        <li>Select 98 to see order history</li>
        <li>Select 97 to see current order</li>
        <li>Select 0 to cancel order</li>
    </ul>
    `;
}
function reply(socketId, message) {
    io.to(socketId).emit("response", {
        "response": message
    });
}
app.use(express_1.default.static("src/public"));
httpServer.listen(4000, () => console.log(`Server started on PORT 4000`));
