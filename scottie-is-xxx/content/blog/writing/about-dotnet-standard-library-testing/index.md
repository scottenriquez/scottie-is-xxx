---
title: Testing .NET Standard Libraries Using .NET Core, NUnit, and Travis CI
date: "2018-04-16T22:12:03.284Z"
description: "Getting started testing .NET Standard class libraries."
---

While my development choices for the frontend change as rapidly as new JavaScript frameworks come and go, I've remained pretty consistent with using the .NET ecosystem for my server-side needs. I still use Node.js, Spring Boot, and Flask for several side projects, but I've grown to love the power of .NET and C# over the past several years while it has been the default technology at my job. My two biggest complaints were the monolithic scale of .NET Framework and the fact that it required Windows (or Mono which hasn't always been backed by Xamarin/Microsoft). Both of these changed with the advent of .NET Core. This alternative is cross-platform, modular, and much more performant. While both .NET Framework and .NET Core are implementations of .NET Standard, .NET Core very much seems to be the preferred way of the future.

Like many other .NET developers, I've packaged logic into open-source libraries and published to NuGet for easy distribution. However, also like many other developers, I've written packages to target .NET Framework. This is a problem because these packages can only be used with .NET Framework. The alternative is to target .NET Standard instead. As described by Microsoft docs, .NET Standard is a set of APIs that all .NET implementations must provide to conform to the standard. Because of this, having your NuGet packages target .NET Standard means that your package has support for .NET Framework, .NET Core, Mono, Xamarin, etc.

The primary reason that Microsoft recommends sticking with .NET Framework over .NET Core is compatibility. Essentially, they want developers to choose .NET Core first and .NET Framework second if there is some dependency that's not .NET Standard compatible. This shift in mentality means that libraries need to target .NET Standard by default. In order for a library to target .NET Standard, all dependent libraries must target .NET Standard as well which is arguably the biggest hurdle that .NET Core adoption is facing at this time.

With such a radical shift in the ecosystem comes some growing pains and a great deal of learning. While working to convert one of my libraries to .NET Standard, I faced challenges with setting up my testing infrastructure, so I wanted to share what I learned. This post will walk you through setting up a .NET Standard library, unit tests, and continuous integration using Travis CI. A working example with complete source code and [Travis CI](https://travis-ci.org/scottenriquez/scottie-gg-xxx-dotnet-standard-testing/builds/483708145) configured can be found on [GitHub](https://github.com/scottenriquez/scottie-gg-xxx-dotnet-standard-testing).

# Preparing Your Development Environment

The demo source code included in this post targets .NET Standard 2.0. If you are running an older version of Visual Studio, you will either need to upgrade or install the SDKs manually. Visual Studio 2017 version 15.3 and on for Windows include the requisite SDK. For macOS, the Visual Studio IDE can be used as well. This demo was developed using 7.5 Preview 1. For Linux, .NET Core can be installed via scripts and an alternative editor like Visual Studio Code or Rider from JetBrains can be used for development.

# Creating the Domain Project

This library does simple addition for type `decimal`. We'll start by creating a project for the domain logic. Be sure to create a .NET Standard library and not a .NET Framework library. Next, add an `AdditionService` class with function to execute the logic.

```csharp
public class AdditionService : IAdditionService
{
	public decimal Add(decimal first, decimal second)
	{
		return first + second;
	}
}
```

# Creating the Test Project

This repo uses NUnit for unit testing. The NUnit project offers templates for creating test projects, but this post walks through adding each dependency manually to clarify some of the nuances. As noted in the NUnit wiki, Microsoft has specified that tests must target a specific platform in order to properly validate the expected behavior of the .NET Standard-targeted code against that platform. While this may seem counterintuitive to the nature of .NET Standard, keep in mind that you can write multiple tests to support multiple platforms. For the sake of this demo, just target .NET Core. Instead of creating a .NET Standard project for the unit tests create a .NET Core class library.

The first dependency is Microsoft.NET.Test.Sdk. As noted previously, .NET Core is much more modular. This package is Microsoft's testing module. The next two dependencies are NUnit and NUnit3TestAdapter. These two packages will allow us to write NUnit tests and run them via the command line. We can now create our first unit test.

```csharp
[TestFixture]
public class AdditionServiceTests
{
	[Test]
	public void Should_Add_ForStandardInput()
	{
		//arrange
		decimal first = 1.0m;
		decimal second = 2.0m;
		decimal expectedOutput = 3.0em;
		IAdditionService additionService = new AdditionService();

		//act
		decimal actualSum = additionService.Add(first, second);

		//assert
		actualSum.Should().Be(expectedSum);
	}
}
```

You can run the unit tests locally using an IDE like Visual Studio or Rider or via terminal with the command `dotnet test`. Note that you can also supply a path to your `.csproj` file to only test specific projects in your solution.

# Configuring Travis CI for GitHub Projects

If you plan on hosting your source code in a public repository on GitHub, you can leverage a testing automation tool called Travis CI for free. To get started, log into the Travis CI site with GitHub authentication and enable your repository for testing through the web interface. After that, simply add a YAML file in the root of your project named `.travis.yml`.

```yaml
language: csharp
mono: none
dotnet: 2.0.0

install:
  - dotnet restore src

script:
  - dotnet build src
  - dotnet test src/Gg.Scottie.Dotnet.Standard.Testing.Unit.Tests/Gg.Scottie.Dotnet.Standard.Testing.Unit.Tests.csproj
```

# Testing Multiple Targets on Windows and \*NIX

As mentioned above, the primary benefit of targeting .NET Standard is that it can be added as a dependency by newer versions of .NET Framework and .NET Core without any additional code or configuration. With that being said, you may want to have unit tests that target both .NET Core and .NET Framework to ensure that your library behaves as expected with each. We can add multiple targets to our testing project by simply modifying the `.csproj`. By changing the `TargetFramework` tag to `TargetFrameworks` and changing the value to `netcoreapp2.0;net47` we can test against both .NET Core 2.0 and .NET Framework 4.7. As you might imagine, this could cause issues for non-Windows developers because there is no native \*NIX support for .NET Framework. In the XML, we can even add conditions to only target .NET Core if the tests are not running on Windows by adding `Condition="'$(OS)' != 'Windows_NT'">netcoreapp2.0`.
