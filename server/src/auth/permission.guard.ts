import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PermissionList } from './permission.list';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from 'src/models/workspaceSchema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<Workspace>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('perm guard start');
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.headers['workspaceId'];
    const userId = request.user.sub;
    const path = request.route.path;

    //Get permission from list
    let permissionListEntry = PermissionList.find(
      (entry) => entry.path === path,
    );

    //If undefined => endpoint does not require special permission
    if (!permissionListEntry) {
      return true;
    }

    //Find project and check if user has required permission
    if (!workspaceId) return false;

    let project = await this.workspaceModel.findById(workspaceId);
    if (!project) return false;

    let userAsProjectMember = project.members.find(
      (member) => member.memberId === userId,
    );
    if (!userAsProjectMember) return false;

    let role = project.roles.find(
      (role) => role.roleId === userAsProjectMember.roleId,
    );
    if (!role) return false;

    if (role.permissions.includes(permissionListEntry.permission)) {
      console.log('perm guard end');
      return true;
    } else {
      return false;
    }
  }
}
