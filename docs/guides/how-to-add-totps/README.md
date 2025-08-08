# How to add 2FA TOTP records (keys) on app

### If you use default 2FA otpauth:// links

To add 2FA TOTP records using 2FA TOTP QR-Codes, you must scan QR-Code of service providing 2FA and scan (decode) it to a URI. If you have screenshot of QR-Code -- scan it on any app providing scan from image, ex: Search screen on Google Assistant. For example, this QR-Code will represent next URI string:

![QR Code with URI](image.png)

Copy this URI string and paste it to app using button _"Add new TOTP record"_:

![Add new TOTP record popup](image-2.png)

Then press OK, record will appear on page

![Added record](image-4.png)

### If you use google migrations (otpauth-migration:// links)

To add 2FA TOTP records using migration from Google Authenticator app, you must go to menu, select "Transfer accounts" -> "Export accounts"

Select codes then screenshot QR code and scan (decode) it to a URI. Use any app providing scan from image, ex: "Search screen" function (Google Lens) on Google Assistant.

For example, this QR-Code will represent next URI string:

![Google lens scan from Google Authenticator](image-5.png)

After scaning copy this URI string and paste it to app using button _"Add new TOTP record"_:

![Add new TOTP record using otpauth-migration](image-6.png)

Then press OK, all selected records from Google Authenticator will appear on page

![Added records from otpauth-migration](image-7.png)

### If you use Proton Authenticator

To add 2FA TOTP records from Proton Authenticator you must go to settings and press "Export":
![alt text](photo_2025-08-08_17-10-27.jpg)

After this save file and open it on text editor:

![alt text](photo_2025-08-08_17-10-35.jpg)

![alt text](photo_2025-08-08_17-10-41.jpg)

Copy all stuff from file at clipboard and import in application:

![alt text](photo_2025-08-08_17-10-38.jpg)

![alt text](<Снимок экрана_20250808_170854.png>)

Then press OK, records will appear on page:

![alt text](<Снимок экрана_20250808_170912.png>)
