from mongoengine import *
import sys
import json
module= sys.path[0].replace("models","") + 'config'
sys.path.insert(0, module)
from db import *



myDB= DB()
connect(host=myDB)

class username(Document):
    size= IntField(required=True)

    def json(self):
        cc_dict= {
            "size": self.size,
        }
        return json.dumps(cc_dict)

    meta={
        "indexes": ["size"],
    }

if __name__ == "__main__":
    cc= username(size= 10).save()
    cc = username(size=11).save()

