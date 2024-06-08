import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Workspace } from 'src/models/workspaceSchema';
import { CreateWorkspaceDto, GetWorkspaceDto } from './workspace.dto';
import { UserIdDto } from 'src/user/user.dto';
import { User } from 'src/models/userSchema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<Workspace>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createWorkspace(body: CreateWorkspaceDto & UserIdDto) {
    let roleId = new mongoose.Types.ObjectId();
    let newWorkspaceObject = {
      name: body.workspaceName,
      pictureUrl:
        body.pictureUrl ||
        'https://www.creativefabrica.com/wp-content/uploads/2021/06/22/Management-Team-Line-Icon-Graphics-13702405-1.jpg',
      roles: [
        {
          roleName: 'owner',
          roleId: roleId,
          permissions: ['*'],
        },
      ],
      members: [
        {
          memberId: body.userId,
          roleId: roleId,
          isOwner: true,
          teams: [],
        },
      ],
      code: '12345678',
    };

    let newWorkspace = await this.workspaceModel.create(newWorkspaceObject);

    await newWorkspace.save();

    await this.userModel.findByIdAndUpdate(body.userId, {
      $push: { workspaces: newWorkspace._id },
    });

    return { workspaceId: newWorkspace._id };
  }

  async getWorkspace(body: GetWorkspaceDto) {
    let workspace = await this.workspaceModel.findById(body.workspaceId);
    if (!workspace)
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);

    return { workspace };
  }
}
