module.exports = (robot) ->
  robot.hear /(.+?)@(.+?)@(.*)(@|$)/i, (res) ->
    res.send "! ! command received ! !"
    res.send res.match[0]
    command = "node /home/pi/google-home-notifier/go.js " + res.match[0].replace(/\s/g, '\\ ')
    res.send command
    @exec = require('child_process').exec
    @exec command, (error, stdout, stderr) ->
      #res.send error
      res.send stdout
      #res.send stderr
  robot.hear /(.*)/i, (res) ->
    if(res.message.rawMessage.bot_profile.name.match(/@gmail\.com/))
      res.send "detected"
      #res.send JSON.stringify(res.message.rawMessage);
      #object['attachments'][0]['fallback']
      at = res.message.rawMessage.attachments[0]
      at_str = "cal@" + at.fallback + "___" + at.text + "___" + at.pretext + "___" + at.title + "___";
      command = "node /home/pi/google-home-notifier/go.js " +  "cal@" + at_str.replace(/\s/g, '\\ ')
      res.send command
      @exec = require('child_process').exec
      @exec command, (error, stdout, stderr) ->
        #res.send error
        res.send stdout
        #res.send stderr
