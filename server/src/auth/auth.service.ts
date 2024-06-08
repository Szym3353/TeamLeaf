import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/userSchema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { username, email, password, confirmPassword } = data;

    //Validate data
    if (password !== confirmPassword)
      throw new HttpException('Passwords does not match', HttpStatus.FORBIDDEN);
    let exists = await this.userModel.exists({ email });
    if (exists)
      throw new HttpException(
        'E-mail address already in use',
        HttpStatus.FORBIDDEN,
      );

    //Create new user
    let hashedPassword = await bcrypt.hash(password, 12);
    let newUserObject: User = {
      username,
      email,
      password: hashedPassword,
      profile: {
        displayName: username,
        description: '',
        profilePictureUrl: process.env.DEFAULT_AVATAR,
      },
      workspaces: [],
      session: {
        status: 'online',
        //Add with socketio implementation
        socketId: '',
      },
    };

    let newUser = await this.userModel.create(newUserObject);

    //Return token
    return {
      access_token: await this.jwtService.signAsync({ sub: newUser._id }),
    };
  }

  async login(data: LoginDto) {
    let { email, password } = data;

    //Find user
    let user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('Incorrect credentials', HttpStatus.FORBIDDEN);

    //Validate
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException('Incorrect credentials', HttpStatus.FORBIDDEN);

    //Return token
    return { access_token: await this.jwtService.signAsync({ sub: user._id }) };
  }
}
