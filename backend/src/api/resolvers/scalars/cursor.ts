import { GraphQLScalarType, Kind } from 'graphql';

//TODO this won't handle date types that well

function parseString(value: string){
  return JSON.parse(Buffer.from(value, 'base64').toString('utf-8'));
}

export const cursorScalar = new GraphQLScalarType({
  name: 'Cursor',
  description: 'Cursor scalar type',

  serialize(value) {
    return Buffer.from(JSON.stringify(value)).toString('base64');
  },

  parseValue(value) {
    if(!(typeof value === "string")){
      throw new Error('Cursor scalar parseValue expected string');
    }
    return parseString(value);
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {


      return parseString(ast.value)
    }
    // Invalid hard-coded value
    return null;

  },

});