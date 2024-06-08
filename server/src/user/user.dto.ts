import { IsIn, IsNotEmpty, IsString, NotEquals } from 'class-validator';
import mongoose from 'mongoose';
import { IsObjectId } from 'src/IsValidObjectId';
import { Profile, Session, User } from 'src/models/userSchema';

export class UserIdDto {
  @IsObjectId()
  userId: string;
}

export class UpdateSettingsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(User.keys)
  key: keyof User;

  @IsNotEmpty()
  newValue: string | Profile | mongoose.Types.ObjectId[] | Session;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @NotEquals('currentPassword', {
    message: 'New password must be different from the old one.',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;

  @IsNotEmpty()
  @IsString()
  currentPassword: string;
}
