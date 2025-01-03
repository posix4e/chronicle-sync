variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "openhands"
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

data "aws_availability_zones" "available" {
  state = "available"
}
