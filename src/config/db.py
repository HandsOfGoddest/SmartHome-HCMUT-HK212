import json

from mongoengine import *

def DB():
    host= "mongodb+srv://Akatsuki:akatsuki@cluster0.afgoj.mongodb.net/IOT_project?retryWrites=true&w=majority"
    return host


# class username(Document):
#     size= IntField(required=True)
#
#     def json(self):
#         cc_dict= {
#             "size": self.size,
#         }
#         return json.dumps(cc_dict)
#
#     meta={
#         "indexes": ["size"],
#     }
#
# if __name__ == "__main__":
#     cc= username(size= 10).save()
#     cc = username(size=11).save()