import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type WorkspaceDocument = HydratedDocument<Workspace>;

@Schema()
class Member {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  memberId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  roleId: mongoose.Schema.Types.ObjectId;

  @Prop()
  isOwner: boolean;

  @Prop([mongoose.Schema.Types.ObjectId])
  teams: mongoose.Schema.Types.ObjectId[];
}

const MemberSchema = SchemaFactory.createForClass(Member);

@Schema()
class Team {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  teamId: mongoose.Schema.Types.ObjectId;

  @Prop()
  teamName: string;

  @Prop()
  teamColor: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  teamLeader: mongoose.Schema.Types.ObjectId;
}

const TeamSchema = SchemaFactory.createForClass(Team);

@Schema()
class Role {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  roleId: mongoose.Schema.Types.ObjectId;

  @Prop()
  roleName: string;

  @Prop([String])
  permissions: string[];
}

const RoleSchema = SchemaFactory.createForClass(Role);

@Schema()
class Comment {
  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  commentId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: mongoose.Schema.Types.ObjectId;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema()
class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  postId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  date: Date;

  @Prop([CommentSchema])
  comments: Comment[];
}

const PostSchema = SchemaFactory.createForClass(Post);

@Schema()
export class Workspace {
  @Prop()
  name: string;

  @Prop()
  pictureUrl: string;

  @Prop()
  code: string;

  @Prop([MemberSchema])
  members: Member[];

  @Prop([TeamSchema])
  teams: Team[];

  @Prop([RoleSchema])
  roles: Role[];

  @Prop([PostSchema])
  posts: Post[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
