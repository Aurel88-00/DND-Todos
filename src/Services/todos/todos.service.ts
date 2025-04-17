// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITodos } from 'src/lib/interfaces/todos.interface';
import { TodoDTO } from 'src/lib/dtos/todos.dto';

@Injectable()
export class TodosService {
  constructor(@InjectModel('Todos') private todosModel: Model<ITodos>) {}

  async findAll(): Promise<ITodos[]> {
    try {
      const todos = await this.todosModel.find().exec();
      return todos;
    } catch (error: any) {
      throw new NotFoundException(
        error?.message ? error?.message : 'No items found',
      );
    }
  }

  async findOne(id: number): Promise<ITodos> {
    try {
      const todo = await this.todosModel.findById(id).exec();
      return todo;
    } catch (error) {
      throw new NotFoundException(
        error?.message ? error?.message : `Todo with ID ${id} not found`,
      );
    }
  }

  async create(todo: TodoDTO): Promise<ITodos> {
    try {
      const newTodo = new this.todosModel({
        ...todo,
        order: (await this.todosModel.countDocuments()) + 1,
      });
      return newTodo.save();
    } catch (error) {
      throw new NotFoundException(
        error?.message ? error?.message : 'No items found',
      );
    }
  }

  async createMany(todos: TodoDTO[]): Promise<ITodos[]> {
    try {
      const newTodos = await this.todosModel.insertMany(todos);
      return newTodos as ITodos[];
    } catch (error) {
      throw new NotFoundException(
        error?.message ? error?.message : `No items found`,
      );
    }
  }
  async update(
    id: number,
    updates: Partial<ITodos> | TodoDTO,
  ): Promise<ITodos | null> {
    try {
      const updatedTodo = await this.todosModel
        .findByIdAndUpdate(id, updates, { new: true })
        .exec();
      return updatedTodo;
    } catch (error) {
      throw new NotFoundException(
        error?.message ? error?.message : `Todo with ID ${id} not found`,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.todosModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new NotFoundException(
        error?.message ? error?.message : `Todo with ID ${id} not found`,
      );
    }
  }
}
