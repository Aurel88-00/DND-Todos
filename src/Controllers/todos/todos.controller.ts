// src/todos/todos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Res,
  UseFilters,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from '../../Services/todos/todos.service';
import { ITodos } from 'src/lib/interfaces/todos.interface';
import { TodoDTO } from 'src/lib/dtos/todos.dto';
import { HttpExceptionFilter } from 'src/Filters/HTTPExceptions';
import { RolesAllowed } from 'src/Decorators/roles.decorator';
import { Roles } from 'src/lib/enums/roles.enum';
import { RolesGuard } from 'src/Guards/roles.guard';

@Controller('api')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('/todos')
  @UseFilters(HttpExceptionFilter)
  async findAll(@Res() response): Promise<ITodos[]> {
    try {
      const todos = await this.todosService.findAll();
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Success', data: todos });
    } catch (error) {
      throw new HttpException(error, error?.status ?? HttpStatus.NOT_FOUND);
    }
  }

  @Get('/todos/:id')
  @UseFilters(HttpExceptionFilter)
  async findOne(
    @Res() response,
    @Param('id') id: number,
  ): Promise<ITodos | undefined> {
    try {
      const todo = await this.todosService.findOne(id);
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Success', data: todo });
    } catch (error) {
      throw new HttpException(error, error?.status ?? HttpStatus.NOT_FOUND);
    }
  }

  @Post('/todo')
  @UseFilters(HttpExceptionFilter)
  async create(@Res() response, @Body() todo: TodoDTO): Promise<ITodos> {
    try {
      const newTodo = await this.todosService.create(todo);
      return response
        .status(HttpStatus.CREATED)
        .json({ message: 'Success', data: newTodo });
    } catch (error) {
      throw new HttpException(error, error?.status ?? HttpStatus.NOT_FOUND);
    }
  }

  @Post('/todos')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(RolesGuard)
  @RolesAllowed(Roles.ADMIN)
  async createMany(
    @Res() response,
    @Body() todos: TodoDTO[],
  ): Promise<ITodos[]> {
    try {
      const newTodos = await this.todosService.createMany(todos);
      return response
        .status(HttpStatus.CREATED)
        .json({ messag: 'Success', data: newTodos });
    } catch (error) {
      throw new HttpException(error, error?.status ?? HttpStatus.NOT_FOUND);
    }
  }

  @Put('/todos/:id')
  @UseFilters(HttpExceptionFilter)
  async update(
    @Param('id') id: number,
    @Body() updates: Partial<ITodos> | TodoDTO,
  ): Promise<ITodos | undefined> {
    try {
      return await this.todosService.update(id, updates);
    } catch (error) {
      throw new HttpException(error, error?.status ?? HttpStatus.NOT_FOUND);
    }
  }

  @Delete('/todos/:id')
  @UseFilters(HttpExceptionFilter)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this.todosService.delete(id);
    } catch (error) {
      throw new HttpException(error, error?.status ?? HttpStatus.NOT_FOUND);
    }
  }
}
