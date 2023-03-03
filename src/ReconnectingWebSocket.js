import {useEffect, useState} from 'react';

export class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.id = btoa(Math.random()).slice(5);
    this.connect();
  }
  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.onopen();
      console.log(`Connected websocket (${this.id})...`);
    }
    this.ws.onmessage = ev => this.onmessage(ev);
    this.ws.onclose = () => {
      console.log(`Lost connection to ${this.id}. Attempting to reconnect...`)
      this.onclose();
      setTimeout(() => {
        this.connect();
      }, 1000);
    }
    this.ws.onerror = () => {
      this.onerror();
      this.ws.close();
    }
  }
  close() {
    this.ws.close();
  }
  closePermanently() {
    // Remove the reconnect timeout
    this.ws.onclose = () => {};
    this.ws.close();
    this.onclose();
    console.log(`Permanently closed ${this.id}`)
  }
  send(data) {
    this.ws.send(data);
  }
  onopen() { }
  onclose() { }
  onmessage() { }
  onerror() { }
}

export function useWS(url, handler) {
  const [ws, setWs] = useState(null);
  const [wsIsOpen, setWsIsOpen] = useState(false);
  
  useEffect(() => {
    console.log("Subscribing websocket...");
    let newWs = new ReconnectingWebSocket(url);
    newWs.onmessage = (ev) => ev.data? handler(ev.data) : null;
    //newWs.onmessage = ev => {
    //  return ev.data? handler(ev.data) : null;
    //}
    newWs.onopen = () => setWsIsOpen(true);
    newWs.onclose = () => setWsIsOpen(false);
    setWs(newWs);
    return () => newWs.closePermanently();
  }, [url, handler]);
  
  return [ws, wsIsOpen]
}