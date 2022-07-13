const {Teacher} = require('../models')
const {Student} = require('../models')
const {Pairing} = require('../models')

module.exports = {
  async register (req, res) {
    try {
      const teacher = await Teacher.findOne({
        where: {
          email: req.body.teacher
        }
      });
      if (!teacher) {
        await Teacher.create({
          "email": req.body.teacher
        });
      }
      for (let i = 0; i < req.body.students.length; i++) {
        const student = await Student.findOne({
          where: {
            email: req.body.students[i]
          }
        });
        if(!student) {
          await Student.create({
            "email": req.body.students[i]
          });
        }
        const pairing = await Pairing.findOne({
          where: {
            teacher: req.body.teacher,
            student: req.body.students[i]
          }
        });
        console.log(pairing)
        if(!pairing) {
          await Pairing.create({
            "teacher": req.body.teacher,
            "student": req.body.students[i]
          });
        }
      }
      res.status(204).send()
    } catch (err) {
      res.status(400).send({
        message: `The student has not been registered`,
        error: err
      })
    }
  },
  async commonStudents (req, res) {
    console.log(req.query)
    try {
      let students = []
      for (let i = 0; i < req.query.teacher.length; i++) {
        const pairing = await Pairing.findAll({
          where: {
            teacher: req.query.teacher[i]
          }
        });
        for (let j = 0; j < pairing.length; j++) {
          students.push(pairing[j].dataValues.student)
        }
      }
      console.log(students)
      res.send(habit.toJSON())
    } catch (err) {
      res.status(400).send({
        error: `The list of students could not be retrieved`
      })
    }
  },
  async suspend (req, res) {
    try {
      await Student.update({
          suspend: 1
        },{ where: {
          email: req.body.student
        }
      })
      res.status(204).send()
    } catch (err) {
      res.status(400).send({
        error: `The student was not found`
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
