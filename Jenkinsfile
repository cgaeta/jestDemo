pipeline {
  agent { dockerfile true }
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
