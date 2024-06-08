import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from 'src/models/workspaceSchema';
import { User, UserSchema } from 'src/models/userSchema';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class WorkspaceModule {}
