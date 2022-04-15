from django.contrib.admin.utils import lookup_field
from django.db.migrations import serializer
from django.shortcuts import render, HttpResponse, get_object_or_404
from django.http import JsonResponse
# import sys
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *
from .DB import DBSingleton

# from rest_framework.parsers import JSONParser
from rest_framework.response import  Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.decorators import APIView
# from rest_framework import generics
# from rest_framework import mixins
# from rest_framework import viewsets


db= DBSingleton.get_instance()
db.connectDB()
# Create your views here.
class UserViewSet(APIView):

    def get(self, request):
        users = User.objects.all()
        user_serializer = UserSerializer(users, many=True)
        return JsonResponse(user_serializer.data, safe=False)

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                userID= User.objects.get(userID= serializer.data["userID"]).id
                room_lst= serializer.data["room"]
                for room in room_lst:
                    Room.objects.get(Id= room).update(add_to_set__users= userID)
    
                return Response(serializer.data, status.HTTP_201_CREATED)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status.HTTP_409_CONFLICT)


class UserDetailViewSet(APIView):

    def get_object(self, userID):
        try:
            users= User.objects.get(userID=userID)

            return users
        except User.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, userID):
        try:
            user= self.get_object(userID)
            user_serializer = UserSerializer(user)

            return Response(user_serializer.data)
        except:
            return Response(status.HTTP_404_NOT_FOUND)

    def put(self, request, userID):
        try:
            user = self.get_object(userID)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
    
                return Response(serializer.data)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(serializer.errors, status.HTTP_403_FORBIDDEN)

    def delete(self, request, userID):
        user = self.get_object(userID)
        rooms = Room.objects(users=user.id)
        for rom in rooms:
            rom.update(pull__users=user.id)
        user.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class SearchUserView(APIView):
    def get_object(self, userName):
        try:
            users= User.objects(name__icontains = userName)

            return users
        except User.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, userName):
        try:
            users= self.get_object(userName)
            user_serializer = UserSerializer(users, many=True)

            return Response(user_serializer.data)
        except:
            return Response(status.HTTP_404_NOT_FOUND)

class RoomViewSet(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        rooms_serializer = RoomSerializer(rooms, many=True)
        return Response(rooms_serializer.data)

    def post(self, request):
        try:
            serializer = RoomSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
    
                return Response(serializer.data, status.HTTP_201_CREATED)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status.HTTP_409_CONFLICT)

class RoomDetailViewSet(APIView):
    def get_object(self, Id):
        try:
            room= Room.objects.get(Id=Id)

            return room
        except Room.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, Id):
        try:
            room= self.get_object(Id)
            room_serializer = RoomSerializer(room)

            return Response(room_serializer.data)
        except:
            return Response(status.HTTP_404_NOT_FOUND)

    def put(self, request, Id):
        try:
            room = self.get_object(Id)
            serializer = RoomSerializer(room, data=request.data)
            if serializer.is_valid():
                serializer.save()
    
                return Response(serializer.data)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except:
            return Response(serializer.errors, status.HTTP_403_FORBIDDEN)


    def delete(self, request, Id):
        room = self.get_object(Id)
        room.delete()
        return Response(status.HTTP_204_NO_CONTENT)

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
    def get_objects(self, Id):
        try:
            device= Devices.objects.get(Id=Id)
            device_id= device.id
            device= Records.objects(Id=device_id)

            return device
        except Records.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, Id):
        try:
            records = self.get_objects(Id)
            records_serializer = RecordsSerializer(records, many=True)

            return Response(records_serializer.data)
        except:
            return Response(status.HTTP_404_NOT_FOUND)
        
class DevicesLogViewSet(APIView):
    def get(self, request):
        logs = DevicesLog.objects.all()
        logs_serializer = DevicesLogSerializer(logs, many=True)
        return Response(logs_serializer.data)

class DevicesLogSearch(APIView):
    def get_object(self, roomID, fdate, ldate, deviceID):
        # d1= fdate
        logs=[]
        if deviceID != None:
            logs= DevicesLog.objects(  Q(deviceId= deviceID)
                                      & Q(atRoom= roomID) )
        else:
            logs= DevicesLog.objects(atRoom= roomID)
        res=[]
        for log in logs:
            if log._date_changed.day>=fdate and log._date_changed.day<=ldate:
                res.append(log)
        return res
            
        
    def get(self, request, paras):
        paralst= paras.split("+")
        roomID= paralst[0]
        fday= int(paralst[1])
        lday= int(paralst[2])
        deviceID= paralst[3] if (len(paralst) == 4) else None
        logs= self.get_object(roomID, fday, lday, deviceID)
        logs_serializer= DevicesLogSerializer(logs, many=True)
        return Response(logs_serializer.data)


# class DevicesViewSet(viewsets.ModelViewSet):
#     queryset = Devices.objects.all()
#     serializer_class = DevicesSerializer
#     lookup_field = "Id"
#
#     def create(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except:
#             return Response(status.HTTP_406_NOT_ACCEPTABLE)
#
#     def retrieve(self, request, *args, **kwargs):
#         try:
#             instance = self.get_object()
#             serializer = self.get_serializer(instance)
#             return Response(serializer.data)
#         except:
#             return Response(status.HTTP_404_NOT_FOUND)

# class RecordsViewSet(viewsets.ModelViewSet):
#     queryset = Records.objects.all()
#     serializer_class = RecordsSerializer
#     lookup_field = "Id"
    # http_method_names= ['get']

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     lookup_field = "userID"
#
#     def create(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except:
#             return Response(status.HTTP_406_NOT_ACCEPTABLE)
#
#     def retrieve(self, request, *args, **kwargs):
#         try:
#             instance = self.get_object()
#             serializer = self.get_serializer(instance)
#             return Response(serializer.data)
#         except:
#             return Response(status.HTTP_404_NOT_FOUND)

# class RoomViewSet(viewsets.ModelViewSet):
#     queryset = Room.objects.all()
#     serializer_class = RoomSerializer
#     lookup_field = "Id"
#
#     def create(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         except:
#             return Response(status.HTTP_406_NOT_ACCEPTABLE)
#
#     def retrieve(self, request, *args, **kwargs):
#         try:
#             instance = self.get_object()
#             serializer = self.get_serializer(instance)
#             return Response(serializer.data)
#         except:
#             return Response(status.HTTP_404_NOT_FOUND)


# class UserListView(generics.GenericAPIView, mixins.ListModelMixin,
#                    mixins.CreateModelMixin):
#     queryset= User.objects.all()
#     serializer_class= UserSerializer
#
#     def get(self, request):
#         return self.list(request)
#
#     def post(self, request):
#         return self.create(request)
#
# class UserDetailView(generics.GenericAPIView, mixins.RetrieveModelMixin,
#                      mixins.UpdateModelMixin, mixins.DestroyModelMixin):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     lookup_field= "userID"
#
#     def get(self, request, userID):
#         return self.retrieve(request, userID= userID)
#
#     def put(self, request, userID):
#         return self.update(request, userID= userID)
#
#     def delete(self, request, userID):
#         return self.destroy(request, userID= userID)



# class UserListView(APIView):
#
#     def get(self, request):
#         users = User.objects.all()
#         user_serializer = UserSerializer(users, many=True)
#         return Response(user_serializer.data)
#
#     def post(self, request):
#         try:
#             serializer = UserSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status.HTTP_201_CREATED)
#             return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
#         except:
#             return Response(status.HTTP_409_CONFLICT)
#
#
# class UserDetailView(APIView):
#
#     def get_object(self, userID):
#         try:
#             return User.objects.get(userID=userID)
#         except User.DoesNotExist:
#             return Response(status.HTTP_404_NOT_FOUND)
#
#     def get(self, request, userID):
#         user= self.get_object(userID)
#         user_serializer = UserSerializer(user)
#         return Response(user_serializer.data)
#
#     def put(self, request, userID):
#         user = self.get_object(userID)
#         serializer = UserSerializer(user, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
#
#     def delete(self, request, userID):
#         user = self.get_object(userID)
#         user.delete()
#         return Response(status.HTTP_204_NO_CONTENT)



'''
@api_view(['GET', 'POST'])
@csrf_exempt
def user(request):
    # return render(request, wellcomePage)
    # return HttpResponse("Hello!")
    if request.method == 'GET':
        users= User.objects.all()
        user_serializer= UserSerializer(users, many= True)
        return Response(user_serializer.data)
    if request.method == "POST":
        # data= JSONParser().parse(request)
        try:
            serializer= UserSerializer(data= request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_201_CREATED)
            return Response(serializer.errors , status.HTTP_400_BAD_REQUEST)
        except:
            return HttpResponse(status.HTTP_409_CONFLICT)

# @csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def getUser(request, userID):
    try:
        user= User.objects.get(userID=userID)
    except User.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        user_serializer= UserSerializer(user)
        return Response(user_serializer.data)
    elif request.method == 'PUT':
        # data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response(status.HTTP_204_NO_CONTENT)
'''





