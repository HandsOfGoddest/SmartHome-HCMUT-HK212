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

class Records(Document):
    data= ListField(FloatField(), default=[])
    Id= ReferenceField("Devices", required=True)
    _date_created= DateField(default=datetime.datetime.now())
    _date_updated = DateField(default=datetime.datetime.now())

    def json(self):
        records_dict= {
            "data": self.data,
            "Id": self.Id,
            "_date_created": self._date_created,
            "_date_updated": self._date_updated,
        }
        return json.dumps(records_dict)

    meta={
        "indexes": ["Id"],
        "ordering": ["_date_created"],
    }