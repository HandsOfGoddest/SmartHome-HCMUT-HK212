import sys
import required
module= sys.path[0] + '\\' + 'models'
sys.path.insert(0, module)
import datetime

## Import models class ##
from UserModel import *
from RoomModel import *
from RecordsModel import *
from DevicesModel import *
##########################

def create_rdata():
    try:
        user1 = User(
            name="Híu",
            phoneNumber="0888111999",
            userID="00001",
            dateOfBirth=datetime.datetime(2001, 1, 29),
            password="HOGS",
            homeTown="Ninh Bình",
            isAdmin=True,
        ).save()
        user2 = User(
            name="Cừn",
            phoneNumber="0888112999",
            userID="00002",
            dateOfBirth=datetime.datetime(2001, 7, 28),
            password="CuongOCD",
            homeTown="Kon Tum",
        ).save()
        user3 = User(
            name="Tòn",
            phoneNumber="0888113999",
            userID="00003",
            dateOfBirth=datetime.datetime(2001, 12, 4),
            password="Toncutedth",
            homeTown="Bến Tre",
        ).save()
        user4 = User(
            name="Rin",
            phoneNumber="0888114999",
            userID="00004",
            dateOfBirth=datetime.datetime(2001, 5, 15),
            password="Rincute123",
            homeTown="Thanh Hóa",
        ).save()
        user5 = User(
            name="Việt",
            phoneNumber="0888115999",
            userID="00005",
            dateOfBirth=datetime.datetime(2001, 9, 9),
            password="TQV",
            homeTown="Nghệ An",
        ).save()

        room1 = Room(
            Id=1,
            owner="Hiếu",
        ).save()

        room2 = Room(
            Id=2,
            owner="Hiếu",
        ).save()

        room3 = Room(
            Id=3,
            owner="Hiếu",
        ).save()

        room4 = Room(
            Id=4,
            owner="Hiếu",
        ).save()

        room5 = Room(
            Id=5,
            owner="Hiếu",
        ).save()
        print("Add successfuly")
    except:
        print("There is a error while add!")

def delete_all_rdata():
    try:
        if(User.objects ):  User.objects.delete()
        if(Room.objects ): Room.objects.delete()
        print("Delete Successfully")
    except:
        print("Can not delete all rdata")

def controller(*argv):
    # for arg in argv:
    if(len(argv[0]) == 2):
        arg = argv[0][1]
        if (arg == "-c"):
            create_rdata()
        elif (arg == "-d"):
            delete_all_rdata()
        else:
            print("Vui long nhap:")
            print("py seeder.py -c: de khoi tao du lieu")
            print("py seeder.py -d: de xoa du lieu")
    else:
        print("Vui long nhap:")
        print("py seeder.py -c: de khoi tao du lieu")
        print("py seeder.py -d: de xoa du lieu")

if __name__ == "__main__":
    controller(sys.argv)
