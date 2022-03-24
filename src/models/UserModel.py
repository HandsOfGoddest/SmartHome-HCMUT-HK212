import required
from mongoengine import *
import sys
import json
import datetime

module= sys.path[0].replace("models","") + 'config'
sys.path.insert(0, module)
from db import *

myDB= DB()
connect(host=myDB)

class User(Document):
    name= StringField(required=True)
    phoneNumber= StringField(required= True, unique=True)
    userID= StringField(required= True, unique=True)
    dateOfBirth= DateField(required= True, default=datetime.datetime.now())
    password= StringField(required= True)
    homeTown= StringField(required= True)
    room= ListField(ReferenceField("Room"), default=[])
    isAdmin= BooleanField(default=False)

    def json(self):
        user_dict= {
            "name": self.name,
            "phoneNumber": self.phoneNumber,
            "userID": self.userID,
            "dateOfBirth": self.dateOfBirth,
            "password": self.password,
            "homeTown": self.homeTown,
            "room": self.room,
            "isAdmin": self.isAdmin,
        }
        return json.dumps(user_dict)

    meta={
        "indexes": ["name", "userID"],
        "ordering": ["-date_created"],
    }

if __name__ == "__main__":
    User.objects.delete()

