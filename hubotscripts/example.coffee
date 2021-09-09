module.exports = (robot) ->
  robot.hear /(.+?)@(.+?)@(.*)(@|$)/i, (res) ->
    res.send "! ! command received ! !"
    res.send res.match[0]
    command0 = "node /home/pi/google-home-notifier/go.js " + "\"" + res.match[0] + "\""
    res.send command0
    @exec0 = require('child_process').exec
    @exec0 command0, (error, stdout, stderr) ->
      res.send error
      res.send stdout
      res.send stderr
  robot.hear /(.*)/i, (res) ->
    if(res.message.rawMessage.bot_profile.name.match(/@gmail\.com/))
      res.send "detected"
      #res.send JSON.stringify(res.message.rawMessage);
      at = res.message.rawMessage.attachments[0]
      at_str = "\"cal@" + at.fallback.toString() + "___" + at.pretext.toString() + "___" + at.title.toString() + "___@\""
      command1 = "node /home/pi/google-home-notifier/go.js " + at_str
      res.send command1
      @exec1 = require('child_process').exec
      @exec1 command1, (error, stdout, stderr) ->
        res.send error
        res.send stdout
        res.send stderr

#end


