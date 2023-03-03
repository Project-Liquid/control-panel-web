import {useState} from 'react';

export class MessageProcessor {
  constructor(setters, fallback) {
    this.setters = setters;
    this.fallback = fallback;
  }
  getSortCode(message) {
    return message.slice(0, 3);
  }
  getMessageBody(message) {
    return message.slice(3);
  }
  processMessage(message) {
    const setter = this.setters[this.getSortCode(message)];
    if (setter) {
      setter(this.getMessageBody(message));
      return true;
    } else {
      this.fallback(message);
      return false;
    }
  }
}

export function useProcessor(setters, fallback=() => {}) {
  return useState(() => {
    const processor = new MessageProcessor(setters, fallback);
    return (message) => processor.processMessage(message);
  })[0];
}