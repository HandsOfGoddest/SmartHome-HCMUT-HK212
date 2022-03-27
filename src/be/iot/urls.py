from django.urls import path, include
# from .views import UserListView, UserDetailView
from rest_framework.routers import DefaultRouter

from .views import  UserViewSet, UserDetailViewSet,\
                    RoomViewSet, RoomDetailViewSet,\
                    DevicesViewSet, DevicesDetailViewSet,\
                    RecordsViewSet

# router= DefaultRouter()
# router.register('users', UserViewSet, basename="users")
# router.register('rooms', RoomViewSet, basename="rooms")
# router.register('devices', DevicesViewSet, basename="devices")
# router.register('records', RecordsViewSet, basename="records")

urlpatterns = [
    # path("", include(router.urls)),
    path("users/", UserViewSet.as_view()),
    path("users/<str:userID>/", UserDetailViewSet.as_view()),
    path("rooms/", RoomViewSet.as_view()),
    path("rooms/<int:Id>/", RoomDetailViewSet.as_view()),
    path("devices/", DevicesViewSet.as_view()),
    path("devices/<str:Id>/", DevicesDetailViewSet.as_view()),
    path("records/", RecordsViewSet.as_view())
]