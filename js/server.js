const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');

// ----- MOCK UP DATA -----
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' },
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType = new GraphQLObjectType({
	name: "Author",
	description: "This represents an author of a book",
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		books: { 
			type: GraphQLList(BookType),
			resolve: (author) => books.filter(book => book.authorId === author.id)	
		}
	})
});

const BookType = new GraphQLObjectType({
	name: "Book",
	description: "This represents book written by an author",
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		authorId: { type: GraphQLInt },
		author: {
			type: AuthorType,
			resolve: (book) => authors.find(author => author.id === book.authorId)
		}
	})
});

const RootQueryType = new GraphQLObjectType({
	name: "Query",
	description: "Root Query",
	fields: () => ({
		books: {
			type: GraphQLList(BookType),
			description: "List all of books",
			resolve: () => books
		},
		authors: {
			type: GraphQLList(AuthorType),
			description: "List all of authors",
			resolve: () => authors
		},
		book: {
			type: BookType,
			description: "A single book",
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (parent, args) => books.find(book => book.id === args.id)
		},
		author: {
			type: AuthorType,
			description: "A single author",
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (parent, args) => authors.find(author => author.id === args.id)
		}
	})
});

const RootMutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "Root Mutation",
	fields: () => ({
		addBook: {
			type: BookType,
			description: "Add a book",
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				authorId: { type: GraphQLNonNull(GraphQLInt) }
			},
			resolve: (parent, args) => {
				const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
				books.push(book);
				return book;
			}
		},
		addAuthor: {
			type: AuthorType,
			description: "Add an author",
			args: {
				name: { type: GraphQLNonNull(GraphQLString) }
			},
			resolve: (parent, args) => {
				const author = { id: authors.length + 1, name: args.name };
				authors.push(author);
				return author;
			}
		}
	})
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType
});

// ----- GraphQL Service -----
app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true
}));

// ----- REST API ----
app.get('/book/:bookId', (req, res) => {
	const { bookId } = req.params;
	const book = books.find(book => book.id === parseInt(bookId));
	res.json({ book });
});

app.get('/author/:authorId', (req, res) => {
	const { authorId } = req.params;
	const author = authors.find(author => author.id === parseInt(authorId));
	res.json({ author });
});

app.get('/books', (req, res) => {
	res.json({ books });
});

app.get('/authors', (req, res) => {
	res.json({ authors });
});

app.post('/book', (req, res) => {
	const { name, authorId } = req.query;
	const book = { id: books.length + 1, name, authorId: +authorId };
	books.push(book);
	res.json({ msg: "Added book", book });
});

app.listen(3000, () => console.log("Server started: Listening at port 3000"));