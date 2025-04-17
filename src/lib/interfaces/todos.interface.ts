import { Document } from 'mongoose';

export interface ITodos extends Document {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly order: number;
}
