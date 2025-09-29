
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file, ...)
    if ____moduleCache[file] then
        return ____moduleCache[file].value
    end
    if ____modules[file] then
        local module = ____modules[file]
        local value = nil
        if (select("#", ...) > 0) then value = module(...) else value = module(file) end
        ____moduleCache[file] = { value = value }
        return value
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function(...) 
local function __TS__ArrayAt(self, relativeIndex)
    local absoluteIndex = relativeIndex < 0 and #self + relativeIndex or relativeIndex
    if absoluteIndex >= 0 and absoluteIndex < #self then
        return self[absoluteIndex + 1]
    end
    return nil
end

local function __TS__ArrayIsArray(value)
    return type(value) == "table" and (value[1] ~= nil or next(value) == nil)
end

local function __TS__ArrayConcat(self, ...)
    local items = {...}
    local result = {}
    local len = 0
    for i = 1, #self do
        len = len + 1
        result[len] = self[i]
    end
    for i = 1, #items do
        local item = items[i]
        if __TS__ArrayIsArray(item) then
            for j = 1, #item do
                len = len + 1
                result[len] = item[j]
            end
        else
            len = len + 1
            result[len] = item
        end
    end
    return result
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local function __TS__ArrayEntries(array)
    local key = 0
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = array[key + 1] == nil, value = {key, array[key + 1]}}
            key = key + 1
            return result
        end
    }
end

local function __TS__ArrayEvery(self, callbackfn, thisArg)
    for i = 1, #self do
        if not callbackfn(thisArg, self[i], i - 1, self) then
            return false
        end
    end
    return true
end

local function __TS__ArrayFill(self, value, start, ____end)
    local relativeStart = start or 0
    local relativeEnd = ____end or #self
    if relativeStart < 0 then
        relativeStart = relativeStart + #self
    end
    if relativeEnd < 0 then
        relativeEnd = relativeEnd + #self
    end
    do
        local i = relativeStart
        while i < relativeEnd do
            self[i + 1] = value
            i = i + 1
        end
    end
    return self
end

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end

local function __TS__ArrayFind(self, predicate, thisArg)
    for i = 1, #self do
        local elem = self[i]
        if predicate(thisArg, elem, i - 1, self) then
            return elem
        end
    end
    return nil
end

local function __TS__ArrayFindIndex(self, callbackFn, thisArg)
    for i = 1, #self do
        if callbackFn(thisArg, self[i], i - 1, self) then
            return i - 1
        end
    end
    return -1
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local __TS__ArrayFrom
do
    local function arrayLikeStep(self, index)
        index = index + 1
        if index > self.length then
            return
        end
        return index, self[index]
    end
    local function arrayLikeIterator(arr)
        if type(arr.length) == "number" then
            return arrayLikeStep, arr, 0
        end
        return __TS__Iterator(arr)
    end
    function __TS__ArrayFrom(arrayLike, mapFn, thisArg)
        local result = {}
        if mapFn == nil then
            for ____, v in arrayLikeIterator(arrayLike) do
                result[#result + 1] = v
            end
        else
            local i = 0
            for ____, v in arrayLikeIterator(arrayLike) do
                local ____mapFn_3 = mapFn
                local ____thisArg_1 = thisArg
                local ____v_2 = v
                local ____i_0 = i
                i = ____i_0 + 1
                result[#result + 1] = ____mapFn_3(____thisArg_1, ____v_2, ____i_0)
            end
        end
        return result
    end
end

local function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k + 1, len do
        if self[i] == searchElement then
            return true
        end
    end
    return false
end

local function __TS__ArrayIndexOf(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    if len == 0 then
        return -1
    end
    if fromIndex >= len then
        return -1
    end
    if fromIndex < 0 then
        fromIndex = len + fromIndex
        if fromIndex < 0 then
            fromIndex = 0
        end
    end
    for i = fromIndex + 1, len do
        if self[i] == searchElement then
            return i - 1
        end
    end
    return -1
end

local function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local parts = {}
    for i = 1, #self do
        parts[i] = tostring(self[i])
    end
    return table.concat(parts, separator)
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayPush(self, ...)
    local items = {...}
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__CountVarargs(...)
    return select("#", ...)
end

local function __TS__ArrayReduce(self, callbackFn, ...)
    local len = #self
    local k = 0
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, len do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReduceRight(self, callbackFn, ...)
    local len = #self
    local k = len - 1
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, 1, -1 do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReverse(self)
    local i = 1
    local j = #self
    while i < j do
        local temp = self[j]
        self[j] = self[i]
        self[i] = temp
        i = i + 1
        j = j - 1
    end
    return self
end

local function __TS__ArrayUnshift(self, ...)
    local items = {...}
    local numItemsToInsert = #items
    if numItemsToInsert == 0 then
        return #self
    end
    for i = #self, 1, -1 do
        self[i + numItemsToInsert] = self[i]
    end
    for i = 1, numItemsToInsert do
        self[i] = items[i]
    end
    return #self
end

local function __TS__ArraySort(self, compareFn)
    if compareFn ~= nil then
        table.sort(
            self,
            function(a, b) return compareFn(nil, a, b) < 0 end
        )
    else
        table.sort(self)
    end
    return self
end

local function __TS__ArraySlice(self, first, last)
    local len = #self
    first = first or 0
    if first < 0 then
        first = len + first
        if first < 0 then
            first = 0
        end
    else
        if first > len then
            first = len
        end
    end
    last = last or len
    if last < 0 then
        last = len + last
        if last < 0 then
            last = 0
        end
    else
        if last > len then
            last = len
        end
    end
    local out = {}
    first = first + 1
    last = last + 1
    local n = 1
    while first < last do
        out[n] = self[first]
        first = first + 1
        n = n + 1
    end
    return out
end

local function __TS__ArraySome(self, callbackfn, thisArg)
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            return true
        end
    end
    return false
end

local function __TS__ArraySplice(self, ...)
    local args = {...}
    local len = #self
    local actualArgumentCount = __TS__CountVarargs(...)
    local start = args[1]
    local deleteCount = args[2]
    if start < 0 then
        start = len + start
        if start < 0 then
            start = 0
        end
    elseif start > len then
        start = len
    end
    local itemCount = actualArgumentCount - 2
    if itemCount < 0 then
        itemCount = 0
    end
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - start
    else
        actualDeleteCount = deleteCount or 0
        if actualDeleteCount < 0 then
            actualDeleteCount = 0
        end
        if actualDeleteCount > len - start then
            actualDeleteCount = len - start
        end
    end
    local out = {}
    for k = 1, actualDeleteCount do
        local from = start + k
        if self[from] ~= nil then
            out[k] = self[from]
        end
    end
    if itemCount < actualDeleteCount then
        for k = start + 1, len - actualDeleteCount do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
        for k = len - actualDeleteCount + itemCount + 1, len do
            self[k] = nil
        end
    elseif itemCount > actualDeleteCount then
        for k = len - actualDeleteCount, start + 1, -1 do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
    end
    local j = start + 1
    for i = 3, actualArgumentCount do
        self[j] = args[i]
        j = j + 1
    end
    for k = #self, len - actualDeleteCount + itemCount + 1, -1 do
        self[k] = nil
    end
    return out
end

local function __TS__ArrayToObject(self)
    local object = {}
    for i = 1, #self do
        object[i - 1] = self[i]
    end
    return object
end

local function __TS__ArrayFlat(self, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = self[i]
        if depth > 0 and __TS__ArrayIsArray(value) then
            local toAdd
            if depth == 1 then
                toAdd = value
            else
                toAdd = __TS__ArrayFlat(value, depth - 1)
            end
            for j = 1, #toAdd do
                local val = toAdd[j]
                len = len + 1
                result[len] = val
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArrayFlatMap(self, callback, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = callback(thisArg, self[i], i - 1, self)
        if __TS__ArrayIsArray(value) then
            for j = 1, #value do
                len = len + 1
                result[len] = value[j]
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArraySetLength(self, length)
    if length < 0 or length ~= length or length == math.huge or math.floor(length) ~= length then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    for i = length + 1, #self do
        self[i] = nil
    end
    return length
end

local __TS__Unpack = table.unpack or unpack

local function __TS__ArrayToReversed(self)
    local copy = {__TS__Unpack(self)}
    __TS__ArrayReverse(copy)
    return copy
end

local function __TS__ArrayToSorted(self, compareFn)
    local copy = {__TS__Unpack(self)}
    __TS__ArraySort(copy, compareFn)
    return copy
end

local function __TS__ArrayToSpliced(self, start, deleteCount, ...)
    local copy = {__TS__Unpack(self)}
    __TS__ArraySplice(copy, start, deleteCount, ...)
    return copy
end

local function __TS__ArrayWith(self, index, value)
    local copy = {__TS__Unpack(self)}
    copy[index + 1] = value
    return copy
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Promise
do
    local function makeDeferredPromiseFactory()
        local resolve
        local reject
        local function executor(____, res, rej)
            resolve = res
            reject = rej
        end
        return function()
            local promise = __TS__New(__TS__Promise, executor)
            return promise, resolve, reject
        end
    end
    local makeDeferredPromise = makeDeferredPromiseFactory()
    local function isPromiseLike(value)
        return __TS__InstanceOf(value, __TS__Promise)
    end
    local function doNothing(self)
    end
    local ____pcall = _G.pcall
    __TS__Promise = __TS__Class()
    __TS__Promise.name = "__TS__Promise"
    function __TS__Promise.prototype.____constructor(self, executor)
        self.state = 0
        self.fulfilledCallbacks = {}
        self.rejectedCallbacks = {}
        self.finallyCallbacks = {}
        local success, ____error = ____pcall(
            executor,
            nil,
            function(____, v) return self:resolve(v) end,
            function(____, err) return self:reject(err) end
        )
        if not success then
            self:reject(____error)
        end
    end
    function __TS__Promise.resolve(value)
        if __TS__InstanceOf(value, __TS__Promise) then
            return value
        end
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 1
        promise.value = value
        return promise
    end
    function __TS__Promise.reject(reason)
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 2
        promise.rejectionReason = reason
        return promise
    end
    __TS__Promise.prototype["then"] = function(self, onFulfilled, onRejected)
        local promise, resolve, reject = makeDeferredPromise()
        self:addCallbacks(
            onFulfilled and self:createPromiseResolvingCallback(onFulfilled, resolve, reject) or resolve,
            onRejected and self:createPromiseResolvingCallback(onRejected, resolve, reject) or reject
        )
        return promise
    end
    function __TS__Promise.prototype.addCallbacks(self, fulfilledCallback, rejectedCallback)
        if self.state == 1 then
            return fulfilledCallback(nil, self.value)
        end
        if self.state == 2 then
            return rejectedCallback(nil, self.rejectionReason)
        end
        local ____self_fulfilledCallbacks_0 = self.fulfilledCallbacks
        ____self_fulfilledCallbacks_0[#____self_fulfilledCallbacks_0 + 1] = fulfilledCallback
        local ____self_rejectedCallbacks_1 = self.rejectedCallbacks
        ____self_rejectedCallbacks_1[#____self_rejectedCallbacks_1 + 1] = rejectedCallback
    end
    function __TS__Promise.prototype.catch(self, onRejected)
        return self["then"](self, nil, onRejected)
    end
    function __TS__Promise.prototype.finally(self, onFinally)
        if onFinally then
            local ____self_finallyCallbacks_2 = self.finallyCallbacks
            ____self_finallyCallbacks_2[#____self_finallyCallbacks_2 + 1] = onFinally
            if self.state ~= 0 then
                onFinally(nil)
            end
        end
        return self
    end
    function __TS__Promise.prototype.resolve(self, value)
        if isPromiseLike(value) then
            return value:addCallbacks(
                function(____, v) return self:resolve(v) end,
                function(____, err) return self:reject(err) end
            )
        end
        if self.state == 0 then
            self.state = 1
            self.value = value
            return self:invokeCallbacks(self.fulfilledCallbacks, value)
        end
    end
    function __TS__Promise.prototype.reject(self, reason)
        if self.state == 0 then
            self.state = 2
            self.rejectionReason = reason
            return self:invokeCallbacks(self.rejectedCallbacks, reason)
        end
    end
    function __TS__Promise.prototype.invokeCallbacks(self, callbacks, value)
        local callbacksLength = #callbacks
        local finallyCallbacks = self.finallyCallbacks
        local finallyCallbacksLength = #finallyCallbacks
        if callbacksLength ~= 0 then
            for i = 1, callbacksLength - 1 do
                callbacks[i](callbacks, value)
            end
            if finallyCallbacksLength == 0 then
                return callbacks[callbacksLength](callbacks, value)
            end
            callbacks[callbacksLength](callbacks, value)
        end
        if finallyCallbacksLength ~= 0 then
            for i = 1, finallyCallbacksLength - 1 do
                finallyCallbacks[i](finallyCallbacks)
            end
            return finallyCallbacks[finallyCallbacksLength](finallyCallbacks)
        end
    end
    function __TS__Promise.prototype.createPromiseResolvingCallback(self, f, resolve, reject)
        return function(____, value)
            local success, resultOrError = ____pcall(f, nil, value)
            if not success then
                return reject(nil, resultOrError)
            end
            return self:handleCallbackValue(resultOrError, resolve, reject)
        end
    end
    function __TS__Promise.prototype.handleCallbackValue(self, value, resolve, reject)
        if isPromiseLike(value) then
            local nextpromise = value
            if nextpromise.state == 1 then
                return resolve(nil, nextpromise.value)
            elseif nextpromise.state == 2 then
                return reject(nil, nextpromise.rejectionReason)
            else
                return nextpromise:addCallbacks(resolve, reject)
            end
        else
            return resolve(nil, value)
        end
    end
end

local __TS__AsyncAwaiter, __TS__Await
do
    local ____coroutine = _G.coroutine or ({})
    local cocreate = ____coroutine.create
    local coresume = ____coroutine.resume
    local costatus = ____coroutine.status
    local coyield = ____coroutine.yield
    function __TS__AsyncAwaiter(generator)
        return __TS__New(
            __TS__Promise,
            function(____, resolve, reject)
                local fulfilled, step, resolved, asyncCoroutine
                function fulfilled(self, value)
                    local success, resultOrError = coresume(asyncCoroutine, value)
                    if success then
                        return step(resultOrError)
                    end
                    return reject(nil, resultOrError)
                end
                function step(result)
                    if resolved then
                        return
                    end
                    if costatus(asyncCoroutine) == "dead" then
                        return resolve(nil, result)
                    end
                    return __TS__Promise.resolve(result):addCallbacks(fulfilled, reject)
                end
                resolved = false
                asyncCoroutine = cocreate(generator)
                local success, resultOrError = coresume(
                    asyncCoroutine,
                    function(____, v)
                        resolved = true
                        return __TS__Promise.resolve(v):addCallbacks(resolve, reject)
                    end
                )
                if success then
                    return step(resultOrError)
                else
                    return reject(nil, resultOrError)
                end
            end
        )
    end
    function __TS__Await(thing)
        return coyield(thing)
    end
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local function __TS__Decorate(self, originalValue, decorators, context)
    local result = originalValue
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator ~= nil then
                local ____decorator_result_0 = decorator(self, result, context)
                if ____decorator_result_0 == nil then
                    ____decorator_result_0 = result
                end
                result = ____decorator_result_0
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__DecorateLegacy(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator ~= nil then
                local oldResult = result
                if key == nil then
                    result = decorator(nil, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(nil, target, key, descriptor) or descriptor
                    local isSimpleValue = desc.configurable == true and desc.writable == true and not desc.get and not desc.set
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(nil, target, key, desc)
                else
                    result = decorator(nil, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(nil, target, key, paramIndex) end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

local function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                __TS__New(
                    TypeError,
                    ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. "."
                ),
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    target[key] = nil
    return true
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(__TS__StringAccess(iterable, index))
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

local function __TS__FunctionBind(fn, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        __TS__ArrayUnshift(
            args,
            __TS__Unpack(boundArgs)
        )
        return fn(__TS__Unpack(args))
    end
end

local __TS__Generator
do
    local function generatorIterator(self)
        return self
    end
    local function generatorNext(self, ...)
        local co = self.____coroutine
        if coroutine.status(co) == "dead" then
            return {done = true}
        end
        local status, value = coroutine.resume(co, ...)
        if not status then
            error(value, 0)
        end
        return {
            value = value,
            done = coroutine.status(co) == "dead"
        }
    end
    function __TS__Generator(fn)
        return function(...)
            local args = {...}
            local argsLength = __TS__CountVarargs(...)
            return {
                ____coroutine = coroutine.create(function() return fn(__TS__Unpack(args, 1, argsLength)) end),
                [Symbol.iterator] = generatorIterator,
                next = generatorNext
            }
        end
    end
end

local function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return valueType == "table" or valueType == "function"
end

local function __TS__LuaIteratorSpread(self, state, firstKey)
    local results = {}
    local key, value = self(state, firstKey)
    while key do
        results[#results + 1] = {key, value}
        key, value = self(state, key)
    end
    return __TS__Unpack(results)
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
end

local function __TS__MapGroupBy(items, keySelector)
    local result = __TS__New(Map)
    local i = 0
    for ____, item in __TS__Iterator(items) do
        local key = keySelector(nil, item, i)
        if result:has(key) then
            local ____temp_0 = result:get(key)
            ____temp_0[#____temp_0 + 1] = item
        else
            result:set(key, {item})
        end
        i = i + 1
    end
    return result
end

local __TS__Match = string.match

local __TS__MathAtan2 = math.atan2 or math.atan

local __TS__MathModf = math.modf

local function __TS__NumberIsNaN(value)
    return value ~= value
end

local function __TS__MathSign(val)
    if __TS__NumberIsNaN(val) or val == 0 then
        return val
    end
    if val < 0 then
        return -1
    end
    return 1
end

local function __TS__NumberIsFinite(value)
    return type(value) == "number" and value == value and value ~= math.huge and value ~= -math.huge
end

local function __TS__MathTrunc(val)
    if not __TS__NumberIsFinite(val) or val == 0 then
        return val
    end
    return val > 0 and math.floor(val) or math.ceil(val)
end

local function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return value and 1 or 0
    else
        return 0 / 0
    end
end

local function __TS__NumberIsInteger(value)
    return __TS__NumberIsFinite(value) and math.floor(value) == value
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__ParseInt
do
    local parseIntBasePattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
    function __TS__ParseInt(numberString, base)
        if base == nil then
            base = 10
            local hexMatch = __TS__Match(numberString, "^%s*-?0[xX]")
            if hexMatch ~= nil then
                base = 16
                numberString = (__TS__Match(hexMatch, "-")) and "-" .. __TS__StringSubstring(numberString, #hexMatch) or __TS__StringSubstring(numberString, #hexMatch)
            end
        end
        if base < 2 or base > 36 then
            return 0 / 0
        end
        local allowedDigits = base <= 10 and __TS__StringSubstring(parseIntBasePattern, 0, base) or __TS__StringSubstring(parseIntBasePattern, 0, 10 + 2 * (base - 10))
        local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
        local number = tonumber((__TS__Match(numberString, pattern)), base)
        if number == nil then
            return 0 / 0
        end
        if number >= 0 then
            return math.floor(number)
        else
            return math.ceil(number)
        end
    end
end

local function __TS__ParseFloat(numberString)
    local infinityMatch = __TS__Match(numberString, "^%s*(-?Infinity)")
    if infinityMatch ~= nil then
        return __TS__StringAccess(infinityMatch, 0) == "-" and -math.huge or math.huge
    end
    local number = tonumber((__TS__Match(numberString, "^%s*(-?%d+%.?%d*)")))
    return number or 0 / 0
end

local __TS__NumberToString
do
    local radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
    function __TS__NumberToString(self, radix)
        if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
            return tostring(self)
        end
        radix = math.floor(radix)
        if radix < 2 or radix > 36 then
            error("toString() radix argument must be between 2 and 36", 0)
        end
        local integer, fraction = __TS__MathModf(math.abs(self))
        local result = ""
        if radix == 8 then
            result = string.format("%o", integer)
        elseif radix == 16 then
            result = string.format("%x", integer)
        else
            repeat
                do
                    result = __TS__StringAccess(radixChars, integer % radix) .. result
                    integer = math.floor(integer / radix)
                end
            until not (integer ~= 0)
        end
        if fraction ~= 0 then
            result = result .. "."
            local delta = 1e-16
            repeat
                do
                    fraction = fraction * radix
                    delta = delta * radix
                    local digit = math.floor(fraction)
                    result = result .. __TS__StringAccess(radixChars, digit)
                    fraction = fraction - digit
                end
            until not (fraction >= delta)
        end
        if self < 0 then
            result = "-" .. result
        end
        return result
    end
end

local function __TS__NumberToFixed(self, fractionDigits)
    if math.abs(self) >= 1e+21 or self ~= self then
        return tostring(self)
    end
    local f = math.floor(fractionDigits or 0)
    if f < 0 or f > 99 then
        error("toFixed() digits argument must be between 0 and 99", 0)
    end
    return string.format(
        ("%." .. tostring(f)) .. "f",
        self
    )
end

local function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = type(key) == "number" and key + 1 or key
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = desc.get ~= nil or desc.set ~= nil
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        local ____desc_set_4 = desc.set
        local ____desc_get_5 = desc.get
        local ____desc_configurable_0 = desc.configurable
        if ____desc_configurable_0 == nil then
            ____desc_configurable_0 = valueExists
        end
        local ____desc_enumerable_1 = desc.enumerable
        if ____desc_enumerable_1 == nil then
            ____desc_enumerable_1 = valueExists
        end
        local ____desc_writable_2 = desc.writable
        if ____desc_writable_2 == nil then
            ____desc_writable_2 = valueExists
        end
        local ____temp_3
        if desc.value ~= nil then
            ____temp_3 = desc.value
        else
            ____temp_3 = value
        end
        descriptor = {
            set = ____desc_set_4,
            get = ____desc_get_5,
            configurable = ____desc_configurable_0,
            enumerable = ____desc_enumerable_1,
            writable = ____desc_writable_2,
            value = ____temp_3
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

local function __TS__ObjectEntries(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = {key, obj[key]}
    end
    return result
end

local function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

local function __TS__ObjectGroupBy(items, keySelector)
    local result = {}
    local i = 0
    for ____, item in __TS__Iterator(items) do
        local key = keySelector(nil, item, i)
        if result[key] ~= nil then
            local ____result_key_0 = result[key]
            ____result_key_0[#____result_key_0 + 1] = item
        else
            result[key] = {item}
        end
        i = i + 1
    end
    return result
end

local function __TS__ObjectKeys(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = key
    end
    return result
end

local function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

local function __TS__ObjectValues(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = obj[key]
    end
    return result
end

local function __TS__PromiseAll(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = item.value
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = item
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = data
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        reject(nil, reason)
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAllSettled(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = {status = "fulfilled", value = item.value}
            elseif item.state == 2 then
                results[i + 1] = {status = "rejected", reason = item.rejectionReason}
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = {status = "fulfilled", value = item}
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = {status = "fulfilled", value = data}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        results[index + 1] = {status = "rejected", reason = reason}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAny(iterable)
    local rejections = {}
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                rejections[#rejections + 1] = item.rejectionReason
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    if #pending == 0 then
        return __TS__Promise.reject("No promises to resolve with .any()")
    end
    local numResolved = 0
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, data)
                        resolve(nil, data)
                    end,
                    function(____, reason)
                        rejections[#rejections + 1] = reason
                        numResolved = numResolved + 1
                        if numResolved == #pending then
                            reject(nil, {name = "AggregateError", message = "All Promises rejected", errors = rejections})
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseRace(iterable)
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, value) return resolve(nil, value) end,
                    function(____, reason) return reject(nil, reason) end
                )
            end
        end
    )
end

local Set
do
    Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return self.nextKey[value] ~= nil or self.lastKey == value
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.union(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:add(item)
        end
        return result
    end
    function Set.prototype.intersection(self, other)
        local result = __TS__New(Set)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.difference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:delete(item)
        end
        return result
    end
    function Set.prototype.symmetricDifference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            if self:has(item) then
                result:delete(item)
            else
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.isSubsetOf(self, other)
        for ____, item in __TS__Iterator(self) do
            if not other:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isSupersetOf(self, other)
        for ____, item in __TS__Iterator(other) do
            if not self:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isDisjointFrom(self, other)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                return false
            end
        end
        return true
    end
    Set[Symbol.species] = Set
end

local function __TS__SparseArrayNew(...)
    local sparseArray = {...}
    sparseArray.sparseLength = __TS__CountVarargs(...)
    return sparseArray
end

local function __TS__SparseArrayPush(sparseArray, ...)
    local args = {...}
    local argsLen = __TS__CountVarargs(...)
    local listLen = sparseArray.sparseLength
    for i = 1, argsLen do
        sparseArray[listLen + i] = args[i]
    end
    sparseArray.sparseLength = listLen + argsLen
end

local function __TS__SparseArraySpread(sparseArray)
    local _unpack = unpack or table.unpack
    return _unpack(sparseArray, 1, sparseArray.sparseLength)
end

local WeakMap
do
    WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
end

local WeakSet
do
    WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
end

local function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        local originalTraceback = debug.traceback
        _G.__TS__originalTraceback = originalTraceback
        debug.traceback = function(thread, message, level)
            local trace
            if thread == nil and message == nil and level == nil then
                trace = originalTraceback()
            elseif __TS__StringIncludes(_VERSION, "Lua 5.0") then
                trace = originalTraceback((("[Level " .. tostring(level)) .. "] ") .. tostring(message))
            else
                trace = originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local function replacer(____, file, srcFile, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap ~= nil and fileSourceMap[line] ~= nil then
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (srcFile .. ":") .. tostring(data)
                    end
                    return (data.file .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            local result = string.gsub(
                trace,
                "(%S+)%.lua:(%d+)",
                function(file, line) return replacer(nil, file .. ".lua", file .. ".ts", line) end
            )
            local function stringReplacer(____, file, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap ~= nil and fileSourceMap[line] ~= nil then
                    local chunkName = (__TS__Match(file, "%[string \"([^\"]+)\"%]"))
                    local sourceName = string.gsub(chunkName, ".lua$", ".ts")
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (sourceName .. ":") .. tostring(data)
                    end
                    return (data.file .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            result = string.gsub(
                result,
                "(%[string \"[^\"]+\"%]):(%d+)",
                function(file, line) return stringReplacer(nil, file, line) end
            )
            return result
        end
    end
end

local function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        for i = 0, #iterable - 1 do
            arr[i + 1] = __TS__StringAccess(iterable, i)
        end
    else
        local len = 0
        for ____, item in __TS__Iterator(iterable) do
            len = len + 1
            arr[len] = item
        end
    end
    return __TS__Unpack(arr)
end

local function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or 0 / 0
end

local function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

local function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return self .. string.sub(
        fillString,
        1,
        math.floor(maxLength)
    )
end

local function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return string.sub(
        fillString,
        1,
        math.floor(maxLength)
    ) .. self
end

local __TS__StringReplace
do
    local sub = string.sub
    function __TS__StringReplace(source, searchValue, replaceValue)
        local startPos, endPos = string.find(source, searchValue, nil, true)
        if not startPos then
            return source
        end
        local before = sub(source, 1, startPos - 1)
        local replacement = type(replaceValue) == "string" and replaceValue or replaceValue(nil, searchValue, startPos - 1, source)
        local after = sub(source, endPos + 1)
        return (before .. replacement) .. after
    end
end

local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local __TS__StringReplaceAll
do
    local sub = string.sub
    local find = string.find
    function __TS__StringReplaceAll(source, searchValue, replaceValue)
        if type(replaceValue) == "string" then
            local concat = table.concat(
                __TS__StringSplit(source, searchValue),
                replaceValue
            )
            if #searchValue == 0 then
                return (replaceValue .. concat) .. replaceValue
            end
            return concat
        end
        local parts = {}
        local partsIndex = 1
        if #searchValue == 0 then
            parts[1] = replaceValue(nil, "", 0, source)
            partsIndex = 2
            for i = 1, #source do
                parts[partsIndex] = sub(source, i, i)
                parts[partsIndex + 1] = replaceValue(nil, "", i, source)
                partsIndex = partsIndex + 2
            end
        else
            local currentPos = 1
            while true do
                local startPos, endPos = find(source, searchValue, currentPos, true)
                if not startPos then
                    break
                end
                parts[partsIndex] = sub(source, currentPos, startPos - 1)
                parts[partsIndex + 1] = replaceValue(nil, searchValue, startPos - 1, source)
                partsIndex = partsIndex + 2
                currentPos = endPos + 1
            end
            parts[partsIndex] = sub(source, currentPos)
        end
        return table.concat(parts)
    end
end

local function __TS__StringSlice(self, start, ____end)
    if start == nil or start ~= start then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

local function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

local function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

local function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

local function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

local __TS__SymbolRegistryFor, __TS__SymbolRegistryKeyFor
do
    local symbolRegistry = {}
    function __TS__SymbolRegistryFor(key)
        if not symbolRegistry[key] then
            symbolRegistry[key] = __TS__Symbol(key)
        end
        return symbolRegistry[key]
    end
    function __TS__SymbolRegistryKeyFor(sym)
        for key in pairs(symbolRegistry) do
            if symbolRegistry[key] == sym then
                return key
            end
        end
        return nil
    end
end

local function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

local function __TS__Using(self, cb, ...)
    local args = {...}
    local thrownError
    local ok, result = xpcall(
        function() return cb(__TS__Unpack(args)) end,
        function(err)
            thrownError = err
            return thrownError
        end
    )
    local argArray = {__TS__Unpack(args)}
    do
        local i = #argArray - 1
        while i >= 0 do
            local ____self_0 = argArray[i + 1]
            ____self_0[Symbol.dispose](____self_0)
            i = i - 1
        end
    end
    if not ok then
        error(thrownError, 0)
    end
    return result
end

local function __TS__UsingAsync(self, cb, ...)
    local args = {...}
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        local thrownError
        local ok, result = xpcall(
            function() return cb(
                nil,
                __TS__Unpack(args)
            ) end,
            function(err)
                thrownError = err
                return thrownError
            end
        )
        local argArray = {__TS__Unpack(args)}
        do
            local i = #argArray - 1
            while i >= 0 do
                if argArray[i + 1][Symbol.dispose] ~= nil then
                    local ____self_0 = argArray[i + 1]
                    ____self_0[Symbol.dispose](____self_0)
                end
                if argArray[i + 1][Symbol.asyncDispose] ~= nil then
                    local ____self_1 = argArray[i + 1]
                    __TS__Await(____self_1[Symbol.asyncDispose](____self_1))
                end
                i = i - 1
            end
        end
        if not ok then
            error(thrownError, 0)
        end
        return ____awaiter_resolve(nil, result)
    end)
end

return {
  __TS__ArrayAt = __TS__ArrayAt,
  __TS__ArrayConcat = __TS__ArrayConcat,
  __TS__ArrayEntries = __TS__ArrayEntries,
  __TS__ArrayEvery = __TS__ArrayEvery,
  __TS__ArrayFill = __TS__ArrayFill,
  __TS__ArrayFilter = __TS__ArrayFilter,
  __TS__ArrayForEach = __TS__ArrayForEach,
  __TS__ArrayFind = __TS__ArrayFind,
  __TS__ArrayFindIndex = __TS__ArrayFindIndex,
  __TS__ArrayFrom = __TS__ArrayFrom,
  __TS__ArrayIncludes = __TS__ArrayIncludes,
  __TS__ArrayIndexOf = __TS__ArrayIndexOf,
  __TS__ArrayIsArray = __TS__ArrayIsArray,
  __TS__ArrayJoin = __TS__ArrayJoin,
  __TS__ArrayMap = __TS__ArrayMap,
  __TS__ArrayPush = __TS__ArrayPush,
  __TS__ArrayPushArray = __TS__ArrayPushArray,
  __TS__ArrayReduce = __TS__ArrayReduce,
  __TS__ArrayReduceRight = __TS__ArrayReduceRight,
  __TS__ArrayReverse = __TS__ArrayReverse,
  __TS__ArrayUnshift = __TS__ArrayUnshift,
  __TS__ArraySort = __TS__ArraySort,
  __TS__ArraySlice = __TS__ArraySlice,
  __TS__ArraySome = __TS__ArraySome,
  __TS__ArraySplice = __TS__ArraySplice,
  __TS__ArrayToObject = __TS__ArrayToObject,
  __TS__ArrayFlat = __TS__ArrayFlat,
  __TS__ArrayFlatMap = __TS__ArrayFlatMap,
  __TS__ArraySetLength = __TS__ArraySetLength,
  __TS__ArrayToReversed = __TS__ArrayToReversed,
  __TS__ArrayToSorted = __TS__ArrayToSorted,
  __TS__ArrayToSpliced = __TS__ArrayToSpliced,
  __TS__ArrayWith = __TS__ArrayWith,
  __TS__AsyncAwaiter = __TS__AsyncAwaiter,
  __TS__Await = __TS__Await,
  __TS__Class = __TS__Class,
  __TS__ClassExtends = __TS__ClassExtends,
  __TS__CloneDescriptor = __TS__CloneDescriptor,
  __TS__CountVarargs = __TS__CountVarargs,
  __TS__Decorate = __TS__Decorate,
  __TS__DecorateLegacy = __TS__DecorateLegacy,
  __TS__DecorateParam = __TS__DecorateParam,
  __TS__Delete = __TS__Delete,
  __TS__DelegatedYield = __TS__DelegatedYield,
  __TS__DescriptorGet = __TS__DescriptorGet,
  __TS__DescriptorSet = __TS__DescriptorSet,
  Error = Error,
  RangeError = RangeError,
  ReferenceError = ReferenceError,
  SyntaxError = SyntaxError,
  TypeError = TypeError,
  URIError = URIError,
  __TS__FunctionBind = __TS__FunctionBind,
  __TS__Generator = __TS__Generator,
  __TS__InstanceOf = __TS__InstanceOf,
  __TS__InstanceOfObject = __TS__InstanceOfObject,
  __TS__Iterator = __TS__Iterator,
  __TS__LuaIteratorSpread = __TS__LuaIteratorSpread,
  Map = Map,
  __TS__MapGroupBy = __TS__MapGroupBy,
  __TS__Match = __TS__Match,
  __TS__MathAtan2 = __TS__MathAtan2,
  __TS__MathModf = __TS__MathModf,
  __TS__MathSign = __TS__MathSign,
  __TS__MathTrunc = __TS__MathTrunc,
  __TS__New = __TS__New,
  __TS__Number = __TS__Number,
  __TS__NumberIsFinite = __TS__NumberIsFinite,
  __TS__NumberIsInteger = __TS__NumberIsInteger,
  __TS__NumberIsNaN = __TS__NumberIsNaN,
  __TS__ParseInt = __TS__ParseInt,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__NumberToString = __TS__NumberToString,
  __TS__NumberToFixed = __TS__NumberToFixed,
  __TS__ObjectAssign = __TS__ObjectAssign,
  __TS__ObjectDefineProperty = __TS__ObjectDefineProperty,
  __TS__ObjectEntries = __TS__ObjectEntries,
  __TS__ObjectFromEntries = __TS__ObjectFromEntries,
  __TS__ObjectGetOwnPropertyDescriptor = __TS__ObjectGetOwnPropertyDescriptor,
  __TS__ObjectGetOwnPropertyDescriptors = __TS__ObjectGetOwnPropertyDescriptors,
  __TS__ObjectGroupBy = __TS__ObjectGroupBy,
  __TS__ObjectKeys = __TS__ObjectKeys,
  __TS__ObjectRest = __TS__ObjectRest,
  __TS__ObjectValues = __TS__ObjectValues,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__ParseInt = __TS__ParseInt,
  __TS__Promise = __TS__Promise,
  __TS__PromiseAll = __TS__PromiseAll,
  __TS__PromiseAllSettled = __TS__PromiseAllSettled,
  __TS__PromiseAny = __TS__PromiseAny,
  __TS__PromiseRace = __TS__PromiseRace,
  Set = Set,
  __TS__SetDescriptor = __TS__SetDescriptor,
  __TS__SparseArrayNew = __TS__SparseArrayNew,
  __TS__SparseArrayPush = __TS__SparseArrayPush,
  __TS__SparseArraySpread = __TS__SparseArraySpread,
  WeakMap = WeakMap,
  WeakSet = WeakSet,
  __TS__SourceMapTraceBack = __TS__SourceMapTraceBack,
  __TS__Spread = __TS__Spread,
  __TS__StringAccess = __TS__StringAccess,
  __TS__StringCharAt = __TS__StringCharAt,
  __TS__StringCharCodeAt = __TS__StringCharCodeAt,
  __TS__StringEndsWith = __TS__StringEndsWith,
  __TS__StringIncludes = __TS__StringIncludes,
  __TS__StringPadEnd = __TS__StringPadEnd,
  __TS__StringPadStart = __TS__StringPadStart,
  __TS__StringReplace = __TS__StringReplace,
  __TS__StringReplaceAll = __TS__StringReplaceAll,
  __TS__StringSlice = __TS__StringSlice,
  __TS__StringSplit = __TS__StringSplit,
  __TS__StringStartsWith = __TS__StringStartsWith,
  __TS__StringSubstr = __TS__StringSubstr,
  __TS__StringSubstring = __TS__StringSubstring,
  __TS__StringTrim = __TS__StringTrim,
  __TS__StringTrimEnd = __TS__StringTrimEnd,
  __TS__StringTrimStart = __TS__StringTrimStart,
  __TS__Symbol = __TS__Symbol,
  Symbol = Symbol,
  __TS__SymbolRegistryFor = __TS__SymbolRegistryFor,
  __TS__SymbolRegistryKeyFor = __TS__SymbolRegistryKeyFor,
  __TS__TypeOf = __TS__TypeOf,
  __TS__Unpack = __TS__Unpack,
  __TS__Using = __TS__Using,
  __TS__UsingAsync = __TS__UsingAsync
}
 end,
["src.types.index"] = function(...) 
local ____exports = {}
return ____exports
 end,
["src.config.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- 默认应用配置
local DEFAULT_CONFIG = {debug = true, console = true, runtime = {debuggerPort = 4279, sleep = false, catchCrash = true}, map = {name = "WC3 TypeScript Map", version = "1.0.0", description = "A Warcraft III map built with TypeScript"}}
--- 配置管理器
-- 提供应用程序配置的统一管理
____exports.ConfigManager = __TS__Class()
local ConfigManager = ____exports.ConfigManager
ConfigManager.name = "ConfigManager"
function ConfigManager.prototype.____constructor(self)
    self.config = __TS__ObjectAssign({}, DEFAULT_CONFIG)
end
function ConfigManager.getInstance(self)
    if not ____exports.ConfigManager.instance then
        ____exports.ConfigManager.instance = __TS__New(____exports.ConfigManager)
    end
    return ____exports.ConfigManager.instance
end
function ConfigManager.prototype.getConfig(self)
    return __TS__ObjectAssign({}, self.config)
end
function ConfigManager.prototype.isDebugMode(self)
    return self.config.debug
end
function ConfigManager.prototype.isConsoleEnabled(self)
    return self.config.console
end
function ConfigManager.prototype.getRuntimeConfig(self)
    return __TS__ObjectAssign({}, self.config.runtime)
end
function ConfigManager.prototype.getMapConfig(self)
    return __TS__ObjectAssign({}, self.config.map)
end
function ConfigManager.prototype.updateConfig(self, updates)
    self.config = __TS__ObjectAssign({}, self.config, updates)
end
function ConfigManager.prototype.resetToDefault(self)
    self.config = __TS__ObjectAssign({}, DEFAULT_CONFIG)
end
return ____exports
 end,
["src.ydlua.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ObjectKeys = ____lualib.__TS__ObjectKeys
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____config = require("src.config.index")
local ConfigManager = ____config.ConfigManager
____exports.ydcommon = require("jass.common")
____exports.ydai = require("jass.ai")
____exports.ydglobals = require("jass.globals")
____exports.ydjapi = require("jass.japi")
____exports.ydhook = require("jass.hook")
____exports.ydruntime = require("jass.runtime")
____exports.ydslk = require("jass.slk")
____exports.ydconsole = require("jass.console")
____exports.yddebug = require("jass.debug")
____exports.ydlog = require("jass.log")
____exports.ydmessage = require("jass.message")
____exports.ydbignum = require("jass.bignum")
____exports.ydlua = __TS__Class()
local ydlua = ____exports.ydlua
ydlua.name = "ydlua"
function ydlua.prototype.____constructor(self)
    self.configManager = ConfigManager:getInstance()
end
function ydlua.getInstance(self)
    if not ____exports.ydlua.instance then
        ____exports.ydlua.instance = __TS__New(____exports.ydlua)
    end
    return ____exports.ydlua.instance
end
function ydlua.prototype.initializeRuntime(self)
    local config = self.configManager:getConfig()
    local runtimeConfig = config.runtime
    ____exports.ydruntime.console = config.console
    ____exports.ydruntime.sleep = runtimeConfig.sleep
    ____exports.ydruntime.debugger = runtimeConfig.debuggerPort
    ____exports.ydruntime.catch_crash = runtimeConfig.catchCrash
    ____exports.ydruntime.error_hanlde = function(self, msg)
        print("========lua-err========")
        print(tostring(msg))
        print("=========================")
    end
    print(((">>> Runtime configured: debugger=" .. tostring(runtimeConfig.debuggerPort)) .. ", crash_catch=") .. tostring(runtimeConfig.catchCrash))
end
function ydlua.prototype.initialize(self)
    self:initializeConsole()
    self:initializeRuntime()
    self:registerGlobals()
end
function ydlua.prototype.initializeConsole(self)
    local isConsoleEnabled = self.configManager:isConsoleEnabled()
    ____exports.ydconsole.enable = isConsoleEnabled
    if isConsoleEnabled then
        _G.print = function(message) return ____exports.ydconsole:write(message) end
        print(">>> Console enabled")
    end
end
function ydlua.prototype.registerGlobals(self)
    __TS__ArrayForEach(
        __TS__ObjectKeys(____exports.ydcommon),
        function(____, key)
            _G[key] = ____exports.ydcommon[key]
        end
    )
    __TS__ArrayForEach(
        __TS__ObjectKeys(____exports.ydjapi),
        function(____, key)
            _G[key] = ____exports.ydjapi[key]
        end
    )
    print(">>> Global APIs registered")
end
return ____exports
 end,
["src.utils.helper"] = function(...) 
local ____exports = {}
function ____exports.c2i(self, char)
    return (string.unpack(">I4", char))
end
function ____exports.i2c(self, id)
    return string.pack("I4", id)
end
function ____exports.FourCC(self, id)
    return ____exports.c2i(nil, id)
end
return ____exports
 end,
["src.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____ydlua = require("src.ydlua.index")
local ydlua = ____ydlua.ydlua
local ____helper = require("src.utils.helper")
local FourCC = ____helper.FourCC
local ____wc3ts = require("src.@eiriksgata.wc3ts")
local Unit = ____wc3ts.Unit
local ____globals = require("lua_modules.@eiriksgata.wc3ts.dist.globals.index")
local Players = ____globals.Players
--- 应用程序主入口
-- 负责引导整个应用程序的启动
local function main(self)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        print("hello ts")
        DisplayTextToPlayer(
            Player(0),
            0,
            0,
            "hello ts"
        )
        Unit:create(
            Players[1],
            FourCC(nil, "hfoo"),
            0,
            0,
            0
        )
    end)
end
ydlua:getInstance():initialize()
main(nil)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.dist.globals.index"] = function(...) 
local ____exports = {}
local ____player = require("lua_modules.@eiriksgata.wc3ts.dist.handles.player")
local MapPlayer = ____player.MapPlayer
local ____define = require("lua_modules.@eiriksgata.wc3ts.dist.globals.define")
local bj_MAX_PLAYER_SLOTS = ____define.bj_MAX_PLAYER_SLOTS
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.dist.globals.order")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
____exports.Players = {}
do
    local i = 0
    while i < bj_MAX_PLAYER_SLOTS do
        local pl = MapPlayer:fromHandle(Player(i))
        if pl then
            ____exports.Players[i + 1] = pl
        end
        i = i + 1
    end
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.dist.globals.order"] = function(...) 
local ____exports = {}
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.dist.globals.define"] = function(...) 
local ____exports = {}
____exports.MAP_SPEED_NORMAL = function() return ConvertGameSpeed(2) end
____exports.bj_PI = math.pi
____exports.bj_E = 2.718281828459045
____exports.bj_CELLWIDTH = 128
____exports.bj_CLIFFHEIGHT = 128
____exports.bj_UNIT_FACING = 270
____exports.bj_RADTODEG = 180 / ____exports.bj_PI
____exports.bj_DEGTORAD = ____exports.bj_PI / 180
____exports.bj_TEXT_DELAY_QUEST = 20
____exports.bj_TEXT_DELAY_QUESTUPDATE = 20
____exports.bj_TEXT_DELAY_QUESTDONE = 20
____exports.bj_TEXT_DELAY_QUESTFAILED = 20
____exports.bj_TEXT_DELAY_QUESTREQUIREMENT = 20
____exports.bj_TEXT_DELAY_MISSIONFAILED = 20
____exports.bj_TEXT_DELAY_ALWAYSHINT = 12
____exports.bj_TEXT_DELAY_HINT = 12
____exports.bj_TEXT_DELAY_SECRET = 10
____exports.bj_TEXT_DELAY_UNITACQUIRED = 15
____exports.bj_TEXT_DELAY_UNITAVAILABLE = 10
____exports.bj_TEXT_DELAY_ITEMACQUIRED = 10
____exports.bj_TEXT_DELAY_WARNING = 12
____exports.bj_QUEUE_DELAY_QUEST = 5
____exports.bj_QUEUE_DELAY_HINT = 5
____exports.bj_QUEUE_DELAY_SECRET = 3
____exports.bj_HANDICAP_EASY = 60
____exports.bj_GAME_STARTED_THRESHOLD = 0.01
____exports.bj_WAIT_FOR_COND_MIN_INTERVAL = 0.1
____exports.bj_POLLED_WAIT_INTERVAL = 0.1
____exports.bj_POLLED_WAIT_SKIP_THRESHOLD = 2
____exports.bj_MAX_INVENTORY = 6
____exports.bj_MAX_PLAYERS = 12
____exports.bj_PLAYER_NEUTRAL_VICTIM = 13
____exports.bj_PLAYER_NEUTRAL_EXTRA = 14
____exports.bj_MAX_PLAYER_SLOTS = 16
____exports.bj_MAX_SKELETONS = 25
____exports.bj_MAX_STOCK_ITEM_SLOTS = 11
____exports.bj_MAX_STOCK_UNIT_SLOTS = 11
____exports.bj_MAX_ITEM_LEVEL = 10
____exports.bj_TOD_DAWN = 6
____exports.bj_TOD_DUSK = 18
____exports.bj_MELEE_STARTING_TOD = 8
____exports.bj_MELEE_STARTING_GOLD_V0 = 750
____exports.bj_MELEE_STARTING_GOLD_V1 = 500
____exports.bj_MELEE_STARTING_LUMBER_V0 = 200
____exports.bj_MELEE_STARTING_LUMBER_V1 = 150
____exports.bj_MELEE_STARTING_HERO_TOKENS = 1
____exports.bj_MELEE_HERO_LIMIT = 3
____exports.bj_MELEE_HERO_TYPE_LIMIT = 1
____exports.bj_MELEE_MINE_SEARCH_RADIUS = 2000
____exports.bj_MELEE_CLEAR_UNITS_RADIUS = 1500
____exports.bj_MELEE_CRIPPLE_TIMEOUT = 120
____exports.bj_MELEE_CRIPPLE_MSG_DURATION = 20
____exports.bj_MELEE_MAX_TWINKED_HEROES_V0 = 3
____exports.bj_MELEE_MAX_TWINKED_HEROES_V1 = 1
____exports.bj_CREEP_ITEM_DELAY = 0.5
____exports.bj_STOCK_RESTOCK_INITIAL_DELAY = 120
____exports.bj_STOCK_RESTOCK_INTERVAL = 30
____exports.bj_STOCK_MAX_ITERATIONS = 20
____exports.bj_MAX_DEST_IN_REGION_EVENTS = 64
____exports.bj_CAMERA_MIN_FARZ = 100
____exports.bj_CAMERA_DEFAULT_DISTANCE = 1650
____exports.bj_CAMERA_DEFAULT_FARZ = 5000
____exports.bj_CAMERA_DEFAULT_AOA = 304
____exports.bj_CAMERA_DEFAULT_FOV = 70
____exports.bj_CAMERA_DEFAULT_ROLL = 0
____exports.bj_CAMERA_DEFAULT_ROTATION = 90
____exports.bj_RESCUE_PING_TIME = 2
____exports.bj_NOTHING_SOUND_DURATION = 5
____exports.bj_TRANSMISSION_PING_TIME = 1
____exports.bj_TRANSMISSION_IND_RED = 255
____exports.bj_TRANSMISSION_IND_BLUE = 255
____exports.bj_TRANSMISSION_IND_GREEN = 255
____exports.bj_TRANSMISSION_IND_ALPHA = 255
____exports.bj_TRANSMISSION_PORT_HANGTIME = 1.5
____exports.bj_CINEMODE_INTERFACEFADE = 0.5
____exports.bj_CINEMODE_GAMESPEED = ____exports.MAP_SPEED_NORMAL
____exports.bj_CINEMODE_VOLUME_UNITMOVEMENT = 0.4
____exports.bj_CINEMODE_VOLUME_UNITSOUNDS = 0
____exports.bj_CINEMODE_VOLUME_COMBAT = 0.4
____exports.bj_CINEMODE_VOLUME_SPELLS = 0.4
____exports.bj_CINEMODE_VOLUME_UI = 0
____exports.bj_CINEMODE_VOLUME_MUSIC = 0.55
____exports.bj_CINEMODE_VOLUME_AMBIENTSOUNDS = 1
____exports.bj_CINEMODE_VOLUME_FIRE = 0.6
____exports.bj_SPEECH_VOLUME_UNITMOVEMENT = 0.25
____exports.bj_SPEECH_VOLUME_UNITSOUNDS = 0
____exports.bj_SPEECH_VOLUME_COMBAT = 0.25
____exports.bj_SPEECH_VOLUME_SPELLS = 0.25
____exports.bj_SPEECH_VOLUME_UI = 0
____exports.bj_SPEECH_VOLUME_MUSIC = 0.55
____exports.bj_SPEECH_VOLUME_AMBIENTSOUNDS = 1
____exports.bj_SPEECH_VOLUME_FIRE = 0.6
____exports.bj_SMARTPAN_TRESHOLD_PAN = 500
____exports.bj_SMARTPAN_TRESHOLD_SNAP = 3500
____exports.bj_MAX_QUEUED_TRIGGERS = 100
____exports.bj_QUEUED_TRIGGER_TIMEOUT = 180
____exports.bj_CAMPAIGN_INDEX_T = 0
____exports.bj_CAMPAIGN_INDEX_H = 1
____exports.bj_CAMPAIGN_INDEX_U = 2
____exports.bj_CAMPAIGN_INDEX_O = 3
____exports.bj_CAMPAIGN_INDEX_N = 4
____exports.bj_CAMPAIGN_INDEX_XN = 5
____exports.bj_CAMPAIGN_INDEX_XH = 6
____exports.bj_CAMPAIGN_INDEX_XU = 7
____exports.bj_CAMPAIGN_INDEX_XO = 8
____exports.bj_CAMPAIGN_OFFSET_T = 0
____exports.bj_CAMPAIGN_OFFSET_H = 1
____exports.bj_CAMPAIGN_OFFSET_U = 2
____exports.bj_CAMPAIGN_OFFSET_O = 3
____exports.bj_CAMPAIGN_OFFSET_N = 4
____exports.bj_CAMPAIGN_OFFSET_XN = 0
____exports.bj_CAMPAIGN_OFFSET_XH = 1
____exports.bj_CAMPAIGN_OFFSET_XU = 2
____exports.bj_CAMPAIGN_OFFSET_XO = 3
____exports.bj_MISSION_INDEX_T00 = ____exports.bj_CAMPAIGN_OFFSET_T * 1000 + 0
____exports.bj_MISSION_INDEX_T01 = ____exports.bj_CAMPAIGN_OFFSET_T * 1000 + 1
____exports.bj_MISSION_INDEX_H00 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 0
____exports.bj_MISSION_INDEX_H01 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 1
____exports.bj_MISSION_INDEX_H02 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 2
____exports.bj_MISSION_INDEX_H03 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 3
____exports.bj_MISSION_INDEX_H04 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 4
____exports.bj_MISSION_INDEX_H05 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 5
____exports.bj_MISSION_INDEX_H06 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 6
____exports.bj_MISSION_INDEX_H07 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 7
____exports.bj_MISSION_INDEX_H08 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 8
____exports.bj_MISSION_INDEX_H09 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 9
____exports.bj_MISSION_INDEX_H10 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 10
____exports.bj_MISSION_INDEX_H11 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 11
____exports.bj_MISSION_INDEX_U00 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 0
____exports.bj_MISSION_INDEX_U01 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 1
____exports.bj_MISSION_INDEX_U02 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 2
____exports.bj_MISSION_INDEX_U03 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 3
____exports.bj_MISSION_INDEX_U05 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 4
____exports.bj_MISSION_INDEX_U07 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 5
____exports.bj_MISSION_INDEX_U08 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 6
____exports.bj_MISSION_INDEX_U09 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 7
____exports.bj_MISSION_INDEX_U10 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 8
____exports.bj_MISSION_INDEX_U11 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 9
____exports.bj_MISSION_INDEX_O00 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 0
____exports.bj_MISSION_INDEX_O01 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 1
____exports.bj_MISSION_INDEX_O02 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 2
____exports.bj_MISSION_INDEX_O03 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 3
____exports.bj_MISSION_INDEX_O04 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 4
____exports.bj_MISSION_INDEX_O05 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 5
____exports.bj_MISSION_INDEX_O06 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 6
____exports.bj_MISSION_INDEX_O07 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 7
____exports.bj_MISSION_INDEX_O08 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 8
____exports.bj_MISSION_INDEX_O09 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 9
____exports.bj_MISSION_INDEX_O10 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 10
____exports.bj_MISSION_INDEX_N00 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 0
____exports.bj_MISSION_INDEX_N01 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 1
____exports.bj_MISSION_INDEX_N02 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 2
____exports.bj_MISSION_INDEX_N03 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 3
____exports.bj_MISSION_INDEX_N04 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 4
____exports.bj_MISSION_INDEX_N05 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 5
____exports.bj_MISSION_INDEX_N06 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 6
____exports.bj_MISSION_INDEX_N07 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 7
____exports.bj_MISSION_INDEX_N08 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 8
____exports.bj_MISSION_INDEX_N09 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 9
____exports.bj_MISSION_INDEX_XN00 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 0
____exports.bj_MISSION_INDEX_XN01 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 1
____exports.bj_MISSION_INDEX_XN02 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 2
____exports.bj_MISSION_INDEX_XN03 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 3
____exports.bj_MISSION_INDEX_XN04 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 4
____exports.bj_MISSION_INDEX_XN05 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 5
____exports.bj_MISSION_INDEX_XN06 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 6
____exports.bj_MISSION_INDEX_XN07 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 7
____exports.bj_MISSION_INDEX_XN08 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 8
____exports.bj_MISSION_INDEX_XN09 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 9
____exports.bj_MISSION_INDEX_XN10 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 10
____exports.bj_MISSION_INDEX_XH00 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 0
____exports.bj_MISSION_INDEX_XH01 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 1
____exports.bj_MISSION_INDEX_XH02 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 2
____exports.bj_MISSION_INDEX_XH03 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 3
____exports.bj_MISSION_INDEX_XH04 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 4
____exports.bj_MISSION_INDEX_XH05 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 5
____exports.bj_MISSION_INDEX_XH06 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 6
____exports.bj_MISSION_INDEX_XH07 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 7
____exports.bj_MISSION_INDEX_XH08 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 8
____exports.bj_MISSION_INDEX_XH09 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 9
____exports.bj_MISSION_INDEX_XU00 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 0
____exports.bj_MISSION_INDEX_XU01 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 1
____exports.bj_MISSION_INDEX_XU02 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 2
____exports.bj_MISSION_INDEX_XU03 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 3
____exports.bj_MISSION_INDEX_XU04 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 4
____exports.bj_MISSION_INDEX_XU05 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 5
____exports.bj_MISSION_INDEX_XU06 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 6
____exports.bj_MISSION_INDEX_XU07 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 7
____exports.bj_MISSION_INDEX_XU08 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 8
____exports.bj_MISSION_INDEX_XU09 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 9
____exports.bj_MISSION_INDEX_XU10 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 10
____exports.bj_MISSION_INDEX_XU11 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 11
____exports.bj_MISSION_INDEX_XU12 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 12
____exports.bj_MISSION_INDEX_XU13 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 13
____exports.bj_MISSION_INDEX_XO00 = ____exports.bj_CAMPAIGN_OFFSET_XO * 1000 + 0
____exports.bj_CINEMATICINDEX_TOP = 0
____exports.bj_CINEMATICINDEX_HOP = 1
____exports.bj_CINEMATICINDEX_HED = 2
____exports.bj_CINEMATICINDEX_OOP = 3
____exports.bj_CINEMATICINDEX_OED = 4
____exports.bj_CINEMATICINDEX_UOP = 5
____exports.bj_CINEMATICINDEX_UED = 6
____exports.bj_CINEMATICINDEX_NOP = 7
____exports.bj_CINEMATICINDEX_NED = 8
____exports.bj_CINEMATICINDEX_XOP = 9
____exports.bj_CINEMATICINDEX_XED = 10
____exports.bj_ALLIANCE_UNALLIED = 0
____exports.bj_ALLIANCE_UNALLIED_VISION = 1
____exports.bj_ALLIANCE_ALLIED = 2
____exports.bj_ALLIANCE_ALLIED_VISION = 3
____exports.bj_ALLIANCE_ALLIED_UNITS = 4
____exports.bj_ALLIANCE_ALLIED_ADVUNITS = 5
____exports.bj_ALLIANCE_NEUTRAL = 6
____exports.bj_ALLIANCE_NEUTRAL_VISION = 7
____exports.bj_KEYEVENTTYPE_DEPRESS = 0
____exports.bj_KEYEVENTTYPE_RELEASE = 1
____exports.bj_KEYEVENTKEY_LEFT = 0
____exports.bj_KEYEVENTKEY_RIGHT = 1
____exports.bj_KEYEVENTKEY_DOWN = 2
____exports.bj_KEYEVENTKEY_UP = 3
____exports.bj_TIMETYPE_ADD = 0
____exports.bj_TIMETYPE_SET = 1
____exports.bj_TIMETYPE_SUB = 2
____exports.bj_CAMERABOUNDS_ADJUST_ADD = 0
____exports.bj_CAMERABOUNDS_ADJUST_SUB = 1
____exports.bj_QUESTTYPE_REQ_DISCOVERED = 0
____exports.bj_QUESTTYPE_REQ_UNDISCOVERED = 1
____exports.bj_QUESTTYPE_OPT_DISCOVERED = 2
____exports.bj_QUESTTYPE_OPT_UNDISCOVERED = 3
____exports.bj_QUESTMESSAGE_DISCOVERED = 0
____exports.bj_QUESTMESSAGE_UPDATED = 1
____exports.bj_QUESTMESSAGE_COMPLETED = 2
____exports.bj_QUESTMESSAGE_FAILED = 3
____exports.bj_QUESTMESSAGE_REQUIREMENT = 4
____exports.bj_QUESTMESSAGE_MISSIONFAILED = 5
____exports.bj_QUESTMESSAGE_ALWAYSHINT = 6
____exports.bj_QUESTMESSAGE_HINT = 7
____exports.bj_QUESTMESSAGE_SECRET = 8
____exports.bj_QUESTMESSAGE_UNITACQUIRED = 9
____exports.bj_QUESTMESSAGE_UNITAVAILABLE = 10
____exports.bj_QUESTMESSAGE_ITEMACQUIRED = 11
____exports.bj_QUESTMESSAGE_WARNING = 12
____exports.bj_SORTTYPE_SORTBYVALUE = 0
____exports.bj_SORTTYPE_SORTBYPLAYER = 1
____exports.bj_SORTTYPE_SORTBYLABEL = 2
____exports.bj_CINEFADETYPE_FADEIN = 0
____exports.bj_CINEFADETYPE_FADEOUT = 1
____exports.bj_CINEFADETYPE_FADEOUTIN = 2
____exports.bj_REMOVEBUFFS_POSITIVE = 0
____exports.bj_REMOVEBUFFS_NEGATIVE = 1
____exports.bj_REMOVEBUFFS_ALL = 2
____exports.bj_REMOVEBUFFS_NONTLIFE = 3
____exports.bj_BUFF_POLARITY_POSITIVE = 0
____exports.bj_BUFF_POLARITY_NEGATIVE = 1
____exports.bj_BUFF_POLARITY_EITHER = 2
____exports.bj_BUFF_RESIST_MAGIC = 0
____exports.bj_BUFF_RESIST_PHYSICAL = 1
____exports.bj_BUFF_RESIST_EITHER = 2
____exports.bj_BUFF_RESIST_BOTH = 3
____exports.bj_HEROSTAT_STR = 0
____exports.bj_HEROSTAT_AGI = 1
____exports.bj_HEROSTAT_INT = 2
____exports.bj_MODIFYMETHOD_ADD = 0
____exports.bj_MODIFYMETHOD_SUB = 1
____exports.bj_MODIFYMETHOD_SET = 2
____exports.bj_UNIT_STATE_METHOD_ABSOLUTE = 0
____exports.bj_UNIT_STATE_METHOD_RELATIVE = 1
____exports.bj_UNIT_STATE_METHOD_DEFAULTS = 2
____exports.bj_UNIT_STATE_METHOD_MAXIMUM = 3
____exports.bj_GATEOPERATION_CLOSE = 0
____exports.bj_GATEOPERATION_OPEN = 1
____exports.bj_GATEOPERATION_DESTROY = 2
____exports.bj_GAMECACHE_BOOLEAN = 0
____exports.bj_GAMECACHE_INTEGER = 1
____exports.bj_GAMECACHE_REAL = 2
____exports.bj_GAMECACHE_UNIT = 3
____exports.bj_GAMECACHE_STRING = 4
____exports.bj_ITEM_STATUS_HIDDEN = 0
____exports.bj_ITEM_STATUS_OWNED = 1
____exports.bj_ITEM_STATUS_INVULNERABLE = 2
____exports.bj_ITEM_STATUS_POWERUP = 3
____exports.bj_ITEM_STATUS_SELLABLE = 4
____exports.bj_ITEM_STATUS_PAWNABLE = 5
____exports.bj_ITEMCODE_STATUS_POWERUP = 0
____exports.bj_ITEMCODE_STATUS_SELLABLE = 1
____exports.bj_ITEMCODE_STATUS_PAWNABLE = 2
____exports.bj_MINIMAPPINGSTYLE_SIMPLE = 0
____exports.bj_MINIMAPPINGSTYLE_FLASHY = 1
____exports.bj_MINIMAPPINGSTYLE_ATTACK = 2
____exports.bj_CORPSE_MAX_DEATH_TIME = 8
____exports.bj_CORPSETYPE_FLESH = 0
____exports.bj_CORPSETYPE_BONE = 1
____exports.bj_ELEVATOR_BLOCKER_CODE = "DTep"
____exports.bj_ELEVATOR_CODE01 = "DTrf"
____exports.bj_ELEVATOR_CODE02 = "DTrx"
____exports.bj_ELEVATOR_WALL_TYPE_ALL = 0
____exports.bj_ELEVATOR_WALL_TYPE_EAST = 1
____exports.bj_ELEVATOR_WALL_TYPE_NORTH = 2
____exports.bj_ELEVATOR_WALL_TYPE_SOUTH = 3
____exports.bj_ELEVATOR_WALL_TYPE_WEST = 4
____exports.bj_MELEE_MAX_TWINKED_HEROES = 0
____exports.bj_mapInitialPlayableArea = nil
____exports.bj_mapInitialCameraBounds = nil
____exports.bj_forLoopAIndex = 0
____exports.bj_forLoopBIndex = 0
____exports.bj_forLoopAIndexEnd = 0
____exports.bj_forLoopBIndexEnd = 0
____exports.bj_slotControlReady = false
____exports.bj_gameStartedTimer = nil
____exports.bj_gameStarted = false
____exports.bj_isSinglePlayer = false
____exports.bj_dncSoundsDay = nil
____exports.bj_dncSoundsNight = nil
____exports.bj_dayAmbientSound = nil
____exports.bj_nightAmbientSound = nil
____exports.bj_dncSoundsDawn = nil
____exports.bj_dncSoundsDusk = nil
____exports.bj_dawnSound = nil
____exports.bj_duskSound = nil
____exports.bj_useDawnDuskSounds = true
____exports.bj_dncIsDaytime = false
____exports.bj_rescueSound = nil
____exports.bj_questDiscoveredSound = nil
____exports.bj_questUpdatedSound = nil
____exports.bj_questCompletedSound = nil
____exports.bj_questFailedSound = nil
____exports.bj_questHintSound = nil
____exports.bj_questSecretSound = nil
____exports.bj_questItemAcquiredSound = nil
____exports.bj_questWarningSound = nil
____exports.bj_victoryDialogSound = nil
____exports.bj_defeatDialogSound = nil
____exports.bj_rescueUnitBehavior = nil
____exports.bj_rescueChangeColorUnit = true
____exports.bj_rescueChangeColorBldg = true
____exports.bj_cineSceneEndingTimer = nil
____exports.bj_cineSceneLastSound = nil
____exports.bj_cineSceneBeingSkipped = nil
____exports.bj_cineModePriorSpeed = ____exports.MAP_SPEED_NORMAL
____exports.bj_cineModePriorFogSetting = false
____exports.bj_cineModePriorMaskSetting = false
____exports.bj_cineModeAlreadyIn = false
____exports.bj_cineModePriorDawnDusk = false
____exports.bj_cineModeSavedSeed = 0
____exports.bj_cineFadeFinishTimer = nil
____exports.bj_cineFadeContinueTimer = nil
____exports.bj_cineFadeContinueRed = 0
____exports.bj_cineFadeContinueGreen = 0
____exports.bj_cineFadeContinueBlue = 0
____exports.bj_cineFadeContinueTrans = 0
____exports.bj_cineFadeContinueDuration = 0
____exports.bj_cineFadeContinueTex = ""
____exports.JASS_MAX_ARRAY_SIZE = 8192
____exports.PLAYER_NEUTRAL_PASSIVE = 15
____exports.PLAYER_NEUTRAL_AGGRESSIVE = 12
____exports.PLAYER_COLOR_RED = function() return ConvertPlayerColor(0) end
____exports.PLAYER_COLOR_BLUE = function() return ConvertPlayerColor(1) end
____exports.PLAYER_COLOR_CYAN = function() return ConvertPlayerColor(2) end
____exports.PLAYER_COLOR_PURPLE = function() return ConvertPlayerColor(3) end
____exports.PLAYER_COLOR_YELLOW = function() return ConvertPlayerColor(4) end
____exports.PLAYER_COLOR_ORANGE = function() return ConvertPlayerColor(5) end
____exports.PLAYER_COLOR_GREEN = function() return ConvertPlayerColor(6) end
____exports.PLAYER_COLOR_PINK = function() return ConvertPlayerColor(7) end
____exports.PLAYER_COLOR_LIGHT_GRAY = function() return ConvertPlayerColor(8) end
____exports.PLAYER_COLOR_LIGHT_BLUE = function() return ConvertPlayerColor(9) end
____exports.PLAYER_COLOR_AQUA = function() return ConvertPlayerColor(10) end
____exports.PLAYER_COLOR_BROWN = function() return ConvertPlayerColor(11) end
____exports.PLAYER_COLOR_BLACK = function() return ConvertPlayerColor(12) end
____exports.RACE_HUMAN = function() return ConvertRace(1) end
____exports.RACE_ORC = function() return ConvertRace(2) end
____exports.RACE_UNDEAD = function() return ConvertRace(3) end
____exports.RACE_NIGHTELF = function() return ConvertRace(4) end
____exports.RACE_DEMON = function() return ConvertRace(5) end
____exports.RACE_OTHER = function() return ConvertRace(7) end
____exports.PLAYER_GAME_RESULT_VICTORY = function() return ConvertPlayerGameResult(0) end
____exports.PLAYER_GAME_RESULT_DEFEAT = function() return ConvertPlayerGameResult(1) end
____exports.PLAYER_GAME_RESULT_TIE = function() return ConvertPlayerGameResult(2) end
____exports.PLAYER_GAME_RESULT_NEUTRAL = function() return ConvertPlayerGameResult(3) end
____exports.ALLIANCE_PASSIVE = function() return ConvertAllianceType(0) end
____exports.ALLIANCE_HELP_REQUEST = function() return ConvertAllianceType(1) end
____exports.ALLIANCE_HELP_RESPONSE = function() return ConvertAllianceType(2) end
____exports.ALLIANCE_SHARED_XP = function() return ConvertAllianceType(3) end
____exports.ALLIANCE_SHARED_SPELLS = function() return ConvertAllianceType(4) end
____exports.ALLIANCE_SHARED_VISION = function() return ConvertAllianceType(5) end
____exports.ALLIANCE_SHARED_CONTROL = function() return ConvertAllianceType(6) end
____exports.ALLIANCE_SHARED_ADVANCED_CONTROL = function() return ConvertAllianceType(7) end
____exports.ALLIANCE_RESCUABLE = function() return ConvertAllianceType(8) end
____exports.ALLIANCE_SHARED_VISION_FORCED = function() return ConvertAllianceType(9) end
____exports.VERSION_REIGN_OF_CHAOS = function() return ConvertVersion(0) end
____exports.VERSION_FROZEN_THRONE = function() return ConvertVersion(1) end
____exports.ATTACK_TYPE_NORMAL = function() return ConvertAttackType(0) end
____exports.ATTACK_TYPE_MELEE = function() return ConvertAttackType(1) end
____exports.ATTACK_TYPE_PIERCE = function() return ConvertAttackType(2) end
____exports.ATTACK_TYPE_SIEGE = function() return ConvertAttackType(3) end
____exports.ATTACK_TYPE_MAGIC = function() return ConvertAttackType(4) end
____exports.ATTACK_TYPE_CHAOS = function() return ConvertAttackType(5) end
____exports.ATTACK_TYPE_HERO = function() return ConvertAttackType(6) end
____exports.DAMAGE_TYPE_UNKNOWN = function() return ConvertDamageType(0) end
____exports.DAMAGE_TYPE_NORMAL = function() return ConvertDamageType(4) end
____exports.DAMAGE_TYPE_ENHANCED = function() return ConvertDamageType(5) end
____exports.DAMAGE_TYPE_FIRE = function() return ConvertDamageType(8) end
____exports.DAMAGE_TYPE_COLD = function() return ConvertDamageType(9) end
____exports.DAMAGE_TYPE_LIGHTNING = function() return ConvertDamageType(10) end
____exports.DAMAGE_TYPE_POISON = function() return ConvertDamageType(11) end
____exports.DAMAGE_TYPE_DISEASE = function() return ConvertDamageType(12) end
____exports.DAMAGE_TYPE_DIVINE = function() return ConvertDamageType(13) end
____exports.DAMAGE_TYPE_MAGIC = function() return ConvertDamageType(14) end
____exports.DAMAGE_TYPE_SONIC = function() return ConvertDamageType(15) end
____exports.DAMAGE_TYPE_ACID = function() return ConvertDamageType(16) end
____exports.DAMAGE_TYPE_FORCE = function() return ConvertDamageType(17) end
____exports.DAMAGE_TYPE_DEATH = function() return ConvertDamageType(18) end
____exports.DAMAGE_TYPE_MIND = function() return ConvertDamageType(19) end
____exports.DAMAGE_TYPE_PLANT = function() return ConvertDamageType(20) end
____exports.DAMAGE_TYPE_DEFENSIVE = function() return ConvertDamageType(21) end
____exports.DAMAGE_TYPE_DEMOLITION = function() return ConvertDamageType(22) end
____exports.DAMAGE_TYPE_SLOW_POISON = function() return ConvertDamageType(23) end
____exports.DAMAGE_TYPE_SPIRIT_LINK = function() return ConvertDamageType(24) end
____exports.DAMAGE_TYPE_SHADOW_STRIKE = function() return ConvertDamageType(25) end
____exports.DAMAGE_TYPE_UNIVERSAL = function() return ConvertDamageType(26) end
____exports.WEAPON_TYPE_WHOKNOWS = function() return ConvertWeaponType(0) end
____exports.WEAPON_TYPE_METAL_LIGHT_CHOP = function() return ConvertWeaponType(1) end
____exports.WEAPON_TYPE_METAL_MEDIUM_CHOP = function() return ConvertWeaponType(2) end
____exports.WEAPON_TYPE_METAL_HEAVY_CHOP = function() return ConvertWeaponType(3) end
____exports.WEAPON_TYPE_METAL_LIGHT_SLICE = function() return ConvertWeaponType(4) end
____exports.WEAPON_TYPE_METAL_MEDIUM_SLICE = function() return ConvertWeaponType(5) end
____exports.WEAPON_TYPE_METAL_HEAVY_SLICE = function() return ConvertWeaponType(6) end
____exports.WEAPON_TYPE_METAL_MEDIUM_BASH = function() return ConvertWeaponType(7) end
____exports.WEAPON_TYPE_METAL_HEAVY_BASH = function() return ConvertWeaponType(8) end
____exports.WEAPON_TYPE_METAL_MEDIUM_STAB = function() return ConvertWeaponType(9) end
____exports.WEAPON_TYPE_METAL_HEAVY_STAB = function() return ConvertWeaponType(10) end
____exports.WEAPON_TYPE_WOOD_LIGHT_SLICE = function() return ConvertWeaponType(11) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_SLICE = function() return ConvertWeaponType(12) end
____exports.WEAPON_TYPE_WOOD_HEAVY_SLICE = function() return ConvertWeaponType(13) end
____exports.WEAPON_TYPE_WOOD_LIGHT_BASH = function() return ConvertWeaponType(14) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_BASH = function() return ConvertWeaponType(15) end
____exports.WEAPON_TYPE_WOOD_HEAVY_BASH = function() return ConvertWeaponType(16) end
____exports.WEAPON_TYPE_WOOD_LIGHT_STAB = function() return ConvertWeaponType(17) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_STAB = function() return ConvertWeaponType(18) end
____exports.WEAPON_TYPE_CLAW_LIGHT_SLICE = function() return ConvertWeaponType(19) end
____exports.WEAPON_TYPE_CLAW_MEDIUM_SLICE = function() return ConvertWeaponType(20) end
____exports.WEAPON_TYPE_CLAW_HEAVY_SLICE = function() return ConvertWeaponType(21) end
____exports.WEAPON_TYPE_AXE_MEDIUM_CHOP = function() return ConvertWeaponType(22) end
____exports.WEAPON_TYPE_ROCK_HEAVY_BASH = function() return ConvertWeaponType(23) end
____exports.PATHING_TYPE_ANY = function() return ConvertPathingType(0) end
____exports.PATHING_TYPE_WALKABILITY = function() return ConvertPathingType(1) end
____exports.PATHING_TYPE_FLYABILITY = function() return ConvertPathingType(2) end
____exports.PATHING_TYPE_BUILDABILITY = function() return ConvertPathingType(3) end
____exports.PATHING_TYPE_PEONHARVESTPATHING = function() return ConvertPathingType(4) end
____exports.PATHING_TYPE_BLIGHTPATHING = function() return ConvertPathingType(5) end
____exports.PATHING_TYPE_FLOATABILITY = function() return ConvertPathingType(6) end
____exports.PATHING_TYPE_AMPHIBIOUSPATHING = function() return ConvertPathingType(7) end
____exports.RACE_PREF_HUMAN = function() return ConvertRacePref(1) end
____exports.RACE_PREF_ORC = function() return ConvertRacePref(2) end
____exports.RACE_PREF_NIGHTELF = function() return ConvertRacePref(4) end
____exports.RACE_PREF_UNDEAD = function() return ConvertRacePref(8) end
____exports.RACE_PREF_DEMON = function() return ConvertRacePref(16) end
____exports.RACE_PREF_RANDOM = function() return ConvertRacePref(32) end
____exports.RACE_PREF_USER_SELECTABLE = function() return ConvertRacePref(64) end
____exports.MAP_CONTROL_USER = function() return ConvertMapControl(0) end
____exports.MAP_CONTROL_COMPUTER = function() return ConvertMapControl(1) end
____exports.MAP_CONTROL_RESCUABLE = function() return ConvertMapControl(2) end
____exports.MAP_CONTROL_NEUTRAL = function() return ConvertMapControl(3) end
____exports.MAP_CONTROL_CREEP = function() return ConvertMapControl(4) end
____exports.MAP_CONTROL_NONE = function() return ConvertMapControl(5) end
____exports.GAME_TYPE_MELEE = function() return ConvertGameType(1) end
____exports.GAME_TYPE_FFA = function() return ConvertGameType(2) end
____exports.GAME_TYPE_USE_MAP_SETTINGS = function() return ConvertGameType(4) end
____exports.GAME_TYPE_BLIZ = function() return ConvertGameType(8) end
____exports.GAME_TYPE_ONE_ON_ONE = function() return ConvertGameType(16) end
____exports.GAME_TYPE_TWO_TEAM_PLAY = function() return ConvertGameType(32) end
____exports.GAME_TYPE_THREE_TEAM_PLAY = function() return ConvertGameType(64) end
____exports.GAME_TYPE_FOUR_TEAM_PLAY = function() return ConvertGameType(128) end
____exports.MAP_FOG_HIDE_TERRAIN = function() return ConvertMapFlag(1) end
____exports.MAP_FOG_MAP_EXPLORED = function() return ConvertMapFlag(2) end
____exports.MAP_FOG_ALWAYS_VISIBLE = function() return ConvertMapFlag(4) end
____exports.MAP_USE_HANDICAPS = function() return ConvertMapFlag(8) end
____exports.MAP_OBSERVERS = function() return ConvertMapFlag(16) end
____exports.MAP_OBSERVERS_ON_DEATH = function() return ConvertMapFlag(32) end
____exports.MAP_FIXED_COLORS = function() return ConvertMapFlag(128) end
____exports.MAP_LOCK_RESOURCE_TRADING = function() return ConvertMapFlag(256) end
____exports.MAP_RESOURCE_TRADING_ALLIES_ONLY = function() return ConvertMapFlag(512) end
____exports.MAP_LOCK_ALLIANCE_CHANGES = function() return ConvertMapFlag(1024) end
____exports.MAP_ALLIANCE_CHANGES_HIDDEN = function() return ConvertMapFlag(2048) end
____exports.MAP_CHEATS = function() return ConvertMapFlag(4096) end
____exports.MAP_CHEATS_HIDDEN = function() return ConvertMapFlag(8192) end
____exports.MAP_LOCK_SPEED = function() return ConvertMapFlag(8192 * 2) end
____exports.MAP_LOCK_RANDOM_SEED = function() return ConvertMapFlag(8192 * 4) end
____exports.MAP_SHARED_ADVANCED_CONTROL = function() return ConvertMapFlag(8192 * 8) end
____exports.MAP_RANDOM_HERO = function() return ConvertMapFlag(8192 * 16) end
____exports.MAP_RANDOM_RACES = function() return ConvertMapFlag(8192 * 32) end
____exports.MAP_RELOADED = function() return ConvertMapFlag(8192 * 64) end
____exports.MAP_PLACEMENT_RANDOM = function() return ConvertPlacement(0) end
____exports.MAP_PLACEMENT_FIXED = function() return ConvertPlacement(1) end
____exports.MAP_PLACEMENT_USE_MAP_SETTINGS = function() return ConvertPlacement(2) end
____exports.MAP_PLACEMENT_TEAMS_TOGETHER = function() return ConvertPlacement(3) end
____exports.MAP_LOC_PRIO_LOW = function() return ConvertStartLocPrio(0) end
____exports.MAP_LOC_PRIO_HIGH = function() return ConvertStartLocPrio(1) end
____exports.MAP_LOC_PRIO_NOT = function() return ConvertStartLocPrio(2) end
____exports.MAP_DENSITY_NONE = function() return ConvertMapDensity(0) end
____exports.MAP_DENSITY_LIGHT = function() return ConvertMapDensity(1) end
____exports.MAP_DENSITY_MEDIUM = function() return ConvertMapDensity(2) end
____exports.MAP_DENSITY_HEAVY = function() return ConvertMapDensity(3) end
____exports.MAP_DIFFICULTY_EASY = function() return ConvertGameDifficulty(0) end
____exports.MAP_DIFFICULTY_NORMAL = function() return ConvertGameDifficulty(1) end
____exports.MAP_DIFFICULTY_HARD = function() return ConvertGameDifficulty(2) end
____exports.MAP_DIFFICULTY_INSANE = function() return ConvertGameDifficulty(3) end
____exports.MAP_SPEED_SLOWEST = function() return ConvertGameSpeed(0) end
____exports.MAP_SPEED_SLOW = function() return ConvertGameSpeed(1) end
____exports.MAP_SPEED_FAST = function() return ConvertGameSpeed(3) end
____exports.MAP_SPEED_FASTEST = function() return ConvertGameSpeed(4) end
____exports.PLAYER_SLOT_STATE_EMPTY = function() return ConvertPlayerSlotState(0) end
____exports.PLAYER_SLOT_STATE_PLAYING = function() return ConvertPlayerSlotState(1) end
____exports.PLAYER_SLOT_STATE_LEFT = function() return ConvertPlayerSlotState(2) end
____exports.SOUND_VOLUMEGROUP_UNITMOVEMENT = function() return ConvertVolumeGroup(0) end
____exports.SOUND_VOLUMEGROUP_UNITSOUNDS = function() return ConvertVolumeGroup(1) end
____exports.SOUND_VOLUMEGROUP_COMBAT = function() return ConvertVolumeGroup(2) end
____exports.SOUND_VOLUMEGROUP_SPELLS = function() return ConvertVolumeGroup(3) end
____exports.SOUND_VOLUMEGROUP_UI = function() return ConvertVolumeGroup(4) end
____exports.SOUND_VOLUMEGROUP_MUSIC = function() return ConvertVolumeGroup(5) end
____exports.SOUND_VOLUMEGROUP_AMBIENTSOUNDS = function() return ConvertVolumeGroup(6) end
____exports.SOUND_VOLUMEGROUP_FIRE = function() return ConvertVolumeGroup(7) end
____exports.GAME_STATE_DIVINE_INTERVENTION = function() return ConvertIGameState(0) end
____exports.GAME_STATE_DISCONNECTED = function() return ConvertIGameState(1) end
____exports.GAME_STATE_TIME_OF_DAY = function() return ConvertFGameState(2) end
____exports.PLAYER_STATE_GAME_RESULT = function() return ConvertPlayerState(0) end
____exports.PLAYER_STATE_RESOURCE_GOLD = function() return ConvertPlayerState(1) end
____exports.PLAYER_STATE_RESOURCE_LUMBER = function() return ConvertPlayerState(2) end
____exports.PLAYER_STATE_RESOURCE_HERO_TOKENS = function() return ConvertPlayerState(3) end
____exports.PLAYER_STATE_RESOURCE_FOOD_CAP = function() return ConvertPlayerState(4) end
____exports.PLAYER_STATE_RESOURCE_FOOD_USED = function() return ConvertPlayerState(5) end
____exports.PLAYER_STATE_FOOD_CAP_CEILING = function() return ConvertPlayerState(6) end
____exports.PLAYER_STATE_GIVES_BOUNTY = function() return ConvertPlayerState(7) end
____exports.PLAYER_STATE_ALLIED_VICTORY = function() return ConvertPlayerState(8) end
____exports.PLAYER_STATE_PLACED = function() return ConvertPlayerState(9) end
____exports.PLAYER_STATE_OBSERVER_ON_DEATH = function() return ConvertPlayerState(10) end
____exports.PLAYER_STATE_OBSERVER = function() return ConvertPlayerState(11) end
____exports.PLAYER_STATE_UNFOLLOWABLE = function() return ConvertPlayerState(12) end
____exports.PLAYER_STATE_GOLD_UPKEEP_RATE = function() return ConvertPlayerState(13) end
____exports.PLAYER_STATE_LUMBER_UPKEEP_RATE = function() return ConvertPlayerState(14) end
____exports.PLAYER_STATE_GOLD_GATHERED = function() return ConvertPlayerState(15) end
____exports.PLAYER_STATE_LUMBER_GATHERED = function() return ConvertPlayerState(16) end
____exports.PLAYER_STATE_NO_CREEP_SLEEP = function() return ConvertPlayerState(25) end
____exports.UNIT_STATE_LIFE = function() return ConvertUnitState(0) end
____exports.UNIT_STATE_MAX_LIFE = function() return ConvertUnitState(1) end
____exports.UNIT_STATE_MANA = function() return ConvertUnitState(2) end
____exports.UNIT_STATE_MAX_MANA = function() return ConvertUnitState(3) end
____exports.UNIT_STATE_ATTACK_DICE = function() return ConvertUnitState(16) end
____exports.UNIT_STATE_ATTACK_SIDE = function() return ConvertUnitState(17) end
____exports.UNIT_STATE_ATTACK_WHITE = function() return ConvertUnitState(18) end
____exports.UNIT_STATE_ATTACK_BONUS = function() return ConvertUnitState(19) end
____exports.UNIT_STATE_ATTACK_MIX = function() return ConvertUnitState(20) end
____exports.UNIT_STATE_ATTACK_MAX = function() return ConvertUnitState(21) end
____exports.UNIT_STATE_ATTACK_RANGE = function() return ConvertUnitState(22) end
____exports.UNIT_STATE_DEFEND_WHITE = function() return ConvertUnitState(32) end
____exports.UNIT_STATE_ATTACK_SPACE = function() return ConvertUnitState(37) end
____exports.UNIT_STATE_ATTACK_SPEED = function() return ConvertUnitState(81) end
____exports.AI_DIFFICULTY_NEWBIE = function() return ConvertAIDifficulty(0) end
____exports.AI_DIFFICULTY_NORMAL = function() return ConvertAIDifficulty(1) end
____exports.AI_DIFFICULTY_INSANE = function() return ConvertAIDifficulty(2) end
____exports.PLAYER_SCORE_UNITS_TRAINED = function() return ConvertPlayerScore(0) end
____exports.PLAYER_SCORE_UNITS_KILLED = function() return ConvertPlayerScore(1) end
____exports.PLAYER_SCORE_STRUCT_BUILT = function() return ConvertPlayerScore(2) end
____exports.PLAYER_SCORE_STRUCT_RAZED = function() return ConvertPlayerScore(3) end
____exports.PLAYER_SCORE_TECH_PERCENT = function() return ConvertPlayerScore(4) end
____exports.PLAYER_SCORE_FOOD_MAXPROD = function() return ConvertPlayerScore(5) end
____exports.PLAYER_SCORE_FOOD_MAXUSED = function() return ConvertPlayerScore(6) end
____exports.PLAYER_SCORE_HEROES_KILLED = function() return ConvertPlayerScore(7) end
____exports.PLAYER_SCORE_ITEMS_GAINED = function() return ConvertPlayerScore(8) end
____exports.PLAYER_SCORE_MERCS_HIRED = function() return ConvertPlayerScore(9) end
____exports.PLAYER_SCORE_GOLD_MINED_TOTAL = function() return ConvertPlayerScore(10) end
____exports.PLAYER_SCORE_GOLD_MINED_UPKEEP = function() return ConvertPlayerScore(11) end
____exports.PLAYER_SCORE_GOLD_LOST_UPKEEP = function() return ConvertPlayerScore(12) end
____exports.PLAYER_SCORE_GOLD_LOST_TAX = function() return ConvertPlayerScore(13) end
____exports.PLAYER_SCORE_GOLD_GIVEN = function() return ConvertPlayerScore(14) end
____exports.PLAYER_SCORE_GOLD_RECEIVED = function() return ConvertPlayerScore(15) end
____exports.PLAYER_SCORE_LUMBER_TOTAL = function() return ConvertPlayerScore(16) end
____exports.PLAYER_SCORE_LUMBER_LOST_UPKEEP = function() return ConvertPlayerScore(17) end
____exports.PLAYER_SCORE_LUMBER_LOST_TAX = function() return ConvertPlayerScore(18) end
____exports.PLAYER_SCORE_LUMBER_GIVEN = function() return ConvertPlayerScore(19) end
____exports.PLAYER_SCORE_LUMBER_RECEIVED = function() return ConvertPlayerScore(20) end
____exports.PLAYER_SCORE_UNIT_TOTAL = function() return ConvertPlayerScore(21) end
____exports.PLAYER_SCORE_HERO_TOTAL = function() return ConvertPlayerScore(22) end
____exports.PLAYER_SCORE_RESOURCE_TOTAL = function() return ConvertPlayerScore(23) end
____exports.PLAYER_SCORE_TOTAL = function() return ConvertPlayerScore(24) end
____exports.EVENT_GAME_VICTORY = function() return ConvertGameEvent(0) end
____exports.EVENT_GAME_END_LEVEL = function() return ConvertGameEvent(1) end
____exports.EVENT_GAME_VARIABLE_LIMIT = function() return ConvertGameEvent(2) end
____exports.EVENT_GAME_STATE_LIMIT = function() return ConvertGameEvent(3) end
____exports.EVENT_GAME_TIMER_EXPIRED = function() return ConvertGameEvent(4) end
____exports.EVENT_GAME_ENTER_REGION = function() return ConvertGameEvent(5) end
____exports.EVENT_GAME_LEAVE_REGION = function() return ConvertGameEvent(6) end
____exports.EVENT_GAME_TRACKABLE_HIT = function() return ConvertGameEvent(7) end
____exports.EVENT_GAME_TRACKABLE_TRACK = function() return ConvertGameEvent(8) end
____exports.EVENT_GAME_SHOW_SKILL = function() return ConvertGameEvent(9) end
____exports.EVENT_GAME_BUILD_SUBMENU = function() return ConvertGameEvent(10) end
____exports.EVENT_PLAYER_STATE_LIMIT = function() return ConvertPlayerEvent(11) end
____exports.EVENT_PLAYER_ALLIANCE_CHANGED = function() return ConvertPlayerEvent(12) end
____exports.EVENT_PLAYER_DEFEAT = function() return ConvertPlayerEvent(13) end
____exports.EVENT_PLAYER_VICTORY = function() return ConvertPlayerEvent(14) end
____exports.EVENT_PLAYER_LEAVE = function() return ConvertPlayerEvent(15) end
____exports.EVENT_PLAYER_CHAT = function() return ConvertPlayerEvent(16) end
____exports.EVENT_PLAYER_END_CINEMATIC = function() return ConvertPlayerEvent(17) end
____exports.EVENT_PLAYER_UNIT_ATTACKED = function() return ConvertPlayerUnitEvent(18) end
____exports.EVENT_PLAYER_UNIT_RESCUED = function() return ConvertPlayerUnitEvent(19) end
____exports.EVENT_PLAYER_UNIT_DEATH = function() return ConvertPlayerUnitEvent(20) end
____exports.EVENT_PLAYER_UNIT_DECAY = function() return ConvertPlayerUnitEvent(21) end
____exports.EVENT_PLAYER_UNIT_DETECTED = function() return ConvertPlayerUnitEvent(22) end
____exports.EVENT_PLAYER_UNIT_HIDDEN = function() return ConvertPlayerUnitEvent(23) end
____exports.EVENT_PLAYER_UNIT_SELECTED = function() return ConvertPlayerUnitEvent(24) end
____exports.EVENT_PLAYER_UNIT_DESELECTED = function() return ConvertPlayerUnitEvent(25) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_START = function() return ConvertPlayerUnitEvent(26) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL = function() return ConvertPlayerUnitEvent(27) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_FINISH = function() return ConvertPlayerUnitEvent(28) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_START = function() return ConvertPlayerUnitEvent(29) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_CANCEL = function() return ConvertPlayerUnitEvent(30) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_FINISH = function() return ConvertPlayerUnitEvent(31) end
____exports.EVENT_PLAYER_UNIT_TRAIN_START = function() return ConvertPlayerUnitEvent(32) end
____exports.EVENT_PLAYER_UNIT_TRAIN_CANCEL = function() return ConvertPlayerUnitEvent(33) end
____exports.EVENT_PLAYER_UNIT_TRAIN_FINISH = function() return ConvertPlayerUnitEvent(34) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_START = function() return ConvertPlayerUnitEvent(35) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_CANCEL = function() return ConvertPlayerUnitEvent(36) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_FINISH = function() return ConvertPlayerUnitEvent(37) end
____exports.EVENT_PLAYER_UNIT_ISSUED_ORDER = function() return ConvertPlayerUnitEvent(38) end
____exports.EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER = function() return ConvertPlayerUnitEvent(39) end
____exports.EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER = function() return ConvertPlayerUnitEvent(40) end
____exports.EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER = function() return ConvertPlayerUnitEvent(40) end
____exports.EVENT_PLAYER_HERO_LEVEL = function() return ConvertPlayerUnitEvent(41) end
____exports.EVENT_PLAYER_HERO_SKILL = function() return ConvertPlayerUnitEvent(42) end
____exports.EVENT_PLAYER_HERO_REVIVABLE = function() return ConvertPlayerUnitEvent(43) end
____exports.EVENT_PLAYER_HERO_REVIVE_START = function() return ConvertPlayerUnitEvent(44) end
____exports.EVENT_PLAYER_HERO_REVIVE_CANCEL = function() return ConvertPlayerUnitEvent(45) end
____exports.EVENT_PLAYER_HERO_REVIVE_FINISH = function() return ConvertPlayerUnitEvent(46) end
____exports.EVENT_PLAYER_UNIT_SUMMON = function() return ConvertPlayerUnitEvent(47) end
____exports.EVENT_PLAYER_UNIT_DROP_ITEM = function() return ConvertPlayerUnitEvent(48) end
____exports.EVENT_PLAYER_UNIT_PICKUP_ITEM = function() return ConvertPlayerUnitEvent(49) end
____exports.EVENT_PLAYER_UNIT_USE_ITEM = function() return ConvertPlayerUnitEvent(50) end
____exports.EVENT_PLAYER_UNIT_LOADED = function() return ConvertPlayerUnitEvent(51) end
____exports.EVENT_UNIT_DAMAGED = function() return ConvertUnitEvent(52) end
____exports.EVENT_UNIT_DEATH = function() return ConvertUnitEvent(53) end
____exports.EVENT_UNIT_DECAY = function() return ConvertUnitEvent(54) end
____exports.EVENT_UNIT_DETECTED = function() return ConvertUnitEvent(55) end
____exports.EVENT_UNIT_HIDDEN = function() return ConvertUnitEvent(56) end
____exports.EVENT_UNIT_SELECTED = function() return ConvertUnitEvent(57) end
____exports.EVENT_UNIT_DESELECTED = function() return ConvertUnitEvent(58) end
____exports.EVENT_UNIT_STATE_LIMIT = function() return ConvertUnitEvent(59) end
____exports.EVENT_UNIT_ACQUIRED_TARGET = function() return ConvertUnitEvent(60) end
____exports.EVENT_UNIT_TARGET_IN_RANGE = function() return ConvertUnitEvent(61) end
____exports.EVENT_UNIT_ATTACKED = function() return ConvertUnitEvent(62) end
____exports.EVENT_UNIT_RESCUED = function() return ConvertUnitEvent(63) end
____exports.EVENT_UNIT_CONSTRUCT_CANCEL = function() return ConvertUnitEvent(64) end
____exports.EVENT_UNIT_CONSTRUCT_FINISH = function() return ConvertUnitEvent(65) end
____exports.EVENT_UNIT_UPGRADE_START = function() return ConvertUnitEvent(66) end
____exports.EVENT_UNIT_UPGRADE_CANCEL = function() return ConvertUnitEvent(67) end
____exports.EVENT_UNIT_UPGRADE_FINISH = function() return ConvertUnitEvent(68) end
____exports.EVENT_UNIT_TRAIN_START = function() return ConvertUnitEvent(69) end
____exports.EVENT_UNIT_TRAIN_CANCEL = function() return ConvertUnitEvent(70) end
____exports.EVENT_UNIT_TRAIN_FINISH = function() return ConvertUnitEvent(71) end
____exports.EVENT_UNIT_RESEARCH_START = function() return ConvertUnitEvent(72) end
____exports.EVENT_UNIT_RESEARCH_CANCEL = function() return ConvertUnitEvent(73) end
____exports.EVENT_UNIT_RESEARCH_FINISH = function() return ConvertUnitEvent(74) end
____exports.EVENT_UNIT_ISSUED_ORDER = function() return ConvertUnitEvent(75) end
____exports.EVENT_UNIT_ISSUED_POINT_ORDER = function() return ConvertUnitEvent(76) end
____exports.EVENT_UNIT_ISSUED_TARGET_ORDER = function() return ConvertUnitEvent(77) end
____exports.EVENT_UNIT_HERO_LEVEL = function() return ConvertUnitEvent(78) end
____exports.EVENT_UNIT_HERO_SKILL = function() return ConvertUnitEvent(79) end
____exports.EVENT_UNIT_HERO_REVIVABLE = function() return ConvertUnitEvent(80) end
____exports.EVENT_UNIT_HERO_REVIVE_START = function() return ConvertUnitEvent(81) end
____exports.EVENT_UNIT_HERO_REVIVE_CANCEL = function() return ConvertUnitEvent(82) end
____exports.EVENT_UNIT_HERO_REVIVE_FINISH = function() return ConvertUnitEvent(83) end
____exports.EVENT_UNIT_SUMMON = function() return ConvertUnitEvent(84) end
____exports.EVENT_UNIT_DROP_ITEM = function() return ConvertUnitEvent(85) end
____exports.EVENT_UNIT_PICKUP_ITEM = function() return ConvertUnitEvent(86) end
____exports.EVENT_UNIT_USE_ITEM = function() return ConvertUnitEvent(87) end
____exports.EVENT_UNIT_LOADED = function() return ConvertUnitEvent(88) end
____exports.EVENT_WIDGET_DEATH = function() return ConvertWidgetEvent(89) end
____exports.EVENT_DIALOG_BUTTON_CLICK = function() return ConvertDialogEvent(90) end
____exports.EVENT_DIALOG_CLICK = function() return ConvertDialogEvent(91) end
____exports.EVENT_GAME_LOADED = function() return ConvertGameEvent(256) end
____exports.EVENT_GAME_TOURNAMENT_FINISH_SOON = function() return ConvertGameEvent(257) end
____exports.EVENT_GAME_TOURNAMENT_FINISH_NOW = function() return ConvertGameEvent(258) end
____exports.EVENT_GAME_SAVE = function() return ConvertGameEvent(259) end
____exports.EVENT_PLAYER_ARROW_LEFT_DOWN = function() return ConvertPlayerEvent(261) end
____exports.EVENT_PLAYER_ARROW_LEFT_UP = function() return ConvertPlayerEvent(262) end
____exports.EVENT_PLAYER_ARROW_RIGHT_DOWN = function() return ConvertPlayerEvent(263) end
____exports.EVENT_PLAYER_ARROW_RIGHT_UP = function() return ConvertPlayerEvent(264) end
____exports.EVENT_PLAYER_ARROW_DOWN_DOWN = function() return ConvertPlayerEvent(265) end
____exports.EVENT_PLAYER_ARROW_DOWN_UP = function() return ConvertPlayerEvent(266) end
____exports.EVENT_PLAYER_ARROW_UP_DOWN = function() return ConvertPlayerEvent(267) end
____exports.EVENT_PLAYER_ARROW_UP_UP = function() return ConvertPlayerEvent(268) end
____exports.EVENT_PLAYER_UNIT_SELL = function() return ConvertPlayerUnitEvent(269) end
____exports.EVENT_PLAYER_UNIT_CHANGE_OWNER = function() return ConvertPlayerUnitEvent(270) end
____exports.EVENT_PLAYER_UNIT_SELL_ITEM = function() return ConvertPlayerUnitEvent(271) end
____exports.EVENT_PLAYER_UNIT_SPELL_CHANNEL = function() return ConvertPlayerUnitEvent(272) end
____exports.EVENT_PLAYER_UNIT_SPELL_CAST = function() return ConvertPlayerUnitEvent(273) end
____exports.EVENT_PLAYER_UNIT_SPELL_EFFECT = function() return ConvertPlayerUnitEvent(274) end
____exports.EVENT_PLAYER_UNIT_SPELL_FINISH = function() return ConvertPlayerUnitEvent(275) end
____exports.EVENT_PLAYER_UNIT_SPELL_ENDCAST = function() return ConvertPlayerUnitEvent(276) end
____exports.EVENT_PLAYER_UNIT_PAWN_ITEM = function() return ConvertPlayerUnitEvent(277) end
____exports.EVENT_UNIT_SELL = function() return ConvertUnitEvent(286) end
____exports.EVENT_UNIT_CHANGE_OWNER = function() return ConvertUnitEvent(287) end
____exports.EVENT_UNIT_SELL_ITEM = function() return ConvertUnitEvent(288) end
____exports.EVENT_UNIT_SPELL_CHANNEL = function() return ConvertUnitEvent(289) end
____exports.EVENT_UNIT_SPELL_CAST = function() return ConvertUnitEvent(290) end
____exports.EVENT_UNIT_SPELL_EFFECT = function() return ConvertUnitEvent(291) end
____exports.EVENT_UNIT_SPELL_FINISH = function() return ConvertUnitEvent(292) end
____exports.EVENT_UNIT_SPELL_ENDCAST = function() return ConvertUnitEvent(293) end
____exports.EVENT_UNIT_PAWN_ITEM = function() return ConvertUnitEvent(294) end
____exports.LESS_THAN = function() return ConvertLimitOp(0) end
____exports.LESS_THAN_OR_EQUAL = function() return ConvertLimitOp(1) end
____exports.EQUAL = function() return ConvertLimitOp(2) end
____exports.GREATER_THAN_OR_EQUAL = function() return ConvertLimitOp(3) end
____exports.GREATER_THAN = function() return ConvertLimitOp(4) end
____exports.NOT_EQUAL = function() return ConvertLimitOp(5) end
____exports.UNIT_TYPE_HERO = function() return ConvertUnitType(0) end
____exports.UNIT_TYPE_DEAD = function() return ConvertUnitType(1) end
____exports.UNIT_TYPE_STRUCTURE = function() return ConvertUnitType(2) end
____exports.UNIT_TYPE_FLYING = function() return ConvertUnitType(3) end
____exports.UNIT_TYPE_GROUND = function() return ConvertUnitType(4) end
____exports.UNIT_TYPE_ATTACKS_FLYING = function() return ConvertUnitType(5) end
____exports.UNIT_TYPE_ATTACKS_GROUND = function() return ConvertUnitType(6) end
____exports.UNIT_TYPE_MELEE_ATTACKER = function() return ConvertUnitType(7) end
____exports.UNIT_TYPE_RANGED_ATTACKER = function() return ConvertUnitType(8) end
____exports.UNIT_TYPE_GIANT = function() return ConvertUnitType(9) end
____exports.UNIT_TYPE_SUMMONED = function() return ConvertUnitType(10) end
____exports.UNIT_TYPE_STUNNED = function() return ConvertUnitType(11) end
____exports.UNIT_TYPE_PLAGUED = function() return ConvertUnitType(12) end
____exports.UNIT_TYPE_SNARED = function() return ConvertUnitType(13) end
____exports.UNIT_TYPE_UNDEAD = function() return ConvertUnitType(14) end
____exports.UNIT_TYPE_MECHANICAL = function() return ConvertUnitType(15) end
____exports.UNIT_TYPE_PEON = function() return ConvertUnitType(16) end
____exports.UNIT_TYPE_SAPPER = function() return ConvertUnitType(17) end
____exports.UNIT_TYPE_TOWNHALL = function() return ConvertUnitType(18) end
____exports.UNIT_TYPE_ANCIENT = function() return ConvertUnitType(19) end
____exports.UNIT_TYPE_TAUREN = function() return ConvertUnitType(20) end
____exports.UNIT_TYPE_POISONED = function() return ConvertUnitType(21) end
____exports.UNIT_TYPE_POLYMORPHED = function() return ConvertUnitType(22) end
____exports.UNIT_TYPE_SLEEPING = function() return ConvertUnitType(23) end
____exports.UNIT_TYPE_RESISTANT = function() return ConvertUnitType(24) end
____exports.UNIT_TYPE_ETHEREAL = function() return ConvertUnitType(25) end
____exports.UNIT_TYPE_MAGIC_IMMUNE = function() return ConvertUnitType(26) end
____exports.ITEM_TYPE_PERMANENT = function() return ConvertItemType(0) end
____exports.ITEM_TYPE_CHARGED = function() return ConvertItemType(1) end
____exports.ITEM_TYPE_POWERUP = function() return ConvertItemType(2) end
____exports.ITEM_TYPE_ARTIFACT = function() return ConvertItemType(3) end
____exports.ITEM_TYPE_PURCHASABLE = function() return ConvertItemType(4) end
____exports.ITEM_TYPE_CAMPAIGN = function() return ConvertItemType(5) end
____exports.ITEM_TYPE_MISCELLANEOUS = function() return ConvertItemType(6) end
____exports.ITEM_TYPE_UNKNOWN = function() return ConvertItemType(7) end
____exports.ITEM_TYPE_ANY = function() return ConvertItemType(8) end
____exports.ITEM_TYPE_TOME = function() return ConvertItemType(2) end
____exports.CAMERA_FIELD_TARGET_DISTANCE = function() return ConvertCameraField(0) end
____exports.CAMERA_FIELD_FARZ = function() return ConvertCameraField(1) end
____exports.CAMERA_FIELD_ANGLE_OF_ATTACK = function() return ConvertCameraField(2) end
____exports.CAMERA_FIELD_FIELD_OF_VIEW = function() return ConvertCameraField(3) end
____exports.CAMERA_FIELD_ROLL = function() return ConvertCameraField(4) end
____exports.CAMERA_FIELD_ROTATION = function() return ConvertCameraField(5) end
____exports.CAMERA_FIELD_ZOFFSET = function() return ConvertCameraField(6) end
____exports.BLEND_MODE_NONE = function() return ConvertBlendMode(0) end
____exports.BLEND_MODE_DONT_CARE = function() return ConvertBlendMode(0) end
____exports.BLEND_MODE_KEYALPHA = function() return ConvertBlendMode(1) end
____exports.BLEND_MODE_BLEND = function() return ConvertBlendMode(2) end
____exports.BLEND_MODE_ADDITIVE = function() return ConvertBlendMode(3) end
____exports.BLEND_MODE_MODULATE = function() return ConvertBlendMode(4) end
____exports.BLEND_MODE_MODULATE_2X = function() return ConvertBlendMode(5) end
____exports.RARITY_FREQUENT = function() return ConvertRarityControl(0) end
____exports.RARITY_RARE = function() return ConvertRarityControl(1) end
____exports.TEXMAP_FLAG_NONE = function() return ConvertTexMapFlags(0) end
____exports.TEXMAP_FLAG_WRAP_U = function() return ConvertTexMapFlags(1) end
____exports.TEXMAP_FLAG_WRAP_V = function() return ConvertTexMapFlags(2) end
____exports.TEXMAP_FLAG_WRAP_UV = function() return ConvertTexMapFlags(3) end
____exports.FOG_OF_WAR_MASKED = function() return ConvertFogState(1) end
____exports.FOG_OF_WAR_FOGGED = function() return ConvertFogState(2) end
____exports.FOG_OF_WAR_VISIBLE = function() return ConvertFogState(4) end
____exports.CAMERA_MARGIN_LEFT = 0
____exports.CAMERA_MARGIN_RIGHT = 1
____exports.CAMERA_MARGIN_TOP = 2
____exports.CAMERA_MARGIN_BOTTOM = 3
____exports.EFFECT_TYPE_EFFECT = function() return ConvertEffectType(0) end
____exports.EFFECT_TYPE_TARGET = function() return ConvertEffectType(1) end
____exports.EFFECT_TYPE_CASTER = function() return ConvertEffectType(2) end
____exports.EFFECT_TYPE_SPECIAL = function() return ConvertEffectType(3) end
____exports.EFFECT_TYPE_AREA_EFFECT = function() return ConvertEffectType(4) end
____exports.EFFECT_TYPE_MISSILE = function() return ConvertEffectType(5) end
____exports.EFFECT_TYPE_LIGHTNING = function() return ConvertEffectType(6) end
____exports.SOUND_TYPE_EFFECT = function() return ConvertSoundType(0) end
____exports.SOUND_TYPE_EFFECT_LOOPED = function() return ConvertSoundType(1) end
____exports.EVENT_DAMAGE_DATA_VAILD = 0
____exports.EVENT_DAMAGE_DATA_IS_PHYSICAL = 1
____exports.EVENT_DAMAGE_DATA_IS_ATTACK = 2
____exports.EVENT_DAMAGE_DATA_IS_RANGED = 3
____exports.EVENT_DAMAGE_DATA_DAMAGE_TYPE = 4
____exports.EVENT_DAMAGE_DATA_WEAPON_TYPE = 5
____exports.EVENT_DAMAGE_DATA_ATTACK_TYPE = 6
____exports.MOVE_TYPE_NONE = 0
____exports.MOVE_TYPE_NOT = 1
____exports.MOVE_TYPE_FOOT = 2
____exports.MOVE_TYPE_FLY = 4
____exports.MOVE_TYPE_MINE = 8
____exports.MOVE_TYPE_WIND = 16
____exports.MOVE_TYPE_UN = 32
____exports.MOVE_TYPE_FLOAT = 64
____exports.MOVE_TYPE_AMPH = 128
____exports.COLLISION_TYPE_UNIT = 1
____exports.COLLISION_TYPE_BUILDING = 3
____exports.FRAME_ALIGN_LEFT_TOP = 0
____exports.FRAME_ALIGN_TOP = 1
____exports.FRAME_ALIGN_RIGHT_TOP = 2
____exports.FRAME_ALIGN_LEFT = 3
____exports.FRAME_ALIGN_CENTER = 4
____exports.FRAME_ALIGN_RIGHT = 5
____exports.FRAME_ALIGN_LEFT_BOTTOM = 6
____exports.FRAME_ALIGN_BOTTOM = 7
____exports.FRAME_ALIGN_RIGHT_BOTTOM = 8
____exports.MOUSE_ORDER_CLICK = 1
____exports.MOUSE_ORDER_ENTER = 2
____exports.MOUSE_ORDER_LEAVE = 3
____exports.MOUSE_ORDER_RELEASE = 4
____exports.MOUSE_ORDER_SCROLL = 6
____exports.MOUSE_ORDER_DOUBLE_CLICK = 12
____exports.GAME_KEY_MOUSE_LEFT = 1
____exports.GAME_KEY_MOUSE_RIGHT = 2
____exports.GAME_KEY_A = 65
____exports.GAME_KEY_B = 66
____exports.GAME_KEY_C = 67
____exports.GAME_KEY_D = 68
____exports.GAME_KEY_E = 69
____exports.GAME_KEY_F = 70
____exports.GAME_KEY_G = 71
____exports.GAME_KEY_H = 72
____exports.GAME_KEY_I = 73
____exports.GAME_KEY_J = 74
____exports.GAME_KEY_K = 75
____exports.GAME_KEY_L = 76
____exports.GAME_KEY_M = 77
____exports.GAME_KEY_N = 78
____exports.GAME_KEY_O = 79
____exports.GAME_KEY_P = 80
____exports.GAME_KEY_Q = 81
____exports.GAME_KEY_R = 82
____exports.GAME_KEY_S = 83
____exports.GAME_KEY_T = 84
____exports.GAME_KEY_U = 85
____exports.GAME_KEY_V = 86
____exports.GAME_KEY_W = 87
____exports.GAME_KEY_X = 88
____exports.GAME_KEY_Y = 89
____exports.GAME_KEY_Z = 90
____exports.GAME_KEY_0 = 48
____exports.GAME_KEY_1 = 49
____exports.GAME_KEY_2 = 50
____exports.GAME_KEY_3 = 51
____exports.GAME_KEY_4 = 52
____exports.GAME_KEY_5 = 53
____exports.GAME_KEY_6 = 53
____exports.GAME_KEY_7 = 55
____exports.GAME_KEY_8 = 56
____exports.GAME_KEY_9 = 57
____exports.GAME_KEY_TAB = 9
____exports.GAME_KEY_SPACE = 32
____exports.GAME_KEY_ENTER = 513
____exports.GAME_KEY_BACKSPACE = 514
____exports.GAME_KEY_SHIFT = 0
____exports.GAME_KEY_RIGHT = 516
____exports.GAME_KEY_UP = 517
____exports.GAME_KEY_LEFT = 518
____exports.GAME_KEY_DOWN = 519
____exports.GAME_KEY_ACTION_PRESS = 1
____exports.GAME_KEY_ACTION_RELEASE = 0
____exports.TEXT_ALIGN_LEFT_TOP = 11
____exports.TEXT_ALIGN_TOP = 17
____exports.TEXT_ALIGN_RIGHT_TOP = 37
____exports.TEXT_ALIGN_CENTER = 18
____exports.TEXT_ALIGN_LEFT = 10
____exports.TEXT_ALIGN_RIGHT = 34
____exports.TEXT_ALIGN_LEFT_BOTTOM = 12
____exports.TEXT_ALIGN_BOTTOM = 20
____exports.TEXT_ALIGN_RIGHT_BOTTOM = 36
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.dist.handles.player"] = function(...) 
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
local ____handle = require("lua_modules.@eiriksgata.wc3ts.dist.handles.handle")
local Handle = ____handle.Handle
____exports.MapPlayer = __TS__Class()
local MapPlayer = ____exports.MapPlayer
MapPlayer.name = "MapPlayer"
__TS__ClassExtends(MapPlayer, Handle)
function MapPlayer.prototype.____constructor(self, index)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Player(index)
    if handle == nil then
        Error(nil, "w3ts failed to create player handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function MapPlayer.create(self, index)
    local handle = Player(index)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function MapPlayer.prototype.addTechResearched(self, techId, levels)
    AddPlayerTechResearched(self.handle, techId, levels)
end
function MapPlayer.prototype.cacheHeroData(self)
    CachePlayerHeroData(self.handle)
end
function MapPlayer.prototype.compareAlliance(self, otherPlayer, whichAllianceSetting)
    return GetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting)
end
function MapPlayer.prototype.coordsFogged(self, x, y)
    return IsFoggedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsMasked(self, x, y)
    return IsMaskedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsVisible(self, x, y)
    return IsVisibleToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.cripple(self, toWhichPlayers, flag)
    CripplePlayer(self.handle, toWhichPlayers.handle, flag)
end
function MapPlayer.prototype.getScore(self, whichPlayerScore)
    return GetPlayerScore(self.handle, whichPlayerScore)
end
function MapPlayer.prototype.getState(self, whichPlayerState)
    return GetPlayerState(self.handle, whichPlayerState)
end
function MapPlayer.prototype.getStructureCount(self, includeIncomplete)
    return GetPlayerStructureCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getTaxRate(self, otherPlayer, whichResource)
    return GetPlayerTaxRate(self.handle, otherPlayer, whichResource)
end
function MapPlayer.prototype.getTechCount(self, techId, specificonly)
    return GetPlayerTechCount(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getTechMaxAllowed(self, techId)
    return GetPlayerTechMaxAllowed(self.handle, techId)
end
function MapPlayer.prototype.getTechResearched(self, techId, specificonly)
    return GetPlayerTechResearched(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getUnitCount(self, includeIncomplete)
    return GetPlayerUnitCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getUnitCountByType(self, unitName, includeIncomplete, includeUpgrades)
    return GetPlayerTypedUnitCount(self.handle, unitName, includeIncomplete, includeUpgrades)
end
function MapPlayer.prototype.inForce(self, whichForce)
    return IsPlayerInForce(self.handle, whichForce.handle)
end
function MapPlayer.prototype.isLocal(self)
    return GetLocalPlayer() == self.handle
end
function MapPlayer.prototype.isObserver(self)
    return IsPlayerObserver(self.handle)
end
function MapPlayer.prototype.isPlayerAlly(self, otherPlayer)
    return IsPlayerAlly(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isPlayerEnemy(self, otherPlayer)
    return IsPlayerEnemy(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isRacePrefSet(self, pref)
    return IsPlayerRacePrefSet(self.handle, pref)
end
function MapPlayer.prototype.isSelectable(self)
    return GetPlayerSelectable(self.handle)
end
function MapPlayer.prototype.pointFogged(self, whichPoint)
    return IsLocationFoggedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointMasked(self, whichPoint)
    return IsLocationMaskedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointVisible(self, whichPoint)
    return IsLocationVisibleToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.remove(self, gameResult)
    RemovePlayer(self.handle, gameResult)
end
function MapPlayer.prototype.removeAllGuardPositions(self)
    RemoveAllGuardPositions(self.handle)
end
function MapPlayer.prototype.setAbilityAvailable(self, abilId, avail)
    SetPlayerAbilityAvailable(self.handle, abilId, avail)
end
function MapPlayer.prototype.setAlliance(self, otherPlayer, whichAllianceSetting, value)
    SetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting, value)
end
function MapPlayer.prototype.setOnScoreScreen(self, flag)
    SetPlayerOnScoreScreen(self.handle, flag)
end
function MapPlayer.prototype.setState(self, whichPlayerState, value)
    SetPlayerState(self.handle, whichPlayerState, value)
end
function MapPlayer.prototype.setTaxRate(self, otherPlayer, whichResource, rate)
    SetPlayerTaxRate(self.handle, otherPlayer.handle, whichResource, rate)
end
function MapPlayer.prototype.setTechMaxAllowed(self, techId, maximum)
    SetPlayerTechMaxAllowed(self.handle, techId, maximum)
end
function MapPlayer.prototype.setTechResearched(self, techId, setToLevel)
    SetPlayerTechResearched(self.handle, techId, setToLevel)
end
function MapPlayer.prototype.setUnitsOwner(self, newOwner)
    SetPlayerUnitsOwner(self.handle, newOwner)
end
function MapPlayer.fromEnum(self)
    return ____exports.MapPlayer:fromHandle(GetEnumPlayer())
end
function MapPlayer.fromEvent(self)
    return ____exports.MapPlayer:fromHandle(GetTriggerPlayer())
end
function MapPlayer.fromFilter(self)
    return ____exports.MapPlayer:fromHandle(GetFilterPlayer())
end
function MapPlayer.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function MapPlayer.fromIndex(self, index)
    return self:fromHandle(Player(index))
end
function MapPlayer.fromLocal(self)
    local pl = GetLocalPlayer()
    if pl == nil then
        do
            local i = 0
            while i < 10 do
                DisplayTextToPlayer(
                    Player(0),
                    0,
                    0,
                    "$$$$$$$$$ LOCAL PLAYER IS NULL. TELL ME"
                )
                i = i + 1
            end
        end
    end
    return self:fromHandle(pl)
end
__TS__SetDescriptor(
    MapPlayer.prototype,
    "color",
    {
        get = function(self)
            return GetPlayerColor(self.handle)
        end,
        set = function(self, color)
            SetPlayerColor(self.handle, color)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "controller",
    {get = function(self)
        return GetPlayerController(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "handicap",
    {
        get = function(self)
            return GetPlayerHandicap(self.handle)
        end,
        set = function(self, handicap)
            SetPlayerHandicap(self.handle, handicap)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "handicapXp",
    {
        get = function(self)
            return GetPlayerHandicapXP(self.handle)
        end,
        set = function(self, handicap)
            SetPlayerHandicapXP(self.handle, handicap)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "id",
    {get = function(self)
        return GetPlayerId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "name",
    {
        get = function(self)
            return GetPlayerName(self.handle) or ""
        end,
        set = function(self, value)
            SetPlayerName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "race",
    {get = function(self)
        return GetPlayerRace(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "slotState",
    {get = function(self)
        return GetPlayerSlotState(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocation",
    {get = function(self)
        return GetPlayerStartLocation(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationX",
    {get = function(self)
        return GetStartLocationX(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationY",
    {get = function(self)
        return GetStartLocationY(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationPoint",
    {get = function(self)
        return GetStartLocationLoc(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "team",
    {get = function(self)
        return GetPlayerTeam(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.dist.handles.handle"] = function(...) 
local ____lualib = require("lualib_bundle")
local WeakMap = ____lualib.WeakMap
local __TS__New = ____lualib.__TS__New
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
---
-- @noSelfInFile
local map = __TS__New(WeakMap)
____exports.Handle = __TS__Class()
local Handle = ____exports.Handle
Handle.name = "Handle"
function Handle.prototype.____constructor(self, handle)
    self.handle = handle == nil and ____exports.Handle.initHandle or handle
    map:set(self.handle, self)
end
function Handle.initFromHandle(self)
    return ____exports.Handle.initHandle ~= nil
end
function Handle.getObject(self, handle)
    local obj = map:get(handle)
    if obj ~= nil then
        return obj
    end
    ____exports.Handle.initHandle = handle
    local newObj = __TS__New(self)
    ____exports.Handle.initHandle = nil
    return newObj
end
__TS__SetDescriptor(
    Handle.prototype,
    "id",
    {get = function(self)
        return GetHandleId(self.handle)
    end},
    true
)
return ____exports
 end,
}
return require("src.index", ...)
