from iot.models import Room
from iot.serializers import RoomSerializer
from iot.DB import DBSingleton

from rest_framework.response import  Response
from rest_framework import status
from rest_framework.decorators import APIView

db= DBSingleton.get_instance()
db.connectDB()

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