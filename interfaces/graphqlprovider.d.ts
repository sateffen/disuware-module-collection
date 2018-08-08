declare module "disuware!graphqlprovider" {
    type GraphQLSchema = Object;

    export function executeGraphQLQuery(query: string, variables?: Object): Promise<Object>;
    export function addGraphQLSchema(schema: GraphQLSchema): void;
    export function addRawGraphQLSchema(typeDefs: string, resolvers: Object): void;
}
