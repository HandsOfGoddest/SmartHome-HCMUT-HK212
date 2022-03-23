init to adafruit: 
    npm install -g forever adafruit-io
    adafruit-io client config -u DOAN_IoT -k aio_dInI88dAWj1BiPy5AGxXOswL1bqi

get feeds data:
    adafruit-io client feeds help
    Usage: adafruit-io client feeds <action>

    Actions:
    all      All feeds for current user
    create   Create a new Feed
    destroy  Delete an existing Feed
    get      Get feed by ID, Feed key, or Feed Name
    update   Update properties of an existing Feed
    replace  Replace an existing Feed
    watch    Listen for new values
    help     Show help