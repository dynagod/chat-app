// require('dotenv').config({path: './env'});
import dotenv from 'dotenv';
import connectDb from "./db/index.js";
import { server } from './utils/socket.js';

dotenv.config({path: './env'});

connectDb()
.then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log(`MONGODB connection failed !!! ERROR: ${error}`);
});