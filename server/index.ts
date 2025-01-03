import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Read schema
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

const resolvers = {
  Query: {
    historyEntries: async (_, { lastId, minTimestamp }) => {
      const entries = await prisma.historyEntry.findMany({
        where: {
          AND: [
            { timestamp: { gte: minTimestamp } },
            lastId ? { id: { gt: lastId } } : {}
          ]
        },
        orderBy: { id: 'asc' },
        take: 100
      });
      return entries;
    },
  },
  Mutation: {
    syncHistoryEntries: async (_, { entries }) => {
      const results = [];
      
      for (const entry of entries) {
        const existingEntry = await prisma.historyEntry.findUnique({
          where: { id: entry.id }
        });

        if (!existingEntry || existingEntry.lastModified < entry.lastModified) {
          const result = await prisma.historyEntry.upsert({
            where: { id: entry.id },
            update: entry,
            create: entry
          });
          results.push(result);
        } else {
          results.push(existingEntry);
        }
      }

      return results;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });
  console.log(`🚀 Server ready at: ${url}`);
};

startServer();