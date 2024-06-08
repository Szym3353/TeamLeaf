import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
class Subtask {
  @Prop()
  isDone: boolean;

  @Prop()
  title: string;
}

const SubtaskSchema = SchemaFactory.createForClass(Subtask);

@Schema()
export class Task {
  @Prop()
  title: string;

  @Prop()
  deadline: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  assignedToUsers: mongoose.Schema.Types.ObjectId[];

  @Prop([mongoose.Schema.Types.ObjectId])
  assignedToTeams: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' })
  workspaceId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop([SubtaskSchema])
  subtasks: Subtask[];

  @Prop()
  status: 'Urgent' | 'High' | 'Normal';
}

export const TaskSchema = SchemaFactory.createForClass(Task);
