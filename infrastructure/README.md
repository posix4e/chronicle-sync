# Infrastructure Setup

This directory contains the infrastructure as code (IaC) for deploying the OpenHands backend using AWS services.

## AWS Infrastructure

The infrastructure is set up using Terraform and includes:

- VPC with public subnets
- ECS Cluster using Fargate
- ECS Task Definition and Service
- Security Groups
- CloudWatch Logs configuration

### Prerequisites

1. AWS CLI installed and configured with admin access
2. Terraform installed (version >= 1.0.0)
3. Docker installed (for building and pushing images)

### Deployment Steps

1. Create an ECR repository for the backend:
```bash
aws ecr create-repository --repository-name openhands-backend
```

2. Build and push the Docker image:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
docker build -t openhands-backend .
docker tag openhands-backend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/openhands-backend:latest
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/openhands-backend:latest
```

3. Initialize Terraform:
```bash
cd infrastructure/aws
terraform init
```

4. Apply the infrastructure:
```bash
terraform apply -var="ecr_repository_url=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/openhands-backend"
```

### Cleanup

To destroy the infrastructure:
```bash
terraform destroy
```
