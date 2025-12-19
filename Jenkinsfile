pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        APP_NAME        = "nutrition-analyzer"
        IMAGE_TAG       = "latest"
        REGISTRY_URL    = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REGISTRY_REPO   = "student-projects" 
        SONAR_PROJECT   = "nutrition-analyzer-key"
        SONAR_HOST_URL  = "http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000"
        NAMESPACE       = "2401178-nutritionanalyzer"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        docker build -t $APP_NAME:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=$SONAR_PROJECT \
                          -Dsonar.host.url=$SONAR_HOST_URL \
                          -Dsonar.login=student \
                          -Dsonar.password=Imccstudent@2025
                    '''
                }
            }
        }

        stage('Login & Push to Nexus') {
            steps {
                container('dind') {
                    sh 'sleep 10'
                    // We are trying the provided Nexus password again
                    sh "docker login $REGISTRY_URL -u student -p Imcc@2025"
                    sh '''
                        docker tag $APP_NAME:$IMAGE_TAG $REGISTRY_URL/$REGISTRY_REPO/$APP_NAME:$IMAGE_TAG
                        docker push $REGISTRY_URL/$REGISTRY_REPO/$APP_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/service.yaml
                        kubectl apply -f k8s/ingress.yaml
                        echo "--- VERIFYING DEPLOYMENT ---"
                        sleep 15
                        kubectl get pods -n $NAMESPACE
                    '''
                }
            }
        }
    }
}
