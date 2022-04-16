from iot.DB import DBSingleton
db= DBSingleton.get_instance()
db.connectDB()

from iot.models import User, Room
from iot.serializers import RoomSerializer
from rest_framework.response import  Response
from rest_framework import status
from rest_framework.decorators import APIView



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
                nRoom= Room.objects.get(Id= serializer.validated_data["Id"])
                admins= User.objects(isAdmin= True)
                print(serializer.validated_data)
                for admin in admins:
                    admin.update(add_to_set__room= nRoom.id)
                    nRoom.update(add_to_set__users= admin.id)
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
        count= 0
        admins= []
        for user in room.users:
            if user.isAdmin == True:
                admins.append(user)
        if len(admins) == len(room.users):
            print("yes")
            for admin in admins:
                admin.update(pull__room= room.id)
            room.delete()
            return Response(status.HTTP_204_NO_CONTENT)
        else:
            return Response(status.HTTP_400_BAD_REQUEST)