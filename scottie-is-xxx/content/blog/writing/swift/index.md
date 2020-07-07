---
title: Starting with Swift and iOS 
date: "2020-07-05T22:12:03.284Z"
description: "The start of a spinoff blog about Swift development."
---
Frontend web development is in a perpetual state of turmoil, and I'm getting too old for it.

If you want a one-sentence description, there it is. I've technically been writing client-side code since the days of hiding ads and embedding personality quizzes on MySpace in the mid-2000s. Professionally, I've been writing HTML, CSS, and client-side JavaScript for about six years. In this time, I feel like I've already seen eons come and go due to the untenably rapid evolution of the frontend.

I'm a full-stack developer turned solution architect. This means that I get to design and implement some awesome backends in the cloud and begrudgingly fight the browser to expose it to the end user. There's still a ton that excites me about the software world including cloud-native architectures, CI/CD pipeline improvements, infrastructure as code, and so on. The cloud provider arms race in particular has produced incredible products like serverless computing and cognitive functions as a service.

I won't spend much time here detailing my complaints with frontend development because there's already a lot of great discussions happening on forums and blogs by people way smarter than me. The crux of my frustration isn't just around the volume and velocity of change though. When a cloud provider offers a new service, they're offering a new computing consumption method that may challenge the way we currently design solutions (i.e. serverless computing). Much of the innovation of modern web development (i.e. virtualizing the DOM or transpiling modern language syntax to browser engine-compatible JavaScript) serves to further abstract developers away from the technical debt caused by the ubiquity of the browser (and countless other factors).

For example, React is a powerful JavaScript library that allows developers to quickly build applications out of reusable components in JSX. It has become my de-facto standard tool for building the web. There's a standard toolchain called Create React App that's used to generate a single-page application with a single CLI command: `create-react-app new-app`. This single action downloads roughly 200 megabytes of dependencies. While the production build is a fraction of this, it goes to show just how expansive JavaScript tooling has become.

So, why Swift and iOS? I'm ready to try something new. I'm looking forward to having a standard library, programming language, development kit, and a stable platform to build on. Even the major additions like SwiftUI have a focus on interoperability. I've been excited by the idea of mobile development for some time, but now I feel motivated to learn these new skills because I feel confident that they won't be completely useless in a few years (like my AngularJS skills are now).

This the start of my spinoff blog: [Scottie Codes Swift](https://scottie.codes/swift). I'll focus my study regimen, showcasing the software that I build, and exploring how my existing knowledge can be leveraged. I'm also going to attempt to contribute to the Twittersphere via [@CodesSwift](https://twitter.com/codesswift). For now, here's to a fresh start.
```swift
let programmingLanguage: String = "Swift"
print("Hello from \(programmingLanguage)!")
```