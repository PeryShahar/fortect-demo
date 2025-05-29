export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface SendMessagePayload {
  text: string;
}
