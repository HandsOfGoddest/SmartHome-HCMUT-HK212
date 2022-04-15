from .models import Devices, Records
# import requests
import datetime

def query_devices(Id):
    return Devices.objects(Id= Id)

def query_records(Id):
    return Records.objects(Id= Id)

def create_Device_object(Id, name, type):
    device= Devices(
        Id= Id,
        name = name,
        data = 0,
        status = False,
        enabled = True,
        type = type,
        _date_created = datetime.datetime.now()
    )

def create_Record(Id, data):
    record= Records(
        data= data,
        Id = Id,
        _date_created = datetime.datetime.now(),
        _date_updated = datetime.datetime.now(),
    ).save()

def DeviceController(Id, data, type):
    device= query_devices(Id)
    if(device):
        deviceId= device[0].id
        if(device[0].type == type and device[0].status == True):
            create_Record(deviceId, data)
    else:
        print("Unknown device")


