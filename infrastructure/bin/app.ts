#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';

const app = new cdk.App();
new BackendStack(app, 'BackendStack', {
  env: {
    account: '181997277373', // Replace with your AWS account ID
    region: 'us-east-1'
  }
});
