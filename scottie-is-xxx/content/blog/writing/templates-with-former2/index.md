---
title: Using Former2 for Existing AWS Resources 
date: "2020-09-26T22:12:03.284Z"
description: "Generating CloudFormation templates from existing AWS resources."
tag: "Programming"
---

## Overview
I've been making a concerted effort lately to use infrastructure as code via CloudFormation for all of my personal AWS-hosted projects. Writing these templates can feel a bit tedious, even with editor tooling and plugins. I thought it would be awesome to generate CloudFormation templates for existing resources and first found CloudFormer. I found blog posts about CloudFormer from as far back as 2013, but it was never advertised much. 

**Update: [Former2](https://github.com/iann0036/former2) is the de facto standard now that [CloudFormer has been deprecated](https://twitter.com/iann0036/status/1314765292145274880?s=20). I kept my notes on CloudFormer for posterity at the end of the post.**

## Getting Started with Former2

Former2 takes a client-side approach to infrastructure as code template generation and has support for [Terraform](https://www.terraform.io/) and [CDK](https://aws.amazon.com/cdk/). Instead of an EC2 instance, it uses the JavaScript SDKs via your browser to make all requisite API calls. You can even use the static website hosted on the public internet. If you're not keen on the idea of passing read-only IAM credentials to a third-party website, [clone the repository](https://github.com/iann0036/former2) and run the web application locally via the file system or Docker. I've also created a CloudFormation template to run it on an EC2 instance:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  pAllowedIpCidr:
    Type: String
    AllowedPattern: '((\d{1,3})\.){3}\d{1,3}/\d{1,2}'
    Default: '0.0.0.0/0'
  pLatestAl2AmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2
  pVpcId:
    Type: AWS::EC2::VPC::Id
  pSubnetId:
    Type: AWS::EC2::Subnet::Id
  pKeyPairName:
    Type: AWS::EC2::KeyPair::KeyName
Description: A self-hosted instance of Former2 on EC2
Resources:
  rEc2SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Former2 security group 
      GroupName: Former2 
      VpcId: !Ref pVpcId
      SecurityGroupIngress: 
      - 
        CidrIp: !Ref pAllowedIpCidr
        IpProtocol: tcp
        FromPort: 80
        ToPort: 443
      SecurityGroupEgress: 
      - 
        CidrIp: !Ref pAllowedIpCidr
        IpProtocol: tcp
        FromPort: 80
        ToPort: 443
  rEc2Instance:
    Type: AWS::EC2::Instance
    Properties:
      UserData:
        Fn::Base64: |
          #!/bin/bash
          yum update -y
          yum install git httpd -y
          systemctl start httpd
          systemctl enable httpd
          cd /var/www/html
          git clone https://github.com/iann0036/former2.git .
      ImageId: !Ref pLatestAl2AmiId 
      InstanceType: t2.micro
      KeyName: !Ref pKeyPairName
      Tenancy: default
      SubnetId: !Ref pSubnetId
      EbsOptimized: false
      SecurityGroupIds: 
      - !Ref rEc2SecurityGroup
      SourceDestCheck: true
      BlockDeviceMappings: 
      - 
        DeviceName: /dev/xvda
        Ebs: 
          Encrypted: false
          VolumeSize: 8
          VolumeType: gp2
          DeleteOnTermination: true
      HibernationOptions: 
        Configured: false
Outputs:
  PublicIp:
    Description: Former2 EC2 instance public IP address
    Value: !GetAtt rEc2Instance.PublicIp
    Export:
      Name: !Sub "${AWS::StackName}-PublicIp"
```

## Use Cases for Generating Templates
Overall I’d argue that addressing the minor changes is easier than writing a template from scratch. With that being said, I don’t know that I’d ever spin up resources via the Console with the sole intent of creating CloudFormation templates. However, it could make migrating from a prototype to a productionized product easier if you’re willing to pay a small compute cost.

## ~~Getting Started with CloudFormer~~
~~Setting up CloudFormer is quite simple through CloudFormation. In fact, it's a sample template that creates a stack with several resources:~~
- ~~`AWS::EC2::Instance`~~
- ~~`AWS::EC2::SecurityGroup`~~
- ~~`AWS::IAM::InstanceProfile`~~
- ~~`AWS::IAM::Role`~~
- ~~`AWS::IAM::Policy`~~

~~The template has a few parameters as well:~~
- ~~Username~~
- ~~Password~~
- ~~VPC~~ 

~~After creating the stack like any other CloudFormation template, a URL is outputted. The `t2.small` EC2 instance is a web server with a public IPv4 address and DNS configured behind the scenes. The security group allows all traffic (0.0.0.0/0) on port 443, but it's worth noting that I did have an SSL issue with my instance that threw a warning in my browser. The instance profile is used by the web server to assume the IAM role with an attached policy that allows for widespread reads across resources and writes to S3. Keep in mind that the CloudFormer stack should be deleted after to use to avoid unnecessary compute charges for the EC2 instance.~~

## ~~Using the CloudFormer Web Server~~
~~Navigate to the URL from the output tab of the CloudFormation stack (something like `https://ec2-0-0-0-0.compute-1.amazonaws.com`) and enter the username and password that you specified as a parameter. Via the GUI, select the resources to reverse engineer across the following categories:~~
- ~~DNS~~
- ~~VPC~~
- ~~VPC Network~~
- ~~VPC Security~~
- ~~Network~~
- ~~Managed~~
- ~~Services~~
- ~~Managed Config~~
- ~~Compute~~
- ~~Storage~~
- ~~Storage Config~~
- ~~App Services~~
- ~~Security~~
- ~~Operational~~

~~The list is robust but not all-inclusive.~~

## ~~Creating a Template for a CloudFront Distribution~~
~~I have a public CDN in one of my AWS accounts for images on a JAMstack site hosted on Netlify. It uses a standard design: a private S3 bucket behind a CloudFront distribution with an Origin Access Identity. Through the CloudFormer workflow, I selected the individual components:~~
- ~~CloudFront distribution~~
- ~~S3 bucket~~
- ~~Bucket policy~~

~~Sadly, there's no support for YAML as of right now. The web server generated a JSON template, which I converted to YAML via the Designer.~~

~~I plugged the template back into CloudFormation, and everything provisioned successfully. Digging deeper into the template, I noticed a few minor changes to make. First of all, the logical names are based on specifics of the existing resources (e.g., `distd1yqxti3jheii7cloudfrontnet` came from the URL of the CDN). However, these can easily be refactored. Since CloudFormer doesn't support creating an OAI, the existing identity is hardcoded. I added a resource for that to the template and converted the hardcoded value to a reference.~~
