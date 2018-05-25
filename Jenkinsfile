pipeline {
  agent { dockerfile true }
  stages {
    stage('Build') {
      steps {
        sh 'echo "Building.."'
        sh 'whoami'
        sh 'su pptruser'
        sh 'whoami'
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Testing.."'
        sh 'sudo -u pptruser npm test -- "\\w+\\.(unit|intg)\\.test\\.js"'
      }
    }
  }
}
