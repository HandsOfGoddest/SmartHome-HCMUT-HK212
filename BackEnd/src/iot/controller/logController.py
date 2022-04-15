from iot.models import DevicesLog
from iot.serializers import DevicesLogSerializer
from iot.DB import DBSingleton

from rest_framework.response import  Response
from rest_framework import status
from rest_framework.decorators import APIView

import datetime
from mongoengine import *

db= DBSingleton.get_instance()
db.connectDB()

class DevicesLogViewSet(APIView):
    def get(self, request):
        logs = DevicesLog.objects.all()
        logs_serializer = DevicesLogSerializer(logs, many=True)
        return Response(logs_serializer.data)

class DevicesLogSearch(APIView):
    
    def __verify_date(self, fdate, ldate):
       if fdate > ldate:
           return False
       else:
           return True         
    
    def get_object(self, roomID, fdate, ldate, deviceID):
        d1= fdate.split("-")
        d2= ldate.split("-")
        date1= datetime.date(int(d1[0]), int(d1[1]), int(d1[2]))
        date2= datetime.date(int(d2[0]), int(d2[1]), int(d2[2]))
        if self.__verify_date(date1, date2):  
            logs=[]
            if deviceID != None:
                logs= DevicesLog.objects(  Q(deviceId= deviceID)
                                        & Q(atRoom= roomID) )
            else:
                logs= DevicesLog.objects(atRoom= roomID)
            res=[]
            for log in logs:
                if log._date_changed.date()>=date1 and log._date_changed.date()<=date2:
                    res.append(log)
            return res
        else:
            return []
            
        
    def get(self, request, paras):
        paralst= paras.split("+")
        roomID= paralst[0]
        fday= paralst[1]
        lday= paralst[2]
        deviceID= paralst[3] if (len(paralst) == 4) else None
        logs= self.get_object(roomID, fday, lday, deviceID)
        logs_serializer= DevicesLogSerializer(logs, many=True)
        return Response(logs_serializer.data)