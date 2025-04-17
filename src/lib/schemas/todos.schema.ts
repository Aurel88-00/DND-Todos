import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Todos {
  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const TodosSchema = SchemaFactory.createForClass(Todos);
