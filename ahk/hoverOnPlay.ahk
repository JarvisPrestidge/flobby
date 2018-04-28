#NoTrayIcon
#SingleInstance force

PLAY_BUTTON_X_PERCENTAGE := 88.54
PLAY_BUTTON_Y_PERCENTAGE := 87.03
PlayButtonX := A_ScreenWidth * (PLAY_BUTTON_X_PERCENTAGE  / 100)
PlayButtonY := A_ScreenHeight * (PLAY_BUTTON_Y_PERCENTAGE  / 100)
MouseMove, %PlayButtonX%, %PlayButtonY%, 0
