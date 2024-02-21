import { IsString, IsUUID } from 'class-validator';

export class CreateTodoDto {
  @IsUUID()
  listId!: string;

  @IsString()
  title!: string;
}
