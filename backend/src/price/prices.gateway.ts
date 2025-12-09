import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { transports } from 'engine.io-client';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: "*" } })
export class PricesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected', client.id);
  }

  sendPriceUpdate(symbol: string, price: number) {
    console.log('Gateway emitting price', { symbol, price });
    this.server.emit('price', { symbol, price });
  }
}
