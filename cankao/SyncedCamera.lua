do
    --[[
    =============================================================================================================================================================
                                                                       Synced Camera
                                                                        by Antares

                                            Continuously syncs player camera parameters and writes them into a table.

                                Requires:
								TotalInitialization			    https://www.hiveworkshop.com/threads/.317099/

    =============================================================================================================================================================
    ]]

    local TIME_STEP     = 0.02

    local zeroTable     = {__index = function(self, key) return 0 end}

    SyncedCamera = {
        EyeX = setmetatable({}, zeroTable),
        EyeY = setmetatable({}, zeroTable),
        EyeZ = setmetatable({}, zeroTable),
        AngleOfAttack = setmetatable({}, zeroTable),
        Rotation = setmetatable({}, zeroTable),
        FieldOfView = setmetatable({}, zeroTable),
        TargetDistance = setmetatable({}, zeroTable)
    }

    --===========================================================================================================================================================

    local EPSILON       = 0.001
    local localPlayer
    local syncReady     = {}
    local abs           = math.abs

    OnInit.final(function()
        localPlayer = GetLocalPlayer()

        local trig = CreateTrigger()
        for i = 0, bj_MAX_PLAYER_SLOTS - 1 do
            syncReady[Player(i)] = true
            BlzTriggerRegisterPlayerSyncEvent(trig, Player(i), "SyncCamera", false)
        end
        TriggerAddAction(trig, function()
            local data = BlzGetTriggerSyncData()

            local nextComma = data:find(",")
            local player = Player(tonumber(data:sub(1, nextComma - 1)) - 1)
            data = data:sub(nextComma + 1, data:len())
            nextComma = data:find(",")
            SyncedCamera.EyeX[player] = tonumber(data:sub(1, nextComma - 1))
            data = data:sub(nextComma + 1, data:len())
            nextComma = data:find(",")
            SyncedCamera.EyeY[player] = tonumber(data:sub(1, nextComma - 1))
            data = data:sub(nextComma + 1, data:len())
            nextComma = data:find(",")
            SyncedCamera.EyeZ[player] = tonumber(data:sub(1, nextComma - 1))
            data = data:sub(nextComma + 1, data:len())
            nextComma = data:find(",")
            SyncedCamera.AngleOfAttack[player] = tonumber(data:sub(1, nextComma - 1))
            data = data:sub(nextComma + 1, data:len())
            nextComma = data:find(",")
            SyncedCamera.Rotation[player] = tonumber(data:sub(1, nextComma - 1))
            data = data:sub(nextComma + 1, data:len())
            nextComma = data:find(",")
            SyncedCamera.FieldOfView[player] = tonumber(data:sub(1, nextComma - 1))
            data = data:sub(nextComma + 1, data:len())
            SyncedCamera.TargetDistance[player] = tonumber(data)

            syncReady[player] = true
        end)

        TimerStart(CreateTimer(), TIME_STEP, true, function()
            local eyeX = GetCameraEyePositionX()
            local eyeY = GetCameraEyePositionY()
            local eyeZ = GetCameraEyePositionZ()
            local angleOfAttack = GetCameraField(CAMERA_FIELD_ANGLE_OF_ATTACK)
            local rotation = GetCameraField(CAMERA_FIELD_ROTATION)
            local fieldOfView = GetCameraField(CAMERA_FIELD_FIELD_OF_VIEW)
            local targetDistance = GetCameraField(CAMERA_FIELD_TARGET_DISTANCE)

            if syncReady[localPlayer] and (abs(eyeX - SyncedCamera.EyeX[localPlayer]) > EPSILON or
            abs(eyeY - SyncedCamera.EyeY[localPlayer]) > EPSILON or
            abs(eyeZ - SyncedCamera.EyeZ[localPlayer]) > EPSILON or
            abs(angleOfAttack - SyncedCamera.AngleOfAttack[localPlayer]) > EPSILON or
            abs(rotation - SyncedCamera.Rotation[localPlayer]) > EPSILON or
            abs(fieldOfView - SyncedCamera.FieldOfView[localPlayer]) > EPSILON or
            abs(targetDistance - SyncedCamera.TargetDistance[localPlayer]) > EPSILON) then
                syncReady[localPlayer] = false
                BlzSendSyncData("SyncCamera",
                    GetPlayerId(localPlayer) + 1 .. ","
                    .. tostring(eyeX) .. ","
                    .. tostring(eyeY) .. ","
                    .. tostring(eyeZ) .. ","
                    .. tostring(angleOfAttack) .. ","
                    .. tostring(rotation) .. ","
                    .. tostring(fieldOfView) .. ","
                    .. tostring(targetDistance))
            end
        end)
    end)
end