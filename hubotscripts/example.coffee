module.exports = (robot) ->
  robot.hear /(.+?)@(.+?)@(.*)(@|$)/i, (res) ->
    res.send "! ! command received ! !"
    res.send res.match[0]
    @exec = require('child_process').exec
    command = "node /home/pi/google-home-notifier/go.js " + res.match[0].replace(' ', '\\ ')
    res.send command
    @exec command, (error, stdout, stderr) ->
  #   msg.send error
      res.send stdout
  #   res.send stderr