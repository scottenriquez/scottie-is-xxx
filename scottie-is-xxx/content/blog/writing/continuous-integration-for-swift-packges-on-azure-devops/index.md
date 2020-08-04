---
title: Continuous Integration for Swift Packages in Azure DevOps 
date: "2020-08-04T22:12:03.284Z"
description: "Building CI for Swift packages using Azure Pipelines."
---
## Overview
I use Azure DevOps for building CI/CD pipelines for professional projects. Given the GitHub integration and broader feature set, I've started using it instead of Travis CI for my open-source projects too. For most technology areas, there's a wide set of pre-built tasks that can be leveraged to build robust pipelines quickly. There are several tasks for compiling and publishing iOS applications using Xcode on transient macOS virtual machines.

However, in the spirit of using Swift like a general-purpose language, I wanted to use a Linux build server, a more industry-standard approach for CI/CD. [In my previous post](/writing/swift-executables-with-unit-tests), I described how I set up a Swift executable package to be more testable. This pipeline provides continuous integration for it. Azure Pipelines, which powers CI/CD in Azure DevOps, is scripted in YAML. It also supports integrating shell commands to be run on the virtual machine.

## Adding a Trigger
The first thing to specify in the YAML is a trigger. The trigger denotes which branches in the Git repository the build should be run for. For example, to run the build only for master, the trigger would be as follows:
```yaml
trigger:
- master
```
In general, I want CI to run on all branches, so I use the following YAML instead:
```yaml
trigger:
  branches:
    include:
      - '*'
```

## Specifying a Virtual Machine Image
After specifying the trigger, Azure Pipelines needs to know what type of infrastructure to run the build on. At the time of writing, 5.2 is the latest stable version of Swift. Swift is not currently available in APT, Ubuntu's package manager. The binaries from the Swift download page target a specific LTS version of Ubuntu. The most recent version listed is 18.04, even though 20.04 released in April. Because of these specific requirements, I opted to target a specific version of Ubuntu in my YAML instead of `ubuntu-latest`. `ubuntu-latest` will be updated to 20.04 at some point, but this is outside my control.
```yaml
pool:
  vmImage: 'ubuntu-18.04'
```

## Installing Swift Programmatically
With a product like Azure Pipelines that utilizes transient virtual machines, the customer pays for the server time. In short, the longer your builds take, the more expensive they are. Because of this and performance reasons, it doesn't make sense to compile Swift from source each time the build runs (i.e., when a developer commits). The best practice is to fetch dependencies via the distro's package manager for easier versioning and simple installation. With that not being an option for Swift on Ubuntu, the next best option is to fetch the binaries.

Azure Pipelines supports steps, which are logical sections of the build for human readability and organization. At a high level, the process is to:
- Install dependencies for running Swift that aren't shipped with Ubuntu
- Make a working directory
- Fetch the Swift binaries
- Unzip the binaries
- Add the binaries to the `PATH` so that `swift` can be used as a shell command
- Echo the version to ensure that it's working properly

In the pipeline script, the steps above are written as Bash commands and wrapped in a `script` YAML statement.
```yaml
steps:
- script: |
    sudo apt-get install clang libicu-dev
    mkdir swift-install
    cd swift-install
    wget https://swift.org/builds/swift-5.2.4-release/ubuntu1804/swift-5.2.4-RELEASE/swift-5.2.4-RELEASE-ubuntu18.04.tar.gz
    tar -xvzf swift-5.2.4-RELEASE*
    export PATH=$PATH:$(pwd)/swift-5.2.4-RELEASE-ubuntu18.04
    swift -version
  displayName: 'Install Swift'
```

## Additional Steps
With Swift successfully installed, the remainder of the build steps is scripted in additional `steps`. This commonly entails compiling, running unit tests, and static code analysis. For the sake of a simple executable package, this could be merely running `swift test` like below. Putting it all together, this YAML script is a solid base for many Swift package CI jobs.

```yaml
trigger:
  branches:
    include:
      - '*'

pool:
  vmImage: 'ubuntu-18.04'

steps:
- script: |
    sudo apt-get install clang libicu-dev
    mkdir swift-install
    cd swift-install
    wget https://swift.org/builds/swift-5.2.4-release/ubuntu1804/swift-5.2.4-RELEASE/swift-5.2.4-RELEASE-ubuntu18.04.tar.gz
    tar -xvzf swift-5.2.4-RELEASE*
    export PATH=$PATH:$(pwd)/swift-5.2.4-RELEASE-ubuntu18.04
    swift -version
  displayName: 'Install Swift'

- script: |
    swift test
  displayName: 'Run unit tests'
```