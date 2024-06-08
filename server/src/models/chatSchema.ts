import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  authorId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  content: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class Chat {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  participants: mongoose.Schema.Types.ObjectId[];

  @Prop([MessageSchema])
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
