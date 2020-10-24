import { Schema, model, Document } from "mongoose";

const validRoles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} is not a valid role',
};

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name is mandatory'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'The email is mandatory'],
  },
  password: {
    type: String,
    required: [true, 'The password is mandatory'],
  },
  role: {
    type: String,
    default: 'USER',
    required: [true],
    enum: validRoles,
  },
})

export interface UserDoc extends Document {
  password: string,
  email: {
    type: string;
    unique: boolean;
    required: boolean;
  },
  name: {
    type: string,
    required: boolean
  }
}
export default model<UserDoc>("User", userSchema);
