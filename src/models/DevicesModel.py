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

class Devices(Document):
    Id= StringField(required=True, unique=True)
    name= StringField()
    data= FloatField()
    status= BooleanField(required=True)
    enabled= BooleanField(required=True)
    type= StringField(required= True)
    _date_created= DateField(default=datetime.datetime.now())

    def json(self):
        devices_dict= {
            "Id": self.Id,
            "name": self.name,
            "data": self.data,
            "status": self.status,
            "enabled": self.enabled,
            "type": self.type,
            "_date_created": self._date_created,
        }
        return json.dumps(devices_dict)

    meta={
        "indexes": ["Id", "type"],
        "ordering": ["_date_created"],
    }