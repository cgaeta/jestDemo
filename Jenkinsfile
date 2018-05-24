Jenkinsfile (Declarative Pipeline)
pipeline {
  agent { docker { image 'node:9.6.1' } }
  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'npm i'
      }
    }
    stage('Test') {
      steps {
        echo 'Testing..'
        sh 'npm jest'
      }
    }
  }
}
