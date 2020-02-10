node {
    stage ('Checkout') {
        checkout scm
    }

    stage ('Build') {
        sh docker build -t checkmate/backend:version ./backend
        sh docker build -t checkmate/web:version ./web
    }

    stage ('Test') {

    }

    stage ("Deploy") {

    }
}