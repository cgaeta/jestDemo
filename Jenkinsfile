pipeline {
  agent { dockerfile true }
  stages {
    stage('Build') {
      steps {
        sh 'echo "Building.."'
        sh 'whoami'
        sh 'su - pptruser'
        sh 'whoami'
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Testing.."'
        sh 'ls -l runTest.sh'
        sh 'chown pptruser ./runTest.sh'
        sh 'ls -l runTest.sh'
        sh 'chmod 755 /usr/src/app/runTest.sh'
        sh 'ls -l runTest.sh'
        //sh 'su -c ./runTest.sh pptruser'
        //sh 'npm test -- "\\w+\\.(unit|intg)\\.test\\.js"'
      }
    }
  }
}
