---
title: Using CloudFormer for Existing AWS Resources 
date: "2020-09-26T22:12:03.284Z"
description: "Generating CloudFormation templates from existing AWS resources."
tag: "Programming"
---

## Overview
I've been making a concerted effort lately to use infrastructure as code via CloudFormation for all of my personal AWS-hosted projects. Writing these templates can feel a bit tedious, even with editor tooling and plugins. I thought it would be awesome to generate CloudFormation templates for existing resources and found [CloudFormer](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-using-cloudformer.html) (beta version 0.42 currently). It never ceases to amaze me how many AWS products there are. I found blog posts about CloudFormer from as far back as 2013, but I've never really heard it advertised strangely enough. I tested CloudFormer on a few simple resources on my to-do list to convert to templates with decent results.

## Getting Started
Setting up CloudFormer is quite simple through CloudFormation. In fact, it's a sample template that creates a stack with several resources:
- `AWS::EC2::Instance`
- `AWS::EC2::SecurityGroup`
- `AWS::IAM::InstanceProfile`
- `AWS::IAM::Role`
- `AWS::IAM::Policy`

The template has a few parameters as well:
- Username
- Password
- VPC 

After creating the stack like any other CloudFormation template, a URL is outputted. The `t2.small` EC2 instance is a web server with a public IPv4 address and DNS configured behind the scenes. The security group allows all traffic (0.0.0.0/0) on port 443, but it's worth noting that I did have an SSL issue with my instance that threw a warning in my browser. The instance profile is used by the web server to assume the IAM role with an attached policy that allows for widespread reads across resources and writes to S3. Keep in mind that the CloudFormer stack should be deleted after to use to avoid unnecessary compute charges for the EC2 instance.

## Using the CloudFormer Web Server
Navigate to the URL from the output tab of the CloudFormation stack (something like `https://ec2-0-0-0-0.compute-1.amazonaws.com`) and enter the username and password that you specified as a parameter. Via the GUI, select the resources to reverse engineer across the following categories:
- DNS
- VPC
- VPC Network
- VPC Security
- Network
- Managed
- Services
- Managed Config
- Compute
- Storage
- Storage Config
- App Services
- Security
- Operational

The list is robust but not all-inclusive.

## Creating a Template for a CloudFront Distribution
I have a public CDN in one of my AWS accounts for images on a JAMstack site hosted on Netlify. It uses a standard design: a private S3 bucket behind a CloudFront distribution with an Origin Access Identity. Through the CloudFormer workflow, I selected the individual components:
- CloudFront distribution
- S3 bucket
- Bucket policy

Sadly, there's no support for YAML as of right now. The web server generated a JSON template, which I converted to YAML via the Designer.

```yaml
AWSTemplateFormatVersion: 2010-09-09
Resources:
  distd1yqxti3jheii7cloudfrontnet:
    Type: "AWS::CloudFront::Distribution"
    Properties:
      DistributionConfig:
        Enabled: true
        PriceClass: PriceClass_All
        DefaultCacheBehavior:
          TargetOriginId: S3-twiath-site-cdn
          ViewerProtocolPolicy: https-only
          MinTTL: 0
          AllowedMethods:
            - HEAD
            - GET
          CachedMethods:
            - HEAD
            - GET
          ForwardedValues:
            QueryString: true
            Cookies:
              Forward: none
        Origins:
          - DomainName: twiath-site-cdn.s3.amazonaws.com
            Id: S3-twiath-site-cdn
            S3OriginConfig:
              OriginAccessIdentity: origin-access-identity/cloudfront/E1TD7RRQ2L9X7C
        Restrictions:
          GeoRestriction:
            RestrictionType: none
            Locations: []
        ViewerCertificate:
          CloudFrontDefaultCertificate: "true"
          MinimumProtocolVersion: TLSv1
  s3twiathsitecdn:
    Type: "AWS::S3::Bucket"
    Properties:
      AccessControl: Private
      VersioningConfiguration:
        Status: Suspended
  s3policytwiathsitecdn:
    Type: "AWS::S3::BucketPolicy"
    Properties:
      Bucket: !Ref s3twiathsitecdn
      PolicyDocument:
        Version: 2012-10-17
        Statement:
          - Sid: "2"
            Effect: Allow
            Principal:
              AWS: >-
                arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity
                E1TD7RRQ2L9X7C
            Action: "s3:GetObject"
            Resource: !Join
              - ""
              - - "arn:aws:s3:::"
                - !Ref s3twiathsitecdn
                - /*
Description: S3 bucket behind CloudFront with OAI
```

I plugged the template back into CloudFormation, and everything provisioned successfully. Digging deeper into the template, I noticed a few minor changes to make. First of all, the logical names are based on specifics of the existing resources (e.g., `distd1yqxti3jheii7cloudfrontnet` came from the URL of the CDN). However, these can easily be refactored. Since CloudFormer doesn't support creating an OAI, the existing identity is hardcoded. I added a resource for that to the template and converted the hardcoded value to a reference.

Overall I'd argue that addressing the minor changes is easier than writing a template from scratch. With that being said, I don't know that I'd ever spin up resources via the Console with the sole intent of creating CloudFormation templates. However, it could make migrating from a prototype to a productionized product easier if you're willing to pay a small compute cost.