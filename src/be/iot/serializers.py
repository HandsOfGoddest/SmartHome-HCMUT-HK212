import inn as inn
import required
from rest_framework import serializers
from rest_framework.response import  Response
from .models import Room, Devices, User, Records
import datetime

class RoomSerializer(serializers.Serializer):
    Id = serializers.IntegerField()
    owner = serializers.CharField(max_length=400)
    users = serializers.SlugRelatedField(
        slug_field='userID',
        queryset= User.objects.all(),
        many=True,
        required=False,
        default=[],
    )
    devices = serializers.SlugRelatedField(
        slug_field='Id',
        queryset=Devices.objects.all(),
        many=True,
        required=False,
        default=[],
    )
    _date_created = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        validated_data["users"]= set(validated_data["users"])
        validated_data["devices"] = set(validated_data["devices"])
        return Room.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Id = validated_data.get('Id', instance.Id)
        instance.owner= validated_data.get('owner', instance.owner)
        userIDs= validated_data.get('users', instance.users)
        # userID= "NDH001"
        user= set(userIDs) - set(instance.users)
        if(user):
            instance.users+= user
        # if userIDs:
        #     userID= userIDs[0]
        # if not userID in instance.users:
        #     instance.users+= userID
        deviceIDs= validated_data.get('devices', instance.devices)
        device= set(deviceIDs) - set(instance.devices)
        if device:
            instance.devices+= device
        instance._date_created= validated_data.get('_date_created', instance._date_created)
        instance.save()
        return instance

    class Meta:
        model = Room
        fields = ['Id', 'owner', 'users', 'devices', '_date_created']

class UserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=400)
    phoneNumber = serializers.CharField(max_length=400)
    userID = serializers.CharField(max_length=400)
    dateOfBirth = serializers.DateField()
    password = serializers.CharField(max_length=400)
    homeTown = serializers.CharField(max_length=400)
    room = serializers.SlugRelatedField(
        slug_field='Id',
        queryset=Room.objects.all(),
        many=True,
    )
    isAdmin = serializers.BooleanField(default=False)

    def create(self, validated_data):
        validated_data["room"]= set(validated_data["room"])
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.phoneNumber= validated_data.get('phoneNumber', instance.phoneNumber)
        instance.userID= validated_data.get('userID', instance.userID)
        instance.dateOfBirth= validated_data.get('dateOfBirth', instance.dateOfBirth)
        instance.password= validated_data.get('password', instance.password)
        instance.homeTown= validated_data.get('_home_town', instance.homeTown)
        roomIDs= validated_data.get('room', instance.room)
        room= set(roomIDs) - set(instance.room)
        if(room):
            instance.room+= room
        # roomID= "NDHR0011"
        # if(roomIDs):
        #     roomID = roomIDs[0]
        # if roomID != instance.rooms:
        #     instance.room+= roomIDs
        instance.isAdmin= validated_data.get('isAdmin', instance.isAdmin)
        instance.save()
        return instance


    class Meta:
        model= User
        fields=['name', 'phoneNumber', 'userID', 'dateOfBirth', 'password', 'homeTown', 'room', 'isAdmin']

class RecordsSerializer(serializers.Serializer):
    data = serializers.FloatField()
    Id = serializers.SlugRelatedField(
        slug_field='Id',
        queryset=Devices.objects.all(),
    )
    _date_created = serializers.DateTimeField(required=False)
    _date_updated = serializers.DateTimeField(required=False)
    class Meta:
        model= Records
        fields= {'data', 'Id', '_date_created', '_date_updated'}

    def create(self, validated_data):
        return Records.objects.create(**validated_data)


class DevicesSerializer(serializers.Serializer):
    Id = serializers.CharField(max_length=400)
    name = serializers.CharField(max_length=400)
    data = serializers.FloatField()
    status = serializers.BooleanField()
    enabled = serializers.BooleanField()
    type = serializers.CharField(max_length=400)
    _date_created = serializers.DateTimeField(required=False)

    class Meta:
        model= Devices
        fields= ['Id', 'name', 'data', 'status', 'enabled', 'type', '_date_created']

    def create(self, validated_data):
        return Devices.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Id = validated_data.get('Id', instance.Id)
        instance.name= validated_data.get('name', instance.name)
        instance.data= validated_data.get('data', instance.data)
        instance.status= validated_data.get('status', instance.status)
        instance.enabled= validated_data.get('enabled', instance.enabled)
        instance.type= validated_data.get('type', instance.type)
        instance._date_created= validated_data.get('_date_created', instance._date_created)
        instance.save()
        return instance

