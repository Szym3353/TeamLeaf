import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class Profile {
  @Prop()
  displayName: string;

  @Prop()
  profilePictureUrl: string;

  @Prop()
  description: string;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema()
export class Session {
  @Prop()
  socketId: string;

  @Prop()
  status: 'online' | 'away' | 'offline';
}

const SessionSchema = SchemaFactory.createForClass(Session);

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: ProfileSchema })
  profile: Profile;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }] })
  workspaces: mongoose.Types.ObjectId[];

  @Prop({ type: SessionSchema })
  session: Session;

  static keys = ['username', 'email', 'profile', 'workspaces', 'session'];
}

export const UserSchema = SchemaFactory.createForClass(User);
