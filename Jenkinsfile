pipeline {
  agent { dockerfile true }
  stages {
    stage('Build') {
      steps {
        sh 'echo "Building.."'
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Testing.."'
        sh 'npm test -- "*+.unit.test.js"'
      }
    }
  }
}
