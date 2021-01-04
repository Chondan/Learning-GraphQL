import graphene
import json

# Interface
class Info(graphene.Interface):
	hobbies = graphene.List(graphene.String)
	friends = graphene.List(lambda: Person) # If put only 'Person', an error will show up with 'Person' is not defined.

	def resolve_friends(self, info):
		arr = []
		for f in self.friends:
			for p in persons:
				if (f == p.id):
					arr.append(p)
		return arr

# Enum Type
class SongType(graphene.Enum):
	POP = 1
	ROCK = 2

class Song(graphene.ObjectType):
	id = graphene.ID()
	name = graphene.String()
	artistId = graphene.ID()
	downloaded = graphene.Int()
	type = graphene.Field(SongType)

class Person(graphene.ObjectType):
	class Meta:
		interfaces = (Info,)

	id = graphene.ID()
	name = graphene.String()
	age = graphene.Int()
	songs = graphene.List(Song, downloaded=graphene.Int())

	def resolve_songs(self, info, downloaded=0):
		arr = []
		for s in songs:
			if (s.artistId == self.id and s.downloaded >= downloaded):
				arr.append(s)
		return arr

	def resolve_name(self, info):
		return self.name.upper()

persons = []
songs = []
def setup():
	global persons, songs
	persons = [
		Person(["playing football"], ["2"], "1", "Chondan", 22),
		Person(["listening to music"], ["1"], "2", "Salah", 28)
	]
	songs = [
		Song("1", "song1", "1", 500, 1),
		Song("2", "song2", "2", 1000, 2)
	]
setup()

# Query
class Query(graphene.ObjectType):
	person = graphene.Field(Person, name=graphene.String())
	persons = graphene.List(Person, max_age=graphene.Int())
	songs = graphene.List(Song, downloaded=graphene.Int())
	song = graphene.List(Song, artistId=graphene.ID())

	def resolve_song(self, info, artistId="1"):
		arr = []
		for s in songs:
			if (s.artistId == artistId):
				arr.append(s)
		return arr

	def resolve_songs(self, info, downloaded=0):
		arr = []
		for s in songs:
			if (s.downloaded >= downloaded):
				arr.append(s)
		return arr

	def resolve_person(self, info, name="Chondan"):
		for p in persons:
			if (p.name == name):
				return p

	def resolve_persons(self, info, max_age):
		arr = []
		for p in persons:
			if (p.age <= max_age):
				arr.append(p)
		return arr

schema = graphene.Schema(query=Query)

query = '''
	{
		person(name: "Salah") {
			name,
			id,
			songs(downloaded: 5555) {
				name
			},
			hobbies,
			friends {
				name
			}
		},
		persons(maxAge: 30) {
			name,
			id,
			songs {
				name
			}
		},
		songs(downloaded: 0) {
			name
		},
		song(artistId: "1") {
			name,
			downloaded,
			type
		}
	}
'''
result = schema.execute(query)

print(json.dumps(result.data, indent=2))