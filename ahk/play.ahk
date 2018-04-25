#Persistent
#SingleInstance force

TargetExecutionDate := %0%

MsgBox, % TargetExecutionDate

if (not A_IsAdmin)
{
    MsgBox, restarting app
    Run *RunAs %A_ScriptFullPath% %1%
    ExitApp
}

if (!TargetExecutionDate)
{
    MsgBox, Electron failed to pass execution param
    ExitApp
}

SystemTimeMsDelta := GetSystemTimeMsDelta()

TargetExecutionDiffMs := ((DateDiff(A_Now, TargetExecutionDate, "Seconds") * 1000) - SystemTimeMsDelta) * -1

MsgBox, %TargetExecutionDiffMs%

SetTimer, Play, %TargetExecutionDiffMs%

return

F2::Play()

Play()
{
    static PLAY_BUTTON_X_PERCENTAGE := 88.54
    static PLAY_BUTTON_Y_PERCENTAGE := 87.03
    PlayButtonX := A_ScreenWidth * (PLAY_BUTTON_X_PERCENTAGE  / 100)
    PlayButtonY := A_ScreenHeight * (PLAY_BUTTON_Y_PERCENTAGE  / 100)
    WinActivate, Fortnite
    BlockInput, On
    Click, %PlayButtonX%, %PlayButtonY%
    BlockInput, Off
    ExitApp
}

GetSystemTimeMsDelta()
{
    static SYSTEMTIME, init := VarSetCapacity(SYSTEMTIME, 16, 0) && NumPut(16, SYSTEMTIME, "UShort")
    DllCall("kernel32.dll\GetSystemTime", "Ptr", &SYSTEMTIME, "Ptr")
    return NumGet(SYSTEMTIME, 14, "UShort")
}

DateDiff(StartDate, EndDate, unit)
{
    Diff := EndDate
    Diff -= StartDate, %unit%
    return Diff
}
