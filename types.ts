export interface Particle {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export interface MessageRequest {
  recipient: string;
  tone: string;
}