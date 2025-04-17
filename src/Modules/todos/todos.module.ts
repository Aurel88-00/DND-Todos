// src/todos/todos.module.ts
import { Module } from '@nestjs/common';
import { TodosService } from '../../Services/todos/todos.service';
import { TodosController } from '../../Controllers/todos/todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosSchema } from 'src/lib/schemas/todos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Todos', schema: TodosSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
