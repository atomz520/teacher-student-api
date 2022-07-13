const TeacherStudentController = require('./controllers/TeacherStudentController')

module.exports = (app) => {
  app.post('/register',
    TeacherStudentController.register)

  app.get('/commonstudents',
    TeacherStudentController.commonStudents
  )

  app.post('/suspend',
    TeacherStudentController.suspend
  )

  app.post('/retrievefornotifications',
    TeacherStudentController.retrieveForNotifications
  )
}
