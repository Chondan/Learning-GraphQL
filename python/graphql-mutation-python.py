import graphene
import json

class CreatePerson(graphene.Mutation):
	class Arguments:
		name = graphene.String()
		age = graphene.Int()

	ok = graphene.Boolean()
	person = graphene.Field(lambda: Person)

	def mutate(self, info, name,age):
		person = Person(age=age, name=name, hobbies=["Playing Football", "Listening to musics"])
		persons.append(person)
		ok = True
		return CreatePerson(person=person, ok=ok)

class Person(graphene.ObjectType):
	name = graphene.String()
	age = graphene.Int()
	hobbies = graphene.List(graphene.String, start=graphene.String())

	def resolve_hobbies(self, info, start=""):
		if self.hobbies is None:
			return self.hobbies
			
		arr = []
		for h in self.hobbies:
			if h.startswith(start):
				arr.append(h)
		return arr

persons = [
	Person("Chondan", 22)
]

class Mutation(graphene.ObjectType):
	create_person = CreatePerson.Field()

class Query(graphene.ObjectType):
	persons = graphene.List(Person)

	def resolve_persons(self, info):
		return persons

schema = graphene.Schema(query=Query, mutation=Mutation)

query = '''
	mutation MyMutation {
		createPerson(name: "Mane", age: 28) {
			ok,
			person {
				name
			}
		}
	}
'''

results = schema.execute(query)
print(json.dumps(results.data, indent=2))

query = '''
	query myQuery {
		persons {
			name,
			age,
			hobbies(start: "P")
		}
	}
'''

results = schema.execute(query)
print(json.dumps(results.data, indent=2))