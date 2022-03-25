import sys
from Adafruit_IO import MQTTClient
import serial.tools.list_ports
import random
import time

AIO_FEED_IDs = ["DEN","GAS","DOOR"]
AIO_USERNAME = "DOAN_IoT"
AIO_KEY = "aio_WQDc82glCE3sNbbVLz0UqDGJrPKD"

def connected ( client ) :
    print ("Ket noi thanh cong ...")
    for AIO_FEED_ID in AIO_FEED_IDs:
        client.subscribe( AIO_FEED_ID )

def subscribe( client , userdata , mid , granted_qos ) :
    print ("Subcribe thanh cong ...")

def disconnected ( client ) :
    print ("Ngat ket noi ...")
    sys.exit(1)

def message ( client , feed_id , payload ):
    print ("Nhan du lieu : " + payload )
    ser.write((str(payload) + "#").encode())

def getPort():
    ports= serial.tools.list_ports.comports()
    N= len(ports)
    comPorts= "None"
    for i in range(0, N):
        port= ports[i]
        strPort= str(port)
        if "USB Serial Device" in strPort:
            splitPort= strPort.split(" ")
            comPorts= splitPort[0]
    return comPorts

try:
    ser = serial.Serial( port=getPort(), baudrate=115200)
    print("connected microbit")
except:
    print("Can not found microbit port!")
mess = ""
def processData(data): ## kiểu dữ liệu được gửi đi: !ID:FIELD:VALUE#, ID= 1,2,3,4,.. , FIELD: tên loại thiết bị
    data = data.replace("!", "")
    data = data.replace("#", "")
    splitData = data.split(":")
    print(splitData)
    if len(splitData) == 3:
        if splitData[1] == "GAS":
            client.publish(AIO_FEED_IDs[1], splitData[2])
        elif splitData[1] == "DEN":
            client.publish(AIO_FEED_IDs[0], splitData[2])
        elif splitData[1] == "DOOR":
            client.publish(AIO_FEED_IDs[2], splitData[2])

mess = ""
def readSerial():
    bytesToRead = ser.inWaiting ()
    if ( bytesToRead > 0) :
        global mess
        mess = mess + ser.read( bytesToRead ).decode("UTF -8")
        while ("#" in mess ) and ("!" in mess ) :
            start = mess.find ("!")
            end = mess.find ("#")
            processData ( mess [ start : end + 1])
            if ( end == len( mess )) :
                mess = ""
            else :
                mess = mess [ end +1:]

client = MQTTClient ( AIO_USERNAME , AIO_KEY )
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect ()
client.loop_background ()

while True :
    # value = random.randint(0, 100)
    # print("Cap nhat:", value)
    # client.publish(AIO_FEED_IDs, value)
    # time.sleep(2)
    readSerial()
    print("#############################################################################")
    time.sleep(30)