---
title: "AWS re:Invent 2020 [In-Progress]" 
date: "2020-12-01T22:12:03.284Z"
description: "Thoughts and proofs-of-concepts from AWS re:Invent 2020."
tag: "Programming"
---

## EC2 macOS Instances
The prospect of having macOS support for EC2 instances is exciting, but the current implementation has some severe limitations. First off, the instances are only available via [dedicated hosts](https://aws.amazon.com/ec2/dedicated-hosts/) with a minimum of a 24-hour tenancy. At an hourly rate of USD 1.083, it’s hard to imagine this being economically viable outside of particular use cases. The only AMIs available are 10.14 (Mojave) and 10.15 (Catalina), although Big Sur (11.0) is coming soon. There’s also no mention of support for AWS Workspaces yet, which I hope is a future addition given the popularity of macOS amongst engineers. Lastly, the new Apple M1 ARM-based chip isn’t available until next year.

Despite the cost, I still want to get my hands on an instance. For now, I’ve hit a roadblock and have to increase my `mac1` dedicated host service quota. However, the following CLI command should allow you to provision an instance.

```shell
aws ec2 allocate-hosts --instance-type mac1.metal \
  --availability-zone us-east-1a --auto-placement on \
  --quantity 1 --region us-east-1
aws ec2 run-instances --region us-east-1 \
  --instance-type mac1.metal \
  --image-id  ami-023f74f1accd0b25b \
  --key-name $MY_KEY_PAIR --associate-public-ip-address
```

I also put together a CloudFormation template that includes a security group resource with a parameterized CIDR block.

```yaml
Parameters:
  pAllowedIpCidr:
    Type: String
    AllowedPattern: '((\d{1,3})\.){3}\d{1,3}/\d{1,2}'
    Default: '0.0.0.0/0'
  pKeyPairName:
    Type: AWS::EC2::KeyPair::KeyName
  pVpcId:
    Type: AWS::EC2::VPC::Id
Resources:
  rEc2SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: macOS EC2 instance security group 
      VpcId: !Ref pVpcId
      SecurityGroupIngress: 
      - CidrIp: !Ref pAllowedIpCidr
        IpProtocol: tcp
        FromPort: 22 
        ToPort: 22
      SecurityGroupEgress: 
      - CidrIp: !Ref pAllowedIpCidr
        IpProtocol: tcp
        FromPort: 22
        ToPort: 22 
  rDedicatedHost:
    Type: AWS::EC2::Host
    Properties: 
      AutoPlacement: 'on'
      AvailabilityZone: us-east-1a
      InstanceType: mac1.metal
  rEc2Instance:
    Type: AWS::EC2::Instance
    Properties:
      BlockDeviceMappings: 
      - DeviceName: /dev/disk0
        Ebs: 
          Encrypted: false
          VolumeSize: 8
          VolumeType: gp3
      HostId: !Ref rDedicatedHost
      ImageId: ami-023f74f1accd0b25b
      InstanceType: mac1.metal
      KeyName: !Ref pKeyPairName
      SecurityGroupIds: 
      - !Ref rEc2SecurityGroup
      Tenancy: dedicated
```

## Container Support for Lambda
AWS Lambda supports Docker images up to 10GB in size. They've also provided base images for Lambda runtimes in the new [public ECR](https://gallery.ecr.aws/). For reference, the [base Node.js](https://gallery.ecr.aws/lambda/nodejs) 12 image is ~450MB. The Serverless Application Model (SAM) CLI has already been updated for container support. Instead of specifying a `--runtime`, engineers can now use a `--base-image`.

```shell
sam --version #1.13.1
sam init --base-image amazon/nodejs12.x-base
```

This creates a `Dockerfile` for the function.

```dockerfile
FROM public.ecr.aws/lambda/nodejs:12
COPY app.js package.json ./
RUN npm install
CMD ["app.lambdaHandler"]
```

The `deploy` command also includes container registry support via ECR. With a quick `--guided` deployment, I produced the following `samconfig`:
```toml
version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "sam-app-container-support"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-117t8f9009z98"
s3_prefix = "sam-app-container-support"
region = "us-east-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
image_repository = "ACCOUNT_NUMBER.dkr.ecr.us-east-1.amazonaws.com/IMAGE_REPOSITORY"
```

All of this made it seamless to deploy a container-based Lambda function with the same ease as `zip`-based ones. I haven't had the opportunity to do performance testing yet, but per [/u/julianwood](https://www.reddit.com/r/aws/comments/k4p5dc/new_for_aws_lambda_container_image_support/geb5o18?utm_source=share&utm_medium=web2x&context=3) from the Lambda team, it should be equivalent.

> Performance is on-par with `zip` functions. We don't use Fargate; this is pure Lambda. We optimize the image when the function is created and cache the layers so the start-up time is pretty much the same as `zip` functions. 

A fully-functional example can be found in this [GitHub repository](https://github.com/scottenriquez/aws-reinvent-2020-samples).
