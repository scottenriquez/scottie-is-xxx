---
title: "[WIP] .NET 5 Docker Lambda Function with API Gateway Using CDK"
date: "2021-02-11T22:12:03.284Z"
description: "Building an API with full infrastructure as code support."
tag: "Programming"
---

## Deciding on Which Technology to Use
While infrastructure as code (IaC) has existed within the AWS ecosystem since 2011, adoption has exploded recently due to the ability to manage large amounts of infrastructure at scale and standardize design across an organization. There are almost too many options between CloudFormation (CFN), CDK, and Terraform for IaC and Serverless Application Model (SAM) and Serverless Framework for development. [This article](https://acloudguru.com/blog/engineering/cloudformation-terraform-or-cdk-guide-to-iac-on-aws) from A Cloud Guru quickly sums up the pros and cons of each option. I choose this particular stack for some key reasons:
- CDK allows the infrastructure and the CI/CD pipeline to be described as C#
- CDK provides the ability to inject more robust logic than intrinsic functions in CFN and more modularity as well
- Docker ensures that the Lambda functions run consistently across local development, builds, and production environments

## Initializing the Project
Ensure that .NET 5 and the latest version of CDK are installed. To create a skeleton, run these commands in the root directory:

```shell
# note that CDK uses this directory name as the solution name
mkdir LambdaApiSolution
cd LambdaApiSolution
cdk init app --language=csharp
# creates a CFN stack called CDKToolkit with an S3 bucket for staging purposes
cdk bootstrap
cdk deploy
```

At the time of writing, this template uses .NET Core 3.1. Inside of the `.csproj` file, change the `TargetFramework` tag to `net5.0`.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net5.0</TargetFramework>
  </PropertyGroup>
</Project>
```

From the `/LambdaApiSolution` directory, run these commands to create the serverless skeleton:

```shell
# install the latest version of the .NET Lambda templates
dotnet new -i Amazon.Lambda.Templates
cd src/
# create the function
dotnet new lambda.image.EmptyFunction --name LambdaApiSolution.DockerFunction
# add the projects to the solution file
dotnet sln add LambdaApiSolution.DockerFunction/src/LambdaApiSolution.DockerFunction/LambdaApiSolution.DockerFunction.csproj
dotnet sln add LambdaApiSolution.DockerFunction/test/LambdaApiSolution.DockerFunction.Tests/LambdaApiSolution.DockerFunction.Tests.csproj
# build the solution and run the sample unit test
dotnet test LambdaApiSolution.sln
```

## Creating the Lambda Infrastructure and Build
First, add the Lambda CDK NuGet package to the CDK project.

```xml
<PackageReference Include="Amazon.CDK.AWS.Lambda" Version="1.89.0" />
```

Then, create the Docker image and Lambda function using CDK constructors in `LambdaApiSolutionStack.cs`:

```csharp
public class LambdaApiSolutionStack : Stack
{
    internal LambdaApiSolutionStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
    {
        DockerImageCode dockerImageCode = DockerImageCode.FromImageAsset("src/LambdaApiSolution.DockerFunction/src/LambdaApiSolution.DockerFunction");
        DockerImageFunction dockerImageFunction = new DockerImageFunction(this, "LambdaFunction", new DockerImageFunctionProps()
        {
            Code = dockerImageCode,
            Description = ".NET 5 Docker Lambda function"
        });
    }
}
```

Lastly, update the `Dockerfile` in the Lambda function project like so to build the C# code:

```dockerfile
FROM public.ecr.aws/lambda/dotnet:5.0
FROM mcr.microsoft.com/dotnet/sdk:5.0 as build-image

ARG FUNCTION_DIR="/build"
ARG CONFIGURATION="release"
ENV PATH="/root/.dotnet/tools:${PATH}"

RUN apt-get update && apt-get -y install zip

RUN mkdir $FUNCTION_DIR
WORKDIR $FUNCTION_DIR
COPY Function.cs LambdaApiSolution.DockerFunction.csproj aws-lambda-tools-defaults.json $FUNCTION_DIR/
RUN dotnet tool install -g Amazon.Lambda.Tools

RUN mkdir -p build_artifacts
RUN if [ "$CONFIGURATION" = "debug" ]; then dotnet lambda package --configuration Debug --package-type zip; else dotnet lambda package --configuration Release --package-type zip; fi
RUN if [ "$CONFIGURATION" = "debug" ]; then cp -r /build/bin/Debug/net5.0/publish/* /build/build_artifacts; else cp -r /build/bin/Release/net5.0/publish/* /build/build_artifacts; fi

FROM public.ecr.aws/lambda/dotnet:5.0

COPY --from=build-image /build/build_artifacts/ /var/task/
CMD ["LambdaApiSolution.DockerFunction::LambdaApiSolution.DockerFunction.Function::FunctionHandler"]
```

## Testing the Function
...