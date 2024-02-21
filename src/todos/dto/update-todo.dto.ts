import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  isImportant?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;
}
