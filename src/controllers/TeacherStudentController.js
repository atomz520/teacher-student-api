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
    try {
      let response = {}
      let studentsRaw = {}
      let students = []
      if(typeof(req.query.teacher) === "string"){
        const pairing = await Pairing.findAll({
          where: {
            teacher: req.query.teacher
          }
        });
        let studentsOfTeacher = []
        for (let j = 0; j < pairing.length; j++) {
          studentsOfTeacher.push(pairing[j].dataValues.student)
        }
        students = studentsOfTeacher
      } else {
        for (let i = 0; i < req.query.teacher.length; i++) {
          const pairing = await Pairing.findAll({
            where: {
              teacher: req.query.teacher[i]
            }
          });
          let studentsOfTeacher = []
          for (let j = 0; j < pairing.length; j++) {
            studentsOfTeacher.push(pairing[j].dataValues.student)
          }
          studentsRaw[req.query.teacher[i]] = studentsOfTeacher
        }
        for(const [key, value] of Object.entries(studentsRaw)) {
          if(students.length === 0) {
            students = value
          }
          let intersection = students.filter(x => value.includes(x));
          students = intersection
        }
      }
      response.students = students
      res.status(200).send(JSON.stringify(response))
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
      let response = {}
      let receipients = []
      let students = await Pairing.findAll({
        where: {
          teacher: req.body.teacher
        }
      });
      for(let student of students) {
        receipients.push(student.student)
      }
      
      let addedStudents = req.body.notification.split(' @');
      addedStudents.shift()


      let difference = receipients
        .filter(x => !addedStudents.includes(x))
        .concat(addedStudents.filter(x => !receipients.includes(x)));

      for (let i = 0; i < difference.length; i++) {
        const student = await Student.findOne({
          where: {
            email: difference[i]
          }
        });
        if(!student){
          difference.splice(i,1)
        } else if (student.dataValues.suspend) {
          difference.splice(i,1)
          i--
        }
      }
      response.receipients = difference

      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      res.status(400).send({
        message: `The student has not been registered`,
        error: err
      })
    }
  },
}
