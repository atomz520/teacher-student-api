module.exports = {
  port: process.env.PORT || 8085,
  db: {
    database: process.env.DB_NAME || 'teacher-student',
    user: process.env.DB_USER || 'teacher-student',
    password: process.env.DB_PASS || 'teacher-student',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: './teacher-student.sqlite'
    }
  }
}
