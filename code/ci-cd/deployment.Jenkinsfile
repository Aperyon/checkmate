node {
    stage ('Checkout') {
        checkout scm
    }

    stage ('Build') {
        sh "fab deployment.build:1"
    }

    stage ('Test') {

    }

    stage ("Deploy") {
        sh "fab deployment.deploy:1"
    }
}