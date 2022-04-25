# import sys
# from Adafruit_IO import MQTTClient
import serial.tools.list_ports
import time
from DB import DBSingleton
from models import Devices, Records
import datetime
from abc import ABCMeta, abstractstaticmethod
import json
import socket
from threading import Thread
import threading

HOST = "127.0.0.1"
PORT = 65432


# from channels.generic.websocket import WebsocketConsumer

db= DBSingleton.get_instance()
db.connectDB()

def query_devices(Id):
    return Devices.objects(Id= Id)

def create_Record(Id, data):
    record= Records(
        data= data,
        Id = Id,
        _date_created = datetime.datetime.now(),
        _date_updated = datetime.datetime.now(),
    ).save()
def DeviceController(Id, data, type):
    device= query_devices(Id)
    if(device):
        deviceId= device[0].id
        if(device[0].type == type):
            create_Record(deviceId, data)
    else:
        print("Unknown device")

class IGateway(metaclass= ABCMeta):
    @abstractstaticmethod
    def get_data(): pass

class GatewaySingleton(IGateway):
    __instance= None
    ser= None
    @staticmethod
    def get_instance():
        if GatewaySingleton.__instance is None:
            GatewaySingleton()
        return GatewaySingleton.__instance
    
    def __init__(self, port):
        if GatewaySingleton.__instance is None:
            self.port= port
            GatewaySingleton.__instance= self
        else:
            raise Exception("Can't be initialized")
    def readSerial(self, mess):
        bytesToRead = GatewaySingleton.ser.inWaiting ()
        if ( bytesToRead > 0) :
            mess
            mess = mess + GatewaySingleton.ser.read( bytesToRead ).decode("UTF -8")
            while ("#" in mess ) and ("!" in mess ) :
                start = mess.find ("!")
                end = mess.find ("#")
                self.processData ( mess [ start : end + 1])
                if ( end == len( mess )) :
                    mess = ""
                else :
                    mess = mess [ end +1:]
    @staticmethod
    def get_data():
        print(GatewaySingleton.__instance.port)
    
    def processData(self, data):
        data = data.replace("!", "")
        data = data.replace("#", "")
        splitData = data.split(":")
        print(splitData)
        if len(splitData) == 3:
            if splitData[1] == "GAS":
                DeviceController(splitData[0], splitData[2], splitData[1])
            elif splitData[1] == "LIGHT":
                DeviceController(splitData[0], splitData[2], splitData[1])
            elif splitData[1] == "DOOR":
                DeviceController(splitData[0], splitData[2], splitData[1])
                
    def __getPort(self):
        ports= serial.tools.list_ports.comports()
        N= len(ports)
        comPorts= "None"
        for i in range(0, N):
            port= ports[i]
            strPort= str(port)
            if self.port in strPort:
                splitPort= strPort.split(" ")
                comPorts= splitPort[0]
        return comPorts
    
    def __connectPorts(self):
        try:
            GatewaySingleton.ser = serial.Serial( port=self.__getPort(), baudrate=115200)
            print("connected microbit")
        except:
            print("Can not found microbit port!")

    def  turn_on(self,typ):
        GatewaySingleton.ser.write((typ + str(1) + "#").encode())    
    def  turn_off(self,typ):
        GatewaySingleton.ser.write((typ + str(0) + "#").encode())    

    def PyToBit(self):
        while True:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, PORT))
                s.listen(2)
                conn, addr = s.accept()
                with conn:
                    print('Connected by', addr)
                    while True:
                        data = conn.recv(1024)
                        if not data:
                            break
                        print(data.decode())
                        dat = data.decode().split(".")
                        if dat[1] == "on":
                            self.turn_on(dat[0])
                        elif dat[1] == "off":
                            self.turn_off(dat[0])
                        else:
                            print("Unknown command")
    def BitToPy(self):
        self.__connectPorts()
        while True :
            self.readSerial("")
            # time.sleep(0.2)
            # print("#############################")
    def read(self):
        t1 = threading.Thread(target=self.PyToBit)
        t2 = threading.Thread(target=self.BitToPy)
        t1.start()
        t2.start()
        t1.join()
        t2.join()
                            # conn.sendall(data)
            #     s.listen()
            #     conn, addr = s.accept()
            #     with conn:
            #         print('Connected by', addr)
            #         data = conn.recv(1024)
            #         print(data.decode())
            #         conn.sendall(b"nhan hello")
            # self.readSerial("")
            # time.sleep(2)
            # print("#############################")
            
            
a= GatewaySingleton("COM7")

a.read()






# AIO_FEED_IDs = ["DEN","GAS","DOOR"]
# AIO_USERNAME = "DOAN_IoT"
# AIO_KEY = "aio_cSEX44cnmDwF90QprbMTKGDSrIy9"
# client = MQTTClient ( AIO_USERNAME , AIO_KEY )

# def connected ( client ) :
#     print ("Ket noi thanh cong ...")
#     for AIO_FEED_ID in AIO_FEED_IDs:
#         client.subscribe( AIO_FEED_ID )

# def subscribe( client , userdata , mid , granted_qos ) :
#     print ("Subcribe thanh cong ...")

# def disconnected ( client ) :
#     print ("Ngat ket noi ...")
#     sys.exit(1)

# def message ( client , feed_id , payload ):
#     print ("Nhan du lieu : " + payload )
#     ser.write((str(payload) + "#").encode())

# def getPort():
#     ports= serial.tools.list_ports.comports()
#     N= len(ports)
#     comPorts= "None"
#     for i in range(0, N):
#         port= ports[i]
#         strPort= str(port)
#         if "COM10" in strPort:
#             splitPort= strPort.split(" ")
#             comPorts= splitPort[0]
#             print(comPorts)
#     return comPorts

# try:
#     ser = serial.Serial( port=getPort(), baudrate=115200)
#     print("connected microbit")
# except:
#     print("Can not found microbit port!")

# mess = ""
# def processData(data): ## kiểu dữ liệu được gửi đi: !ID:FIELD:VALUE#, ID= 1,2,3,4,.. , FIELD: tên loại thiết bị
#     data = data.replace("!", "")
#     data = data.replace("#", "")
#     splitData = data.split(":")
#     print(splitData)
#     if len(splitData) == 3:
#         if splitData[1] == "GAS":
#             DeviceController(splitData[0], splitData[2], splitData[1])
#             client.publish(AIO_FEED_IDs[1], splitData[2])
#         elif splitData[1] == "LIGHT":
#             DeviceController(splitData[0], splitData[2], splitData[1])
#             client.publish(AIO_FEED_IDs[0], splitData[2])
#         elif splitData[1] == "DOOR":
#             DeviceController(splitData[0], splitData[2], splitData[1])
#             client.publish(AIO_FEED_IDs[2], splitData[2])

# mess = ""
# def readSerial():
#     bytesToRead = ser.inWaiting ()
#     if ( bytesToRead > 0) :
#         global mess
#         mess = mess + ser.read( bytesToRead ).decode("UTF -8")
#         while ("#" in mess ) and ("!" in mess ) :
#             start = mess.find ("!")
#             end = mess.find ("#")
#             processData ( mess [ start : end + 1])
#             if ( end == len( mess )) :
#                 mess = ""
#             else :
#                 mess = mess [ end +1:]

# client.on_connect = connected
# client.on_disconnect = disconnected
# client.on_message = message
# client.on_subscribe = subscribe
# client.connect ()
# client.loop_background ()

# while True :
#     readSerial()
#     print("#############################################################################")
#     time.sleep(5)