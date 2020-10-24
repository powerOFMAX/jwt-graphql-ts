import User from './models/userModel';
import { gql } from 'apollo-server-express';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, TOKEN_EXPIRATION } from './config/config';

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    password: String
    role: String
  }

  input UserCredentials {
    email: String!
    password: String!
    name: String
  }

  type Mutation {
    signup(input: UserCredentials!): AuthResponse
    login(input: UserCredentials!): AuthResponse
  }

  type Query {
    users: [User!]
  }

  type AuthResponse {
    token: String
    email: String
    name: String
  }
`;

function checkIsUserLogged(context: any) {
  const { email, id } = context;
  // check if the user is logged
  if (!id) throw new Error('you must be logged in to perform this action');
  // find the user and check if it exists
  const user = User.find({ email });
  // if user doesnt exist, throw an error
  if (!user) throw new Error('user does not exist');
  return user;
}

const resolvers = {
  Mutation: {
    // Handle user signup
    async signup(_: any, { input }: any) {
      const { email, password, name } = input;
      const user = await User.findOne({ email });

      if (user) {
        throw new Error('User already exists');
      }

      const newUser = await User.create({
        email,
        password,
        name,
      });

      // return json web token
      const token = jsonwebtoken.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );
      return {name, email, token}
    },

    // Handles user login
    async login(_: any, { input }: any) {
      const { email, password } = input;
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      // return json web token
      const token = jsonwebtoken.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: TOKEN_EXPIRATION,
        }
      );
      const { name } = user
      return {name, email, token};
    },
  },
  Query: {
    users: (_: any, __: any, context: any) => {
      checkIsUserLogged(context);
      return User.find();
    },
  },
};

export { typeDefs, resolvers };
