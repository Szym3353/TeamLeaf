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
import { ChangePasswordDto, UpdateSettingsDto, UserIdDto } from './user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param() params: UserIdDto) {
    console.log('tutaj');
    return this.userService.getUser(params);
  }

  @Post('/password')
  changePassword(@Req() request, @Body() body: ChangePasswordDto) {
    return this.userService.changePassword({
      ...body,
      userId: request.user.sub,
    });
  }

  @Post('/update')
  editSettings(@Req() request, @Body() body: UpdateSettingsDto) {
    return this.userService.editSetting({
      ...body,
      userId: request.user.sub,
    });
  }
}
