from django.db import models
import required
from mongoengine import *
import sys
import json
import datetime
import binascii
import os
from django.conf import settings
from django.utils.timezone import now
# from .DB import DBSingleton


class Devices(Document):
    Id= StringField(required=True, unique=True)
    name= StringField()
    data= FloatField()
    status= BooleanField(required=True)
    enabled= BooleanField(required=True)
    type= StringField(required= True)
    _date_created= DateTimeField(default=datetime.datetime.now())

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

    def __str__(self):
        return self.Id + ":" + self.name

class Records(Document):
    data= FloatField()
    Id= ReferenceField("Devices", required=True)
    _date_created= DateTimeField(default=datetime.datetime.now())
    _date_updated = DateTimeField(default=datetime.datetime.now())

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

class Room(Document):
    Id= IntField(required=True, unique=True)
    owner= StringField(required=True)
    users= ListField(ReferenceField("User"), default= [])
    devices= ListField(ReferenceField("Devices"), default= [])
    _date_created= DateTimeField(default=datetime.datetime.now())

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

    def __str__(self):
        return "Phòng " + str(self.Id)

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

    def __str__(self):
        return self.name + ' ' +self.userID

class DevicesLog(Document):
    deviceId= ReferenceField("Devices", required=True)
    changeValue= StringField(required=True)
    byUser= ReferenceField("User", required=True)
    atRoom= ReferenceField("Room", required=True)
    _date_changed= DateTimeField(default=datetime.datetime.now())
    
    def json(self):
        dLog_dict= {
            "deviceId": self.deviceId,
            "changeValue": self.changeValue,
            "_date_changed": self._date_changed,
        }
        return json.dumps(dLog_dict)

    meta={
        "indexes": ["deviceId", "changeValue"],
        "ordering": ["-_date_changed"],
    }

    def __str__(self):
        return self.deviceId + ' ' +self.changeValue  + "at" + self.atRoom + "on" + self._date_changed 