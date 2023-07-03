import { Injectable } from '@angular/core';
import { local } from 'd3';
import { Socket, io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService{
  socket: Socket
  API_URI = 'http://localhost:3000'

  constructor() {
    this.socket = io(this.API_URI)
    const email = localStorage.getItem('email')
    // this.socket.emit('client:joinRoom', email)
    // super({
    //   url: API_URI
    // })
    // this.ioSocket.emit('connect', ()=>{
    //   console.log('in')
    // })
    // this.socket.on('connect', () => {
    //   console.log('hi')
    // })
  }
  // connect(){
  //   this.socket = io(this.API_URI)
  // }
  // message(){
  //   this.socket?.on('server:message', (data)=>{
  //     console.log(data);
  //   })
  // }

}
