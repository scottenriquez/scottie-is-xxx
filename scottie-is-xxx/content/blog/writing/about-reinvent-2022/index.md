---
title: re:Invent 2022 Releases 
date: "2022-11-29T22:12:03.284Z"
description: "Thoughts and proofs-of-concepts from re:Invent 2022 release."
tag: "Programming"
---

## Overview

I learn best by doing, so with every release cycle,  I take the time to build fully functional examples and digest the blog posts and video content. Below are some of my favorite releases from re:Invent 2022. You can find all source code in [this GitHub repository](https://github.com/scottenriquez/reinvent-2022-examples).

## AWS Lambda SnapStart
Cold starts are one of the most common drawbacks of serverless adoption. Specific runtimes, such as Java, are more affected by this, especially in conjunction with frameworks like Spring Boot. [SnapStart](https://aws.amazon.com/blogs/compute/starting-up-faster-with-aws-lambda-snapstart/) aims to address this:

> After you enable Lambda SnapStart for a particular Lambda function, publishing a new version of the function will trigger an optimization process. The process launches your function and runs it through the entire `Init` phase. Then it takes an immutable, encrypted snapshot of the memory and disk state, and caches it for reuse. When the function is subsequently invoked, the state is retrieved from the cache in chunks on an as-needed basis and used to populate the execution environment. This optimization makes invocation time faster and more predictable, since creating a fresh execution environment no longer requires a dedicated `Init` phase.

For now, SnapStart only supports the Java runtime.

With the release came support via CloudFormation and CDK. However, at the time of writing, CDK only supports SnapStart via the [L1 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.CfnFunction.html): `CfnFunction`. The [L2 `Function` class](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html) does not yet have support, so this may be a temporary blocker for CDK projects. Using CDK, I wrote a simple stack to test a trivial function:

```typescript
export class Java11SnapstartLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // artifact bucket and ZIP deployment
    const artifactBucket = new s3.Bucket(this, 'ArtifactBucket');
    const artifactDeployment = new s3Deployment.BucketDeployment(this, 'DeployFiles', {
      sources: [s3Deployment.Source.asset('./artifact')],
      destinationBucket: artifactBucket,
    });

    // IAM role
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaExecutionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    
    // Lambda functions
    const withSnapStart = new lambda.CfnFunction(this, 'WithSnapStart', {
      code: {
        s3Bucket: artifactDeployment.deployedBucket.bucketName,
        s3Key: 'corretto-test.zip'
      },
      functionName: 'withSnapStart',
      handler: 'example.Hello::handleRequest',
      role: lambdaExecutionRole.roleArn,
      runtime: 'java11',
      snapStart: { applyOn: 'PublishedVersions' }
    });
    const withoutSnapStart = new lambda.CfnFunction(this, 'WithoutSnapStart', {
      code: {
        s3Bucket: artifactDeployment.deployedBucket.bucketName,
        s3Key: 'corretto-test.zip'
      },
      functionName: 'withoutSnapStart',
      handler: 'example.Hello::handleRequest',
      role: lambdaExecutionRole.roleArn,
      runtime: 'java11'
    });
  }
}
```

In [Jeff Barr's post](https://aws.amazon.com/blogs/aws/new-accelerate-your-lambda-functions-with-lambda-snapstart/), he used a Spring Boot function and achieved significant performance benefits. Next, I wanted to see if there were any benefits to a barebones Java 11 function, given that there is no additional charge for SnapStart. With a few tests, I reproduced a slight decrease in total duration. 

Cold start without SnapStart (577.84 milliseconds):
![without-snapstart.png](without-snapstart.png)

Cold start with SnapStart (537.94 milliseconds):
![with-snapstart.png](with-snapstart.png)

A few cold start tests are hardly conclusive, but I'm excited to see how AWS customers' performance and costs fare at scale. One thing to note is that in both my testing and the Jeff Barr example, the billed duration increased with SnapStart while the total duration decreased (i.e., this may be faster but come with an indirect cost).