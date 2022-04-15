from iot.models import User, Room, Devices, Records, DevicesLog
from iot.serializers import DevicesSerializer, RecordsSerializer
from iot.DB import DBSingleton

from rest_framework.response import  Response
from rest_framework import status
from rest_framework.decorators import APIView

import datetime

db= DBSingleton.get_instance()
db.connectDB()

class DevicesViewSet(APIView):
    def get(self, request):
        devices = Devices.objects.all()
        devices_serializer = DevicesSerializer(devices, many=True)
        return Response(devices_serializer.data)

    def post(self, request):
        try:
            serializer = DevicesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
    
                return Response(serializer.data, status.HTTP_201_CREATED)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status.HTTP_409_CONFLICT)

class DevicesDetailViewSet(APIView):
    def get_object(self, Id):
        try:
            devices= Devices.objects.get(Id=Id)

            return devices
        except Devices.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, Id):
        try:
            device= self.get_object(Id)
            device_serializer = DevicesSerializer(device)

            return Response(device_serializer.data)
        except:
            return Response(status.HTTP_404_NOT_FOUND)
        
    def create_changed_log(self, userID, roomID, data, device):
        
        user= User.objects.get(userID= userID)
        room= Room.objects.get(Id= roomID)
        changeValue= None
        if data[3] != device.status:
            changeValue= "status:"+("On" if (data[3] == True) else "Off")
        elif data[4] != device.enabled:
            changeValue= "enabled:"+("On" if (data[4] == True) else "Off")
        else:
            return
        
        log= DevicesLog(
            deviceId= device.Id,
            changeValue= changeValue,
            byUserName= user.name,
            userID= userID,
            atRoom= roomID,
        ).save()

    def put(self, request, Id):
        try:
            deviceID= Id.split('+')[0]
            userID= Id.split('+')[1]
            roomID= Id.split('+')[2]
            
            device = self.get_object(deviceID)
            serializer = DevicesSerializer(device, data=request.data)
            if serializer.is_valid():
                self.create_changed_log(
                    userID, 
                    roomID,
                    list(serializer.validated_data.values()), 
                    device, 
                )
                serializer.save()
                if serializer.data["enabled"] == False:
                    rooms= Room.objects.all()
                    for room in rooms:
                        try:
                            room.update(pull__devices=device.id)
                        except:
                            print("xóa cc")
    
                return Response(serializer.data)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(serializer.errors, status.HTTP_403_FORBIDDEN)

    def delete(self, request, Id):
        device = self.get_object(Id)
        device.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class AvailidDevice(APIView):
    def get_object(self):
        try:
            all_avalid_devices= Devices.objects(enabled=True)
            return all_avalid_devices
        except Devices.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)
        
    def get(self, request):
        all_avalid_devices= self.get_object()
        rooms= Room.objects.all()
        usedDevices= []
        for room in rooms:
            usedDevices+= room.devices
        avalidDevices= set(all_avalid_devices) - set(usedDevices)
        devices_serializer= DevicesSerializer(avalidDevices, many= True)
        return Response(devices_serializer.data)

class RecordsViewSet(APIView):
    def get(self, request):
        records = Records.objects.all()
        records_serializer = RecordsSerializer(records, many=True)
        return Response(records_serializer.data)

    def post(self, request):
        try:
            serializer = RecordsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
    
                return Response(serializer.data, status.HTTP_201_CREATED)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status.HTTP_409_CONFLICT)

class RecordsDetailViewSet(APIView):
    def get_objects(self, Id, fDate= None, toDate= None):
        # try:
            device= Devices.objects.get(Id=Id)
            device_id= device.id
            records= Records.objects(Id=device_id)
            res=[]
            if fDate and toDate:
                for record in records:
                    if (record._date_created.date() >= fDate and record._date_created.date() <= toDate):
                        res.append(record)
            else:
                return records
            return res
        # except Records.DoesNotExist:
        #     return Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, Id):
        # try:
            paras= Id.split("+")
            records= None
            if len(paras) == 3:
                d1= paras[1].split("-")
                d2= paras[2].split("-")
                fdate= datetime.date(int(d1[0]), int(d1[1]), int(d1[2]))
                ldate= datetime.date(int(d2[0]), int(d2[1]), int(d2[2]))
                print("yes")
                records = self.get_objects(paras[0], fdate, ldate)    
            else:
                records = self.get_objects(Id)
            records_serializer = RecordsSerializer(records, many=True)

            return Response(records_serializer.data)
        # except:
        #     return Response(status.HTTP_404_NOT_FOUND)
    