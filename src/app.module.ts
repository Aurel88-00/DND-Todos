import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './Modules/todos/todos.module';
import { AuthModule } from './Modules/auth/auth.module';
import { AttachAccessTokenMiddleware } from './Middlewares/access-token.middleware';
import { TodosController } from './Controllers/todos/todos.controller';

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING as string;

@Module({
  imports: [
    MongooseModule.forRoot(mongoConnectionString),
    AuthModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAccessTokenMiddleware).forRoutes(TodosController);
  }
}
