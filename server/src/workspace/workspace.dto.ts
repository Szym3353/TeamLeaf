import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from 'src/IsValidObjectId';
import { UserIdDto } from 'src/user/user.dto';

export class WorkspaceIdDto {
  @IsObjectId()
  workspaceId: string;
}

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  workspaceName: string;

  @IsString()
  @IsOptional()
  pictureUrl?: string;
}

export class GetWorkspaceDto implements WorkspaceIdDto, UserIdDto {
  /* @IsObjectId() */
  workspaceId: string;
  /* @IsObjectId() */
  userId: string;
}
