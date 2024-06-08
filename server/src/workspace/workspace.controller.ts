import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateWorkspaceDto, WorkspaceIdDto } from './workspace.dto';
import { WorkspaceService } from './workspace.service';

@UseGuards(AuthGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
  @Get(':workspaceId')
  async getWorkspace(@Req() request, @Param() params: WorkspaceIdDto) {

    return this.workspaceService.getWorkspace({
      ...params,
      userId: request.user.sub,
    });
  }

  @Post('/create')
  async createWorkspace(@Req() request, @Body() body: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace({
      ...body,
      userId: request.user.sub,
    });
  }
}
