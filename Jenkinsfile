Jenkinsfile (Declarative Pipeline)
pipeline {
  agent { docker { image 'node:9.6.1' } }
  stages {
    stage('Build') {
      steps {
        sh '"echo Building.."'
        sh 'npm i'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Testing.."'
        sh 'npm test'
      }
    }
  }
  post {
    always {
      sh 'echo "Maybe posting. I don\' know"'
    }
    failure {
      sh 'echo "Nope. Didn\'t work"'
    }
  }
}
