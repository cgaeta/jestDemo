pipeline {
  agent { docker { 'node:carbon' } }
  stages {
    stage('Build') {
      steps {
        sh 'echo "Building.."'
        sh 'docker version'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Testing.."'
      }
    }
  }
}
