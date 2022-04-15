from django.contrib.admin.utils import lookup_field
from django.db.migrations import serializer
from django.shortcuts import render, HttpResponse, get_object_or_404
from django.http import JsonResponse

from .controller.userController import UserViewSet, UserDetailViewSet, SearchUserView
from .controller.roomController import RoomViewSet, RoomDetailViewSet
from .controller.deviceController import    DevicesViewSet, DevicesDetailViewSet, AvailidDevice,\
                                            RecordsViewSet, RecordsDetailViewSet
from .controller.logController import DevicesLogViewSet, DevicesLogSearch