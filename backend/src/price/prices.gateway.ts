import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { transports } from 'engine.io-client';

@WebSocketGateway(
    {
        cors: true,
        origin: '*', methods: ['GET', 'POST'],
        transports: ['websocket']

    }


)
export class PricesGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    afterInit() {
        console.log('WebSocket server initialized');
    }

    sendPriceUpdate(symbol: string, price: number) {
        this.server.emit('priceUpdate', { symbol, price });
    }
}