// Need timers to log elasped time when starting server
console.time("Import processing time");

import "reflect-metadata";
import path from "path";
import express from "express"
import cors from 'cors'
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from "./auth";
import { config } from "./config/config";
import { UserResolver } from "./resolvers/UserResolver";
import { SampleLetterResolver } from "./resolvers/SampleLetterResolver";
import { HookResolver } from "./resolvers/HookResolver";


console.timeEnd("Import processing time");
async function bootstrap() {
  await createConnection({
    type: config.server as "mysql",
    url: `${config.server}://${config.dbUser}:${config.dbPass}@${config.dbHost}/${config.db}`,
    entities: [path.resolve(__dirname, "./models/*.{ts,js}")],
    synchronize: true,
    // logging: ["query"] /* Uncomment to log SQL query in server logs */,
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, SampleLetterResolver, HookResolver],
    authChecker: customAuthChecker,
  });

  const app = express()

  app.use(cors());
  app.use(express.json())

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const token = req.headers["authorization"].replace("Bearer ", "");
      return {
        token,
        user: null,
        res,
      };
    },
  });



  await server.start()
  server.applyMiddleware({ app });

  app.get("/files/:filename", (req, res) => {
    res.download(process.env.FILES_PATH + req.params.filename, `${new Date().toISOString()}_new.pdf`)
  });

  const url = `http://localhost:${config.port}${server.graphqlPath}`
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server is running, GraphQL Playground available at ${url} `)
  );


}

console.time("Server bootstraping time");
bootstrap();
console.timeEnd("Server bootstraping time");
