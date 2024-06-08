import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/userSchema';
import { ChangePasswordDto, UpdateSettingsDto, UserIdDto } from './user.dto';
import errorMessages from 'src/error.messages';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUser(params: UserIdDto) {
    let user = await this.userModel
      .findById(params.userId)
      .populate('workspaces')
      .lean()
      .exec();
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    let { username, email, profile, session } = user;
    const workspacesInfo = user.workspaces.map((workspace: any) => ({
      name: workspace.name,
      pictureUrl: workspace.pictureUrl,
    }));

    return {
      username,
      email,
      profile,
      session,
      workspacesList: workspacesInfo,
    };
  }

  async changePassword(body: ChangePasswordDto & UserIdDto) {
    let { userId, currentPassword, confirmNewPassword, newPassword } = body;

    //Validate input
    let user = await this.userModel.findById(userId);
    if (!user)
      throw new HttpException(errorMessages.userNotFound, HttpStatus.NOT_FOUND);

    if (newPassword !== confirmNewPassword)
      throw new HttpException(
        errorMessages.passwordChangeDifferent,
        HttpStatus.FORBIDDEN,
      );

    let isMatchCurrent = await bcrypt.compare(user.password, currentPassword);
    if (!isMatchCurrent)
      throw new HttpException(
        errorMessages.passwordChangeIncorrectCurrent,
        HttpStatus.FORBIDDEN,
      );

    let hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Success' };
  }

  async editSetting(body: UpdateSettingsDto & UserIdDto) {
    let { userId, key, newValue } = body;

    //Validate input
    let user = await this.userModel.findById(userId);
    if (!user)
      throw new HttpException(errorMessages.userNotFound, HttpStatus.NOT_FOUND);

    if (!User.keys.includes(key)) {
      throw new HttpException('Invalid key provided', HttpStatus.BAD_REQUEST);
    }

    (user as any)[key] = newValue;
    await user.save();

    return user;
  }
}
