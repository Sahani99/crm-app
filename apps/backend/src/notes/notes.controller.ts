import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('leads/:leadId/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  create(
    @Param('leadId') leadId: string,
    @Body('content') content: string,
    @CurrentUser() user: any,
  ) {
    return this.notesService.create(leadId, content, user.id);
  }

  @Get()
  findAll(@Param('leadId') leadId: string) {
    return this.notesService.findAll(leadId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}