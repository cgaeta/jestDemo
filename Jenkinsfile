pipeline {
  agent { docker { image 'node:carbon' } }
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
