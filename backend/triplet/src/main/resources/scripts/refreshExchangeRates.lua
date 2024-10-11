-- -- Lua script to update exchange rates atomically in Redis
--
-- -- Parameters
-- -- KEYS[1]: current exchange rates key ("currentExchangeRates")
-- -- KEYS[2]: previous exchange rates key ("previousExchangeRates")
-- -- ARGV: new exchange rate data to be stored
--
-- local currentKey = KEYS[1]
-- local previousKey = KEYS[2]
--
-- -- Step 1: Delete previous exchange rates if they exist
-- if redis.call("EXISTS", previousKey) == 1 then
--     redis.call("DEL", previousKey)
-- end
--
-- -- Step 2: Rename current exchange rates to previous exchange rates
-- if redis.call("EXISTS", currentKey) == 1 then
--     redis.call("RENAME", currentKey, previousKey)
-- end
--
-- -- Step 3: Store the new exchange rates in Redis (right-push into the list)
-- for i = 1, #ARGV do
--     redis.call("RPUSH", currentKey, ARGV[i])
-- end
--
-- return "Exchange rates updated successfully."
-- Lua script to update exchange rates atomically in Redis

-- Parameters
-- KEYS[1]: current exchange rates key ("currentExchangeRates")
-- KEYS[2]: previous exchange rates key ("previousExchangeRates")
-- ARGV: new exchange rate data to be stored

local currentKey = KEYS[1]
local previousKey = KEYS[2]

-- Step 1: Delete previous exchange rates if they exist
if redis.call("EXISTS", previousKey) == 1 then
    redis.call("DEL", previousKey)
end

-- Step 2: Rename current exchange rates to previous exchange rates
if redis.call("EXISTS", currentKey) == 1 then
    redis.call("RENAME", currentKey, previousKey)
end

-- Step 3: Store the new exchange rates in Redis (right-push into the list)
for i = 1, #ARGV,2 do
    redis.call('HMSET', KEYS[1], ARGV[i], ARGV[i+1])
end

return "Exchange rates updated successfully."
