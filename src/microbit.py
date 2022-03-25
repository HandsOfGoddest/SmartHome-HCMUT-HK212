def on_forever():
    if pins.analog_read_pin(AnalogPin.P2) >= 500:
        pins.digital_write_pin(DigitalPin.P0, 0)
        pins.digital_write_pin(DigitalPin.P1, 1)
    else:
        pins.digital_write_pin(DigitalPin.P0, 1)
        pins.digital_write_pin(DigitalPin.P1, 0)
basic.forever(on_forever)

def on_forever2():
    serial.write_string("!1:GAS:" + str(pins.analog_read_pin(AnalogPin.P2)) + "#")
    serial.write_string("!1:DOOR:" + str(pins.analog_read_pin(AnalogPin.P4)) + "#")
    serial.write_string("!1:DEN:" + str(pins.analog_read_pin(AnalogPin.P3)) + "#")
    basic.pause(5000)
basic.forever(on_forever2)