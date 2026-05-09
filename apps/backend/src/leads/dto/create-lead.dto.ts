import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LeadSource, LeadStatus, Priority } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsString()
  company: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(LeadSource)
  source: LeadSource;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dealValue?: number;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}