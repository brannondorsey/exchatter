#Generating message backups

Script taken from <https://github.com/toffer/iphone-sms-backup>. More info there.

1. Plug in phone and back up using iTunes. Make sure that you select back up to __your computer__ and not iCloud.
2. Open terminal and `cd` to the directory that contains `ams-backup.py`.
3. From there, export all of your messages with this command:

`python sms-backup.py -f json -o messages.json`
