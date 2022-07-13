const {Teacher} = require('../models')
const {Student} = require('../models')

module.exports = {
  async register (req, res) {
    try {

      res.send(habit.toJSON())
    } catch (err) {
      res.status(400).send({
        error: `The student has not been registered`
      })
    }
  },
  async commonStudents (req, res) {
    try {

      res.send(habit.toJSON())
    } catch (err) {
      res.status(400).send({
        error: `The student has not been registered`
      })
    }
  },
  async suspend (req, res) {
    try {

      res.send(habit.toJSON())
    } catch (err) {
      res.status(400).send({
        error: `The student has not been registered`
      })
    }
  },
  async retrieveForNotifications (req, res) {
    try {

      res.send(habit.toJSON())
    } catch (err) {
      res.status(400).send({
        error: `The student has not been registered`
      })
    }
  },
}
