#NoTrayIcon
#SingleInstance force

PLAY_BUTTON_X_PERCENTAGE := 50
PLAY_BUTTON_Y_PERCENTAGE := 92
PlayButtonX := A_ScreenWidth * (PLAY_BUTTON_X_PERCENTAGE  / 100)
PlayButtonY := A_ScreenHeight * (PLAY_BUTTON_Y_PERCENTAGE  / 100)
MouseMove, %PlayButtonX%, %PlayButtonY%, 0
Sleep 50
Click
