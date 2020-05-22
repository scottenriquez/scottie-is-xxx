---
title: TEALS Week One Postmortem
date: "2018-09-03T22:12:03.284Z"
description: "Successes and lessons learned during my first week of teaching computer science."
---

My first week of teaching is in the books, and there’s already a ton to reflect on. Overall, I think that class so far has been a success, but I’ve already identified several opportunities for improvement.

# What Went Well

I graduated high school over a decade ago, and the world and technology have changed a great deal since then. I pounded out Java programs on crawling, clunky Windows 95 desktop machines without the interruptions of smartphones. Now every student has their own laptop. I assumed that my lectures and exercises would have to rival the distractions of the digital age. Overall, I found that it was easy to get the students engaged with the material especially when I made a conscious effort to explain its application in the real world. The students in my class seem much more focused on their careers after high school than I was at 16 or 17.

I thought it would be difficult to switch contexts from my work persona to my classroom persona while maintaining genuineness with the students. Thus far, it’s been a very natural progression for me even though I work in the morning prior to teaching class.

# Where to Improve

Time management continues to be a difficult challenge. As a high school student, an hour felt like an eternity to be in the classroom. From the other side of the desk, an hour feels like not enough time to even begin to teach computer science and programming. Individual time with students is equally scarce and valuable. I want to support everyone in every way that I can, but only getting a minute or two of interaction at a time makes building rapport with my students seem insurmountable. On top of this, when a student asks for help, it’s usually at a point of challenge and frustration.

In week one, I fell short in regard to learning names. I’m only in the classroom for three days per week. This time has to be split between lectures and individual attention. One technique I’m going to try next week is using a Java program that I wrote to randomly select a student’s name when I ask a question. This should give me both the opportunity to finally put names to faces on a regular basis as well as make our formative assessments more uniform and accurate. If this doesn’t pan out, my contingency is to simply make flashcards.

```java
public class TEALSRandomNameSelector {
	public static void main(String[] args) {
		try {
			ArrayList studentNames = new ArrayList();
			Scanner scanner = new Scanner(new FileReader("students.txt"));
			while(scanner.hasNextLine()) {
				studentNames.add(scanner.nextLine());
			}
			scanner.close();
			Random random = new Random();
			int randomIndex = random.nextInt(studentNames.size());
			System.out.println(studentNames.get(randomIndex));
		}
		catch(FileNotFoundException exception) {
			System.out.println("File not found. Check the path in the FileReader constructor method.");
		}
	}
}
```

Lesson planning is extremely time-consuming, but it is paramount to the success of the students. It involves more than just making notes, exercises, demos, and presentations. This week, I intend to focus more on dry runs of my lectures and activities so that they’re more polished and nuanced.

# What Was Unexpected

I underestimated both how intensive and rewarding teaching in the classroom is. On any given day, I’m most likely working on something related to teaching after a day at my full-time job. While I’m often exhausted, I’ve managed to find reserves of energy when working on anything related to school. It’s a responsibility that I take very seriously because of the unique position I’m in to truly make a difference in the lives of my students. Bringing my industry experience to the classroom is a rare opportunity that I’m determined to make the most of.
