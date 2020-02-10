from fabric.api import task, lcd, local, run


@task
def build(version):
    with lcd('code'):
        local(f'docker build -t checkmate/backend:{version} ./backend')
        local(f'docker build -t checkmate/web:{version} ./web')


@task
def deploy(version):
    # Backend
    run('docker stop backend')
    run('docker run backend')

    # Frontend

