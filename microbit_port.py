import serial.tools.list_ports

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
    ser= serial.Serial(port = getPort(), baudrate= 115200)
except:
    print("Can not found microbit port!")