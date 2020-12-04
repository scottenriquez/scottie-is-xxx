---
title: Colley Matrix NuGet Package
date: "2018-04-01T22:12:03.284Z"
description: "A NuGet package for the Colley Matrix algorithm."
tag: "Programming"
---

## Overview

It's very well documented that I'm a huge college football fan. We're presently in the College Football Playoff era of Division I football, which involves a selection committee choosing four playoff teams to compete to be the national champion. The previous era, known as the Bowl Championship Series era, involved a combined poll of human experts and computer algorithms choosing the two best teams to play in the national championship game. One such algorithm is known as the Colley Matrix. Though not a factor in the post-season selection process anymore, it's still referred to at times, particularly when debating the selection committee’s decisions. Based on the [whitepaper](http://www.colleyrankings.com/matrate.pdf) written by Colley himself and [an existing JavaScript implementation](an existing JavaScript implementation), I developed this [NuGet package](https://www.nuget.org/packages/ColleyMatrix/) for simulating head-to-head matchups and applying the Colley algorithm. This algorithm can be applied to any sport or competitions without tie games.

## Usage

The `ColleyMatrix` client exposes two methods: `SimulateGame` and `Solve`. The client constructor takes one argument: `numberOfTeams`.

```csharp
ColleyMatrix colleyMatrix = new ColleyMatrix(numberOfTeams);
```

This will create a client with an underlying sparse matrix where the dimensions span from 0 to `numberOfTeams - 1` corresponding to each team's ID. Next, we can simulate matchups.

```csharp
colleyMatrix.SimulateGame(winnerId, loserId);
```

Note that if the `winnerId` or `loserId` is not valid respective to the sparse matrix's dimensions, an exception will be thrown.

You can solve the sparse matrix at any point without modifying the internal state. The solved vector that is returned is a list of scores with the highest score indicating the best team.

```csharp
IEnumerable<double> solvedVector = colleyMatrix.Solve();
```

## Basics of Implementation

`SimulateGame` updates the matrix state which is wrapped by an interface called `IMatrixProvider`. This removes the dependency on a specific matrix implementation from the underlying domain logic. For reference, the `ColleyMatrix` client ultimately injects a Math.NET `SparseMatrix`. The updates to the matrix state are very simple.

```csharp
double gameCount = _matrixProvider.GetValue(winnerId, loserId);
_matrixProvider.SetValue(winnerId, loserId, gameCount - 1);
_matrixProvider.SetValue(loserId, winnerId, gameCount - 1);
_matrixProvider.SetValue(winnerId, winnerId, _matrixProvider.GetValue(winnerId, winnerId) + 1);
_matrixProvider.SetValue(loserId, loserId, _matrixProvider.GetValue(loserId, loserId) + 1);
```

A list of teams and their corresponding ratings are also maintained.

```csharp
_teams[winnerId].Wins++;
_teams[loserId].Losses++;
_teams[winnerId].ColleyRating = ComputeColleyRating(_teams[winnerId].Wins, _teams[winnerId].Losses);
_teams[loserId].ColleyRating = ComputeColleyRating(_teams[loserId].Wins, _teams[loserId].Losses);
```

The formula for computing the Colley rating is very simple.

```csharp
1 + (wins - losses) / 2;
```

For the `Solve` method, the matrix is lower-upper factorized then solved for the vector of the teams' Colley ratings.

```csharp
IEnumerable<double> colleyRatings = _teams.Select(team => team.ColleyRating);
IEnumerable<double> solvedVector = _matrixProvider.LowerUpperFactorizeAndSolve(colleyRatings);
```

## Build Status

[![Build status](https://travis-ci.org/scottenriquez/colley-matrix-nuget.svg?branch=master)](https://travis-ci.org/scottenriquez/colley-matrix-nuget)
