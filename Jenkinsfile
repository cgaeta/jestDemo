Jenkinsfile (Declarative Pipeline)
pipeline {
  agent { dockerfile true }
  stages {
    stage('Build') {
      steps {
        sh '"echo Building.."'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Testing.."'
      }
    }
  }
}
