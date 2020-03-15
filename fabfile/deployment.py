import os
import datetime as dt

import boto3
from fabric.api import task, lcd, local, run, env, put, execute


env.use_ssh_config = True
env.hosts = ['checkmate-server']


@task
def build_and_deploy(version, build_backend=True, build_frontend=True):
    execute(build, version, build_backend, build_frontend)
    execute(deploy, version)


@task
def build(version, build_backend=True, build_frontend=True):
    try:
        local(f'git tag {version}')
        local('git push')
    except:
        pass

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
def deploy(version, upload_collectstatic=False):
    put('code/config/production/vars.env', '~/checkmate/config/checkmate.env')
    image = f'649995796048.dkr.ecr.eu-west-3.amazonaws.com/checkmate-backend:{version}'
    run('$(aws ecr get-login --no-include-email --region eu-west-3)')
    run(f'docker pull {image}')
    try:
        run(f'docker rm checkmate -f')
    except:
        print('There was no running docker container with name `checkmate`')
    run(f'docker run -d --name checkmate --env-file ~/checkmate/config/checkmate.env -p 80:80 -p 443:443 {image}')
    local(f'aws s3 sync code/web/build s3://app.checkmate.best')
    local(f'aws s3 sync code/landing s3://checkmate.best')

    if upload_collectstatic:
        local(f'docker run --name checkmate {image} bash -c "cd /checkmate && ./manage.py collectstatic --no-input"')
        local(f'docker cp checkmate:/static ./temp_django_static')
        local(f'aws s3 sync temp_django_static s3://api.checkmate.best')
        local('docker rm -f checkmate')
        local('rm -rf temp_django_static')

    run('docker rmi $(docker images -aq)')
    client = boto3.client('cloudfront')
    items_to_invalidate = [
        '/',
        '/static/css/styles.sass',
        '/index.html',
        '/favicon.ico',
        '/manifest.json',
        '/app-icon.png',
        '/static/images/checked-checkbox.png',
        '/static/images/unchecked-checkbox.png',
        '/static/fonts/titlefont.ttf',
    ]
    for distribution_id in os.environ.get('AWS_CLOUDFRONT_DISTRIBUTION_IDS', '').split(','):
        client.create_invalidation(
            DistributionId=distribution_id.strip(),
            InvalidationBatch={
                'Paths': {
                    'Quantity': len(items_to_invalidate),
                    'Items': items_to_invalidate
                },
                'CallerReference': dt.datetime.now().strftime('%Y%m%d%H%M%S')
            }
    )
