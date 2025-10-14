local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____destructable = require("lua_modules.@eiriksgata.wc3ts.src.handles.destructable")
local Destructable = ____destructable.Destructable
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____item = require("lua_modules.@eiriksgata.wc3ts.src.handles.item")
local Item = ____item.Item
local ____player = require("lua_modules.@eiriksgata.wc3ts.src.handles.player")
local MapPlayer = ____player.MapPlayer
local ____point = require("lua_modules.@eiriksgata.wc3ts.src.handles.point")
local Point = ____point.Point
local ____widget = require("lua_modules.@eiriksgata.wc3ts.src.handles.widget")
local Widget = ____widget.Widget
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
local bj_UNIT_FACING = ____define.bj_UNIT_FACING
local UNIT_STATE_ATTACK_BONUS = ____define.UNIT_STATE_ATTACK_BONUS
local UNIT_STATE_ATTACK_SPACE = ____define.UNIT_STATE_ATTACK_SPACE
local UNIT_STATE_ATTACK_SPEED = ____define.UNIT_STATE_ATTACK_SPEED
local UNIT_STATE_ATTACK_WHITE = ____define.UNIT_STATE_ATTACK_WHITE
local UNIT_STATE_DEFEND_WHITE = ____define.UNIT_STATE_DEFEND_WHITE
local UNIT_STATE_MANA = ____define.UNIT_STATE_MANA
local UNIT_STATE_MAX_LIFE = ____define.UNIT_STATE_MAX_LIFE
local UNIT_STATE_MAX_MANA = ____define.UNIT_STATE_MAX_MANA
local UNIT_TYPE_DEAD = ____define.UNIT_TYPE_DEAD
____exports.Unit = __TS__Class()
local Unit = ____exports.Unit
Unit.name = "Unit"
__TS__ClassExtends(Unit, Widget)
function Unit.prototype.____constructor(self, owner, unitId, x, y, face)
    if Handle:initFromHandle() == true then
        Widget.prototype.____constructor(self)
        return
    end
    if face == nil then
        face = bj_UNIT_FACING
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        face
    )
    if handle == nil then
        Error(nil, "w3ts failed to create unit handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Unit.create(self, owner, unitId, x, y, face, skinId)
    if face == nil then
        face = bj_UNIT_FACING
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        face
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Unit.prototype.addAbility(self, abilityId)
    return UnitAddAbility(self.handle, abilityId)
end
function Unit.prototype.addAnimationProps(self, animProperties, add)
    AddUnitAnimationProperties(self.handle, animProperties, add)
end
function Unit.prototype.addExperience(self, xpToAdd, showEyeCandy)
    AddHeroXP(self.handle, xpToAdd, showEyeCandy)
end
function Unit.prototype.addIndicator(self, red, blue, green, alpha)
    UnitAddIndicator(
        self.handle,
        red,
        blue,
        green,
        alpha
    )
end
function Unit.prototype.addItem(self, whichItem)
    return UnitAddItem(self.handle, whichItem.handle)
end
function Unit.prototype.addItemById(self, itemId)
    return Item:fromHandle(UnitAddItemById(self.handle, itemId))
end
function Unit.prototype.addItemToSlotById(self, itemId, itemSlot)
    return UnitAddItemToSlotById(self.handle, itemId, itemSlot)
end
function Unit.prototype.addItemToStock(self, itemId, currentStock, stockMax)
    AddItemToStock(self.handle, itemId, currentStock, stockMax)
end
function Unit.prototype.addResourceAmount(self, amount)
    AddResourceAmount(self.handle, amount)
end
function Unit.prototype.addSleepPerm(self, add)
    UnitAddSleepPerm(self.handle, add)
end
function Unit.prototype.addType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.addUnitToStock(self, unitId, currentStock, stockMax)
    AddUnitToStock(self.handle, unitId, currentStock, stockMax)
end
function Unit.prototype.applyTimedLife(self, buffId, duration)
    UnitApplyTimedLife(self.handle, buffId, duration)
end
function Unit.prototype.attachSound(self, sound)
    AttachSoundToUnit(sound.handle, self.handle)
end
function Unit.prototype.canSleepPerm(self)
    return UnitCanSleepPerm(self.handle)
end
function Unit.prototype.countBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitCountBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.damageAt(self, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamagePoint(
        self.handle,
        delay,
        radius,
        x,
        y,
        amount,
        attack,
        ranged,
        attackType,
        damageType,
        weaponType
    )
end
function Unit.prototype.damageTarget(self, target, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamageTarget(
        self.handle,
        target,
        amount,
        attack,
        ranged,
        attackType,
        damageType,
        weaponType
    )
end
function Unit.prototype.decAbilityLevel(self, abilCode)
    return DecUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.destroy(self)
    RemoveUnit(self.handle)
end
function Unit.prototype.dropItem(self, whichItem, x, y)
    return UnitDropItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.dropItemFromSlot(self, whichItem, slot)
    return UnitDropItemSlot(self.handle, whichItem.handle, slot)
end
function Unit.prototype.dropItemTarget(self, whichItem, target)
    return UnitDropItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.getAbilityLevel(self, abilCode)
    return GetUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.getAgility(self, includeBonuses)
    return GetHeroAgi(self.handle, includeBonuses)
end
function Unit.prototype.getflyHeight(self)
    return GetUnitFlyHeight(self.handle)
end
function Unit.prototype.getHeroLevel(self)
    return GetHeroLevel(self.handle)
end
function Unit.prototype.getIgnoreAlarm(self, flag)
    return UnitIgnoreAlarm(self.handle, flag)
end
function Unit.prototype.getIntelligence(self, includeBonuses)
    return GetHeroInt(self.handle, includeBonuses)
end
function Unit.prototype.getItemInSlot(self, slot)
    return Item:fromHandle(UnitItemInSlot(self.handle, slot))
end
function Unit.prototype.getState(self, whichUnitState)
    return GetUnitState(self.handle, whichUnitState)
end
function Unit.prototype.getStrength(self, includeBonuses)
    return GetHeroStr(self.handle, includeBonuses)
end
function Unit.prototype.hasBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitHasBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.hasItem(self, whichItem)
    return UnitHasItem(self.handle, whichItem.handle)
end
function Unit.prototype.incAbilityLevel(self, abilCode)
    return IncUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.inForce(self, whichForce)
    return IsUnitInForce(self.handle, whichForce.handle)
end
function Unit.prototype.inGroup(self, whichGroup)
    return IsUnitInGroup(self.handle, whichGroup.handle)
end
function Unit.prototype.inRange(self, x, y, distance)
    return IsUnitInRangeXY(self.handle, x, y, distance)
end
function Unit.prototype.inRangeOfPoint(self, whichPoint, distance)
    return IsUnitInRangeLoc(self.handle, whichPoint.handle, distance)
end
function Unit.prototype.inRangeOfUnit(self, otherUnit, distance)
    return IsUnitInRange(self.handle, otherUnit.handle, distance)
end
function Unit.prototype.inTransport(self, whichTransport)
    return IsUnitInTransport(self.handle, whichTransport.handle)
end
function Unit.prototype.isAlive(self)
    return not IsUnitType(
        self.handle,
        UNIT_TYPE_DEAD()
    )
end
function Unit.prototype.isAlly(self, whichPlayer)
    return IsUnitAlly(self.handle, whichPlayer.handle)
end
function Unit.prototype.isEnemy(self, whichPlayer)
    return IsUnitEnemy(self.handle, whichPlayer.handle)
end
function Unit.prototype.isExperienceSuspended(self)
    return IsSuspendedXP(self.handle)
end
function Unit.prototype.isFogged(self, whichPlayer)
    return IsUnitFogged(self.handle, whichPlayer.handle)
end
function Unit.prototype.isHero(self)
    return IsHeroUnitId(self.typeId)
end
function Unit.prototype.isIllusion(self)
    return IsUnitIllusion(self.handle)
end
function Unit.prototype.isLoaded(self)
    return IsUnitLoaded(self.handle)
end
function Unit.prototype.isMasked(self, whichPlayer)
    return IsUnitMasked(self.handle, whichPlayer.handle)
end
function Unit.prototype.isSelected(self, whichPlayer)
    return IsUnitSelected(self.handle, whichPlayer.handle)
end
function Unit.prototype.issueBuildOrder(self, unit, x, y)
    local ____temp_0
    if type(unit) == "string" then
        ____temp_0 = IssueBuildOrder(self.handle, unit, x, y)
    else
        ____temp_0 = IssueBuildOrderById(self.handle, unit, x, y)
    end
    return ____temp_0
end
function Unit.prototype.issueImmediateOrder(self, order)
    local ____temp_1
    if type(order) == "string" then
        ____temp_1 = IssueImmediateOrder(self.handle, order)
    else
        ____temp_1 = IssueImmediateOrderById(self.handle, order)
    end
    return ____temp_1
end
function Unit.prototype.issueInstantOrderAt(self, order, x, y, instantTargetWidget)
    local ____temp_2
    if type(order) == "string" then
        ____temp_2 = IssueInstantPointOrder(
            self.handle,
            order,
            x,
            y,
            instantTargetWidget.handle
        )
    else
        ____temp_2 = IssueInstantPointOrderById(
            self.handle,
            order,
            x,
            y,
            instantTargetWidget.handle
        )
    end
    return ____temp_2
end
function Unit.prototype.issueInstantTargetOrder(self, order, targetWidget, instantTargetWidget)
    local ____temp_3
    if type(order) == "string" then
        ____temp_3 = IssueInstantTargetOrder(self.handle, order, targetWidget.handle, instantTargetWidget.handle)
    else
        ____temp_3 = IssueInstantTargetOrderById(self.handle, order, targetWidget.handle, instantTargetWidget.handle)
    end
    return ____temp_3
end
function Unit.prototype.issueOrderAt(self, order, x, y)
    local ____temp_4
    if type(order) == "string" then
        ____temp_4 = IssuePointOrder(self.handle, order, x, y)
    else
        ____temp_4 = IssuePointOrderById(self.handle, order, x, y)
    end
    return ____temp_4
end
function Unit.prototype.issuePointOrder(self, order, whichPoint)
    local ____temp_5
    if type(order) == "string" then
        ____temp_5 = IssuePointOrderLoc(self.handle, order, whichPoint.handle)
    else
        ____temp_5 = IssuePointOrderByIdLoc(self.handle, order, whichPoint.handle)
    end
    return ____temp_5
end
function Unit.prototype.issueTargetOrder(self, order, targetWidget)
    local ____temp_6
    if type(order) == "string" then
        ____temp_6 = IssueTargetOrder(self.handle, order, targetWidget.handle)
    else
        ____temp_6 = IssueTargetOrderById(self.handle, order, targetWidget.handle)
    end
    return ____temp_6
end
function Unit.prototype.isUnit(self, whichSpecifiedUnit)
    return IsUnit(self.handle, whichSpecifiedUnit.handle)
end
function Unit.prototype.isUnitType(self, whichUnitType)
    return IsUnitType(self.handle, whichUnitType)
end
function Unit.prototype.isVisible(self, whichPlayer)
    return IsUnitVisible(self.handle, whichPlayer.handle)
end
function Unit.prototype.kill(self)
    KillUnit(self.handle)
end
function Unit.prototype.lookAt(self, whichBone, lookAtTarget, offsetX, offsetY, offsetZ)
    SetUnitLookAt(
        self.handle,
        whichBone,
        lookAtTarget.handle,
        offsetX,
        offsetY,
        offsetZ
    )
end
function Unit.prototype.makeAbilityPermanent(self, permanent, abilityId)
    UnitMakeAbilityPermanent(self.handle, permanent, abilityId)
end
function Unit.prototype.modifySkillPoints(self, skillPointDelta)
    return UnitModifySkillPoints(self.handle, skillPointDelta)
end
function Unit.prototype.pauseEx(self, flag)
    PauseUnit(self.handle, flag)
end
function Unit.prototype.pauseTimedLife(self, flag)
    UnitPauseTimedLife(self.handle, flag)
end
function Unit.prototype.queueAnimation(self, whichAnimation)
    QueueUnitAnimation(self.handle, whichAnimation)
end
function Unit.prototype.recycleGuardPosition(self)
    RecycleGuardPosition(self.handle)
end
function Unit.prototype.removeAbility(self, abilityId)
    return UnitRemoveAbility(self.handle, abilityId)
end
function Unit.prototype.removeBuffs(self, removePositive, removeNegative)
    UnitRemoveBuffs(self.handle, removePositive, removeNegative)
end
function Unit.prototype.removeBuffsEx(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    UnitRemoveBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.removeGuardPosition(self)
    RemoveGuardPosition(self.handle)
end
function Unit.prototype.removeItem(self, whichItem)
    UnitRemoveItem(self.handle, whichItem.handle)
end
function Unit.prototype.removeItemFromSlot(self, itemSlot)
    return Item:fromHandle(UnitRemoveItemFromSlot(self.handle, itemSlot))
end
function Unit.prototype.removeItemFromStock(self, itemId)
    RemoveItemFromStock(self.handle, itemId)
end
function Unit.prototype.removeType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.removeUnitFromStock(self, itemId)
    RemoveUnitFromStock(self.handle, itemId)
end
function Unit.prototype.resetCooldown(self)
    UnitResetCooldown(self.handle)
end
function Unit.prototype.resetLookAt(self)
    ResetUnitLookAt(self.handle)
end
function Unit.prototype.revive(self, x, y, doEyecandy)
    return ReviveHero(self.handle, x, y, doEyecandy)
end
function Unit.prototype.reviveAtPoint(self, whichPoint, doEyecandy)
    return ReviveHeroLoc(self.handle, whichPoint.handle, doEyecandy)
end
function Unit.prototype.select(self, flag)
    SelectUnit(self.handle, flag)
end
function Unit.prototype.selectSkill(self, abilCode)
    SelectHeroSkill(self.handle, abilCode)
end
function Unit.prototype.setAbilityLevel(self, abilCode, level)
    return SetUnitAbilityLevel(self.handle, abilCode, level)
end
function Unit.prototype.setAgility(self, value, permanent)
    SetHeroAgi(self.handle, value, permanent)
end
function Unit.prototype.setAnimation(self, whichAnimation)
    if type(whichAnimation) == "string" then
        SetUnitAnimation(self.handle, whichAnimation)
    else
        SetUnitAnimationByIndex(self.handle, whichAnimation)
    end
end
function Unit.prototype.setAnimationWithRarity(self, whichAnimation, rarity)
    SetUnitAnimationWithRarity(self.handle, whichAnimation, rarity)
end
function Unit.prototype.setBaseDamageJAPI(self, baseDamage)
    self:setState(
        UNIT_STATE_ATTACK_WHITE(),
        baseDamage
    )
end
function Unit.prototype.setBonusDamageJAPI(self, bonusDamage)
    self:setState(
        UNIT_STATE_ATTACK_BONUS(),
        bonusDamage
    )
end
function Unit.prototype.setBlendTime(self, timeScale)
    SetUnitBlendTime(self.handle, timeScale)
end
function Unit.prototype.setConstructionProgress(self, constructionPercentage)
    UnitSetConstructionProgress(self.handle, constructionPercentage)
end
function Unit.prototype.setCreepGuard(self, creepGuard)
    SetUnitCreepGuard(self.handle, creepGuard)
end
function Unit.prototype.setExperience(self, newXpVal, showEyeCandy)
    SetHeroXP(self.handle, newXpVal, showEyeCandy)
end
function Unit.prototype.setExploded(self, exploded)
    SetUnitExploded(self.handle, exploded)
end
function Unit.prototype.setFacingEx(self, facingAngle)
    SetUnitFacing(self.handle, facingAngle)
end
function Unit.prototype.setflyHeight(self, value, rate)
    SetUnitFlyHeight(self.handle, value, rate)
end
function Unit.prototype.setHeroLevel(self, level, showEyeCandy)
    SetHeroLevel(self.handle, level, showEyeCandy)
end
function Unit.prototype.setIntelligence(self, value, permanent)
    SetHeroInt(self.handle, value, permanent)
end
function Unit.prototype.setItemTypeSlots(self, slots)
    SetItemTypeSlots(self.handle, slots)
end
function Unit.prototype.setOwner(self, whichPlayer, changeColor)
    if changeColor == nil then
        changeColor = true
    end
    SetUnitOwner(self.handle, whichPlayer.handle, changeColor)
end
function Unit.prototype.getOwner(self)
    return MapPlayer:fromHandle(GetOwningPlayer(self.handle))
end
function Unit.prototype.setPoint(self, point)
    SetUnitPositionLoc(self.handle, point.handle)
end
function Unit.prototype.getPoint(self)
    return Point:fromHandle(GetUnitLoc(self.handle))
end
function Unit.prototype.setPathing(self, flag)
    SetUnitPathing(self.handle, flag)
end
function Unit.prototype.setPosition(self, x, y)
    SetUnitPosition(self.handle, x, y)
end
function Unit.prototype.setRescuable(self, byWhichPlayer, flag)
    SetUnitRescuable(self.handle, byWhichPlayer.handle, flag)
end
function Unit.prototype.setRescueRange(self, range)
    SetUnitRescueRange(self.handle, range)
end
function Unit.prototype.setScale(self, scaleX, scaleY, scaleZ)
    SetUnitScale(self.handle, scaleX, scaleY, scaleZ)
end
function Unit.prototype.setState(self, whichUnitState, newVal)
    SetUnitState(self.handle, whichUnitState, newVal)
end
function Unit.prototype.setStrength(self, value, permanent)
    SetHeroStr(self.handle, value, permanent)
end
function Unit.prototype.setTimeScale(self, timeScale)
    SetUnitTimeScale(self.handle, timeScale)
end
function Unit.prototype.setUnitAttackCooldownJAPI(self, cooldown)
    self:setState(
        UNIT_STATE_ATTACK_SPACE(),
        cooldown
    )
end
function Unit.prototype.setUnitAttackSpeedJAPI(self, attacksPerSecond)
    self:setState(
        UNIT_STATE_ATTACK_SPEED(),
        attacksPerSecond
    )
end
function Unit.prototype.setUnitTypeSlots(self, slots)
    SetUnitTypeSlots(self.handle, slots)
end
function Unit.prototype.setUpgradeProgress(self, upgradePercentage)
    UnitSetUpgradeProgress(self.handle, upgradePercentage)
end
function Unit.prototype.setUseAltIcon(self, flag)
    UnitSetUsesAltIcon(self.handle, flag)
end
function Unit.prototype.setUseFood(self, useFood)
    SetUnitUseFood(self.handle, useFood)
end
function Unit.prototype.setVertexColor(self, red, green, blue, alpha)
    SetUnitVertexColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Unit.prototype.shareVision(self, whichPlayer, share)
    UnitShareVision(self.handle, whichPlayer.handle, share)
end
function Unit.prototype.stripLevels(self, howManyLevels)
    return UnitStripHeroLevel(self.handle, howManyLevels)
end
function Unit.prototype.suspendDecay(self, suspend)
    UnitSuspendDecay(self.handle, suspend)
end
function Unit.prototype.suspendExperience(self, flag)
    SuspendHeroXP(self.handle, flag)
end
function Unit.prototype.useItem(self, whichItem)
    return UnitUseItem(self.handle, whichItem.handle)
end
function Unit.prototype.useItemAt(self, whichItem, x, y)
    return UnitUseItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.useItemTarget(self, whichItem, target)
    return UnitUseItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.wakeUp(self)
    UnitWakeUp(self.handle)
end
function Unit.prototype.waygateGetDestinationX(self)
    return WaygateGetDestinationX(self.handle)
end
function Unit.prototype.waygateGetDestinationY(self)
    return WaygateGetDestinationY(self.handle)
end
function Unit.prototype.waygateSetDestination(self, x, y)
    WaygateSetDestination(self.handle, x, y)
end
function Unit.foodMadeByType(self, unitId)
    return GetFoodMade(unitId)
end
function Unit.foodUsedByType(self, unitId)
    return GetFoodUsed(unitId)
end
function Unit.fromEnum(self)
    return self:fromHandle(GetEnumUnit())
end
function Unit.fromEvent(self)
    return self:fromHandle(GetTriggerUnit())
end
function Unit.fromFilter(self)
    return self:fromHandle(GetFilterUnit())
end
function Unit.fromHandle(self, handle)
    local ____handle_7
    if handle then
        ____handle_7 = self:getObject(handle)
    else
        ____handle_7 = nil
    end
    return ____handle_7
end
function Unit.getPointValueByType(self, unitType)
    return GetUnitPointValueByType(unitType)
end
function Unit.isUnitIdHero(self, unitId)
    return IsHeroUnitId(unitId)
end
function Unit.isUnitIdType(self, unitId, whichUnitType)
    return IsUnitIdType(unitId, whichUnitType)
end
function Unit.prototype.setPreselectUIVisible(self, value)
    DzSetUnitPreselectUIVisible(self.handle, value)
end
__TS__SetDescriptor(
    Unit.prototype,
    "acquireRange",
    {
        get = function(self)
            return GetUnitAcquireRange(self.handle)
        end,
        set = function(self, value)
            SetUnitAcquireRange(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "agility",
    {
        get = function(self)
            return GetHeroAgi(self.handle, false)
        end,
        set = function(self, value)
            SetHeroAgi(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "armor",
    {
        get = function(self)
            return GetUnitState(
                self.handle,
                UNIT_STATE_DEFEND_WHITE()
            )
        end,
        set = function(self, armorAmount)
            SetUnitState(
                self.handle,
                UNIT_STATE_DEFEND_WHITE(),
                armorAmount
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "canSleep",
    {
        get = function(self)
            return UnitCanSleep(self.handle)
        end,
        set = function(self, flag)
            UnitAddSleep(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "color",
    {set = function(self, whichColor)
        SetUnitColor(self.handle, whichColor)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "currentOrder",
    {get = function(self)
        return GetUnitCurrentOrder(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultAcquireRange",
    {get = function(self)
        return GetUnitDefaultAcquireRange(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultFlyHeight",
    {get = function(self)
        return GetUnitDefaultFlyHeight(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultMoveSpeed",
    {get = function(self)
        return GetUnitDefaultMoveSpeed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultPropWindow",
    {get = function(self)
        return GetUnitDefaultPropWindow(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultTurnSpeed",
    {get = function(self)
        return GetUnitDefaultTurnSpeed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "experience",
    {
        get = function(self)
            return GetHeroXP(self.handle)
        end,
        set = function(self, newXpVal)
            SetHeroXP(self.handle, newXpVal, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "facing",
    {
        get = function(self)
            return GetUnitFacing(self.handle)
        end,
        set = function(self, value)
            SetUnitFacing(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "foodMade",
    {get = function(self)
        return GetUnitFoodMade(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "foodUsed",
    {get = function(self)
        return GetUnitFoodUsed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "ignoreAlarmToggled",
    {get = function(self)
        return UnitIgnoreAlarmToggled(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "intelligence",
    {
        get = function(self)
            return GetHeroInt(self.handle, false)
        end,
        set = function(self, value)
            SetHeroInt(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "inventorySize",
    {get = function(self)
        return UnitInventorySize(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "invulnerable",
    {set = function(self, flag)
        SetUnitInvulnerable(self.handle, flag)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "level",
    {get = function(self)
        return GetUnitLevel(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "mana",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MANA())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MANA(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "maxLife",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MAX_LIFE())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MAX_LIFE(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "maxMana",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MAX_MANA())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MAX_MANA(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "moveSpeed",
    {
        get = function(self)
            return GetUnitMoveSpeed(self.handle)
        end,
        set = function(self, value)
            SetUnitMoveSpeed(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "name",
    {
        get = function(self)
            return GetUnitName(self.handle) or ""
        end,
        set = function(self, value)
            DzSetUnitName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "nameProper",
    {
        get = function(self)
            return GetHeroProperName(self.handle) or ""
        end,
        set = function(self, value)
            DzSetUnitProperName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "owner",
    {
        get = function(self)
            return MapPlayer:fromHandle(GetOwningPlayer(self.handle))
        end,
        set = function(self, whichPlayer)
            SetUnitOwner(self.handle, whichPlayer.handle, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "paused",
    {
        get = function(self)
            return IsUnitPaused(self.handle)
        end,
        set = function(self, flag)
            PauseUnit(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "point",
    {
        get = function(self)
            return Point:fromHandle(GetUnitLoc(self.handle))
        end,
        set = function(self, whichPoint)
            SetUnitPositionLoc(self.handle, whichPoint.handle)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "pointValue",
    {get = function(self)
        return GetUnitPointValue(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "propWindow",
    {
        get = function(self)
            return GetUnitPropWindow(self.handle)
        end,
        set = function(self, newPropWindowAngle)
            SetUnitPropWindow(self.handle, newPropWindowAngle)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "race",
    {get = function(self)
        return GetUnitRace(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyDestructable",
    {get = function(self)
        return Destructable:fromHandle(GetUnitRallyDestructable(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyPoint",
    {get = function(self)
        return Point:fromHandle(GetUnitRallyPoint(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyUnit",
    {get = function(self)
        return ____exports.Unit:fromHandle(GetUnitRallyUnit(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "resourceAmount",
    {
        get = function(self)
            return GetResourceAmount(self.handle)
        end,
        set = function(self, amount)
            SetResourceAmount(self.handle, amount)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "show",
    {
        get = function(self)
            return not IsUnitHidden(self.handle)
        end,
        set = function(self, flag)
            ShowUnit(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "skillPoints",
    {
        get = function(self)
            return GetHeroSkillPoints(self.handle)
        end,
        set = function(self, skillPointDelta)
            UnitModifySkillPoints(self.handle, skillPointDelta)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "sleeping",
    {get = function(self)
        return UnitIsSleeping(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "strength",
    {
        get = function(self)
            return GetHeroStr(self.handle, false)
        end,
        set = function(self, value)
            SetHeroStr(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "turnSpeed",
    {
        get = function(self)
            return GetUnitTurnSpeed(self.handle)
        end,
        set = function(self, value)
            SetUnitTurnSpeed(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "typeId",
    {get = function(self)
        return GetUnitTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "userData",
    {
        get = function(self)
            return GetUnitUserData(self.handle)
        end,
        set = function(self, value)
            SetUnitUserData(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "waygateActive",
    {
        get = function(self)
            return WaygateIsActive(self.handle)
        end,
        set = function(self, flag)
            WaygateActivate(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "x",
    {
        get = function(self)
            return GetUnitX(self.handle)
        end,
        set = function(self, value)
            SetUnitX(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "y",
    {
        get = function(self)
            return GetUnitY(self.handle)
        end,
        set = function(self, value)
            SetUnitY(self.handle, value)
        end
    },
    true
)
return ____exports
