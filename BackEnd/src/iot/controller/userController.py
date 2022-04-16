from iot.DB import DBSingleton
db= DBSingleton.get_instance()
db.connectDB()

from iot.models import User, Room
from iot.serializers import UserSerializer
from rest_framework.response import  Response
from rest_framework import status
from rest_framework.decorators import APIView
from django.http import JsonResponse



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
        # try:
            user = self.get_object(userID)
            prev_room= user.room
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                sameRoom= set(prev_room)&set(user.room)
                removedRoom= set(prev_room) - sameRoom
                newRoom= set(user.room) - sameRoom
                # print(user.room)
                for room in newRoom:
                    if user.id not in room.users:
                        room.update(add_to_set__users= user.id)
                for room in removedRoom:
                    room.update(pull__users= user.id)
                return Response(serializer.data)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        # except:
        #     return Response(serializer.errors, status.HTTP_403_FORBIDDEN)

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