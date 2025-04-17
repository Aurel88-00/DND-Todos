import { IsNumber, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class TodoDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  description?: string;
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;
  @IsNumber()
  order: number;
}
