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

class Room(Document):
    Id= IntField(required=True, unique=True)
    owner= StringField(required=True)
    users= ListField(ReferenceField("User"), default= [])
    devices= ListField(ReferenceField("Devices"), default= [])
    _date_created= DateField(default=datetime.datetime.now())

    def json(self):
        room_dict= {
            "Id": self.Id,
            "owner": self.owner,
            "users": self.users,
            "devices": self.devices,
        }
        return json.dumps(room_dict)

    meta={
        "indexes": ["Id"],
        "ordering": ["_date_created"],
    }

if __name__ == "__main__":

    Room.objects.delete()