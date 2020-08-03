---
title: Creating a Swift 5.2 Executable with Unit Tests 
date: "2020-08-03T22:12:03.284Z"
description: "A guide to creating, structuring, and testing Swift executable packages."
---

## Background
To better learn Swift, I've been trying to use it as a truly general-purpose programming language instead of purely iOS development. I'm currently building an iOS app that requires multiple versions of the same vector graphics (SVGs). I couldn't find an open-source solution for my needs, so I decided to start scripting. Typically, I would have used Python or Node.js, but I powered through with Swift in the spirit of immersion.

Getting the initial project structure and unit tests set up took some research, so this quick guide will outline how I've been structuring my codebases for executable packages. Outside of iOS development, Swift's documentation isn't as robust as Python or Node.js, given the age difference. This blog post's objective is to merge a lot of useful knowledge I found across forums.

## Creating the Project
Use the Swift CLI to create an executable project with this command: `swift package init --type executable`. It's important to note that the names will be created based on the current directory. If you want to use a name for your project other than the root directory, create a new folder and run the command there.
```shell
mkdir AlternatePackageName
cd AlternatePackageName
swift package init --type executable
```
To open in Xcode, run `open Package.swift`. Swift has created a project with the following structure:
```shell
├── Package.swift
├── README.md
├── Sources
  └── SwiftPackageExecutable
      └── main.swift
└── Tests
    ├── LinuxMain.swift
    └── SwiftPackageExecutableTests
        ├── SwiftPackageExecutableTests.swift
        └── XCTestManifests.swift
```

## Creating a Library
Executable modules are not testable. The implication is that functions cannot be tested inside `/Sources/SwiftPackageExecutable` (in the same directory as `main.swift`). Doing so will throw an unhelpful compiler error. The alternative is to move the logic to a library module. This requires a change to the directory structure and default `Package.swift`.
```swift
// swift-tools-version:5.2

import PackageDescription

let package = Package(
    name: "SwiftPackageExecutable",
    dependencies: [],
    targets: [
        .target(
            name: "SwiftPackageExecutable",
            dependencies: []),
        .testTarget(
            name: "SwiftPackageExecutableTests",
            dependencies: ["SwiftPackageExecutable"]),
    ]
)
```
First, set the `products` variable in between the `name` and `dependencies`.  Create `.executable` and `.library` entries like so:
```swift
name: "SwiftPackageExecutable",
products: [
    .executable(name: "SwiftPackageExecutable", targets: ["SwiftPackageExecutable"]),
    .library(name: "SwiftPackageLibrary", targets: ["SwiftPackageLibrary"]),
],
dependencies: [],
```
Next, in the array of targets, add another `.target` for the library, and update the dependencies. The executable and test modules should depend on the library.
```swift
.target(
    name: "SwiftPackageExecutable",
    dependencies: ["SwiftPackageLibrary"]),
.target(
    name: "SwiftPackageLibrary",
    dependencies: []),
.testTarget(
    name: "SwiftPackageExecutableTests",
    dependencies: ["SwiftPackageLibrary"]),
```
The completed `Package.swift` is as follows:
```swift
// swift-tools-version:5.2

import PackageDescription

let package = Package(
    name: "SwiftPackageExecutable",
    products: [
        .executable(name: "SwiftPackageExecutable", targets: ["SwiftPackageExecutable"]),
        .library(name: "SwiftPackageLibrary", targets: ["SwiftPackageLibrary"]),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "SwiftPackageExecutable",
            dependencies: ["SwiftPackageLibrary"]),
        .target(
            name: "SwiftPackageLibrary",
            dependencies: []),
        .testTarget(
            name: "SwiftPackageExecutableTests",
            dependencies: ["SwiftPackageLibrary"]),
    ]
)
```
Lastly, create a new directory inside of `/Sources/` for the new library.

## Creating Logic and Unit Tests
For a simple example, add some easily testable logic like addition. The Swift file should reside at `/Sources/SwiftPackageLibrary/Add.swift`.
```swift
import Foundation

public struct Add {
    public static func integers(_ first: Int, to second: Int) -> Int {
        return first + second
    }
}
```
Inside of the test module, add a standard test for the library module function.
```swift
import XCTest
@testable import SwiftPackageLibrary

final class AddTests: XCTestCase {
    func shouldAddTwoIntegersForStandardInput() throws {
        // Arrange
        let first = 1
        let second = 2
        let expectedSum = 3

        // Act
        let actualSum = Add.integers(first, to: second)
        
        // Assert
        XCTAssertEqual(actualSum, expectedSum)
    }

    static var allTests = [
        ("shouldAddTwoIntegersForStandardInput", shouldAddTwoIntegersForStandardInput),
    ]
}
```
Lastly, update `XCTestsManifest`.
```swift
import XCTest

#if !canImport(ObjectiveC)
public func allTests() -> [XCTestCaseEntry] {
    return [
        testCase(AddTests.allTests)
    ]
}
#endif
```

## Putting It All Together
With all this in place, you can now unit test your library logic and expose it as an executable in the `main.swift` file.
```shell
├── Package.swift
├── README.md
├── Sources
    ├── SwiftPackageExecutable
        └── main.swift
    └── SwiftPackageLibrary
        └── Add.swift
└── Tests
    ├── LinuxMain.swift
    └── SwiftPackageExecutableTests
        ├── AddTests.swift
        └── XCTestManifests.swift
```
To run the executable, use `swift run`. To run the unit tests, use `swift test`.