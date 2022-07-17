const {Teacher} = require('../models')
const {Student} = require('../models')
const {Pairing} = require('../models')

module.exports = {
  async register (req, res) {
    try {
      // Find if database already has given teacher
      const teacher = await Teacher.findOne({
        where: {
          email: req.body.teacher
        }
      });
      // Add teacher if not already present in database
      if (!teacher) {
        await Teacher.create({
          "email": req.body.teacher
        });
      }
      for (let i = 0; i < req.body.students.length; i++) {
        // Find if database already has given student
        const student = await Student.findOne({
          where: {
            email: req.body.students[i]
          }
        });
        // Add student if not already present in database
        if(!student) {
          await Student.create({
            "email": req.body.students[i]
          });
        }
        // Find if teacher-student pairing already exists in the database
        const pairing = await Pairing.findOne({
          where: {
            teacher: req.body.teacher,
            student: req.body.students[i]
          }
        });
        // Create pairing
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
        // Get students for single teacher provided in GET 
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
        // Get students for multiple teachers provided in GET 
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
        // Check for intersected (common) students from both arrays
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
      // Set student's property of suspend to 1 with identifier being email
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
      // Look for student list of given teacher
      let students = await Pairing.findAll({
        where: {
          teacher: req.body.teacher
        }
      });
      for(let student of students) {
        receipients.push(student.student)
      }
      // Students from POST JSON
      let addedStudents = req.body.notification.split(' @');
      addedStudents.shift()
      // Union students list gotten from DB and students from JSON
      let difference = receipients
        .filter(x => !addedStudents.includes(x))
        .concat(addedStudents.filter(x => !receipients.includes(x)));
      // Check if any of the students are suspended
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
      // Send response back
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
