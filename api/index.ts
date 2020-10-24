import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './schema';
import { JWT_SECRET, PORT } from './config/config';
import './database';
import jwt from 'express-jwt';

const app = express();
app.use(cors());

// auth middleware
const auth = jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
  algorithms: ['HS256'],
});

const server = new ApolloServer({
  introspection: true, // only for dev purposes
  playground: true, // only for dev purposes
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { id, email } = req.user || {};
    return { id, email };
  },
});

app.use(auth);

const errorHandler = (err: any, req: any, res: any, next: any) => {
  if (res.headersSent) {
    return next(err);
  }
  const { status } = err;
  res.status(status).json(err);
};

app.use(errorHandler);
server.applyMiddleware({ app, path: '/graphql' });

if (!process.env.VERCEL_REGION) {
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/graphql`);
  });
}

export default app;
