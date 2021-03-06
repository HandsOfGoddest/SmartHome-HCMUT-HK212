from django.urls import path

from .views import UserViewSet, UserDetailViewSet, \
    RoomViewSet, RoomDetailViewSet, \
    DevicesViewSet, DevicesDetailViewSet, AvailidDevice, \
    RecordsViewSet, RecordsDetailViewSet, SearchUserView,\
    DevicesLogSearch, DevicesLogViewSet,user_list

urlpatterns = [
    path("users/", UserViewSet.as_view()),
    path("users/<str:userID>/", UserDetailViewSet.as_view()),
    path("users/search/<str:userName>/", SearchUserView.as_view()),
    path("rooms/", RoomViewSet.as_view()),
    path("rooms/<int:Id>/", RoomDetailViewSet.as_view()),
    path("devices/", DevicesViewSet.as_view()),
    path("devices/<str:Id>/", DevicesDetailViewSet.as_view()), #Id= deviceId+userID+roomId
    path("records/", RecordsViewSet.as_view()),
    path("records/<str:Id>/", RecordsDetailViewSet.as_view()), #Id= deviceId(+fromDate+toDate)?
    path("addDeviceToRoom/", AvailidDevice.as_view()),
    path("logs/", DevicesLogViewSet.as_view()),
    path("logs/<str:paras>/", DevicesLogSearch.as_view()), #paras= roomID+fromDate+toDate+deviceID
    path("ws/", user_list) #paras= roomID+fromDate+toDate+deviceID
]