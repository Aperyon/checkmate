from fabric.api import task, lcd, local, run, env, put


env.use_ssh_config = True
env.hosts = ['checkmate-server']

@task
def build(version, build_backend=True, build_frontend=True):
    with lcd('code'):
        if build_backend:
            local(f'docker build -t checkmate-backend:{version} .')
        if build_frontend:
            with lcd('web'):
                local('npm run-script build')

        if build_backend or build_frontend:
            local('$(aws ecr get-login --no-include-email --region eu-west-3)')

            local(f'docker tag checkmate-backend:{version} 649995796048.dkr.ecr.eu-west-3.amazonaws.com/checkmate-backend:{version}')
            local(f'docker push 649995796048.dkr.ecr.eu-west-3.amazonaws.com/checkmate-backend:{version}')


@task
def deploy(version):
    put('code/config/production/vars.env', '~/checkmate/config/checkmate.env')
    image = f'649995796048.dkr.ecr.eu-west-3.amazonaws.com/checkmate-backend:{version}'
    run('$(aws ecr get-login --no-include-email --region eu-west-3)')
    run(f'docker pull {image}')
    # run(f'docker')
    try:
        run(f'docker rm checkmate -f')
    except:
        print('There was no running docker container with name `checkmate`')
    run(f'docker run -d --name checkmate --env-file ~/checkmate/config/checkmate.env -p 80:80 -p 443:443 {image}')
    local(f'aws s3 sync code/web/build s3://app.checkma.it')
    # local(f'docker run --name temp-cm-web checkmate-web:{version}')
    # local('docker cp temp-cm-web:/build build')
    # local('ls -ls build')
    # local('docker rm temp-cm-web -f')
    # Backend
    # run('docker stop backend')
    # run('docker run backend')

    # Frontend
    # local('aws s3 ')
    # run('nginx -s reload')

